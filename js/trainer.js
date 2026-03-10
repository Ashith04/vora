/* ============================================
   Communication Trainer Mode
   ============================================ */

const Trainer = (() => {
    let currentTopic = null;
    let isRecording = false;
    let transcript = '';
    let recordingTimer = null;
    let recordingSeconds = 0;

    function init() {
        renderTopics();
    }

    function renderTopics() {
        const topics = Game.getTrainerTopics();
        const grid = document.getElementById('topic-grid');
        if (!grid) return;

        grid.innerHTML = topics.map((topic, i) => `
            <button class="topic-card" onclick="Trainer.selectTopic(${i})">
                <div class="topic-card-icon">${topic.icon}</div>
                <h4>${topic.title}</h4>
                <p>${topic.prompt}</p>
                <span class="topic-difficulty ${topic.difficulty}">${topic.difficulty}</span>
            </button>
        `).join('');
    }

    function selectTopic(index) {
        const topics = Game.getTrainerTopics();
        currentTopic = topics[index];
        transcript = '';
        recordingSeconds = 0;

        // Update UI
        document.getElementById('trainer-topic-icon').textContent = currentTopic.icon;
        document.getElementById('trainer-topic-title').textContent = currentTopic.title;
        document.getElementById('trainer-topic-prompt').textContent = currentTopic.prompt;

        // Keyword chips
        const chipsContainer = document.getElementById('trainer-keyword-chips');
        chipsContainer.innerHTML = currentTopic.keywords.map(kw =>
            `<span class="keyword-chip">${kw}</span>`
        ).join('');

        // Show speaking area
        document.getElementById('trainer-topics').classList.add('hidden');
        document.getElementById('trainer-speaking').classList.remove('hidden');
        document.getElementById('trainer-feedback').classList.add('hidden');
        document.getElementById('btn-submit-trainer').classList.add('hidden');

        // Reset
        document.getElementById('trainer-transcript').innerHTML = '<p class="transcript-placeholder">Your explanation will appear here...</p>';
        document.getElementById('trainer-timer-text').textContent = '0:00';
        document.getElementById('btn-trainer-mic').classList.remove('listening');
        document.getElementById('trainer-mic-label').textContent = 'Tap to Start Speaking';

        Voice.showAvatar(`Explain "${currentTopic.title}" in your own words. Try to mention the highlighted keywords! 🎤`);
        Voice.speak(`Please explain: ${currentTopic.title}. ${currentTopic.prompt}`);
    }

    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        isRecording = true;
        transcript = '';
        recordingSeconds = 0;

        document.getElementById('btn-trainer-mic').classList.add('listening');
        document.getElementById('trainer-mic-label').textContent = 'Tap to Stop';
        document.getElementById('trainer-transcript').innerHTML = '<p style="color: var(--text-muted);">Listening... explain the concept</p>';

        // Start timer
        recordingTimer = setInterval(() => {
            recordingSeconds++;
            const mins = Math.floor(recordingSeconds / 60);
            const secs = recordingSeconds % 60;
            document.getElementById('trainer-timer-text').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);

        // Start voice
        Voice.startListening((result) => {
            if (result.interim) {
                const display = transcript ? transcript + ' ' + result.interim : result.interim;
                document.getElementById('trainer-transcript').innerHTML = `<p>${transcript}<span style="color: var(--text-muted); font-style: italic;"> ${result.interim}</span></p>`;
            }
            if (result.isFinal && result.final) {
                transcript += (transcript ? ' ' : '') + result.final;
                document.getElementById('trainer-transcript').innerHTML = `<p>${transcript}</p>`;

                // Show submit button after some content
                if (transcript.split(/\s+/).length >= 5) {
                    document.getElementById('btn-submit-trainer').classList.remove('hidden');
                }
            }
        }, 'trainer-waveform-canvas');
    }

    function stopRecording() {
        isRecording = false;
        clearInterval(recordingTimer);
        Voice.stopListening();

        document.getElementById('btn-trainer-mic').classList.remove('listening');
        document.getElementById('trainer-mic-label').textContent = 'Tap to Continue Speaking';

        if (transcript.trim().length > 0) {
            document.getElementById('btn-submit-trainer').classList.remove('hidden');
        }
    }

    function submitResponse() {
        if (!transcript.trim() || !currentTopic) return;

        stopRecording();

        const analysis = Feedback.analyzeExplanation(transcript, currentTopic);

        // Add score
        Game.addScore(analysis.points);
        Game.incrementTrainerCompleted();

        // Show feedback
        document.getElementById('trainer-speaking').classList.add('hidden');
        document.getElementById('trainer-feedback').classList.remove('hidden');

        // Animate meters
        setTimeout(() => {
            setMeter('clarity', analysis.clarityScore);
            setMeter('completeness', analysis.completenessScore);
            setMeter('vocabulary', analysis.vocabularyScore);
            setMeter('confidence', analysis.confidenceScore);
        }, 200);

        // Tips
        const tipsContainer = document.getElementById('trainer-tips');
        tipsContainer.innerHTML = analysis.tips.map(tip =>
            `<div class="feedback-tip ${tip.type}">${tip.text}</div>`
        ).join('');

        // Keywords result
        const kwContainer = document.getElementById('trainer-keywords-result');
        const allKeywords = currentTopic.keywords.map(kw => {
            const found = analysis.foundKeywords.includes(kw);
            return `<span class="keyword-chip ${found ? 'found' : 'missed'}">${found ? '✓' : '✗'} ${kw}</span>`;
        });
        kwContainer.innerHTML = `
            <p style="margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">Keywords mentioned:</p>
            ${allKeywords.join(' ')}
        `;

        // Score
        document.getElementById('trainer-score').textContent = Game.getState().totalScore;

        Voice.showAvatar(`Great speaking practice! You earned ${analysis.points} points. ${analysis.clarityScore > 70 ? '🌟 Excellent clarity!' : '💪 Keep practicing!'}`);
    }

    function setMeter(name, value) {
        const fill = document.getElementById(`meter-${name}`);
        const val = document.getElementById(`meter-${name}-val`);
        if (fill) fill.style.width = `${value}%`;
        if (val) val.textContent = `${value}%`;
    }

    function tryAgain() {
        if (currentTopic) {
            const topics = Game.getTrainerTopics();
            const index = topics.indexOf(currentTopic);
            selectTopic(index >= 0 ? index : 0);
        }
    }

    function showTopics() {
        document.getElementById('trainer-topics').classList.remove('hidden');
        document.getElementById('trainer-speaking').classList.add('hidden');
        document.getElementById('trainer-feedback').classList.add('hidden');
        renderTopics();
    }

    function exitTrainer() {
        if (isRecording) stopRecording();
        showTopics();
        App.navigateTo('home');
    }

    return {
        init,
        renderTopics,
        selectTopic,
        toggleRecording,
        submitResponse,
        tryAgain,
        showTopics,
        exitTrainer
    };
})();
