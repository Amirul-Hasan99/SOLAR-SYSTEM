// QuizMode.js — Complete quiz experience with intro, questions, results
import { createElement, clearElement } from '../utils/dom.js';
import { getQuizSession } from '../data/quizQuestions.js';
import { planetsData, planetOrder } from '../data/planets.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createQuizMode({ onBack, onComplete }) {
  const screen = createElement('div', 'quiz-intro screen-enter');
  screen.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:30;';

  const questions = getQuizSession(9);
  let currentQuestion = 0;
  let lives = 3;
  let score = 0;
  let startTime = Date.now();
  let rewardPlanet = null;

  // Warp background
  const warpBg = createElement('div', 'quiz-warp-bg');
  screen.appendChild(warpBg);

  // Header
  const header = createElement('div', 'quiz-header');
  const backBtn = createElement('button', 'back-btn', { textContent: '←' });
  backBtn.addEventListener('click', () => {
    AudioManager.playClick();
    showSurrender();
  });

  const stats = createElement('div', 'quiz-stats');
  const heartsEl = createElement('div', 'quiz-hearts');
  const progressEl = createElement('div', 'quiz-progress-badge');

  function updateStats() {
    heartsEl.innerHTML = `${Array(lives).fill('❤️').join('')} <span class="count">${lives}</span>`;
    progressEl.innerHTML = `📦 Progres: ${currentQuestion}/${questions.length}`;
  }
  updateStats();

  stats.appendChild(heartsEl);
  stats.appendChild(progressEl);
  header.appendChild(backBtn);
  header.appendChild(stats);
  screen.appendChild(header);

  // Planet scene center
  const planetScene = createElement('div', 'quiz-planet-scene');
  planetScene.style.position = 'relative';
  planetScene.style.zIndex = '5';

  const q = questions[0];
  const planetData = planetsData[q.planet];
  const funFact = planetData ? planetData.funFact : 'Tahukah kamu? Tata surya kita berumur 4,6 miliar tahun!';

  const speechBubble = createElement('div', 'quiz-speech-bubble', { textContent: funFact });
  const astronaut = createElement('div', 'quiz-astronaut');
  astronaut.innerHTML = `<svg viewBox="0 0 100 100" fill="none"><g transform="translate(15,5) scale(0.35)">
    <ellipse cx="100" cy="180" rx="55" ry="65" fill="#D0D0D0"/><circle cx="100" cy="90" r="50" fill="#E0E0E0"/>
    <circle cx="100" cy="90" r="38" fill="#1a1a3a"/>
    <path d="M55 160 Q20 140 30 110" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M145 160 Q180 130 175 100" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M80 240 Q75 280 70 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M120 240 Q125 280 130 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
    <ellipse cx="65" cy="305" rx="18" ry="10" fill="#888"/>
    <ellipse cx="135" cy="305" rx="18" ry="10" fill="#888"/>
  </g></svg>`;

  const planetImg = createElement('div', 'quiz-planet-img');
  if (planetData) {
    const img = createElement('img', '');
    img.src = planetData.texture;
    img.alt = planetData.name;
    planetImg.appendChild(img);
  }

  planetScene.appendChild(speechBubble);
  planetScene.appendChild(astronaut);
  planetScene.appendChild(planetImg);
  screen.appendChild(planetScene);

  // Start quiz button (auto-start after 2s)
  setTimeout(() => {
    showQuestion();
  }, 2500);

  function showQuestion() {
    if (currentQuestion >= questions.length) {
      showCongrats();
      return;
    }
    if (lives <= 0) {
      showGameOver();
      return;
    }

    const q = questions[currentQuestion];
    const pData = planetsData[q.planet];

    // Create question overlay
    const overlay = createElement('div', 'quiz-question-overlay');
    const card = createElement('div', 'quiz-question-card');

    const topBar = createElement('div', 'quiz-question-card-top');
    card.appendChild(topBar);

    const content = createElement('div', 'quiz-question-content');

    // Planet thumbnail
    if (pData) {
      const pThumb = createElement('div', 'quiz-question-planet');
      const pImg = createElement('img', '');
      pImg.src = pData.texture;
      pImg.alt = pData.name;
      pThumb.appendChild(pImg);
      content.appendChild(pThumb);
    }

    // Question text
    const qText = createElement('div', 'quiz-question-text', { textContent: q.question });
    content.appendChild(qText);

    // Options
    const options = createElement('div', 'quiz-options');
    q.options.forEach((option, index) => {
      const optBtn = createElement('button', 'quiz-option', { textContent: option });
      optBtn.addEventListener('click', () => {
        // Disable all options
        options.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));

        if (index === q.correct) {
          optBtn.classList.add('correct');
          AudioManager.playSuccess();
          score++;
        } else {
          optBtn.classList.add('wrong');
          options.children[q.correct].classList.add('correct');
          AudioManager.playError();
          lives--;
        }

        updateStats();

        setTimeout(() => {
          currentQuestion++;
          overlay.remove();
          if (lives <= 0) {
            showGameOver();
          } else {
            showQuestion();
          }
        }, 1200);
      });
      options.appendChild(optBtn);
    });
    content.appendChild(options);
    card.appendChild(content);
    overlay.appendChild(card);
    screen.appendChild(overlay);
  }

  function showSurrender() {
    const overlay = createElement('div', 'surrender-overlay');
    const card = createElement('div', 'surrender-card');

    const top = createElement('div', 'surrender-card-top');
    card.appendChild(top);

    const content = createElement('div', 'surrender-content');
    const title = createElement('div', 'surrender-title', { textContent: 'MENYERAH?' });
    const message = createElement('p', 'surrender-message', {
      textContent: 'Progresmu saat ini tidak akan disimpan. Apakah kamu yakin ingin menyerah dan kembali ke menu?',
    });

    const actions = createElement('div', 'surrender-actions');
    const yesBtn = createElement('button', 'btn btn-danger-solid', { textContent: 'Ya, Menyerah' });
    yesBtn.addEventListener('click', () => {
      AudioManager.playClick();
      onBack();
    });
    const noBtn = createElement('button', 'btn btn-dark', { textContent: 'Lanjut Quiz' });
    noBtn.addEventListener('click', () => {
      AudioManager.playClick();
      overlay.remove();
    });

    actions.appendChild(yesBtn);
    actions.appendChild(noBtn);
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(actions);
    card.appendChild(content);
    overlay.appendChild(card);
    screen.appendChild(overlay);
  }

  function showCongrats() {
    // Determine reward planet
    const unlockedCount = GameState.getUnlockedPlanets().length;
    rewardPlanet = planetOrder[unlockedCount] || planetOrder[planetOrder.length - 1];
    GameState.recordQuizResult(score, questions.length, rewardPlanet);

    // Check speed runner achievement
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed < 60) {
      GameState.unlockAchievement('speed_runner');
    }
    GameState.checkAchievements();

    const overlay = createElement('div', 'quiz-result-overlay');
    const card = createElement('div', 'quiz-result-card');

    const topBar = createElement('div', 'quiz-result-card-top');
    card.appendChild(topBar);

    const content = createElement('div', 'quiz-result-content');

    const title = createElement('div', 'congrats-title', { textContent: 'CONGRATULATIONS!' });
    content.appendChild(title);

    const message = createElement('div', 'quiz-result-message');
    message.innerHTML = `Kamu menjawab <strong>${score}/${questions.length}</strong> pertanyaan dengan benar. Luar biasa!`;
    content.appendChild(message);

    // Reward card
    const reward = createElement('div', 'reward-card');
    const sparkle = createElement('div', 'reward-sparkle', { textContent: '✨' });
    const rewardLabel = createElement('div', 'reward-label');
    const pData = planetsData[rewardPlanet];
    rewardLabel.textContent = `REWARD UNLOCKED: Planet ${pData ? pData.name : rewardPlanet}`;
    const rewardSub = createElement('div', 'reward-sub', {
      textContent: 'Tambahkan ke koleksimu!',
    });
    reward.appendChild(sparkle);
    reward.appendChild(rewardLabel);
    reward.appendChild(rewardSub);
    content.appendChild(reward);

    // Planet thumbnails
    const thumbsRow = createElement('div', 'planet-thumbs-row');
    planetOrder.forEach(key => {
      const thumb = createElement('div', `planet-thumb${GameState.isPlanetUnlocked(key) ? '' : ' locked'}`);
      const img = createElement('img', '');
      img.src = planetsData[key].texture;
      img.alt = planetsData[key].name;
      thumb.appendChild(img);
      thumbsRow.appendChild(thumb);
    });
    content.appendChild(thumbsRow);

    // Back button
    const backBtn = createElement('button', 'btn btn-purple btn-pill btn-full', {
      textContent: '🏠 Kembali ke Menu',
    });
    backBtn.addEventListener('click', () => {
      AudioManager.playClick();
      onComplete();
    });
    content.appendChild(backBtn);

    card.appendChild(content);
    overlay.appendChild(card);
    screen.appendChild(overlay);
  }

  function showGameOver() {
    GameState.recordQuizResult(score, questions.length, null);
    GameState.checkAchievements();

    const overlay = createElement('div', 'quiz-result-overlay');
    const card = createElement('div', 'quiz-result-card');

    const topBar = createElement('div', 'quiz-result-card-top');
    card.appendChild(topBar);

    const content = createElement('div', 'quiz-result-content');

    const title = createElement('div', 'gameover-title', { textContent: 'GAME OVER' });
    content.appendChild(title);

    const message = createElement('div', 'quiz-result-message', {
      textContent: 'Anda telah menyerah atau kehabisan nyawa. Coba lagi!',
    });
    content.appendChild(message);

    const backBtn = createElement('button', 'btn btn-purple btn-pill btn-full', {
      textContent: '🏠 Kembali ke Menu',
    });
    backBtn.addEventListener('click', () => {
      AudioManager.playClick();
      onComplete();
    });
    content.appendChild(backBtn);

    card.appendChild(content);
    overlay.appendChild(card);
    screen.appendChild(overlay);
  }

  return screen;
}
