const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for (let i = 0; i < 75; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.8,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
    gradient.addColorStop(0, '#bb33ff44');
    gradient.addColorStop(0.5, '#66006633');
    gradient.addColorStop(1, '#66006600');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Typewriter effect
const typewriterText = document.querySelector('.typewriter-text');
const glowName = typewriterText.querySelector('.glow-name');
const originalContent = glowName.textContent;
const text = "Hi. I am ";

function startTypewriter() {
  let i = 0;
  typewriterText.textContent = '';
  
  // Recreate the span and add it back to typewriterText
  const newGlowName = document.createElement('span');
  newGlowName.className = 'glow-name';
  typewriterText.appendChild(document.createTextNode(text));
  typewriterText.appendChild(newGlowName);
  
  function typeForward() {
    if (i < originalContent.length) {
      newGlowName.textContent += originalContent.charAt(i);
      i++;
      setTimeout(typeForward, 150);
    } else {
      newGlowName.classList.add('animated');
      setTimeout(startBackspace, 5000);
    }
  }
  
  function startBackspace() {
    newGlowName.classList.remove('animated');
    let currentText = newGlowName.textContent;
    
    function backspace() {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        newGlowName.textContent = currentText;
        setTimeout(backspace, 100); // Faster backspace speed
      } else {
        i = 0;
        setTimeout(typeForward, 500); // Pause before typing again
      }
    }
    
    backspace();
  }
  
  typeForward();
}

startTypewriter();

// 3D Card Effect
const container = document.querySelector('.container');

let bounds;

function rotateToMouse(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  if (!bounds) bounds = container.getBoundingClientRect();
  
  const leftX = mouseX - bounds.x;
  const topY = mouseY - bounds.y;
  const center = {
    x: bounds.width / 2,
    y: bounds.height / 2
  }
  
  const distanceX = leftX - center.x;
  const distanceY = topY - center.y;
  
  const rotateX = (-1) * (distanceY / center.y) * 20;
  const rotateY = (distanceX / center.x) * 20;
  
  container.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale3d(1.05, 1.05, 1.05)
  `;
}

container.addEventListener('mouseenter', () => {
  bounds = container.getBoundingClientRect();
  document.addEventListener('mousemove', rotateToMouse);
});

container.addEventListener('mouseleave', () => {
  document.removeEventListener('mousemove', rotateToMouse);
  container.style.transform = `
    perspective(1000px)
    rotateX(0deg)
    rotateY(0deg)
    scale3d(1, 1, 1)
  `;
});

// Welcome Overlay Handler
class WelcomeScreen {
  constructor() {
    this.overlay = document.querySelector('.welcome-overlay');
    this.content = document.querySelector('.main-content');
    this.button = document.querySelector('.welcome-button');
    this.card = document.querySelector('.welcome-card');
    this.mediaPlayer = new MediaPlayer(false); // Initialize but don't autoplay
    
    this.button.addEventListener('click', () => this.enterSite());
    this.setupCardEffect();
  }

  setupCardEffect() {
    let bounds;

    const rotateCard = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      if (!bounds) bounds = this.card.getBoundingClientRect();
      
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: bounds.width / 2,
        y: bounds.height / 2
      }
      
      const distanceX = leftX - center.x;
      const distanceY = topY - center.y;
      
      const rotateX = (-1) * (distanceY / center.y) * 20;
      const rotateY = (distanceX / center.x) * 20;
      
      this.card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.05, 1.05, 1.05)
      `;
    };

    this.card.addEventListener('mouseenter', () => {
      bounds = this.card.getBoundingClientRect();
      document.addEventListener('mousemove', rotateCard);
    });

    this.card.addEventListener('mouseleave', () => {
      document.removeEventListener('mousemove', rotateCard);
      this.card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    });
  }

  async enterSite() {
    // Start playing music immediately
    await this.mediaPlayer.initializeAudio();
    this.mediaPlayer.playAudio();
    
    // Fade out overlay
    this.overlay.style.opacity = '0';
    this.content.classList.remove('content-blur');
    
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 500);
  }
}

class MediaPlayer {
  constructor(autoplay = false) {
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.playlist = [
      {
        title: "Superstar",
        artist: "Sosa La M",
        cover: "./img/cover.jpg",
        file: "./music/song.mp3"
      }
    ];
    this.currentTrack = 0;
    this.isPlaying = false;
    
    if (autoplay) {
      this.init();
    } else {
      this.createPlayer(); // Only create the player UI
    }
  }

  async init() {
    this.createPlayer();
    await this.initializeAudio();
    this.playAudio();
  }

