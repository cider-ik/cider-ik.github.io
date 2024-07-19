// script.js 파일

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      // 0부터 i까지의 랜덤 인덱스를 생성
      const j = Math.floor(Math.random() * (i + 1));
      
      // 배열의 i번째 요소와 j번째 요소를 교환
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // IE/Edge
    element.msRequestFullscreen();
  }
}

function showPopup() {
  document.getElementById('popup').style.display = 'flex';
}

let curCell = null;
function confirmSelection() {
  if (curCell == null) {
    return;
  }
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
      const backElements = curCell.querySelectorAll('.back');
      const firstBackElement = backElements[0];
      firstBackElement.classList.add(`team${selectedOption.value}`);
      document.getElementById('popup').style.display = 'none';
  }
}

const quizMatrix = [
  { title: '국기보고나라', url: 'https://machugi.io/quiz/w9jeTHbBLaQOqcSvYhUh', isFlip: false },
  { title: '종합인물', url: 'https://machugi.io/quiz/GpLwmKGcojRWwiXnGmJv', isFlip: false },
  { title: '브랜드로고', url: 'https://machugi.io/quiz/6v4a6HwgkJWkrWNqsYoY', isFlip: false },
  { title: '만화캐릭터', url: 'https://machugi.io/quiz/BrLHQwW0q6LV7kEOEtsx', isFlip: false },
  { title: '걸그룹멤버', url: 'https://machugi.io/quiz/VCuFRCFWAOprUGygCqv8', isFlip: false },
  { title: '별다줄', url: 'https://machugi.io/quiz/3YkQHuh0EyuBh61hFeSg', isFlip: false },
  { title: '한국유튜버', url: 'https://machugi.io/quiz/tBMWfhiG3vKvcI8Y3B4z', isFlip: false },
  { title: '애니제목', url: 'https://machugi.io/quiz/et19X1xqAzTMZrXc7AGR', isFlip: false },
  { title: '동물울음소리', url: 'https://machugi.io/quiz/AQTci6ACkL6hDzhsghyd', isFlip: false },
  { title: '노래(반주듣고제목)', url: 'https://machugi.io/quiz/6c9MEmcpExz60GXf0FgL', isFlip: false },
  { title: '종합인물', url: 'https://machugi.io/quiz/SbpfYPnGCCPre4eD6s6r', isFlip: false },
  { title: '롤캐릭터음성', url: 'https://machugi.io/quiz/6UWRrgovO2qzrkbNE1BJ', isFlip: false },
  { title: '음식확대사진', url: 'https://machugi.io/quiz/RQq4aYMsVlb1vVZgJISn', isFlip: false },
  { title: '한국영화명장면', url: 'https://machugi.io/quiz/9AgKMkYILviiuMzaD1xc', isFlip: false },
  { title: '투니버스애니(사진)', url: 'https://machugi.io/quiz/vFM2QynAi0JENNI7Xrxv', isFlip: false },
  { title: '노래(추억의애니OST)', url: 'https://machugi.io/quiz/5okZw1h1q11OuCD8A2YZ', isFlip: false },
  { title: '포켓몬1세대', url: 'https://machugi.io/quiz/UAxm515rLej4kUUJjkcY', isFlip: false },
  { title: '과자', url: 'https://machugi.io/quiz/FQ1H3W0B4B9aGiB9ostj', isFlip: false },
  { title: '억까퀴즈', url: 'https://machugi.io/quiz/RKsrjdbfrgIqzLSgwcey', isFlip: false },
  { title: '군필만아는', url: 'https://machugi.io/quiz/TSC8PpfbrCBTf7iRJRlK', isFlip: false },
  { title: '원피스캐릭터', url: 'https://machugi.io/quiz/MEyspDTZsK2uo4xjjs73', isFlip: false },
  { title: '걸그룹노래제목', url: 'https://machugi.io/quiz/voYQ1vJhmxjXW9blgDTk', isFlip: false },
  { title: '밈고인물', url: 'https://machugi.io/quiz/N8pksRL1R2WvhNrhlzeX', isFlip: false },
  { title: '자동차로고', url: 'https://machugi.io/quiz/bPtKuH4r9FjexFnWCrVa', isFlip: false },
  { title: '노래(00~10)', url: 'https://machugi.io/quiz/gW7EnWrexxVc4FQREqQw', isFlip: false },
  { title: '푸바오맞히기', url: 'https://machugi.io/quiz/JRC5icBSmtZTiWAlheBN', isFlip: false },
  { title: '아이돌이름', url: 'https://machugi.io/quiz/qnPn7pqZLzw7b13kPCoV', isFlip: false },
  { title: '사자성어', url: 'https://machugi.io/quiz/YNQzSptVvYdF2wFM4ULT', isFlip: false },
  { title: '노래(90~00)', url: 'https://machugi.io/quiz/LYQDDHBhIbWghVpggeRE', isFlip: false },
  { title: '명품로고', url: 'https://machugi.io/quiz/scfgMEM2a99jNN2dfFlP', isFlip: false },
  { title: '동물', url: 'https://machugi.io/quiz/fzc1SQLOAL9RntFPdURz', isFlip: false },
  { title: '한국배우', url: 'https://machugi.io/quiz/43PZdTGYAo5hvFlTzfVS', isFlip: false },
  { title: '노래(투니버스애니OST)', url: 'https://machugi.io/quiz/vFM2QynAi0JENNI7Xrxv', isFlip: false },
  { title: '날먹!', url: 'nalmuk', isFlip: false },
  { title: '드라마제목', url: 'https://machugi.io/quiz/vDfeJzUPbuReQafts2op', isFlip: false },
  { title: '음식', url: 'https://machugi.io/quiz/0Bwr8gOG2Qgy6htR2H9R', isFlip: false }
];

document.addEventListener('DOMContentLoaded', function() {
  shuffleArray(quizMatrix);

  const matrix = document.querySelector('.matrix');

  for (let i = 0; i < 36; i++) {
      const li = document.createElement('li');
      const innerDiv = document.createElement('div');
      innerDiv.classList.add('inner');
      const frontDiv = document.createElement('div');
      frontDiv.classList.add('front');
      frontDiv.textContent = i + 1;
      const backDiv = document.createElement('div');
      backDiv.classList.add('back');
      backDiv.textContent = quizMatrix[i].title;

      innerDiv.appendChild(frontDiv);
      innerDiv.appendChild(backDiv);
      li.appendChild(innerDiv);
      li.setAttribute('data-index', i);
      matrix.appendChild(li);
  }

  document.querySelectorAll('.matrix li').forEach(function(cell) {
    cell.addEventListener('click', function() {
      const curData = quizMatrix[Number(this.getAttribute('data-index'))];
      if (curData.isFlip) {
        window.open(curData.url);
        curCell = this;
        showPopup();
      } else {
        this.classList.toggle('flip');
        curData.isFlip = true;
      }
    });
  });

  document.getElementById('floatingButton').addEventListener('click', function() {
    openFullscreen(document.documentElement); // 전체 문서에 대해 전체 화면 요청
  });
});
