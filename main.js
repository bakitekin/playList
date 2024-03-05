/* Elementlere Ulaşma */

// Şarkı Kontrolleri
const prevButton = document.getElementById("prev"); // Önceki şarkı butonu
const nextButton = document.getElementById("next"); // Sonraki şarkı butonu
const repeatButton = document.getElementById("repeat"); // Tekrar et butonu
const shuffleButton = document.getElementById("shuffle"); // Karışık çal butonu

// Ses ve Görüntü Öğeleri
const audio = document.getElementById("audio"); // Ses öğesi
const songImage = document.getElementById("song-image"); // Şarkı resmi öğesi
const songName = document.getElementById("song-name"); // Şarkı adı öğesi
const songArtist = document.getElementById("song-artist"); // Sanatçı adı öğesi

// Çalma Listesi Kontrolleri
const playListButton = document.getElementById("playlist"); // Çalma listesi butonu
const playListContainer = document.getElementById("playlist-container"); // Çalma listesi konteyner öğesi
const closeButton = document.getElementById("close-button"); // Kapatma butonu
const playListSongs = document.getElementById("playlist-songs"); // Çalma listesi şarkıları öğesi

// Süre ve İlerleme Kontrolleri
const maxDuration = document.getElementById("max-duration"); // Maksimum süre öğesi
const currentTimeRef = document.getElementById("current-time"); // Geçerli süre öğesi
const progressBar = document.getElementById("progress-bar"); // İlerleme çubuğu öğesi
const currentProgress = document.getElementById("current-progress"); // Geçerli ilerleme öğesi

// Kontrol Düğmeleri
const pauseButton = document.getElementById("pause"); // Duraklat butonu
const playButton = document.getElementById("play"); // Oynat butonu

/* Şarkı Sırası ve Döngü Ayarları */

let index = 4; // Başlangıçta çalınacak şarkının indeksi
let loop = true; // Şarkıların döngülü çalınıp çalınmayacağını belirleyen bayrak

/* Şarkı Listesi JSON Verisi */

const songsList = [{
    name: "Holocaust",
    link: "songs/ceza.mp3",
    artist: "Ceza",
    image: "images/ceza.jpeg",
  },
  {
    name: "Tu lu Ki",
    link: "songs/xece.mp3",
    artist: "Xece Herdem",
    image: "images/xeceherdem.jpeg",
  },
  {
    name: "Happy",
    link: "songs/Pharrell.mp3",
    artist: "Pharrell Williams",
    image: "images/pharrell williams.jpeg",
  },
  {
    name: "Seni Yazdım Kalbime",
    link: "songs/baba.mp3",
    artist: "Müslüm Baba",
    image: "images/baba.jpeg",
  },
  {
    name: "Another One Bites the Dust",
    link: "songs/Queen.mp3",
    artist: "Queen",
    image: "images/quenn.jpeg",
  },
];

/* Oynatma İşlemleri */

// Oynat butonuna basıldığında yapılacak işlemler
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); // Duraklat butonunu göster
  playButton.classList.add("hide"); // Oynat butonunu gizle
};

// Duraklat butonuna basıldığında yapılacak işlemler
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide"); // Duraklat butonunu gizle
  playButton.classList.remove("hide"); // Oynat butonunu göster
};

// Şarkıyı belirtilen indekse göre ayarla
const setSong = (arrayIndex) => {
  let {
    name,
    link,
    artist,
    image
  } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name; // Şarkı adını görüntüle
  songArtist.innerHTML = artist; // Sanatçı adını görüntüle
  songImage.src = image; // Şarkı resmini görüntüle

  audio.onloadedmetadata = () => {
    // Şarkı süresini biçimlendirilmiş zaman formatında görüntüleme
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playListContainer.classList.add("hide"); // Çalma listesi konteynerını gizle
  playAudio(); // Şarkıyı oynat
};

/* Sürekli Zaman ve İlerleme Güncellemesi */

setInterval(() => {
  // Şu anki zamanı biçimlendirilmiş zaman formatında görüntüleme
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);

  // İlerleme çubuğunun genişliğini güncelleyerek ilerleme yüzdesini gösterme
  currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

/* İlerleme Çubuğu Tıklama İşlemi */

progressBar.addEventListener("click", (event) => {
  // İlerleme çubuğunun sol başlangıç noktası
  let coordStart = progressBar.getBoundingClientRect().left;

  // Tıklamanın X ekseni koordinatı
  let coordEnd = event.clientX;

  // Yüzde hesaplama
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  // İlerleme çubuğunun genişliğini güncelleme
  currentProgress.style.width = progress * 100 + "%";

  // Sesin geçerli zamanını güncelleme
  audio.currentTime = progress * audio.duration;

  // Şarkıyı oynatma
  audio.play();

  // Duraklat butonunu gösterme, oynat butonunu gizleme
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

/* Zaman Biçimlendirme Fonksiyonu */

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

/* Önceki ve Sonraki Şarkı İşlemleri */

// Önceki şarkı fonksiyonu
const previousSong = () => {
  if (index > 0) {
    pauseAudio(); // Şarkıyı duraklat
    index = index - 1; // Bir önceki şarkının indeksine geç
  } else {
    index = songsList.length - 1; // Eğer ilk şarkıdaysa, en son şarkıya geç
  }
  setSong(index); // Yeni şarkıyı ayarla
};

// Sonraki şarkı fonksiyonu
const nextSong = () => {
  // Eğer döngü varsa
  if (loop) {
    // Eğer mevcut indeks son şarkıdaysa, indeksi sıfırla; değilse, bir sonraki şarkıya geç
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    // Yeni şarkıyı ayarla
    setSong(index);
  } else {
    // Eğer döngü yoksa, rastgele bir indeks seç ve o şarkıyı ayarla
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

/* Tekrar ve Karışık Çalma İşlemleri */

// Tekrar butonuna tıklanınca
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

// Karışık çal butonuna tıklanınca
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  }
});

/* Şarkı Bitiminde İşlemler */

audio.onended = () => {
  nextSong(); // Sonraki şarkıyı çağır
};

/* Çalma Listesi İşlemleri */

// Çalma listesi butonuna tıklanınca
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide"); // Çalma listesi konteynerını göster
});

// Kapatma butonuna tıklanınca
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide"); // Çalma listesi konteynerını gizle
});

/* Oynat ve Duraklat Butonları İşlemleri */

// Oynat butonuna tıklandığında
playButton.addEventListener("click", playAudio);

// Duraklat butonuna tıklandığında
pauseButton.addEventListener("click", pauseAudio);

/* Önceki ve Sonraki Butonları İşlemleri */

// Önceki butonuna tıklandığında
prevButton.addEventListener("click", previousSong);

// Sonraki butonuna tıklandığında
nextButton.addEventListener("click", nextSong);

/* Çalma Listesi Başlangıcı */

// Çalma listesini başlatma
const initializePlaylist = () => {
  for (let i in songsList) {
    // Her şarkı için çalma listesine bir öğe ekleme
    playListSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i})">
      <div class="playlist-image-container">
        <image src="${songsList[i].image}"/>
      </div>
      <div class="playlist-song-details">
        <span id="playlist-song-name">${songsList[i].name}</span>
        <span id="playlist-song-artist-album">${songsList[i].artist}</span>
      </div>
    </li>`;
  }
};

// Sayfa yüklendiğinde
window.onload = () => {
  index = 0; // Başlangıçta ilk şarkıyı çal
  setSong(index); // İlk şarkıyı ayarla
  pauseAudio(); // Şarkıyı duraklat
  initializePlaylist(); // Çalma listesini başlat
};