/* ============================================
   Game Engine – Question Bank, Scoring, Storage
   ============================================ */

const Game = (() => {
    // ---- Question Bank: Pressure Environment Scenarios ----
    const questions = {
        interview: [
            {
                category: 'Self Introduction',
                question: 'Tell me about yourself and why you are the right fit for this role.',
                keywords: ['experience', 'skills', 'passionate', 'background', 'contribute', 'team'],
                hint: 'Structure your answer: present, past, future. Keep it under 2 minutes.',
                correctAnswer: 'A strong answer covers your background, relevant experience, key skills, and why you are passionate about contributing to this role and team.'
            },
            {
                category: 'Behavioral',
                question: 'Describe a time when you faced a difficult challenge at work or school. How did you handle it?',
                keywords: ['challenge', 'approach', 'solution', 'learned', 'result', 'team', 'problem'],
                hint: 'Use the STAR method: Situation, Task, Action, Result.',
                correctAnswer: 'Use the STAR method: describe the Situation, your Task, the Action you took, and the Result you achieved. Focus on what you learned.'
            },
            {
                category: 'Strengths & Weaknesses',
                question: 'What is your greatest weakness, and what are you doing to improve it?',
                keywords: ['weakness', 'improve', 'working on', 'growth', 'aware', 'steps', 'better'],
                hint: 'Be honest but show self-awareness and growth mindset.',
                correctAnswer: 'Name a genuine weakness, show self-awareness, and explain concrete steps you are taking to improve. Avoid cliché answers like perfectionism.'
            },
            {
                category: 'Problem Solving',
                question: 'How would you handle a disagreement with your team leader or manager?',
                keywords: ['respectful', 'communicate', 'understand', 'perspective', 'solution', 'compromise', 'professional'],
                hint: 'Show maturity, respect, and communication skills.',
                correctAnswer: 'Approach the situation respectfully, seek to understand their perspective, communicate your viewpoint clearly, and work toward a professional compromise or solution.'
            },
            {
                category: 'Motivation',
                question: 'Where do you see yourself in five years?',
                keywords: ['growth', 'skills', 'contribute', 'leadership', 'learn', 'goals', 'develop'],
                hint: 'Show ambition aligned with the role, not just personal gain.',
                correctAnswer: 'A good answer shows ambition to grow skills, contribute to the organization, take on leadership, and continue learning — aligned with the role you are applying for.'
            }
        ],
        presentation: [
            {
                category: 'Opening Hook',
                question: 'You are presenting a new idea to your team. How would you open your presentation to grab attention?',
                keywords: ['attention', 'story', 'question', 'statistic', 'hook', 'audience', 'engage'],
                hint: 'Start with a hook: a question, story, or surprising fact.',
                correctAnswer: 'Open with a compelling hook — a surprising statistic, a rhetorical question, or a brief story that connects to your main message and engages the audience immediately.'
            },
            {
                category: 'Handling Nerves',
                question: 'You feel extremely nervous before presenting. What strategies would you use to calm yourself?',
                keywords: ['breathe', 'practice', 'prepare', 'positive', 'confident', 'focus', 'audience'],
                hint: 'Think about both mental and physical preparation techniques.',
                correctAnswer: 'Take deep breaths, practice beforehand, use positive self-talk, focus on the message rather than yourself, and remember that the audience wants you to succeed.'
            },
            {
                category: 'Structure',
                question: 'How would you structure a 5-minute presentation on any topic to keep the audience engaged?',
                keywords: ['introduction', 'main points', 'examples', 'conclusion', 'story', 'clear', 'organized'],
                hint: 'Think: opening, 2-3 key points with examples, strong close.',
                correctAnswer: 'Start with a strong introduction, cover 2-3 main points with examples or stories, use transitions between points, and end with a memorable conclusion or call to action.'
            },
            {
                category: 'Tough Questions',
                question: 'During your presentation, someone asks a question you do not know the answer to. How do you handle it?',
                keywords: ['honest', 'acknowledge', 'research', 'follow up', 'confident', 'calm', 'admit'],
                hint: 'Honesty and composure are more impressive than a fake answer.',
                correctAnswer: 'Stay calm, honestly acknowledge you do not know the exact answer, offer to research and follow up, and redirect to what you do know about the topic.'
            },
            {
                category: 'Closing Impact',
                question: 'How would you end a presentation to leave a lasting impression on your audience?',
                keywords: ['summary', 'call to action', 'memorable', 'key takeaway', 'inspire', 'impact', 'closing'],
                hint: 'A great ending is as important as a great beginning.',
                correctAnswer: 'Summarize key takeaways, deliver a powerful call to action or inspiring statement, and leave the audience with one memorable idea they can act on.'
            }
        ],
        debate: [
            {
                category: 'Argument Building',
                question: 'How would you build a strong argument to defend your position in a debate?',
                keywords: ['evidence', 'logic', 'examples', 'structure', 'clear', 'facts', 'reasoning'],
                hint: 'Strong arguments combine facts, logic, and examples.',
                correctAnswer: 'Build arguments with clear structure: state your position, support it with evidence and facts, use logical reasoning, and provide real-world examples to strengthen your case.'
            },
            {
                category: 'Counter Arguments',
                question: 'Your opponent makes a strong point against your position. How do you respond?',
                keywords: ['acknowledge', 'counter', 'evidence', 'perspective', 'however', 'reframe', 'point'],
                hint: 'Acknowledge their point, then present your counter evidence.',
                correctAnswer: 'Acknowledge the valid aspects of their point, then present counter evidence or a different perspective. Use phrases like "however" or "on the other hand" to reframe the discussion.'
            },
            {
                category: 'Staying Calm',
                question: 'The debate is getting heated and emotional. How do you maintain composure and stay professional?',
                keywords: ['calm', 'facts', 'breathe', 'respectful', 'emotion', 'focus', 'professional', 'composed'],
                hint: 'Focus on facts, not feelings. Stay respectful.',
                correctAnswer: 'Take a breath, stick to facts rather than emotions, maintain a respectful tone, focus on the argument rather than the person, and stay composed even when provoked.'
            },
            {
                category: 'Persuasion',
                question: 'How do you persuade an audience that is skeptical of your position?',
                keywords: ['empathy', 'common ground', 'evidence', 'credible', 'relatable', 'trust', 'connect'],
                hint: 'Start from common ground and build trust.',
                correctAnswer: 'Find common ground with the audience, show empathy for their concerns, present credible evidence, use relatable examples, and build trust by being honest and transparent.'
            },
            {
                category: 'Closing Statement',
                question: 'You have 30 seconds for your closing statement in a debate. What would you say?',
                keywords: ['summary', 'strongest', 'remember', 'action', 'compelling', 'key point', 'impact'],
                hint: 'Hit your strongest point and make it memorable.',
                correctAnswer: 'Summarize your strongest argument, remind the audience of key evidence, make an emotional or logical appeal, and end with a compelling statement they will remember.'
            }
        ],
        groupdiscussion: [
            {
                category: 'Initiating',
                question: 'A group discussion has just started and nobody is speaking. How would you take the initiative?',
                keywords: ['initiative', 'introduce', 'topic', 'perspective', 'structured', 'confident', 'open'],
                hint: 'Taking the lead shows confidence — just be inclusive.',
                correctAnswer: 'Take the initiative confidently by introducing the topic, sharing your initial perspective, and inviting others to share their views. Structure the discussion early to set a collaborative tone.'
            },
            {
                category: 'Active Listening',
                question: 'How do you show that you are actively listening to others in a group discussion?',
                keywords: ['listen', 'nod', 'eye contact', 'build on', 'acknowledge', 'paraphrase', 'respect'],
                hint: 'Listening is just as important as speaking.',
                correctAnswer: 'Make eye contact, nod to show understanding, paraphrase their points before adding yours, acknowledge good ideas, and build on what others have said rather than ignoring them.'
            },
            {
                category: 'Disagreeing Politely',
                question: 'You completely disagree with another person\'s opinion in the group. How do you express this?',
                keywords: ['respect', 'understand', 'however', 'perspective', 'alternative', 'polite', 'constructive'],
                hint: 'Disagree with the idea, not the person.',
                correctAnswer: 'Show respect by acknowledging their viewpoint first, then express your disagreement politely with phrases like "I see your point, however I believe..." and offer an alternative perspective with reasoning.'
            },
            {
                category: 'Time Management',
                question: 'The discussion is running out of time and key points haven\'t been covered. What do you do?',
                keywords: ['summarize', 'focus', 'key points', 'time', 'prioritize', 'conclude', 'guide'],
                hint: 'Step up as a facilitator to guide the group.',
                correctAnswer: 'Step in as a facilitator, summarize what has been discussed, identify the key remaining points, suggest the group prioritize, and help guide the discussion toward a meaningful conclusion.'
            },
            {
                category: 'Conclusion',
                question: 'How would you summarize a group discussion effectively at the end?',
                keywords: ['summary', 'key points', 'consensus', 'different views', 'conclusion', 'agreed', 'outcome'],
                hint: 'Cover all major viewpoints, not just your own.',
                correctAnswer: 'Summarize the key points discussed, highlight areas of consensus and different viewpoints fairly, mention the main conclusion or outcome, and acknowledge contributions from the group.'
            }
        ],
        publicspeaking: [
            {
                category: 'Impromptu Speech',
                question: 'You are asked to give an impromptu 1-minute speech on "The power of communication." Go!',
                keywords: ['communication', 'powerful', 'connect', 'understand', 'express', 'world', 'change', 'people'],
                hint: 'Pick one angle and speak with conviction.',
                correctAnswer: 'A strong impromptu speech picks one clear angle, supports it with a personal example or anecdote, and delivers it with energy and conviction. End with a memorable statement.'
            },
            {
                category: 'Body Language',
                question: 'How does body language affect your public speaking? What should you focus on?',
                keywords: ['posture', 'eye contact', 'gestures', 'confidence', 'open', 'stand', 'movement', 'expression'],
                hint: 'Your body speaks before your words do.',
                correctAnswer: 'Good body language includes confident posture, natural eye contact with the audience, purposeful hand gestures, open stance, controlled movement, and expressive facial expressions.'
            },
            {
                category: 'Voice Control',
                question: 'How can you use your voice effectively to keep an audience engaged during a speech?',
                keywords: ['pace', 'tone', 'volume', 'pause', 'emphasis', 'vary', 'energy', 'clarity'],
                hint: 'Monotone kills engagement. Vary your delivery.',
                correctAnswer: 'Vary your pace, tone, and volume. Use strategic pauses for emphasis. Speak with energy and clarity. Slow down for important points and speed up for excitement.'
            },
            {
                category: 'Overcoming Fear',
                question: 'What advice would you give someone who is terrified of public speaking?',
                keywords: ['practice', 'small', 'prepare', 'normal', 'audience', 'breathe', 'start', 'gradually'],
                hint: 'Everyone starts somewhere — focus on progress, not perfection.',
                correctAnswer: 'Start small with familiar audiences, prepare and practice thoroughly, remember that nervousness is normal, focus on your message rather than yourself, and build confidence gradually.'
            },
            {
                category: 'Storytelling',
                question: 'Why is storytelling important in public speaking, and how would you use it?',
                keywords: ['connect', 'memorable', 'emotion', 'relatable', 'personal', 'example', 'engage', 'message'],
                hint: 'Facts tell, stories sell.',
                correctAnswer: 'Stories make your message relatable and memorable. Use personal experiences or examples that connect emotionally with the audience to illustrate your main points and keep them engaged.'
            }
        ]
    };

    // ---- Communication Trainer Topics ----
    const trainerTopics = [
        {
            icon: '🎯',
            title: 'Elevator Pitch',
            prompt: 'Introduce yourself in 60 seconds as if you just met a potential employer in an elevator.',
            keywords: ['name', 'background', 'skills', 'experience', 'passionate', 'value', 'goal', 'opportunity'],
            difficulty: 'easy'
        },
        {
            icon: '💡',
            title: 'Explain a Complex Idea Simply',
            prompt: 'Pick any concept you know well and explain it so a 10-year-old could understand.',
            keywords: ['simple', 'example', 'like', 'imagine', 'basically', 'means', 'works', 'think of it'],
            difficulty: 'medium'
        },
        {
            icon: '🤝',
            title: 'Convince Someone to Join Your Team',
            prompt: 'Persuade a talented person to join your project or team. Sell the vision!',
            keywords: ['opportunity', 'grow', 'together', 'impact', 'vision', 'learn', 'exciting', 'team'],
            difficulty: 'medium'
        },
        {
            icon: '🛡️',
            title: 'Defend an Unpopular Opinion',
            prompt: 'Choose a position most people disagree with and argue in its favor logically.',
            keywords: ['believe', 'because', 'evidence', 'consider', 'perspective', 'actually', 'however', 'reason'],
            difficulty: 'hard'
        },
        {
            icon: '😰',
            title: 'Apologize Professionally',
            prompt: 'You made a mistake at work that affected your team. Deliver a sincere, professional apology.',
            keywords: ['sorry', 'responsibility', 'mistake', 'impact', 'ensure', 'steps', 'prevent', 'committed'],
            difficulty: 'medium'
        },
        {
            icon: '🏆',
            title: 'Describe Your Biggest Achievement',
            prompt: 'Talk about an achievement you are proud of and what it took to accomplish it.',
            keywords: ['accomplished', 'effort', 'challenge', 'proud', 'result', 'team', 'learned', 'impact'],
            difficulty: 'easy'
        },
        {
            icon: '🌍',
            title: 'Impromptu: Technology and Society',
            prompt: 'Give a 1-minute impromptu speech on how technology has changed human communication.',
            keywords: ['technology', 'communication', 'changed', 'connect', 'social media', 'instant', 'global', 'impact'],
            difficulty: 'hard'
        },
        {
            icon: '📊',
            title: 'Present Bad News to a Client',
            prompt: 'A project is delayed by 2 weeks. Explain this to the client while maintaining their trust.',
            keywords: ['understand', 'delay', 'reason', 'solution', 'committed', 'quality', 'plan', 'apologize'],
            difficulty: 'hard'
        },
        {
            icon: '🎪',
            title: 'Tell an Engaging Story',
            prompt: 'Tell a short story from your life that taught you an important lesson. Make it engaging!',
            keywords: ['happened', 'felt', 'realized', 'learned', 'moment', 'changed', 'important', 'since then'],
            difficulty: 'easy'
        }
    ];

    // ---- Badges ----
    const badges = [
        { id: 'first_answer', icon: '🌱', name: 'First Words', desc: 'Answer your first question', condition: (s) => s.totalAnswered >= 1 },
        { id: 'five_correct', icon: '🗣️', name: 'Finding Voice', desc: '5 correct answers', condition: (s) => s.totalCorrect >= 5 },
        { id: 'ten_correct', icon: '📢', name: 'Clear Speaker', desc: '10 correct answers', condition: (s) => s.totalCorrect >= 10 },
        { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3 answer streak', condition: (s) => s.bestStreak >= 3 },
        { id: 'streak_5', icon: '💥', name: 'Unstoppable', desc: '5 answer streak', condition: (s) => s.bestStreak >= 5 },
        { id: 'explorer_1', icon: '🗺️', name: 'Ice Breaker', desc: 'Complete 1 scenario', condition: (s) => s.ecosystemsCompleted >= 1 },
        { id: 'explorer_all', icon: '🌍', name: 'Master Communicator', desc: 'Complete all scenarios', condition: (s) => s.ecosystemsCompleted >= 5 },
        { id: 'challenge_50', icon: '⚡', name: 'Quick Thinker', desc: '50+ challenge points', condition: (s) => s.challengeHighScore >= 50 },
        { id: 'trainer_1', icon: '🎙️', name: 'First Speech', desc: 'Complete 1 trainer topic', condition: (s) => s.trainerCompleted >= 1 },
        { id: 'trainer_5', icon: '🏆', name: 'Eloquent Speaker', desc: 'Complete 5 trainer topics', condition: (s) => s.trainerCompleted >= 5 },
        { id: 'points_100', icon: '💎', name: 'Century Club', desc: 'Earn 100 total points', condition: (s) => s.totalScore >= 100 },
        { id: 'points_500', icon: '👑', name: 'Voice Champion', desc: 'Earn 500 total points', condition: (s) => s.totalScore >= 500 },
    ];

    // ---- Levels ----
    const levels = [
        { name: 'Beginner', minScore: 0, emoji: '🌱' },
        { name: 'Learner', minScore: 50, emoji: '📖' },
        { name: 'Speaker', minScore: 150, emoji: '🗣️' },
        { name: 'Presenter', minScore: 300, emoji: '🎤' },
        { name: 'Debater', minScore: 500, emoji: '⚔️' },
        { name: 'Orator', minScore: 800, emoji: '🏛️' },
        { name: 'Legend', minScore: 1200, emoji: '👑' },
    ];

    // ---- State ----
    let state = loadState();

    function defaultState() {
        return {
            totalScore: 0,
            totalAnswered: 0,
            totalCorrect: 0,
            bestStreak: 0,
            currentStreak: 0,
            ecosystemProgress: {
                interview: 0, presentation: 0, debate: 0, groupdiscussion: 0, publicspeaking: 0
            },
            ecosystemsCompleted: 0,
            challengeHighScore: 0,
            trainerCompleted: 0,
            earnedBadges: [],
            challengeHistory: []
        };
    }

    function loadState() {
        try {
            const saved = localStorage.getItem('ecovoice_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                // If old ecology state, reset
                if (parsed.ecosystemProgress && parsed.ecosystemProgress.forest !== undefined) {
                    return defaultState();
                }
                return { ...defaultState(), ...parsed };
            }
        } catch (e) {
            console.warn('Could not load saved state:', e);
        }
        return defaultState();
    }

    function saveState() {
        try {
            localStorage.setItem('ecovoice_state', JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save state:', e);
        }
    }

    function addScore(points) {
        state.totalScore += points;
        saveState();
        updateHomeStats();
        checkBadges();
    }

    function recordAnswer(correct) {
        state.totalAnswered++;
        if (correct) {
            state.totalCorrect++;
            state.currentStreak++;
            if (state.currentStreak > state.bestStreak) {
                state.bestStreak = state.currentStreak;
            }
        } else {
            state.currentStreak = 0;
        }
        saveState();
        updateHomeStats();
        checkBadges();
    }

    function setEcosystemProgress(ecosystem, questionIndex) {
        if (questionIndex > state.ecosystemProgress[ecosystem]) {
            state.ecosystemProgress[ecosystem] = questionIndex;
        }
        // Count completed
        state.ecosystemsCompleted = Object.values(state.ecosystemProgress).filter(v => v >= 5).length;
        saveState();
    }

    function setChallengeHighScore(score) {
        if (score > state.challengeHighScore) {
            state.challengeHighScore = score;
        }
        saveState();
        checkBadges();
    }

    function incrementTrainerCompleted() {
        state.trainerCompleted++;
        saveState();
        checkBadges();
    }

    function checkBadges() {
        let newBadges = [];
        badges.forEach(badge => {
            if (!state.earnedBadges.includes(badge.id) && badge.condition(state)) {
                state.earnedBadges.push(badge.id);
                newBadges.push(badge);
            }
        });
        saveState();

        // Show notification for new badges
        if (newBadges.length > 0) {
            const names = newBadges.map(b => `${b.icon} ${b.name}`).join(', ');
            Voice.showAvatar(`🏅 New badge${newBadges.length > 1 ? 's' : ''} earned: ${names}!`);
        }

        return newBadges;
    }

    function getQuestions(ecosystem) {
        return questions[ecosystem] || [];
    }

    function getAllQuestions() {
        const all = [];
        Object.entries(questions).forEach(([eco, qs]) => {
            qs.forEach(q => all.push({ ...q, ecosystem: eco }));
        });
        return all;
    }

    function getTrainerTopics() {
        return trainerTopics;
    }

    function getLevel() {
        let currentLevel = levels[0];
        for (const level of levels) {
            if (state.totalScore >= level.minScore) {
                currentLevel = level;
            }
        }
        const nextLevel = levels[levels.indexOf(currentLevel) + 1];
        const progress = nextLevel
            ? ((state.totalScore - currentLevel.minScore) / (nextLevel.minScore - currentLevel.minScore)) * 100
            : 100;
        return { ...currentLevel, progress: Math.min(100, progress), nextLevel };
    }

    function getState() {
        return state;
    }

    function getBadges() {
        return badges;
    }

    function updateHomeStats() {
        const scoreEl = document.getElementById('home-score');
        const streakEl = document.getElementById('home-streak');
        const badgesEl = document.getElementById('home-badges');

        if (scoreEl) scoreEl.textContent = state.totalScore;
        if (streakEl) streakEl.textContent = state.currentStreak;
        if (badgesEl) badgesEl.textContent = state.earnedBadges.length;
    }

    return {
        getQuestions,
        getAllQuestions,
        getTrainerTopics,
        getBadges,
        getState,
        getLevel,
        addScore,
        recordAnswer,
        setEcosystemProgress,
        setChallengeHighScore,
        incrementTrainerCompleted,
        checkBadges,
        updateHomeStats,
        saveState
    };
})();
