var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var source = null;
var analyser = null;

const canvas = document.getElementById('player-fireplace');
const canvasCtx = canvas.getContext('2d');

//

analyser = audioCtx.createAnalyser();
source = audioCtx.createMediaElementSource(audioPlayer);

analyser.fftSize = 1024; // Кол-во колонок: 1024, 512, 256, 128, 64
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);

canvasCtx.clearRect(0, 0, canvas.width, canvas.height);


/* мы запускаем функцию draw() и задаём цикл при помощи requestAnimationFrame() таким образом, 
чтобы в каждом кадре анимации данные обновлялись.

Затем мы устанавливаем значение barWidth , равное ширине холста, делённой на количество столбцов (длину буфера). 
Однако, мы домножаем ширину на 2.5, поскольку на большинстве частот звука не будет, 
поскольку большинство звуков, которые мы слышим в повседневной жизни, находятся в определённых, достаточно низких, диапазонах частот. 
Нам нет смысла показывать множество пустых частот, поэтому мы просто сдвигаем столбцы, 
соответствующие наиболее распространённым частотам.

Мы также устанавливаем значение переменных barHeight и x , задающей то, где на холсте должен быть размещён каждый столбец.
*/
function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = 'rgb(25, 23, 27)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  var barWidth = (canvas.width / bufferLength) * 2.5;
  var barHeight;
  var x = 0;
  for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',176,64)';
    canvasCtx.fillRect(x, canvas.height - barHeight * 2, barWidth, barHeight);

    x += barWidth + 1;
  }
}

audioPlayer.addEventListener('play', () => {
  audioCtx.resume().then(() => {
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      draw();
  });
});

audioPlayer.addEventListener('pause', () => {
  audioCtx.suspend();
});