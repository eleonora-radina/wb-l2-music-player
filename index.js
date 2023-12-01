const player = document.querySelector('.player');
const playBtn = document.querySelector('.play');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const progressContainer = document.querySelector('.player__progress-container');
const progressBar = document.querySelector('.player__progress');

const songName = document.querySelector('.player__song-name');

// Получаем элемент аудиоплеера
const audioPlayer = document.getElementById('audioPlayer');

// Путь к папке с музыкой
const musicFolderPath = "./audio/";

// Список файлов музыки
const musicFiles = [
  'Andy Williams - It is the Most Wonderful Time of the Year',
  'Bobby Helms - Jingle Bell Rock',
  'Frank Sinatra - Let It Snow'
];

// Текущий индекс трека
let currentTrackIndex = 0;

// Загрузка первого трека при загрузке страницы
loadTrack(currentTrackIndex);

// Функция для загрузки трека
function loadTrack(index) {
  songName.textContent = musicFiles[index];
  audioPlayer.src = musicFolderPath + musicFiles[index] + '.mp3';
}

function togglePlayTrack() {
  const isPlaying = playBtn.classList.contains('pause');
  if (isPlaying) {
    playBtn.classList.remove('pause');
    audioPlayer.pause();
  } else {
    playBtn.classList.add('pause');
    audioPlayer.play();
  }  
}

function nextTrack() {
  currentTrackIndex++;
  if (currentTrackIndex > musicFiles.length - 1) {
    currentTrackIndex = 0;
  }
  loadTrack(currentTrackIndex);

  if (playBtn.classList.contains('pause')) {
    audioPlayer.play();
  } else {
    progressBar.style.width = 0;
  }
}

function prevTrack() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = musicFiles.length - 1;
  }
  loadTrack(currentTrackIndex);

  if (playBtn.classList.contains('pause')) {
    audioPlayer.play();
  } else {
    progressBar.style.width = 0;
  }
}



playBtn.addEventListener('click', () => {
  

  togglePlayTrack()});

nextBtn.addEventListener('click', () => nextTrack());
prevBtn.addEventListener('click', () => prevTrack());

// Обработчик события, когда трек завершает воспроизведение
audioPlayer.addEventListener('ended', nextTrack);

function updateProgress(e) {
  const duration = audioPlayer.duration;
  const currentTime = audioPlayer.currentTime;
  progressBar.style.width = `${currentTime / duration * 100}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = clickX / width * duration;
}

audioPlayer.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

/////////////////////////////

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var source = audioCtx.createMediaElementSource(audioPlayer);

const canvas = document.getElementById('player-fireplace');
const canvasCtx = canvas.getContext('2d');

source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);

canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  var barWidth = (canvas.width / bufferLength) * 2.5;
  var barHeight;
  var x = 0;
  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]/2;

    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight);

    x += barWidth + 1;
  }
}

draw();