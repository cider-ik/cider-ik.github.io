/* eslint-disable lines-between-class-members */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */

/**
 * 네모네모 로직
 */

// ----- 칸(cell) 관련 고정 값 -----
const G_STYLE_CLASS_NM = {
  container: 'nemo-container',
  board: 'nemo-board',
  cell: 'nemo-board-cell',
  strongBorderRight: 'strong-right',
  strongBorderLeft: 'strong-left',
  strongBorderTop: 'strong-top',
  strongBorderBottom: 'strong-bottom',
  noneBorderRight: 'none-right',
  noneBorderBottom: 'none-bottom',
};

// const CELL_STRONG_BORDER_STYLE = '2px solid #000';
const G_CELL_SIZE = 30;   // 칸 사이즈 (px)
const G_CELL_MIN_CNT = 5; // 최소 칸 갯수
const G_CELL_MAX_CNT = 30; // 최대 칸 갯수
const G_CELL_MULTIPLE_NUM = 5; // 칸 갯수의 배수

const G_CELL_EMPTY_STYLE = {      // 공백 스타일
  backgroundImage: '',
  backgroundRepeat: '',
  backgroundSize: '',
  backgroundColor: '',
};
const G_CELL_FILL_STYLE = {       // 답안 채우기 스타일
  backgroundColor: '#607d8b',
};
const G_CELL_MARK_STYLE = {       // X마크 스타일
  backgroundImage: 'url("/src/lib/nemo/close.svg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
};

const gNumItemSize = 25;

// ----- 기타 고정 값 -----
const G_DRAG_EVENT_DELAY_MS = 100;        // 드래그 이벤트 지연 시간 (ms)
const gNemoGenTimerLabel = 'Nemo generation time';

/**
 * 생성자
 */
export default class Nemo {
  answerDataArr = [];
  cellCheckMode = 1; // 현재 체크모드 1 예상정답체크, 2 X체크
  // ---------- [TEST] 임시 속성 -------------
  test_showAnswer = null;
  // ------------------------------------------

