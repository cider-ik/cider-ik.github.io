import Nemo from '../../lib/nemo/Nemo.js';

/**
 * document ready
 */

let nemoObj = null;
document.addEventListener('DOMContentLoaded', () => {
  // let $nemoClone = null;
  const rdoCheckMode = document.getElementsByName('rdoCheckMode');

  /**
  * 새 게임 생성
  */
  function genNewGame(pRowCnt, pColCnt) {
    const nemoWrap = document.getElementById('nemo');
    nemoWrap.innerHTML = '';

    // eslint-disable-next-line prefer-const
    let nemoQuestion = [];
    for (let row = 0; row < pRowCnt; row += 1) {
      const colArr = [];
      for (let col = 0; col < pColCnt; col += 1) {
        colArr.push(Math.floor(Math.random() * 2));   // 0 or 1
      }
      nemoQuestion.push(colArr);
    }

    // nemoQuestion = [
    //   [1, 1, 1, 0, 0],
    //   [0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0],
    // ];
    // nemoQuestion = [
    //   [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ];

    const generateOption = {
      onComplete() {   // 다풀었음
        console.log('!!!!!!!!!!!!!!!!!!! 완료 !!!!!!!!!!!!!!!!!!!!');
        // $nemoClone = document.getElementsByClassName('nemo-container')[0].cloneNode(true);   // 하위노드까지 복사하려면 true
        // $nemoClone.classList.add('complete');

        // [...$nemoClone.children].forEach((item) => {
        //   item.classList.add('border-unset');
        //   item.setAttribute('style', '');
        // });

        // document.getElementById('nemo').style.display = 'none';
        // document.querySelector('body').prepend($nemoClone);
      },
    };

    nemoObj = new Nemo('nemo', nemoQuestion, generateOption);
    rdoCheckMode[0].checked = true;
  }

  /**
  * 이벤트 바인딩
  */
  // 체크모드
  const chnageRdo = (e) => nemoObj.changeCellCheckMode(e.target.value);
  rdoCheckMode[0].addEventListener('click', chnageRdo);
  rdoCheckMode[1].addEventListener('click', chnageRdo);

  // 문제 생성
  document.getElementById('btnNewGame').addEventListener('click', () => {
    // if ($nemoClone) {
    //   $nemoClone.remove();
    // }
    document.getElementById('nemo').style.display = 'grid';
    const vaa = document.getElementById('selNemoSize').value;
    genNewGame(vaa, vaa);
  });

  // 다시하기
  document.getElementById('btnResetGame').addEventListener('click', () => {
    // if ($nemoClone) {
    //   $nemoClone.remove();
    // }
    document.getElementById('nemo').style.display = 'grid';
    if (nemoObj != null) {
      nemoObj.reset();
    }
  });

  // -------------------- [TEST] ----------------------------
  document.getElementById('testshowCorrect').addEventListener('click', () => console.log(nemoObj.test_showAnswer));
  document.getElementById('testshowAnswer').addEventListener('click', () => console.log(nemoObj.answerDataArr));
  // --------------------------------------------------------

  genNewGame(document.getElementById('selNemoSize').value, document.getElementById('selNemoSize').value);
});
