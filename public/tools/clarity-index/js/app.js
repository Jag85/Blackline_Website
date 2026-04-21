import assessmentData from './questions.js';

let currentPillarIndex = 0;
let scores = {}; // { pillarId: [score1, score2, ...] }
const STORAGE_KEY = 'fci_assessment_state';

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const assessmentScreen = document.getElementById('assessment-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const pillarTitle = document.getElementById('pillar-title');
const pillarDescription = document.getElementById('pillar-description');
const questionsContainer = document.getElementById('questions-container');

// Initialize
function init() {
    startBtn.addEventListener('click', startAssessment);
    prevBtn.addEventListener('click', goToPreviousPillar);
    nextBtn.addEventListener('click', goToNextPillar);
    
    // Load from local storage if exists
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        const state = JSON.parse(savedState);
        scores = state.scores;
        currentPillarIndex = state.currentPillarIndex;
        // Optionally ask user if they want to resume
        // For simplicity, we just resume if they click start
    }
}

function startAssessment() {
    welcomeScreen.classList.remove('active');
    assessmentScreen.classList.add('active');
    renderPillar();
}

function renderPillar() {
    const pillar = assessmentData.pillars[currentPillarIndex];
    pillarTitle.textContent = pillar.title;
    pillarDescription.textContent = pillar.description;
    
    questionsContainer.innerHTML = '';
    
    pillar.questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item fade-in';
        
        const savedValue = (scores[pillar.id] && scores[pillar.id][qIndex]) || null;
        
        questionDiv.innerHTML = `
            <span class="question-text">${qIndex + 1}. ${question}</span>
            <div class="rating-group">
                ${[1, 2, 3, 4, 5].map(value => `
                    <label class="rating-option">
                        <input type="radio" name="q${qIndex}" value="${value}" ${savedValue == value ? 'checked' : ''} required>
                        <div class="rating-circle">${value}</div>
                        <span class="rating-label">${getRatingLabel(value)}</span>
                    </label>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    updateProgress();
    
    // Show/hide back button
    prevBtn.style.visibility = currentPillarIndex === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = currentPillarIndex === assessmentData.pillars.length - 1 ? 'See Results' : 'Next';
}

function getRatingLabel(value) {
    const labels = {
        1: "Strongly Disagree",
        2: "Disagree",
        3: "Neutral",
        4: "Agree",
        5: "Strongly Agree"
    };
    return labels[value];
}

function updateProgress() {
    const totalPillars = assessmentData.pillars.length;
    const progress = ((currentPillarIndex) / totalPillars) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}% Complete`;
}

function saveCurrentPillarScores() {
    const pillar = assessmentData.pillars[currentPillarIndex];
    const pillarScores = [];
    let allAnswered = true;

    pillar.questions.forEach((_, qIndex) => {
        const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (selected) {
            pillarScores.push(parseInt(selected.value));
        } else {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        alert('Please answer all questions before proceeding.');
        return false;
    }

    scores[pillar.id] = pillarScores;
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        scores,
        currentPillarIndex
    }));
    
    return true;
}

function goToNextPillar() {
    if (saveCurrentPillarScores()) {
        if (currentPillarIndex < assessmentData.pillars.length - 1) {
            currentPillarIndex++;
            renderPillar();
            window.scrollTo(0, 0);
        } else {
            showResults();
        }
    }
}

function goToPreviousPillar() {
    if (currentPillarIndex > 0) {
        currentPillarIndex--;
        renderPillar();
        window.scrollTo(0, 0);
    }
}

function calculateResults() {
    const pillarTotals = {};
    let totalScore = 0;

    assessmentData.pillars.forEach(pillar => {
        const pillarScore = scores[pillar.id].reduce((a, b) => a + b, 0);
        pillarTotals[pillar.id] = pillarScore;
        totalScore += pillarScore;
    });

    // Determine stage
    const stage = assessmentData.stages.find(s => totalScore >= s.min && totalScore <= s.max);

    // Find highest and lowest pillars
    let lowestPillarId = assessmentData.pillars[0].id;
    let highestPillarId = assessmentData.pillars[0].id;

    assessmentData.pillars.forEach(pillar => {
        if (pillarTotals[pillar.id] < pillarTotals[lowestPillarId]) {
            lowestPillarId = pillar.id;
        }
        if (pillarTotals[pillar.id] > pillarTotals[highestPillarId]) {
            highestPillarId = pillar.id;
        }
    });

    return { totalScore, stage, pillarTotals, lowestPillarId, highestPillarId };
}

function showResults() {
    const results = calculateResults();
    assessmentScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    window.scrollTo(0, 0);

    const lowestPillar = assessmentData.pillars.find(p => p.id === results.lowestPillarId);

    resultsScreen.innerHTML = `
        <div class="card fade-in">
            <div class="results-header">
                <h2>Your Results</h2>
                <div class="overall-score">${results.totalScore}<span class="score-out-of">/100</span></div>
                <div class="founder-stage">${results.stage.name}</div>
                <p class="stage-message">${results.stage.message}</p>
            </div>

            <div class="pillar-results-grid">
                ${assessmentData.pillars.map(pillar => {
                    const score = results.pillarTotals[pillar.id];
                    const interpretation = pillar.interpretations.find(i => score >= i.min && score <= i.max).text;
                    const isHighest = pillar.id === results.highestPillarId;
                    const isLowest = pillar.id === results.lowestPillarId;
                    
                    return `
                        <div class="pillar-result-card">
                            ${isHighest ? '<span class="badge badge-strength">Your Strength</span>' : ''}
                            ${isLowest ? '<span class="badge badge-gap">Clarity Gap</span>' : ''}
                            <div class="pillar-score-row">
                                <strong>${pillar.title}</strong>
                                <span>${score}/25</span>
                            </div>
                            <div class="pillar-mini-bar">
                                <div class="pillar-mini-fill" style="width: ${(score/25)*100}%"></div>
                            </div>
                            <p class="pillar-interpretation">${interpretation}</p>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="next-steps-section">
                <h3>Recommended Next Steps</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">Based on your biggest clarity gap (${lowestPillar.title}):</p>
                <ul class="next-steps-list">
                    ${lowestPillar.recommendations.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>

            <div class="email-capture">
                <h3>Save Your Results</h3>
                <p style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--text-muted);">Enter your email to receive a copy of your diagnostic.</p>
                <input type="email" placeholder="your@email.com" id="user-email">
                <button class="btn btn-primary" id="save-email-btn">Send Results</button>
            </div>

            <div class="final-actions">
                <button class="btn btn-primary" onclick="window.print()">Download / Print Summary</button>
                <button class="btn btn-secondary" id="book-session-btn">Book a Strategy Session</button>
                <button class="btn btn-secondary" id="restart-btn" style="margin-top: 1rem;">Restart Assessment</button>
            </div>
        </div>
    `;

    document.getElementById('restart-btn').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    document.getElementById('book-session-btn').addEventListener('click', () => {
        window.open('https://calendly.com', '_blank'); // Placeholder
    });

    document.getElementById('save-email-btn').addEventListener('click', () => {
        const email = document.getElementById('user-email').value;
        if (email) {
            alert(\`Thanks! Your results would be sent to \${email} (This is a demo)\`);
        } else {
            alert('Please enter a valid email.');
        }
    });
}

init();
