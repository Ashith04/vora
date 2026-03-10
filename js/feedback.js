/* ============================================
   Feedback & Communication Analysis Module
   ============================================ */

const Feedback = (() => {

    function analyzeAnswer(userTranscript, expectedKeywords, confidence) {
        const transcript = userTranscript.toLowerCase().trim();
        const words = transcript.split(/\s+/).filter(w => w.length > 0);

        // Keyword matching
        const foundKeywords = [];
        const missedKeywords = [];

        expectedKeywords.forEach(kw => {
            const kwLower = kw.toLowerCase();
            if (transcript.includes(kwLower)) {
                foundKeywords.push(kw);
            } else {
                // Check for partial matches / synonyms
                const partialMatch = words.some(w => 
                    levenshtein(w, kwLower) <= 2 || kwLower.includes(w) || w.includes(kwLower)
                );
                if (partialMatch) {
                    foundKeywords.push(kw);
                } else {
                    missedKeywords.push(kw);
                }
            }
        });

        const keywordScore = expectedKeywords.length > 0
            ? (foundKeywords.length / expectedKeywords.length) * 100
            : 50;

        // Correctness
        let correctness = 'incorrect';
        if (keywordScore >= 70) correctness = 'correct';
        else if (keywordScore >= 40) correctness = 'partial';

        // Clarity score (from speech recognition confidence)
        const clarityScore = Math.round((confidence || 0.6) * 100);

        // Completeness (based on word count and sentence structure)
        const isCompleteSentence = words.length >= 4;
        const completenessScore = Math.min(100, Math.round(
            (words.length / 8) * 50 + (isCompleteSentence ? 30 : 0) + (keywordScore * 0.2)
        ));

        // Generate feedback messages
        const messages = generateMessages(correctness, clarityScore, completenessScore, foundKeywords, missedKeywords);

        // Points
        let points = 0;
        if (correctness === 'correct') points = 30;
        else if (correctness === 'partial') points = 15;

        // Bonus for clarity
        if (clarityScore > 80) points += 10;
        if (completenessScore > 70) points += 10;

        return {
            correctness,
            keywordScore: Math.round(keywordScore),
            clarityScore,
            completenessScore,
            foundKeywords,
            missedKeywords,
            messages,
            points,
            wordCount: words.length
        };
    }

    function generateMessages(correctness, clarity, completeness, found, missed) {
        const messages = [];

        // Correctness feedback
        if (correctness === 'correct') {
            const correctMsgs = [
                '✅ Excellent! That\'s correct!',
                '✅ Great job! You nailed it!',
                '✅ Perfect answer! Well done!',
                '✅ Spot on! Great ecosystem knowledge!'
            ];
            messages.push(correctMsgs[Math.floor(Math.random() * correctMsgs.length)]);
        } else if (correctness === 'partial') {
            messages.push('🟡 You\'re on the right track! Some keywords were missing.');
        } else {
            messages.push('❌ Not quite right. Let\'s review the correct answer.');
        }

        // Clarity feedback
        if (clarity > 85) {
            messages.push('🎤 Great speaking clarity! Very clear pronunciation.');
        } else if (clarity > 60) {
            messages.push('🎤 Good voice clarity. Keep it up!');
        } else {
            messages.push('🎤 Try speaking more clearly and at a steady pace.');
        }

        // Completeness feedback
        if (completeness > 80) {
            messages.push('📝 Great explanation! You used complete sentences.');
        } else if (completeness > 50) {
            messages.push('📝 Try using more complete sentences for better scores.');
        } else {
            messages.push('📝 Use complete sentences to explain your answer.');
        }

        // Missing keywords hint
        if (missed.length > 0 && missed.length <= 3) {
            messages.push(`💡 Try mentioning: ${missed.join(', ')}`);
        }

        return messages;
    }

    function analyzeExplanation(transcript, topic) {
        const text = transcript.toLowerCase().trim();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        // Keywords found
        const foundKeywords = [];
        const missedKeywords = [];

        topic.keywords.forEach(kw => {
            const kwLower = kw.toLowerCase();
            if (text.includes(kwLower)) {
                foundKeywords.push(kw);
            } else {
                const partialMatch = words.some(w => levenshtein(w, kwLower) <= 2);
                if (partialMatch) foundKeywords.push(kw);
                else missedKeywords.push(kw);
            }
        });

        // Clarity: based on avg word length and sentence structure
        const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);
        const clarityScore = Math.min(100, Math.round(
            (sentences.length >= 2 ? 30 : 10) +
            (avgWordLength > 3 ? 20 : 10) +
            (words.length >= 15 ? 30 : words.length * 2) +
            (foundKeywords.length / Math.max(topic.keywords.length, 1)) * 20
        ));

        // Completeness
        const completenessScore = Math.min(100, Math.round(
            (foundKeywords.length / Math.max(topic.keywords.length, 1)) * 60 +
            (sentences.length >= 3 ? 25 : sentences.length * 8) +
            (words.length >= 20 ? 15 : words.length * 0.75)
        ));

        // Vocabulary
        const uniqueWords = new Set(words.filter(w => w.length > 3));
        const vocabularyScore = Math.min(100, Math.round(
            (uniqueWords.size / Math.max(words.length * 0.6, 1)) * 50 +
            (foundKeywords.length * 10) +
            (avgWordLength > 4 ? 10 : 0)
        ));

        // Confidence: based on length and fluency
        const confidenceScore = Math.min(100, Math.round(
            (words.length >= 10 ? 30 : words.length * 3) +
            (sentences.length >= 2 ? 30 : 15) +
            Math.min(40, words.length * 1.5)
        ));

        // Tips
        const tips = [];
        if (clarityScore > 70) tips.push({ type: 'positive', text: '🌟 Great speaking clarity! Your explanation was easy to understand.' });
        else tips.push({ type: 'improve', text: '💡 Try to speak in clearer, structured sentences.' });

        if (completenessScore > 70) tips.push({ type: 'positive', text: '🌟 Thorough explanation! You covered the key concepts.' });
        else tips.push({ type: 'improve', text: '💡 Try to cover more aspects of the topic. Mention specific examples.' });

        if (vocabularyScore > 70) tips.push({ type: 'positive', text: '🌟 Excellent vocabulary! Great use of scientific terms.' });
        else tips.push({ type: 'improve', text: '💡 Try using more specific scientific terms related to the ecosystem.' });

        if (confidenceScore > 70) tips.push({ type: 'positive', text: '🌟 You spoke with confidence! Keep it up.' });
        else tips.push({ type: 'improve', text: '💡 Try speaking for longer with more detail. Confidence comes with practice!' });

        if (words.length < 10) {
            tips.push({ type: 'improve', text: '💡 Try to give a longer, more detailed explanation.' });
        }

        // Points
        const avgScore = (clarityScore + completenessScore + vocabularyScore + confidenceScore) / 4;
        const points = Math.round(avgScore * 0.5);

        return {
            clarityScore,
            completenessScore,
            vocabularyScore,
            confidenceScore,
            foundKeywords,
            missedKeywords,
            tips,
            points,
            wordCount: words.length,
            sentenceCount: sentences.length
        };
    }

    // Levenshtein distance for fuzzy matching
    function levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    return {
        analyzeAnswer,
        analyzeExplanation
        ,
        generateSuggestedAnswer
    };
})();

// Generate a short suggested answer for a question object
function generateSuggestedAnswer(question) {
    if (!question) return '';
    // Prefer the canonical correct answer if provided
    if (question.correctAnswer && question.correctAnswer.trim().length > 0) {
        return question.correctAnswer.trim();
    }

    const keywords = Array.isArray(question.keywords) ? question.keywords : [];
    const hint = question.hint || '';

    function sentenceize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).trim();
    }

    let suggestion = '';
    if (keywords.length > 0) {
        const top = keywords.slice(0, 3);
        suggestion = `${sentenceize(question.question)} A concise response could mention ${top.join(', ')}.`;
    } else if (hint) {
        suggestion = `${sentenceize(hint)}.`;
    } else {
        suggestion = 'Try giving a short, 1–2 sentence answer that directly addresses the question.';
    }

    return suggestion;
}
