/* ========================================================
   ROMANTIC APOLOGY & GIFT REVEAL - INTERACTIVE SCRIPT
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. URL Query Parameter or LocalStorage Support for Her Name
  const urlParams = new URLSearchParams(window.location.search);
  const urlName = urlParams.get('name') || urlParams.get('babu') || urlParams.get('jaan');
  const savedName = localStorage.getItem('sweetheart_name');
  const herNameDisplay = document.getElementById('herNameDisplay');
  const editNameBtn = document.getElementById('editNameBtn');

  const initialName = urlName || (savedName && savedName !== 'Sweetheart' ? savedName : 'Madam Ji');
  if (herNameDisplay) {
    herNameDisplay.textContent = initialName;
  }

  function promptChangeName() {
    const newName = prompt("Apni Girlfriend ka pyaara sa naam ya nickname enter karo (e.g. Madam Ji, Jaan, Babu, Pari):", herNameDisplay.textContent);
    if (newName && newName.trim() !== '') {
      herNameDisplay.textContent = newName.trim();
      localStorage.setItem('sweetheart_name', newName.trim());
      showToast(`Naam set ho gaya: ${newName.trim()} ❤️`);
    }
  }

  if (editNameBtn) editNameBtn.addEventListener('click', promptChangeName);
  if (herNameDisplay) herNameDisplay.addEventListener('click', promptChangeName);

  // 2. Step Navigation Elements
  const stepIntro = document.getElementById('step-intro');
  const stepShayari = document.getElementById('step-shayari');
  const stepQuiz = document.getElementById('step-quiz');
  const stepGift = document.getElementById('step-gift');

  const startJourneyBtn = document.getElementById('startJourneyBtn');
  const toQuizBtn = document.getElementById('toQuizBtn');
  const replayExperienceBtn = document.getElementById('replayExperienceBtn');

  // Quiz Elements
  const quizQ1 = document.getElementById('quiz-q1');
  const quizQ2 = document.getElementById('quiz-q2');
  const quizQ3 = document.getElementById('quiz-q3');
  const quizToast = document.getElementById('quizToast');
  const forgiveYesBtn = document.getElementById('forgiveYesBtn');
  const forgiveNoBtn = document.getElementById('forgiveNoBtn');
  const runawayFeedback = document.getElementById('runawayFeedback');
  const trapContainer = document.getElementById('trapContainer');

  // Gift Box Elements
  const animatedGiftBox = document.getElementById('animatedGiftBox');
  const giftBoxContainer = document.getElementById('giftBoxContainer');
  const revealedGiftArea = document.getElementById('revealedGiftArea');
  const sendWhatsAppMsgBtn = document.getElementById('sendWhatsAppMsgBtn');

  // 3. Floating Hearts Canvas Background
  initHeartCanvas();

  // 4. Romantic Melody Audio Controller
  const bgAudio = document.getElementById('bgAudio');
  const melodyPlayer = setupMelodyPlayer();
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatus = document.getElementById('musicStatus');
  let isAudioActive = false;

  if (bgAudio) {
    bgAudio.volume = 0.65;
  }

  function startMusic() {
    isAudioActive = true;
    if (bgAudio) {
      bgAudio.play().then(() => {
        musicStatus.textContent = 'Playing 💖';
        musicStatus.style.color = '#ff758f';
      }).catch(err => {
        console.log('Audio autoplay prevented or fallback needed:', err);
        melodyPlayer.start();
        musicStatus.textContent = 'Playing 💖';
        musicStatus.style.color = '#ff758f';
      });
    } else {
      melodyPlayer.start();
      musicStatus.textContent = 'Playing 💖';
      musicStatus.style.color = '#ff758f';
    }
  }

  function pauseMusic() {
    isAudioActive = false;
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
    }
    melodyPlayer.stop();
    musicStatus.textContent = 'Play';
    musicStatus.style.color = '#fff';
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isAudioActive) {
      pauseMusic();
    } else {
      startMusic();
    }
  });

  // Navigation Logic
  function showStep(stepElement) {
    [stepIntro, stepShayari, stepQuiz, stepGift].forEach(el => {
      el.classList.remove('active');
    });
    stepElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Intro -> Shayari
  startJourneyBtn.addEventListener('click', () => {
    // Start music on her first interaction
    if (!isAudioActive) {
      startMusic();
    }
    showStep(stepShayari);
    triggerFloatingHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 12);
  });

  // Shayari -> Quiz
  toQuizBtn.addEventListener('click', () => {
    showStep(stepQuiz);
  });

  // Quiz Flow (Questions 1 and 2)
  const q1Buttons = quizQ1.querySelectorAll('.quiz-option');
  q1Buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const reaction = btn.getAttribute('data-reaction');
      showToast(reaction);
      setTimeout(() => {
        quizQ1.classList.remove('active');
        quizQ2.classList.add('active');
      }, 1200);
    });
  });

  const q2Buttons = quizQ2.querySelectorAll('.quiz-option');
  q2Buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const reaction = btn.getAttribute('data-reaction');
      showToast(reaction);
      setTimeout(() => {
        quizQ2.classList.remove('active');
        quizQ3.classList.add('active');
      }, 1200);
    });
  });

  function showToast(message) {
    quizToast.textContent = message;
    quizToast.classList.add('show');
    setTimeout(() => {
      quizToast.classList.remove('show');
    }, 2800);
  }

  // Question 3: Runaway "No" Button Trap
  let noAttempts = 0;
  const wittyNoPhrases = [
    "Arey pakad ke dikhao pehle! 😜",
    "Button chura liya maine! 🙈",
    "No option not allowed for my queen! 🥰",
    "Itni asaani se chhutti nahi milegi mister! 🌹",
    "Please na Yaar, ek baar 'Haan' click kar do 🥺❤️",
    "Haan wala button kitna pyara lag raha hai na? 👉👈",
    "Dekho main ro dunga ab sach me... 😭",
    "Maaf kar do na jaan, promise aisi galti nahi hogi!"
  ];

  function moveNoButton() {
    noAttempts++;
    runawayFeedback.textContent = wittyNoPhrases[(noAttempts - 1) % wittyNoPhrases.length];

    const containerRect = trapContainer.getBoundingClientRect();
    const btnRect = forgiveNoBtn.getBoundingClientRect();

    // Calculate maximum available space inside container or card
    const maxX = Math.max(containerRect.width - btnRect.width - 20, 100);
    const maxY = Math.max(containerRect.height - btnRect.height - 10, 80);

    const randomX = (Math.random() - 0.5) * maxX;
    const randomY = (Math.random() - 0.5) * maxY;

    forgiveNoBtn.style.position = 'relative';
    forgiveNoBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Make the YES button even more prominent and tempting
    const currentScale = 1 + Math.min(noAttempts * 0.05, 0.35);
    forgiveYesBtn.style.transform = `scale(${currentScale})`;
  }

  forgiveNoBtn.addEventListener('mouseenter', moveNoButton);
  forgiveNoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });
  forgiveNoBtn.addEventListener('click', moveNoButton);

  // She said YES!
  forgiveYesBtn.addEventListener('click', () => {
    showToast("Best day ever! You made my heart so happy! 🥹💖");
    triggerConfettiStorm();
    setTimeout(() => {
      showStep(stepGift);
    }, 900);
  });

  // Step 4: Gift Box Unboxing
  let giftOpened = false;
  animatedGiftBox.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;

    // Play sparkling chime sound
    melodyPlayer.playChime();

    // Explosive confetti
    triggerConfettiStorm();
    triggerFloatingHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 30);

    // Box opening visual effect
    animatedGiftBox.style.transform = 'scale(1.3) rotate(15deg)';
    animatedGiftBox.style.opacity = '0';
    animatedGiftBox.style.transition = 'all 0.5s ease-out';

    setTimeout(() => {
      giftBoxContainer.style.display = 'none';
      revealedGiftArea.classList.remove('hidden');
      window.scrollTo({ top: revealedGiftArea.offsetTop - 50, behavior: 'smooth' });
    }, 500);
  });

  // WhatsApp Share Button
  sendWhatsAppMsgBtn.addEventListener('click', () => {
    const girlfriendName = herNameDisplay ? herNameDisplay.textContent.trim() : 'Madam Ji';
    const textMsg = encodeURIComponent(
      `Hey Rohit! ❤️ Maine tumhari apology website poori dekhi aur haan... maine tumhe dil se maaf kiya! 🥹🥰\n\nLekin apna promise yaad rakhna: Mera real physical gift, chocolates aur date night pending hai! Jaldi milo! 🎁🍫✨`
    );
    window.open(`https://wa.me/919582528010?text=${textMsg}`, '_blank');
  });

  // Replay
  replayExperienceBtn.addEventListener('click', () => {
    giftOpened = false;
    giftBoxContainer.style.display = 'flex';
    animatedGiftBox.style.opacity = '1';
    animatedGiftBox.style.transform = 'scale(1) rotate(0deg)';
    revealedGiftArea.classList.add('hidden');
    quizQ1.classList.add('active');
    quizQ2.classList.remove('active');
    quizQ3.classList.remove('active');
    forgiveNoBtn.style.transform = 'translate(0px, 0px)';
    forgiveYesBtn.style.transform = 'scale(1)';
    runawayFeedback.textContent = '';
    noAttempts = 0;
    showStep(stepIntro);
  });

  /* ========================================================
     CANVAS FLOATING HEARTS & PARTICLES
     ======================================================== */
  function initHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 35;

    class HeartParticle {
      constructor(x, y) {
        this.reset(x, y);
      }

      reset(x, y) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : height + Math.random() * 50;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.3 ? '#ff4d6d' : '#ffd166';
        this.rotation = (Math.random() - 0.5) * 0.4;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        // Draw Heart Shape
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 1.3, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 1.3, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new HeartParticle(Math.random() * width, Math.random() * height));
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ========================================================
     CONFETTI FIREWORK SIMULATION (No external CDNs needed)
     ======================================================== */
  function triggerConfettiStorm() {
    const confettiColors = ['#ff3366', '#ffd166', '#06d6a0', '#ff758f', '#ffffff', '#8338ec'];
    for (let i = 0; i < 90; i++) {
      createConfettiPiece(
        window.innerWidth / 2 + (Math.random() - 0.5) * 300,
        window.innerHeight * 0.4 + (Math.random() - 0.5) * 200,
        confettiColors[Math.floor(Math.random() * confettiColors.length)]
      );
    }
  }

  function triggerFloatingHeartBurst(startX, startY, count) {
    const heartEmojis = ['💖', '💕', '✨', '🌹', '🥰', '💝'];
    for (let i = 0; i < count; i++) {
      const floater = document.createElement('div');
      floater.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      floater.style.position = 'fixed';
      floater.style.left = `${startX + (Math.random() - 0.5) * 160}px`;
      floater.style.top = `${startY + (Math.random() - 0.5) * 160}px`;
      floater.style.fontSize = `${Math.random() * 20 + 20}px`;
      floater.style.zIndex = '9999';
      floater.style.pointerEvents = 'none';
      floater.style.transition = 'all 1.6s cubic-bezier(0.1, 0.8, 0.3, 1)';
      floater.style.opacity = '1';
      document.body.appendChild(floater);

      const targetX = (Math.random() - 0.5) * 240;
      const targetY = -(Math.random() * 220 + 80);

      requestAnimationFrame(() => {
        floater.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.4)`;
        floater.style.opacity = '0';
      });

      setTimeout(() => floater.remove(), 1600);
    }
  }

  function createConfettiPiece(x, y, color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.width = `${Math.random() * 8 + 6}px`;
    confetti.style.height = `${Math.random() * 12 + 8}px`;
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = '3px';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = 'all 1.8s cubic-bezier(0.2, 0.8, 0.4, 1)';
    confetti.style.opacity = '1';
    document.body.appendChild(confetti);

    const destX = (Math.random() - 0.5) * 500;
    const destY = Math.random() * 400 + 100;
    const rot = (Math.random() - 0.5) * 720;

    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${destX}px, ${destY}px) rotate(${rot}deg)`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => confetti.remove(), 1800);
  }

  /* ========================================================
     WEB AUDIO API - DREAMY ROMANTIC MUSIC BOX & CHIMES
     Zero external MP3 dependency, works seamlessly in browser
     ======================================================== */
  function setupMelodyPlayer() {
    let audioCtx = null;
    let timerId = null;
    let isPlaying = false;

    // Soft romantic chord arpeggios (C major 7th / F major 9th progression)
    // Frequencies in Hz: C4, E4, G4, B4, C5, D5, E5, G5
    const notes = [
      261.63, 329.63, 392.00, 493.88, 523.25,
      349.23, 440.00, 523.25, 659.25, 587.33,
      293.66, 369.99, 440.00, 554.37, 493.88
    ];
    let noteIndex = 0;

    function initContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playTone(freq, duration = 1.2, type = 'sine', gainVal = 0.08) {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Smooth romantic bell envelope
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }

    function startMelodyLoop() {
      isPlaying = true;
      initContext();

      function step() {
        if (!isPlaying) return;
        const currentFreq = notes[noteIndex % notes.length];
        playTone(currentFreq, 1.4, 'sine', 0.09);

        // Sub harmonic warmth
        if (noteIndex % 3 === 0) {
          playTone(currentFreq / 2, 2.0, 'triangle', 0.04);
        }

        noteIndex++;
        timerId = setTimeout(step, 500);
      }
      step();
    }

    function stopMelodyLoop() {
      isPlaying = false;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    }

    function playChime() {
      initContext();
      const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
      chimeNotes.forEach((f, idx) => {
        setTimeout(() => {
          playTone(f, 1.8, 'sine', 0.12);
        }, idx * 100);
      });
    }

    return {
      get isPlaying() {
        return isPlaying;
      },
      start: startMelodyLoop,
      stop: stopMelodyLoop,
      playChime: playChime
    };
  }
});
