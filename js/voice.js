/* ============================================
   Voice Recognition & Synthesis Module
   ============================================ */

const Voice = (() => {
    let recognition = null;
    let isListening = false;
    let audioContext = null;
    let analyser = null;
    let microphone = null;
    let animationId = null;
    let currentCallback = null;
    let currentCanvas = null;
    let synthesis = window.speechSynthesis;
    let permissionGranted = false;

    function init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser.');
            return false;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = handleResult;
        recognition.onerror = handleError;
        recognition.onend = handleEnd;

        return true;
    }

    function handleResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                finalTranscript += result[0].transcript;
                confidence = result[0].confidence;
            } else {
                interimTranscript += result[0].transcript;
            }
        }

        if (currentCallback) {
            currentCallback({
                final: finalTranscript,
                interim: interimTranscript,
                confidence: confidence,
                isFinal: finalTranscript.length > 0
            });
        }
    }

    function handleError(event) {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            permissionGranted = false;
            App.showMicPermission();
        }
    }

    function handleEnd() {
        if (isListening) {
            try {
                recognition.start();
            } catch (e) {
                // Already started
            }
        }
    }

    async function requestPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(t => t.stop());
            permissionGranted = true;
            App.navigateTo('home');
            showAvatar('Microphone is ready! Choose a game mode to start. 🎉');
        } catch (err) {
            console.error('Microphone permission denied:', err);
            showAvatar('Please allow microphone access to play Vora.');
        }
    }

    function startListening(callback, canvasId) {
        if (!recognition) {
            if (!init()) {
                showAvatar('Your browser doesn\'t support voice recognition. Try Chrome!');
                return;
            }
        }

        currentCallback = callback;
        isListening = true;

        try {
            recognition.start();
        } catch (e) {
            // Already started
        }

        if (canvasId) {
            startWaveform(canvasId);
        }
    }

    function stopListening() {
        isListening = false;
        currentCallback = null;

        if (recognition) {
            try {
                recognition.stop();
            } catch (e) {}
        }

        stopWaveform();
    }

    async function startWaveform(canvasId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            currentCanvas = document.getElementById(canvasId);
            if (currentCanvas) {
                drawWaveform();
            }
        } catch (err) {
            console.warn('Could not start waveform:', err);
        }
    }

    function drawWaveform() {
        if (!analyser || !currentCanvas) return;

        const ctx = currentCanvas.getContext('2d');
        const width = currentCanvas.width;
        const height = currentCanvas.height;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            if (!isListening) return;
            animationId = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, width, height);

            const barCount = 40;
            const barWidth = (width / barCount) * 0.7;
            const gap = (width / barCount) * 0.3;

            for (let i = 0; i < barCount; i++) {
                const dataIndex = Math.floor(i * bufferLength / barCount);
                const barHeight = (dataArray[dataIndex] / 255) * height * 0.85;

                const x = i * (barWidth + gap) + gap / 2;
                const y = (height - barHeight) / 2;

                const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
                gradient.addColorStop(0, 'rgba(110, 231, 183, 0.9)');
                gradient.addColorStop(1, 'rgba(72, 202, 228, 0.6)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 2);
                ctx.fill();
            }
        }

        draw();
    }

    function stopWaveform() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (audioContext) {
            audioContext.close().catch(() => {});
            audioContext = null;
            analyser = null;
            microphone = null;
        }
        if (currentCanvas) {
            const ctx = currentCanvas.getContext('2d');
            ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
            currentCanvas = null;
        }
    }

    function speak(text, callback) {
        if (!synthesis) return;
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 0.8;

        const voices = synthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;

        if (callback) {
            utterance.onend = callback;
        }

        synthesis.speak(utterance);
    }

    function showAvatar(text) {
        const guide = document.getElementById('avatar-guide');
        const textEl = document.getElementById('avatar-text');
        if (guide && textEl) {
            textEl.textContent = text;
            guide.classList.remove('hidden');

            clearTimeout(guide._hideTimeout);
            guide._hideTimeout = setTimeout(() => {
                guide.classList.add('hidden');
            }, 6000);
        }
    }

    function isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    function hasPermission() {
        return permissionGranted;
    }

    function setPermissionGranted(val) {
        permissionGranted = val;
    }

    return {
        init,
        requestPermission,
        startListening,
        stopListening,
        speak,
        showAvatar,
        isSupported,
        hasPermission,
        setPermissionGranted,
        isListening: () => isListening
    };
})();
