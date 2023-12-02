const player = document.querySelector('.player');
const playBtn = document.querySelector('.play');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const loopBtn = document.querySelector('.loop');

const progressContainer = document.querySelector('.player__progress-container');
const progressBar = document.querySelector('.player__progress');

const songName = document.querySelector('.player__song-name');
const currentTimeText = document.querySelector('.player__current-time');
const durationText = document.querySelector('.player__duration');

const volumeSlider = document.getElementById('volumeSlider');


// Получаем элемент аудиоплеера
const audioPlayer = document.getElementById('audioPlayer');

// Путь к папке с музыкой
const musicFolderPath = "./audio/";

// Список файлов музыки
const musicFiles = [
  {
    id: 0,
    name: "Andy Williams - It is the Most Wonderful Time of the Year"
  },
  {
    id: 1,
    name: "Bobby Helms - Jingle Bell Rock"
  },
  {
    id: 2,
    name: "Frank Sinatra - Let It Snow"
  },
  {
    id: 3,
    name: "Ella Fitzgerald - Have Yourself A Merry Little Christmas"
  },
  {
    id: 4,
    name: "Michael Bublé - Winter Wonderland"
  },
  {
    id: 5,
    name: "Sia - Snowman"
  }
];

// Текущий индекс трека
let currentTrackIndex = 0;
var currentSongId = 0;

// Загрузка первого трека при загрузке страницы
loadTrack(currentTrackIndex);

// Функция для загрузки трека
function loadTrack(index) {
  songName.textContent = musicFiles[index].name;
  audioPlayer.src = musicFolderPath + musicFiles[index].name + '.mp3';
  currentSongId = musicFiles[index].id;
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
  let prevSong = document.getElementById(`${currentSongId}`);
  prevSong.style.fontWeight = 'normal';

  currentTrackIndex++;
  if (currentTrackIndex > musicFiles.length - 1) {
    currentTrackIndex = 0;
  }
  loadTrack(currentTrackIndex);

  let nextSong = document.getElementById(`${currentSongId}`);
  nextSong.style.fontWeight = '700';

  if (playBtn.classList.contains('pause')) {
    audioPlayer.play();
  } else {
    progressBar.style.width = 0;
    currentTimeText.textContent = "00:00";
  }
}

function prevTrack() {
  let prevSong = document.getElementById(`${currentSongId}`);
  prevSong.style.fontWeight = 'normal';

  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = musicFiles.length - 1;
  }
  loadTrack(currentTrackIndex);

  let nextSong = document.getElementById(`${currentSongId}`);
  nextSong.style.fontWeight = '700';

  if (playBtn.classList.contains('pause')) {
    audioPlayer.play();
  } else {
    progressBar.style.width = 0;
    currentTimeText.textContent = "00:00";
  }
}

function shuffleTracks() {
  currentSongId = musicFiles[currentTrackIndex].id;

  for (var i = musicFiles.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = musicFiles[i];
    musicFiles[i] = musicFiles[j];
    musicFiles[j] = temp;
  }

  currentTrackIndex = musicFiles.findIndex(x => x.id === currentSongId);

  playlist.innerHTML = '';
  musicFiles.forEach((item) => {
    addSongToPlaylist(item);
  })
}

function loopTrack() {
  const isLoop = loopBtn.classList.contains('active');
  if (isLoop) {
    loopBtn.classList.remove('active');
    audioPlayer.loop = false;
  } else {
    loopBtn.classList.add('active');
    audioPlayer.loop = true;
  }
}

function updateProgress(e) {
  const duration = audioPlayer.duration;
  durationText.textContent = toTime(duration);

  const currentTime = audioPlayer.currentTime;
  progressBar.style.width = `${currentTime / duration * 100}%`;
  currentTimeText.textContent = toTime(currentTime);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = clickX / width * duration;
}

function toTime(seconds) {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
}

function editVolume() {
  audioPlayer.volume = volumeSlider.value;
}

playBtn.addEventListener('click', () => togglePlayTrack());
nextBtn.addEventListener('click', () => nextTrack());
prevBtn.addEventListener('click', () => prevTrack());
shuffleBtn.addEventListener('click', () => shuffleTracks());
loopBtn.addEventListener('click', () => loopTrack());

audioPlayer.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// Обработчик события, когда трек завершает воспроизведение
audioPlayer.addEventListener('ended', nextTrack);

volumeSlider.addEventListener('input', editVolume);

//////////////

const playlist = document.querySelector('.playlist__container');

function addSongToPlaylist(item) {
  let song = document.createElement('p');
  song.classList.add('playlist__song');
  song.id = item.id;
  song.textContent = item.name;
  playlist.appendChild(song);

  if (currentSongId === parseInt(song.id)) {
    song.style.fontWeight = '700';
  } else {
    song.style.normal = '700';
  }

  song.addEventListener('click', () => {

    let prevSong = document.getElementById(`${currentSongId}`);
    prevSong.style.fontWeight = 'normal';


    var index = musicFiles.findIndex((x) => x.id === item.id);
    currentTrackIndex = index;

    loadTrack(currentTrackIndex);

    let nextSong = document.getElementById(`${currentSongId}`);
    nextSong.style.fontWeight = '700';

    if (playBtn.classList.contains('pause')) {
      audioPlayer.play();
    } else {
      progressBar.style.width = 0;
      currentTimeText.textContent = "00:00";
    }
  });
}

musicFiles.forEach((item) => {
  addSongToPlaylist(item);
})