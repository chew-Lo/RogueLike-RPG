function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function updatePlayerStats() {
    document.getElementById('playerStr').textContent = gameState.player.strength;
    document.getElementById('playerDodge').textContent = gameState.player.speed;
    document.getElementById('waveNum').textContent = gameState.wave;
    document.getElementById('score').textContent = gameState.score;
    updateHealthBar('player', gameState.player.hp, gameState.player.currentMaxHp);
    if (gameState.skills.length > 0) {
        document.getElementById('skillsDisplay').style.display = 'block';
        document.getElementById('skillsList').innerHTML = gameState.skills.map(s => `<span class="skill-item">${s.name}</span>`).join('');
    }
}

function updateHealthBar(type, hp, maxHp) {
    const bar = document.getElementById(type + 'Health');
    const percentage = Math.max(0, (hp / maxHp) * 100);
    bar.style.width = percentage + '%';
    bar.textContent = Math.max(0, Math.round(hp)) + '/' + maxHp;
}

function addBattleLog(message) {
    const log = document.getElementById('battleLog');
    const p = document.createElement('p');
    p.textContent = message;
    log.insertBefore(p, log.firstChild);
    if (log.children.length > 10) log.removeChild(log.lastChild);
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('roguelikeLeaderboard') || '[]');
    const list = document.getElementById('leaderboardList');
    
    const topThree = leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
    if (topThree.length === 0) {
        list.innerHTML = '<p style="text-align: center;">No entries yet. Be the first!</p>';
        return;
    }
    
    list.innerHTML = topThree.map((entry, index) => {
        const classInfo = classData[entry.class];
        return `
            <div class="leaderboard-entry ${index < 3 ? 'top' : ''}">
                <div>
                    <strong>#${index + 1}</strong> 
                    ${classInfo ? classInfo.icon : ''} 
                    ${classInfo ? classInfo.name : entry.class}
                </div>
                <div>
                    🏆 ${entry.score} | Wave ${entry.wave} | ${entry.date}
                </div>
            </div>
        `;
    }).join('');
}

updateLeaderboard();