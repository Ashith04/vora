/* ============================================
   Challenge Mode – Timed Voice Quizzes
   ============================================ */

const Challenge = (() => {
    let timer = null;
    let timeLeft = 60;
    let score = 0;
    let correct = 0;
    let totalAsked = 0;
    let streak = 0;
    let bestStreak = 0;
    let currentQuestion = null;
    let allQuestions = [];
    let questionPool = [];
    let isActive = false;
    let currentTranscript = '';

    function startGame() {
        // Reset
        timeLeft = 60;
        score = 0;
        correct = 0;
        totalAsked = 0;
        streak = 0;
        bestStreak = 0;
        currentTranscript = '';
        isActive = true;

        // Build question pool
        allQuestions = Game.getAllQuestions();
        questionPool = shuffleArray([...allQuestions]);

        // Show game UI
        document.getElementById('challenge-pregame').classList.add('hidden');
        document.getElementById('challenge-postgame').classList.add('hidden');
        document.getElementById('challenge-ingame').classList.remove('hidden');

        // Update HUD
        updateHUD();
        loadNextQuestion();
        startTimer();

        // Start listening continuously
        Voice.startListening(handleVoiceResult, 'challenge-waveform-canvas');

        Voice.showAvatar('⚡ Go! Answer as fast as you can!');
    }

    function startTimer() {
        updateTimerDisplay();

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        document.getElementById('challenge-timer-text').textContent = timeLeft;

        // Update ring
        const circumference = 2 * Math.PI * 54;
        const offset = circumference * (1 - timeLeft / 60);
        const progress = document.getElementById('timer-progress');
        progress.style.strokeDashoffset = offset;

        // Color change when low
        if (timeLeft <= 10) {
            progress.style.stroke = 'var(--danger)';
            document.getElementById('challenge-timer-text').style.color = 'var(--danger)';
        } else if (timeLeft <= 20) {
            progress.style.stroke = 'var(--warning)';
            document.getElementById('challenge-timer-text').style.color = 'var(--warning)';
        } else {
            progress.style.stroke = 'var(--accent)';
            document.getElementById('challenge-timer-text').style.color = 'var(--accent)';
        }
    }

    function loadNextQuestion() {
        if (questionPool.length === 0) {
            questionPool = shuffleArray([...allQuestions]);
        }

        currentQuestion = questionPool.pop();
        currentTranscript = '';

        document.getElementById('challenge-question-category').textContent = `${currentQuestion.ecosystem.toUpperCase()} – ${currentQuestion.category}`;
        document.getElementById('challenge-question-text').textContent = currentQuestion.question;
        document.getElementById('challenge-transcript').innerHTML = '<p class="transcript-placeholder">Speak your answer...</p>';

        // Hide feedback
        document.getElementById('challenge-feedback').classList.add('hidden');
    }

    function handleVoiceResult(result) {
        if (!isActive) return;

        if (result.interim) {
            document.getElementById('challenge-transcript').innerHTML = `<p style="color: var(--text-muted); font-style: italic;">${result.interim}</p>`;
        }

        if (result.isFinal && result.final) {
            currentTranscript += result.final + ' ';
            document.getElementById('challenge-transcript').innerHTML = `<p>${currentTranscript.trim()}</p>`;

            // Auto-evaluate
            setTimeout(() => {
                if (isActive && currentTranscript.trim().length > 0) {
                    evaluateAnswer();
                }
            }, 800);
        }
    }

    function evaluateAnswer() {
        if (!currentQuestion || !currentTranscript.trim()) return;

        totalAsked++;
        const result = Feedback.analyzeAnswer(currentTranscript, currentQuestion.keywords, 0.7);

        const isCorrect = result.correctness === 'correct' || result.correctness === 'partial';

        if (isCorrect) {
            correct++;
            streak++;
            if (streak > bestStreak) bestStreak = streak;

            const streakBonus = streak >= 3 ? streak * 5 : 0;
            const points = result.points + streakBonus;
            score += points;

            showQuickFeedback(`✅ +${points} points${streakBonus > 0 ? ` (🔥 x${streak} streak!)` : ''}`, 'var(--success)');
        } else {
            streak = 0;
            showQuickFeedback('❌ Not quite!', 'var(--danger)');
        }

        Game.recordAnswer(isCorrect);
        updateHUD();

        // Next question after brief delay
        setTimeout(() => {
            if (isActive) loadNextQuestion();
        }, 1200);
    }

    function showQuickFeedback(text, color) {
        const fb = document.getElementById('challenge-feedback');
        const fbText = document.getElementById('challenge-feedback-text');
        fb.classList.remove('hidden');
        fb.style.color = color;
        // Map CSS variable names to rgba backgrounds
        const bgMap = {
            'var(--success)': 'rgba(52, 211, 153, 0.1)',
            'var(--danger)': 'rgba(248, 113, 113, 0.1)',
            'var(--warning)': 'rgba(251, 191, 36, 0.1)'
        };
        fb.style.background = bgMap[color] || 'rgba(255,255,255,0.05)';
        fbText.textContent = text;

        // Re-trigger animation
        fb.style.animation = 'none';
        fb.offsetHeight;
        fb.style.animation = 'feedbackFlash 0.4s var(--ease-bounce)';
    }

    function updateHUD() {
        document.getElementById('challenge-score').textContent = score;
        document.getElementById('challenge-correct').textContent = correct;
        document.getElementById('challenge-streak').textContent = streak;
    }

    function endGame() {
        isActive = false;
        clearInterval(timer);
        Voice.stopListening();

        // Save results
        Game.addScore(score);
        Game.setChallengeHighScore(score);

        // Show results
        document.getElementById('challenge-ingame').classList.add('hidden');
        document.getElementById('challenge-postgame').classList.remove('hidden');

        document.getElementById('result-correct').textContent = correct;
        document.getElementById('result-points').textContent = score;
        document.getElementById('result-best-streak').textContent = bestStreak;

        const accuracy = totalAsked > 0 ? Math.round((correct / totalAsked) * 100) : 0;
        document.getElementById('result-accuracy').textContent = `${accuracy}%`;

        // Show earned badges
        const newBadges = Game.checkBadges();
        const badgesContainer = document.getElementById('result-badges');
        if (newBadges.length > 0) {
            badgesContainer.innerHTML = '<p style="margin-bottom: 8px; color: var(--accent);">🏅 New Badges Earned!</p>' +
                newBadges.map(b => `<span style="margin: 4px; display: inline-block;">${b.icon} ${b.name}</span>`).join('');
        } else {
            badgesContainer.innerHTML = '';
        }

        Voice.showAvatar(`⚡ Challenge complete! You scored ${score} points with ${correct} correct answers!`);
    }

    function exitGame() {
        if (isActive) {
            isActive = false;
            clearInterval(timer);
            Voice.stopListening();
        }
        // Reset UI
        document.getElementById('challenge-pregame').classList.remove('hidden');
        document.getElementById('challenge-ingame').classList.add('hidden');
        document.getElementById('challenge-postgame').classList.add('hidden');
        App.navigateTo('home');
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    return {
        startGame,
        exitGame
    };
})();
