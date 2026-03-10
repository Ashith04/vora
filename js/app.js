/* ============================================
   App Controller – Navigation, Init, Particles
   ============================================ */

const App = (() => {
    let currentScreen = 'home';
    const particleColors = ['#6ee7b7', '#48cae4', '#f4a261', '#e76f51', '#52b788', '#60a5fa'];
    const particleEmojis = ['🍃', '🌿', '💧', '✨', '🌸', '🍂'];

    function init() {
        // Init voice
        if (!Voice.isSupported()) {
            Voice.showAvatar('⚠️ Your browser doesn\'t support voice recognition. Please use Chrome for the best experience.');
        }

        // Init particles
        createParticles();

        // Init game stats on home
        Game.updateHomeStats();

        // Init trainer topics
        Trainer.init();

        // Show avatar welcome after brief delay
        setTimeout(() => {
            Voice.showAvatar('Welcome to Vora! 🌿 Pick a game mode to start your ecosystem journey!');
        }, 1000);

        // Load voices (for speech synthesis)
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }

        // Play intro sound effect
        playSound('welcome');
    }

    function navigateTo(screenId) {
        // Check mic permission for game screens
        if (['explorer-game', 'challenge', 'trainer'].includes(screenId)) {
            if (!Voice.hasPermission()) {
                // Try requesting permission automatically
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        stream.getTracks().forEach(t => t.stop());
                        Voice.setPermissionGranted(true);
                        showScreen(screenId);
                    })
                    .catch(() => {
                        showScreen('mic-permission');
                        return;
                    });
                return;
            }
        }

        showScreen(screenId);
    }

    function showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Show target screen
        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            currentScreen = screenId;

            // Trigger re-animation
            target.style.animation = 'none';
            target.offsetHeight;
            target.style.animation = 'screenFadeIn 0.5s var(--ease-out)';

            // Screen-specific init
            onScreenEnter(screenId);
        }

        playSound('navigate');
    }

    function onScreenEnter(screenId) {
        switch (screenId) {
            case 'home':
                Game.updateHomeStats();
                break;
            case 'explorer-select':
                Explorer.updateEcosystemCards();
                break;
            case 'scoreboard':
                renderScoreboard();
                break;
            case 'trainer':
                Trainer.renderTopics();
                break;
        }
    }

    function showMicPermission() {
        showScreen('mic-permission');
    }

    function renderScoreboard() {
        const state = Game.getState();
        const level = Game.getLevel();
        const badges = Game.getBadges();

        // Score & Level
        document.getElementById('total-score').textContent = state.totalScore;
        document.getElementById('overall-progress-fill').style.width = `${level.progress}%`;
        document.getElementById('overall-progress-text').textContent = `Level – ${level.emoji} ${level.name}${level.nextLevel ? ` (${Math.round(level.progress)}% to ${level.nextLevel.name})` : ' (MAX)'}`;

        // Stats
        document.getElementById('stat-questions').textContent = state.totalAnswered;
        document.getElementById('stat-correct').textContent = state.totalCorrect;
        document.getElementById('stat-best-streak').textContent = state.bestStreak;
        document.getElementById('stat-ecosystems').textContent = `${state.ecosystemsCompleted}/5`;

        // Badges
        const badgesGrid = document.getElementById('badges-grid');
        badgesGrid.innerHTML = badges.map(badge => {
            const earned = state.earnedBadges.includes(badge.id);
            return `
                <div class="badge-item ${earned ? 'earned' : ''}">
                    <span class="badge-icon">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-desc">${badge.desc}</span>
                </div>
            `;
        }).join('');
    }

    function createParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const count = 25;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const useEmoji = Math.random() > 0.5;
            if (useEmoji) {
                particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
                particle.style.fontSize = `${Math.random() * 16 + 10}px`;
                particle.style.background = 'none';
            } else {
                const size = Math.random() * 6 + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
            }

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;

            canvas.appendChild(particle);
        }
    }

    // Simple sound effects using Web Audio API (lazily created to respect autoplay policy)
    let soundCtx = null;

    function getSoundCtx() {
        if (!soundCtx) {
            try {
                soundCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return null;
            }
        }
        return soundCtx;
    }

    function playSound(type) {
        try {
            const ctx = getSoundCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            switch (type) {
                case 'welcome':
                    osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
                    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
                    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.5);
                    break;

                case 'navigate':
                    osc.frequency.setValueAtTime(880, ctx.currentTime);
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.15);
                    break;

                case 'correct':
                    osc.frequency.setValueAtTime(523, ctx.currentTime);
                    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                    break;

                case 'incorrect':
                    osc.frequency.setValueAtTime(300, ctx.currentTime);
                    osc.frequency.setValueAtTime(250, ctx.currentTime + 0.1);
                    osc.type = 'triangle';
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                    break;

                default:
                    return;
            }
        } catch (e) {
            // Audio not available
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        navigateTo,
        showMicPermission,
        playSound
    };
})();
