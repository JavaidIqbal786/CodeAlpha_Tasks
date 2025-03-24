document.addEventListener('DOMContentLoaded', function () {
    // Static list of songs from the "music/" folder
    const music_list = [
      {
        img: 'images/stay.png',
        name: 'Stay',
        artist: 'The Kid LAROI, Justin Bieber',
        music: 'music/stay.mp3'
      },
      {
        img: 'images/fallingdown.jpg',
        name: 'Falling Down',
        artist: 'Wid Cards',
        music: 'music/fallingdown.mp3'
      },
      {
        img: 'images/faded.png',
        name: 'Faded',
        artist: 'Alan Walker',
        music: 'music/Faded.mp3'
      },
      {
        img: 'images/ratherbe.jpg',
        name: 'Rather Be',
        artist: 'Clean Bandit',
        music: 'music/Rather Be.mp3'
      }
    ];
    
    // Select core player elements
    let now_playing = document.querySelector('.now-playing');
    let track_art = document.querySelector('.track-art');
    let track_name = document.querySelector('.track-name');
    let track_artist = document.querySelector('.track-artist');
    
    let playpause_btn = document.querySelector('.playpause-track');
    let next_btn = document.querySelector('.next-track');
    let prev_btn = document.querySelector('.prev-track');
    
    let seek_slider = document.querySelector('.seek_slider');
    let volume_slider = document.querySelector('.volume_slider');
    let curr_time = document.querySelector('.current-time');
    let total_duration = document.querySelector('.total-duration');
    let wave = document.getElementById('wave');
    let randomIcon = document.querySelector('.fa-random');
    let curr_track = document.createElement('audio');
    
    // Select playlist-related elements
    let playlistBtn = document.querySelector(".playlist-button");
    let searchInput = document.getElementById("search-bar");
    let playlistContainer = document.getElementById("playlist-container");
    let playlistUL = document.getElementById("playlist");
    
    let track_index = 0;
    let isPlaying = false;
    let isRandom = false;
    let updateTimer;
    
    // Load the initial track
    loadTrack(track_index);
    
    function loadTrack(index) {
      clearInterval(updateTimer);
      reset();
    
      curr_track.src = music_list[index].music;
      curr_track.load();
    
      // Update player UI with track details
      track_art.style.backgroundImage = "url(" + music_list[index].img + ")";
      track_name.textContent = music_list[index].name;
      track_artist.textContent = music_list[index].artist;
      now_playing.textContent = "Playing music " + (index + 1) + " of " + music_list.length;
    
      updateTimer = setInterval(setUpdate, 1000);
    
      // When the track ends, automatically play the next one
      curr_track.addEventListener('ended', nextTrack);
      random_bg_color();
    }
    
    function reset() {
      curr_time.textContent = "00:00";
      total_duration.textContent = "00:00";
      seek_slider.value = 0;
    }
    
    function randomTrack() {
      isRandom ? pauseRandom() : playRandom();
    }
    
    function playRandom() {
      isRandom = true;
      randomIcon.classList.add('randomActive');
    }
    
    function pauseRandom() {
      isRandom = false;
      randomIcon.classList.remove('randomActive');
    }
    
    function repeatTrack() {
      loadTrack(track_index);
      playTrack();
    }
    
    function playpauseTrack() {
      isPlaying ? pauseTrack() : playTrack();
    }
    
    function playTrack() {
      curr_track.play();
      isPlaying = true;
      track_art.classList.add('rotate');
      wave.classList.add('loader');
      playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    }
    
    function pauseTrack() {
      curr_track.pause();
      isPlaying = false;
      track_art.classList.remove('rotate');
      wave.classList.remove('loader');
      playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    }
    
    function nextTrack() {
      if (track_index < music_list.length - 1 && !isRandom) {
        track_index++;
      } else if (track_index < music_list.length - 1 && isRandom) {
        track_index = Math.floor(Math.random() * music_list.length);
      } else {
        track_index = 0;
      }
      loadTrack(track_index);
      playTrack();
    }
    
    function prevTrack() {
      if (track_index > 0) {
        track_index--;
      } else {
        track_index = music_list.length - 1;
      }
      loadTrack(track_index);
      playTrack();
    }
    
    function seekTo() {
      let seekto = curr_track.duration * (seek_slider.value / 100);
      curr_track.currentTime = seekto;
    }
    
    function setVolume() {
      curr_track.volume = volume_slider.value / 100;
    }
    
    function setUpdate() {
      let seekPosition = 0;
      if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;
    
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
    
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
    
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
      }
    }
    
    // Toggle playlist visibility
    function togglePlaylist() {
      playlistContainer.classList.toggle("hidden");
    }
    // Using inline onclick in HTML calls togglePlaylist, so this listener is optional.
    playlistBtn.addEventListener("click", togglePlaylist);
    
    // Load playlist dynamically
    function loadPlaylist() {
      playlistUL.innerHTML = "";
      music_list.forEach((track, index) => {
        let li = document.createElement("li");
        li.textContent = `${track.name} - ${track.artist}`;
        li.setAttribute("data-index", index);
        li.addEventListener("click", function () {
          track_index = index;
          loadTrack(track_index);
          playTrack();
        });
        playlistUL.appendChild(li);
      });
    }
    
    // Global function for search filter
    function searchTrack() {
      let filter = searchInput.value.toLowerCase();
      let tracks = playlistUL.getElementsByTagName("li");
      for (let i = 0; i < tracks.length; i++) {
        let trackText = tracks[i].textContent.toLowerCase();
        tracks[i].style.display = trackText.includes(filter) ? "" : "none";
      }
    }
    // The inline onkeyup in HTML calls searchTrack, but we also add this event listener.
    searchInput.addEventListener("input", searchTrack);
    
    // Initially load the playlist
    loadPlaylist();
    
    // Optional: Change background color randomly
    function random_bg_color() {
      let hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e'];
      function populate(a) {
        for (let i = 0; i < 6; i++) {
          let x = Math.floor(Math.random() * hex.length);
          a += hex[x];
        }
        return a;
      }
      let Color1 = populate('#');
      let Color2 = populate('#');
      let angle = 'to right';
      let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ')';
      document.body.style.background = gradient;
    }
  });
  