  /**
   * 생성자
   * @param {string} pTargetElemId 루트 요소의 ID
   * @param {Array<Array>} pNemoQuestion 문제 2차원 배열
   * @param {object} pGenOption 생성옵션
   * @returns Nemo object
   */
  constructor(pTargetElemId, pNemoQuestion, pGenOption) {
    console.time(gNemoGenTimerLabel);

    // ----- 드래그 시 처리 관련 변수 -----
    let cIsMousePressing = false;
    let cIsMouseDragging = false;
    let $cTempDragStartCell = null;
    const $cTempDragPassedCellArr = [];

    let cIsGameCompleted = false; // 게임 완료 여부

    const cNemoQuestion = JSON.parse(JSON.stringify(pNemoQuestion));
    const cColCnt = cNemoQuestion[0].length;
    const cRowCnt = cNemoQuestion.length;
    const $cReplaceTargetElem = document.getElementById(pTargetElemId || '');

    // ---------- [TEST] 임시 속성 -------------
    this.test_showAnswer = cNemoQuestion;
    // ------------------------------------------


    if (!$cReplaceTargetElem) {
      console.error('컨테이너를 찾을 수 없습니다.');
      return;
    }
    if (!pNemoQuestion) {
      console.error('셀 구성 데이터가 없습니다.');
      return;
    }
    if (cRowCnt < G_CELL_MIN_CNT || cColCnt < G_CELL_MIN_CNT) {
      console.warn(`최소 칸의 갯수는 ${G_CELL_MIN_CNT}입니다.`);
      return;
    }
    if (cRowCnt > G_CELL_MAX_CNT || cColCnt > G_CELL_MAX_CNT) {
      console.warn(`최대 칸의 갯수는 ${G_CELL_MAX_CNT}입니다.`);
      return;
    }
    if (cRowCnt % G_CELL_MULTIPLE_NUM > 0 || cColCnt % G_CELL_MULTIPLE_NUM > 0) {
      console.warn(`칸의 갯수는 ${G_CELL_MULTIPLE_NUM}의 배수로 지정해주세요`);
      return;
    }

    const $nemoWrapElem = $cReplaceTargetElem.cloneNode(true);


    const nemoFragment = document.createDocumentFragment();
    for (let i = 0; i < 4; i += 1) {
      nemoFragment.append(document.createElement('div'));
    }

    // ########## 네모 셀 생성 및 정답 갯수 세팅 ###########
    const NEMO_CONTAINER_SIZE = G_CELL_SIZE * cRowCnt;
    const nemoBoard = document.createElement('ul');
    nemoBoard.classList.add(G_STYLE_CLASS_NM.board);

    const itemEleFragment = document.createDocumentFragment();

    for (let rowIdx = 0; rowIdx < cRowCnt; rowIdx += 1) { // row
      const rowItemDataArr = [];
      for (let colIdx = 0; colIdx < cColCnt; colIdx += 1) { // col
        const newItem = document.createElement('li');
        newItem.classList.add(G_STYLE_CLASS_NM.cell);
        newItem.dataset.idxset = `${rowIdx},${colIdx}`;

        const colOrder = colIdx + 1;
        const colRemainder = colOrder % G_CELL_MULTIPLE_NUM;
        if (colOrder > 1 && colOrder < cColCnt) {
          if (colRemainder == 0) {
            newItem.classList.add(G_STYLE_CLASS_NM.strongBorderRight);
          } else if (colRemainder == 1) {
            newItem.classList.add(G_STYLE_CLASS_NM.strongBorderLeft);
          }
        } else if (colOrder == cColCnt) {
          newItem.classList.add(G_STYLE_CLASS_NM.noneBorderRight);
        }

        const rowOrder = rowIdx + 1;
        const rowRemainder = rowOrder % G_CELL_MULTIPLE_NUM;
        if (rowOrder > 1 && rowOrder < cRowCnt) {
          if (rowRemainder == 0) {
            newItem.classList.add(G_STYLE_CLASS_NM.strongBorderBottom);
          } else if (rowRemainder == 1) {
            newItem.classList.add(G_STYLE_CLASS_NM.strongBorderTop);
          }
        } else if (rowOrder == cRowCnt) {
          newItem.classList.add(G_STYLE_CLASS_NM.noneBorderBottom);
        }

        itemEleFragment.append(newItem);
        rowItemDataArr.push(0);
      }

      this.answerDataArr.push(rowItemDataArr);
    }

    nemoBoard.style.gridTemplateRows = `repeat(${cRowCnt}, 1fr)`;
    nemoBoard.style.gridTemplateColumns = `repeat(${cColCnt}, 1fr)`;
    nemoBoard.append(itemEleFragment);


    // ######## 카운트 힌트 영역 생성 #######

    // ---- 상단 숫자 영역
    const nccItemFragment = document.createDocumentFragment();
    const nccLen = Math.ceil(cRowCnt / 2);
    const numberContColumn = document.createElement('ul');

    numberContColumn.classList.add('number-container-flow', 'number-container-flow-column');
    numberContColumn.style.cssText = [
      `width: ${NEMO_CONTAINER_SIZE}px`,
      `height: ${nccLen * gNumItemSize}px`,
      `lineHeight: ${gNumItemSize}px`,
      `grid-template-rows: repeat(${nccLen}, 1fr)`,
      `grid-template-columns: repeat(${cColCnt}, 1fr)`,
    ].join(';');

    const allNccCellLen = nccLen * cColCnt;
    for (let nccIdx = 0; nccIdx < allNccCellLen; nccIdx += 1) {
      const newNccNumItem = document.createElement('li');
      // newNccNumItem.innerText = '';
      nccItemFragment.append(newNccNumItem);
    }
    numberContColumn.append(nccItemFragment);

    // ---- 왼쪽 숫자 영역
    const ncrItemFragment = document.createDocumentFragment();
    const ncrLen = Math.ceil(cColCnt / 2);

    const numberContRow = document.createElement('ul');
    numberContRow.classList.add('number-container-flow', 'number-container-flow-row');
    numberContRow.style.cssText = [
      `width: ${gNumItemSize * ncrLen}px`,
      `height: ${NEMO_CONTAINER_SIZE}px`,
      `line-height: ${G_CELL_SIZE}px`,
      `grid-template-rows: repeat(${cRowCnt}, 1fr)`,
      `grid-template-columns: repeat(${ncrLen}, 1fr)`,
    ].join(';');

    const allNcrCellLen = ncrLen * cRowCnt;
    for (let ncrIdx = 0; ncrIdx < allNcrCellLen; ncrIdx += 1) {
      const newNcrNumItem = document.createElement('li');
      newNcrNumItem.style.cssText = [`width: ${gNumItemSize}px`, `height: ${G_CELL_SIZE}px`].join(';');
      // newNcrNumItem.innerText = '';
      ncrItemFragment.append(newNcrNumItem);
    }
    numberContRow.append(ncrItemFragment);
    nemoFragment.children[1].append(numberContColumn); // 상단 숫자 영역
    nemoFragment.children[2].append(numberContRow); // 왼쪽 숫자 영역
    nemoFragment.lastElementChild.append(nemoBoard); // 칸 영역


    /**
     * 숫자 힌트 값 세팅
     */
    // ---- 왼쪽 영역
    function leftHintGen() {
      const ncrTextArr = [];
      for (let i = 0; i < cColCnt; i += 1) {
        const nemoItem = cNemoQuestion[i];
        const itemArr = [];
        let tempSum = 0;

        for (let j = 0; j < nemoItem.length; j += 1) {
          if (nemoItem[j] == 1) {
            tempSum += 1;
            if (j == nemoItem.length - 1) { // 마지막 요소 인덱스
              itemArr.push(tempSum);
            }
          } else if (tempSum > 0) {
            itemArr.push(tempSum);
            tempSum = 0;
          }
        }

        const ncrTextItem = new Array(ncrLen);  // Int8Array
        ncrTextItem.fill('');
        let tempNum = 1;
        for (let k = ncrTextItem.length - 1; k >= 0; k -= 1) {
          const iaIdx = itemArr.length - tempNum;
          if (iaIdx < 0) {
            break;
          }
          ncrTextItem[k] = itemArr[iaIdx];
          tempNum += 1;
        }
        ncrTextArr.push(ncrTextItem);
      }

      const leftNumEleArr = numberContRow.children;
      for (let i = 0; i < ncrTextArr.length; i += 1) {
        const bbb = ncrTextArr[i];
        const lastItem = bbb[bbb.length - 1];

        if (lastItem == '') {
          // 정답칸이 없어서 텍스트 배열이 전부 빈문자열이면 마지막에 0을 넣어준다.
          bbb[bbb.length - 1] = 0;
        }

        for (let j = 0; j < bbb.length; j += 1) {
          leftNumEleArr[ncrLen * i + j].innerText = ncrTextArr[i][j];
        }
      }
    }

    // --- 상단 영역
    function topHintGen() {
      const nccTextArr = [];
      for (let cIdx = 0; cIdx < cColCnt; cIdx += 1) {
        const itemArr = [];
        let tempSum = 0;
        for (let rIdx = 0; rIdx < cRowCnt; rIdx += 1) {
          const curValue = cNemoQuestion[rIdx][cIdx];
          if (curValue == 1) {
            tempSum += 1;
            if (rIdx == cRowCnt - 1) { // 마지막 row 인덱스
              itemArr.push(tempSum);
            }
          } else if (tempSum > 0) {
            itemArr.push(tempSum);
            tempSum = 0;
          }
        }

        const nccTextItem = new Array(nccLen);
        nccTextItem.fill('');
        let tempNum = 1;

        for (let k = nccTextItem.length - 1; k >= 0; k -= 1) {
          const iaIdx = itemArr.length - tempNum;
          if (iaIdx < 0) {
            break;
          }
          nccTextItem[k] = itemArr[iaIdx];
          tempNum += 1;
        }
        nccTextArr.push(nccTextItem);
      }

      const topNumEleArr = numberContColumn.children;
      for (let i = 0; i < nccTextArr.length; i += 1) {
        const bbb = nccTextArr[i];
        const lastItem = bbb[bbb.length - 1];

        if (lastItem == '') {
          // 정답칸이 없어서 텍스트 배열이 전부 빈문자열이면 마지막에 0을 넣어준다.
          bbb[bbb.length - 1] = 0;
        }
        for (let j = 0; j < bbb.length; j += 1) {
          topNumEleArr[nccLen * i + j].innerText = nccTextArr[i][j];
        }
      }
    }

    /**
     * 답안 체크
     */
    const isCorrectAnswer = () => {
      let isPass = true;

      loop1: for (let row = 0; row < cRowCnt; row += 1) {
        for (let col = 0; col < cColCnt; col += 1) {
          // X체크는 상태가 2인데, X는 정답체크가 아니므로 정답과 비교시 0으로 취급하여 비교한다.
          const itemState = this.answerDataArr[row][col] == 2 ? 0 : this.answerDataArr[row][col];
          if (cNemoQuestion[row][col] !== itemState) {
            isPass = false;
            // eslint-disable-next-line no-labels
            break loop1;
          }
        }
      }

      return isPass;
    };

    /**
     * 속성 세팅
     */
    const itemEleList = nemoBoard.childNodes; // 칸 요소

    /**
     * 다시하기
     */
    this.p_reset = () => {
      // 칸 체크 상태 값 초기화
      this.answerDataArr.forEach((itemData) => {
        itemData.fill(0);
      });

      // 칸 스타일 초기화
      itemEleList.forEach((item) => {
        Object.assign(item.style, G_CELL_EMPTY_STYLE);
      });

      // 각종 상태값 초기화
      this.cellCheckMode = 1;
      cIsGameCompleted = false;
      $cTempDragPassedCellArr.length = 0;
      cIsMouseDragging = false;
      cIsMousePressing = false;
      $cTempDragStartCell = null;
    };

    /**
     * X체크 칸 전부 초기화
     */
    this.p_unselX = () => {
      this.answerDataArr.forEach((pItemData) => {
        const itemData = pItemData;
        for (let i = 0; i < itemData.length; i += 1) {
          if (itemData[i] == 2) {
            itemData[i] = 0;
          }
        }
      });

      // 칸 스타일 초기화
      itemEleList.forEach((item) => {
        Object.assign(item.style, {
          backgroundImage: '',
          backgroundRepeat: '',
          backgroundSize: '',
        });
      });
    };

    // /**
    //  * 답안지의 행 또는 열의 카운트 세트가 정답과 일치하는지 확인
    //  */
    // const isMatchItemCntSet = (pItemDataArr, pCorrectDataArr) => {
    //   let isMatch = false;
    //   const itemDataCorMatch = JSON.stringify(pItemDataArr).match(/1/g);
    //   const nemoQuestionCorMatch = JSON.stringify(pCorrectDataArr).match(/1/g);
    //   if (itemDataCorMatch != null && nemoQuestionCorMatch != null) {
    //     if (itemDataCorMatch.length == nemoQuestionCorMatch.length) { // 상태1의 갯수는 우선 일치
    //       // 카운트셋이 일치하는지 체크
    //       const itemDataCntSet = JSON.stringify(pItemDataArr).replace(/,/g, '').match(/1+/g);
    //       const nemoQuestionSet = JSON.stringify(pCorrectDataArr).replace(/,/g, '').match(/1+/g);
    //       for (let i = 0; i < itemDataCntSet.length; i += 1) {
    //         isMatch = itemDataCntSet[i].length == nemoQuestionSet[i].length;
    //         if (!isMatch) break;  // 한번이라도 false면 루프 나가기
    //       }
    //     }
    //   }
    //   return isMatch;
    // };
    // /**
    //  * 선택한 칸을 기준으로 십자모양의 칸의 상태를 세팅
    //  */
    // const itemCrossStateSet = (pIdxRow, pIdxCol) => {
    //   // 선택한 칸의 row의 카운트셋이 일치하느지 판단
    //   const isRowCntSetMatch = isMatchItemCntSet(answerDataArr[pIdxRow], cNemoQuestion[pIdxRow]);
    //   if (isRowCntSetMatch) {
    //     const itemEleListRow = [...itemEleList].filter((item) => item.dataset.idxset.split(',')[0] == pIdxRow);
    //     itemEleListRow.forEach((rowItem, idx) => {
    //       if (answerDataArr[pIdxRow][idx] !== 1) {
    //         checkCell(rowItem, 2);
    //       }
    //     });
    //   }
    //   // 선택한 칸의 col의 카운트셋이 일치하는지 판단
    //   const itemDataColArr = [];
    //   const nemoQuestionColArr = [];
    //   const rowLen = answerDataArr.length;
    //   for (let i = 0; i < rowLen; i += 1) {
    //     itemDataColArr.push(answerDataArr[i][pIdxCol]);
    //     nemoQuestionColArr.push(cNemoQuestion[i][pIdxCol]);
    //   }
    //   const isColCntSetMatch = isMatchItemCntSet(itemDataColArr, nemoQuestionColArr);
    //   if (isColCntSetMatch) {
    //     const itemEleListCol = [...itemEleList].filter((item) => item.dataset.idxset.split(',')[1] == pIdxCol);
    //     itemEleListCol.forEach((colItem, idx) => {
    //       if (answerDataArr[idx][pIdxCol] !== 1) {
    //         checkCell(colItem, 2);
    //       }
    //     });
    //   }
    // };
    /**
     * 선택한 칸을 체크표시
     */

    /**
     * 선택한 셀의 현재 상태값을 얻기
     * @param {number} pIdxRow 행 인덱스
     * @param {number} pIdxCol 열 인덱스
     * @returns 새 상태 값 : 0 공백, 1 답안, 2 X마크
     */
    const getNewStateOfCell = (pIdxRow, pIdxCol) => {
      const curState = this.answerDataArr[pIdxRow][pIdxCol];
      return this.cellCheckMode == curState ? 0 : this.cellCheckMode;
    };

    const checkCell = (target, stateVal) => {
      if (cIsGameCompleted) {
        return;
      }

      const idxsetSplit = target.dataset.idxset.split(',');

      let newVal = getNewStateOfCell(idxsetSplit[0], idxsetSplit[1]);

      if (stateVal || stateVal == 0) {
        newVal = stateVal;
      }

      this.answerDataArr[idxsetSplit[0]][idxsetSplit[1]] = newVal;

      Object.assign(target.style, G_CELL_EMPTY_STYLE);

      if (newVal == 1) {
        Object.assign(target.style, G_CELL_FILL_STYLE);
      } else if (newVal == 2) {
        Object.assign(target.style, G_CELL_MARK_STYLE);
      }

      if (isCorrectAnswer()) {
        cIsGameCompleted = true;
        const { onComplete } = pGenOption;
        if (onComplete && onComplete instanceof Function) {
          onComplete();
        }
      }
      //  else if (!stateVal && stateVal !== 0) {
      //   itemCrossStateSet(idxRow, idxCol);
      // }
    };

    /**
     * 마우스 드래그시 처리
     */
    const dragFunc = (e) => {
      if ($cTempDragStartCell != null && $cTempDragStartCell !== e.target) {
        return;
      }

      $cTempDragStartCell = null;
      cIsMouseDragging = true;

      if (!$cTempDragPassedCellArr.includes(e.target)) {
        $cTempDragPassedCellArr.push(e.target);
        checkCell(e.target);
      }
    };

    /**
     * 칸 위에서 마우스 누르기 (드래그 준비)
     */
    nemoBoard.addEventListener('mousedown', (e) => {
      cIsMousePressing = true;
      cIsMouseDragging = false;
      if ($cTempDragStartCell == null) {
        $cTempDragStartCell = e.target;
      }
      setTimeout(() => {
        if (cIsMousePressing) {
          nemoBoard.addEventListener('mousemove', dragFunc);
        }
      }, G_DRAG_EVENT_DELAY_MS);
    });

    /**
     * 아무데서나 마우스 떼기
     */
    document.addEventListener('mouseup', () => {
      if (!cIsMousePressing) {
        return;
      }

      cIsMousePressing = false;
      cIsMouseDragging = false;
      $cTempDragStartCell = null;
      $cTempDragPassedCellArr.length = 0;
      nemoBoard.removeEventListener('mousemove', dragFunc);
    });

    /**
     * 칸 클릭
     */
    nemoBoard.addEventListener('click', (e) => {
      if (cIsMouseDragging) {
        return;
      }

      const { target } = e;
      if (target && target.nodeName == 'LI') {
        if (!cIsGameCompleted) {
          checkCell(target);
        }
      }
    });


    // 초기화
    leftHintGen();
    topHintGen();

    $nemoWrapElem.classList.add(G_STYLE_CLASS_NM.container);
    $nemoWrapElem.style.gridTemplateColumns = `${gNumItemSize * nccLen}px auto`;
    $nemoWrapElem.append(nemoFragment);

    $cReplaceTargetElem.replaceWith($nemoWrapElem);

    console.timeEnd(gNemoGenTimerLabel);
  }

  /**
   * 체크 모드 변경
   * @param {number} pCellCheckMode 1 답안체크, 2 X체크
   */
  changeCellCheckMode(pCellCheckMode) {
    this.cellCheckMode = Number(pCellCheckMode || 1);
  }

  /**
   * 다시하기
   */
  reset() {
    this.p_reset();
  }

  /**
   * X체크 모두 해제
   */
  unselX() {
    this.p_unselX();
  }

  /**
   * 현재 선택한 칸 데이터 얻기
   */
  getAnswerData() {
    return this.answerDataArr;
  }
}
