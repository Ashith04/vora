/* ============================================
   Explorer Mode – Ecosystem Exploration
   ============================================ */

const Explorer = (() => {
    let currentEcosystem = null;
    let currentQuestionIndex = 0;
    let questions = [];
    let isListening = false;
    let currentTranscript = '';
    let currentConfidence = 0;
    let currentSuggestion = '';

    function selectEcosystem(ecosystem) {
        currentEcosystem = ecosystem;
        questions = Game.getQuestions(ecosystem);
        const progress = Game.getState().ecosystemProgress[ecosystem] || 0;
        currentQuestionIndex = progress >= 5 ? 0 : progress;

        App.navigateTo('explorer-game');
        loadQuestion();

        const ecoNames = { interview: '🎯 Interview', presentation: '🎤 Presentation', debate: '⚔️ Debate', groupdiscussion: '💬 Group Discussion', publicspeaking: '📢 Public Speaking' };
        document.getElementById('explorer-ecosystem-title').textContent = ecoNames[ecosystem] || ecosystem;

        Voice.showAvatar(`Welcome to the ${ecoNames[ecosystem] || ecosystem} scenario! Listen to the question and speak your answer. 🎤`);
        Voice.speak(`Welcome to the ${ecoNames[ecosystem] || ecosystem} scenario. Here is your first question.`);
    }

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            completeEcosystem();
            return;
        }

        const q = questions[currentQuestionIndex];
        document.getElementById('explorer-question-category').textContent = q.category;
        document.getElementById('explorer-question-text').textContent = q.question;
        document.getElementById('explorer-hint').textContent = `💡 Hint: ${q.hint}`;

        // Progress
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        document.getElementById('explorer-progress-bar').style.width = `${progress}%`;
        document.getElementById('explorer-progress-text').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

        // Score
        document.getElementById('explorer-game-score').textContent = Game.getState().totalScore;

        // Reset voice area
        document.getElementById('explorer-transcript').innerHTML = '<p class="transcript-placeholder">Your answer will appear here...</p>';
        document.getElementById('explorer-feedback').classList.add('hidden');
        document.getElementById('btn-explorer-mic').classList.remove('listening');
        document.getElementById('explorer-mic-label').textContent = 'Tap to Speak';

        currentTranscript = '';
        currentConfidence = 0;

        // Hide any previous suggested answer
        const sugBox = document.getElementById('explorer-suggestion');
        if (sugBox) {
            sugBox.classList.add('hidden');
            const sugText = document.getElementById('explorer-suggestion-text');
            if (sugText) sugText.textContent = '';
        }

        // Animate card
        const card = document.getElementById('explorer-question-card');
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'cardFloat 0.5s var(--ease-bounce)';
    }

    function toggleListening() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function startListening() {
        isListening = true;
        currentTranscript = '';
        currentConfidence = 0;
        document.getElementById('btn-explorer-mic').classList.add('listening');
        document.getElementById('explorer-mic-label').textContent = 'Listening...';
        document.getElementById('explorer-transcript').innerHTML = '<p style="color: var(--text-muted);">Listening... speak your answer</p>';

        Voice.startListening((result) => {
            if (result.interim) {
                document.getElementById('explorer-transcript').innerHTML = `<p style="color: var(--text-muted); font-style: italic;">${result.interim}</p>`;
            }
            if (result.isFinal && result.final) {
                currentTranscript += result.final + ' ';
                currentConfidence = result.confidence || currentConfidence;
                document.getElementById('explorer-transcript').innerHTML = `<p>${currentTranscript.trim()}</p>`;

                // Auto-submit after getting a final result
                setTimeout(() => {
                    if (isListening && currentTranscript.trim().length > 0) {
                        stopListening();
                        submitAnswer();
                    }
                }, 1500);
            }
        }, 'explorer-waveform-canvas');
    }

    function stopListening() {
        isListening = false;
        Voice.stopListening();
        document.getElementById('btn-explorer-mic').classList.remove('listening');
        document.getElementById('explorer-mic-label').textContent = 'Tap to Speak';
    }

    function submitAnswer() {
        if (!currentTranscript.trim()) return;

        const q = questions[currentQuestionIndex];
        const result = Feedback.analyzeAnswer(currentTranscript, q.keywords, currentConfidence);

        // Update score
        Game.addScore(result.points);
        Game.recordAnswer(result.correctness === 'correct');

        // Show feedback
        const feedbackPanel = document.getElementById('explorer-feedback');
        const feedbackResult = document.getElementById('explorer-feedback-result');
        const feedbackDetails = document.getElementById('explorer-feedback-details');

        feedbackResult.className = `feedback-result ${result.correctness}`;
        feedbackResult.textContent = result.messages[0];

        let detailsHtml = '';
        result.messages.slice(1).forEach(msg => {
            detailsHtml += `<span class="tip">${msg}</span>`;
        });

        if (result.correctness !== 'correct') {
            detailsHtml += `<span class="tip" style="border-left-color: var(--info);">📖 Correct answer: ${q.correctAnswer}</span>`;
        }

        feedbackDetails.innerHTML = detailsHtml;
        feedbackPanel.classList.remove('hidden');

        // Update score display
        document.getElementById('explorer-game-score').textContent = Game.getState().totalScore;

        // Speak feedback
        Voice.speak(result.messages[0]);

        // Check if last question
        if (currentQuestionIndex >= questions.length - 1) {
            document.getElementById('btn-explorer-next').textContent = 'Complete Ecosystem 🎉';
        }
    }

    // Reveal a generated suggested answer (only when user requests it)
    function revealSuggestion() {
        const q = questions[currentQuestionIndex];
        if (!q) return;
        currentSuggestion = Feedback.generateSuggestedAnswer(q) || '';
        const el = document.getElementById('explorer-suggestion-text');
        const box = document.getElementById('explorer-suggestion');
        if (el) el.textContent = currentSuggestion;
        if (box) box.classList.remove('hidden');
        Voice.showAvatar('Here is a suggested answer you can adapt or copy.');
    }

    function speakSuggestion() {
        if (!currentSuggestion) return;
        Voice.speak(currentSuggestion);
    }

    async function copySuggestion() {
        if (!currentSuggestion) return;
        try {
            await navigator.clipboard.writeText(currentSuggestion);
            Voice.showAvatar('Suggested answer copied to clipboard.');
        } catch (e) {
            console.warn('Clipboard copy failed', e);
            Voice.showAvatar('Could not copy to clipboard.');
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        Game.setEcosystemProgress(currentEcosystem, currentQuestionIndex);
        loadQuestion();
    }

    function completeEcosystem() {
        Game.setEcosystemProgress(currentEcosystem, 5);
        Game.addScore(50); // Bonus for completing
        Voice.showAvatar(`🎉 Amazing! You completed the ${currentEcosystem} scenario! +50 bonus points!`);
        Voice.speak(`Congratulations! You completed the ${currentEcosystem} scenario!`);
        App.navigateTo('explorer-select');
        updateEcosystemCards();
    }

    function updateEcosystemCards() {
        const state = Game.getState();
        const ecosystems = ['interview', 'presentation', 'debate', 'groupdiscussion', 'publicspeaking'];

        ecosystems.forEach(eco => {
            const progress = state.ecosystemProgress[eco] || 0;
            const pct = (progress / 5) * 100;

            const progressEl = document.getElementById(`${eco}-progress`);
            const statusEl = document.getElementById(`${eco}-status`);

            if (progressEl) progressEl.style.width = `${pct}%`;
            if (statusEl) statusEl.textContent = progress >= 5 ? '✅ Complete!' : `${progress}/5 Complete`;
        });

        document.getElementById('explorer-select-score').textContent = state.totalScore;
    }

    function exitGame() {
        stopListening();
        App.navigateTo('explorer-select');
        updateEcosystemCards();
    }

    return {
        selectEcosystem,
        toggleListening,
        nextQuestion,
        exitGame,
        updateEcosystemCards
    };
})();
