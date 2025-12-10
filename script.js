const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
    gradient.addColorStop(0, '#bb33ff55');
    gradient.addColorStop(0.5, '#66006633');
    gradient.addColorStop(1, '#66006600');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Loading Screen
const loadingScreen = document.querySelector('.loading-screen');
const loadingProgress = document.querySelector('.loading-progress');

// Typewriter effect
const typewriterText = document.querySelector('.typewriter-text');
const glowName = typewriterText.querySelector('.glow-name');
const originalContent = glowName.textContent;
const text = "Hi. I am ";

function startTypewriter() {
  let i = 0;
  typewriterText.textContent = '';
  
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
        setTimeout(backspace, 100);
      } else {
        i = 0;
        setTimeout(typeForward, 500);
      }
    }
    
    backspace();
  }
  
  typeForward();
}

// Video Background Controls
const bgVideo = document.getElementById('bg-video');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeControls = document.querySelector('.volume-controls');

// Load video and handle loading screen
bgVideo.addEventListener('loadeddata', () => {
  console.log('✅ Video loaded successfully');
  loadingProgress.textContent = 'Video loaded - Ready!';
  
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    startTypewriter();
  }, 500);
});

bgVideo.addEventListener('error', (e) => {
  console.error('❌ Video loading error:', e);
  loadingProgress.textContent = 'Error loading video';
  
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    startTypewriter();
  }, 1000);
});

bgVideo.addEventListener('progress', () => {
  if (bgVideo.buffered.length > 0) {
    const percent = Math.round((bgVideo.buffered.end(0) / bgVideo.duration) * 100);
    loadingProgress.textContent = `Loading video: ${percent}%`;
  }
});

// Set initial volume to 50%
bgVideo.volume = 0.5;
volumeSlider.value = 50;

// Mute/Unmute functionality
muteBtn.addEventListener('click', () => {
  bgVideo.muted = !bgVideo.muted;
  const icon = muteBtn.querySelector('i');
  icon.className = bgVideo.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
});

// Volume slider
volumeSlider.addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  bgVideo.volume = volume;
  
  if (volume > 0) {
    bgVideo.muted = false;
  }
  
  const icon = muteBtn.querySelector('i');
  if (volume === 0) {
    icon.className = 'fas fa-volume-mute';
  } else if (volume < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }
});

// Welcome overlay handler
document.querySelector('.terminal-button-command').addEventListener('click', () => {
  const welcomeOverlay = document.querySelector('.welcome-overlay');
  const mainContent = document.querySelector('.main-content');
  
  // Fade out overlay
  welcomeOverlay.style.opacity = '0';
  
  setTimeout(() => {
    welcomeOverlay.style.display = 'none';
    mainContent.classList.remove('content-blur');
    
    // Unmute and start video playback with 50% volume
    bgVideo.muted = false;
    bgVideo.volume = 0.5;
    volumeSlider.value = 50;
    
    bgVideo.play()
      .then(() => {
        console.log('🎬 Video is now playing with audio');
        bgVideo.classList.add('active');
        volumeControls.classList.add('visible');
        
        const icon = muteBtn.querySelector('i');
        icon.className = 'fas fa-volume-up';
        
        // Trigger animations in sequence
        const techStack = document.querySelector('.tech-stack');
        const interests = document.querySelector('.interests');
        const stats = document.querySelector('.stats');
        const links = document.querySelector('.links');
        
        // 1. Tech Stack (0ms)
        setTimeout(() => {
          if (techStack) techStack.classList.add('visible');
        }, 100);
        
        // 2. Cybersecurity Focus (400ms nach Tech Stack)
        setTimeout(() => {
          if (interests) interests.classList.add('visible');
        }, 500);
        
        // 3. Current Status (400ms nach Cybersecurity)
        setTimeout(() => {
          if (stats) stats.classList.add('visible');
        }, 900);
        
        // 4. Social Media Links (400ms nach Current Status)
        setTimeout(() => {
          if (links) {
            links.style.opacity = '0';
            links.style.transform = 'translateX(100px)';
            links.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
              links.style.opacity = '1';
              links.style.transform = 'translateX(0)';
            }, 50);
          }
        }, 1300);
      })
      .catch(error => {
        console.error('❌ Video play error:', error);
      });
  }, 500);
});

// View Counter
const COUNTER_KEY = 'rosc_view_count';

function getViewCount() {
  const count = localStorage.getItem(COUNTER_KEY);
  return count ? parseInt(count) : 0;
}

function incrementViewCount() {
  let count = getViewCount();
  count++;
  localStorage.setItem(COUNTER_KEY, count.toString());
  return count;
}

function animateCounter(target) {
  const counterElement = document.getElementById('view-count');
  let current = 0;
  const increment = target / 50;
  const duration = 2000;
  const stepTime = duration / 50;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counterElement.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      counterElement.textContent = Math.floor(current).toLocaleString();
    }
  }, stepTime);
}

// Initialize counter
const viewCount = incrementViewCount();
animateCounter(viewCount);