  async initializeAudio() {
    return new Promise((resolve) => {
      this.audio.src = this.playlist[this.currentTrack].file;
      this.audio.volume = 0.5; // Set initial volume to 50%

      this.audio.addEventListener('timeupdate', () => this.updateProgress());
      this.audio.addEventListener('ended', () => this.onTrackEnd());
      this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

      // Resolve promise when audio is ready to play
      this.audio.addEventListener('canplaythrough', () => {
        resolve();
      }, { once: true });
    });
  }

  playAudio() {
    // Create context and play on user interaction
    const playAttempt = setInterval(() => {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          document.querySelector('.play-pause i').className = 'fas fa-pause';
          clearInterval(playAttempt);
        })
        .catch(error => {
          console.log("Auto-play prevented. Waiting for user interaction.");
        });
    }, 2500);
  }

  createPlayer() {
    const player = document.createElement('div');
    player.className = 'media-player';
    player.innerHTML = `
      <div class="player-content">
        <div class="song-info">
          <img src="${this.playlist[0].cover}" alt="Cover" class="cover-art">
          <div class="track-info">
            <div class="track-title">${this.playlist[0].title}</div>
            <div class="track-artist">${this.playlist[0].artist}</div>
          </div>
        </div>
        <div class="playback-controls">
          <button class="play-pause">
            <i class="fas fa-play"></i>
          </button>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress"></div>
            </div>
            <div class="time">
              <span class="current">0:00</span>
              <span class="duration">0:00</span>
            </div>
          </div>
        </div>
        <div class="volume-container">
          <i class="fas fa-volume-down"></i>
          <input type="range" class="volume" min="0" max="100" value="50">
        </div>
      </div>
    `;
    document.body.appendChild(player);

    // Event listeners
    const playPauseBtn = player.querySelector('.play-pause');
    const volumeSlider = player.querySelector('.volume');
    const progressBar = player.querySelector('.progress-bar');

    playPauseBtn.addEventListener('click', () => this.togglePlay());
    volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
    progressBar.addEventListener('click', (e) => this.seek(e));
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      document.querySelector('.play-pause i').className = 'fas fa-play';
    } else {
      this.audio.play();
      this.isPlaying = true;
      document.querySelector('.play-pause i').className = 'fas fa-pause';
    }
  }

  setVolume(value) {
    this.audio.volume = value / 100;
    const volumeIcon = document.querySelector('.volume-container i');
    if (value > 50) {
      volumeIcon.className = 'fas fa-volume-up';
    } else if (value > 0) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-mute';
    }
  }

  updateProgress() {
    const progress = document.querySelector('.progress');
    const currentTime = document.querySelector('.current');
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    progress.style.width = percent + '%';
    currentTime.textContent = this.formatTime(this.audio.currentTime);
  }

  seek(e) {
    const progressBar = document.querySelector('.progress-bar');
    const percent = e.offsetX / progressBar.offsetWidth;
    this.audio.currentTime = percent * this.audio.duration;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  updateDuration() {
    const duration = document.querySelector('.duration');
    duration.textContent = this.formatTime(this.audio.duration);
  }

  onTrackEnd() {
    this.isPlaying = false;
    document.querySelector('.play-pause i').className = 'fas fa-play';
  }
}

// Initialize welcome screen
document.addEventListener('DOMContentLoaded', () => {
  new WelcomeScreen();
});

// Media Player 3D Effect
const mediaPlayer = document.querySelector('.media-player');
let mediaPlayerBounds;

function rotateMediaPlayer(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  if (!mediaPlayerBounds) mediaPlayerBounds = mediaPlayer.getBoundingClientRect();
  
  const leftX = mouseX - mediaPlayerBounds.x;
  const topY = mouseY - mediaPlayerBounds.y;
  const center = {
    x: mediaPlayerBounds.width / 2,
    y: mediaPlayerBounds.height / 2
  }
  
  const distanceX = leftX - center.x;
  const distanceY = topY - center.y;
  
  const rotateX = (-1) * (distanceY / center.y) * 10;
  const rotateY = (distanceX / center.x) * 10;
  
  mediaPlayer.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale3d(1.02, 1.02, 1.02)
  `;
}

mediaPlayer.addEventListener('mouseenter', () => {
  mediaPlayerBounds = mediaPlayer.getBoundingClientRect();
  document.addEventListener('mousemove', rotateMediaPlayer);
});

mediaPlayer.addEventListener('mouseleave', () => {
  document.removeEventListener('mousemove', rotateMediaPlayer);
  mediaPlayer.style.transform = `
    perspective(1000px)
    rotateX(0deg)
    rotateY(0deg)
    scale3d(1, 1, 1)
  `;
});

