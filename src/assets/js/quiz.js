// script.js 파일
document.addEventListener('DOMContentLoaded', function() {
  const matrix = document.querySelector('.matrix');

  for (let i = 1; i <= 36; i++) {
      const li = document.createElement('li');
      const innerDiv = document.createElement('div');
      innerDiv.classList.add('inner');
      const frontDiv = document.createElement('div');
      frontDiv.classList.add('front');
      frontDiv.textContent = i;
      const backDiv = document.createElement('div');
      backDiv.classList.add('back');
      backDiv.textContent = '와우!';

      innerDiv.appendChild(frontDiv);
      innerDiv.appendChild(backDiv);
      li.appendChild(innerDiv);
      matrix.appendChild(li);
  }

  document.querySelectorAll('.matrix li').forEach(function(cell) {
      cell.addEventListener('click', function() {
          cell.classList.toggle('flip');
      });
  });
});
