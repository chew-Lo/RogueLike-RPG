// this shows all the progression ssytem of the game
function showChoices() {
    const choiceArea = document.getElementById('choiceArea');
    choiceArea.innerHTML = '';
    
    generateChoices().forEach(choice => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.onclick = () => selectChoice(choice);
        card.innerHTML = `<h3>${choice.title}</h3><p>${choice.description}</p>`;
        choiceArea.appendChild(card);
    });
    
    showScreen('choiceScreen');
}

function generateChoices() {
    const choices = [];
    const stats = ['strength', 'dodge'];
    
    for (let i = 0; i < 2; i++) {
        const stat = stats[Math.floor(Math.random() * stats.length)];
        const value = Math.floor(2 + Math.random() * 4);
        let emoji = stat === 'strength' ? '💪' : '⚡';
        
        choices.push({ 
            type: 'stat', 
            stat: stat, 
            value: value, 
            title: `${emoji} ${stat.charAt(0).toUpperCase() + stat.slice(1)} +${value}`, 
            description: `Increase ${stat} by ${value}` 
        });
    }
    
    const unlockedSkillNames = gameState.skills.map(s => s.name);
    const availableSkills = allSkills.filter(s => !unlockedSkillNames.includes(s.name));
    
    if (availableSkills.length > 0 && Math.random() < 0.6) {
        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        choices[Math.floor(Math.random() * 2)] = { 
            type: 'skill', 
            skill: skill, 
            title: `🔮 Unlock: ${skill.name}`, 
            description: `${skill.description}` 
        };
    }
    
    if (Math.random() < 0.3) {
        const healAmount = Math.floor(gameState.player.currentMaxHp * 0.3);
        choices[Math.floor(Math.random() * 2)] = { 
            type: 'heal', 
            value: healAmount, 
            title: `❤️ Heal`, 
            description: `Restore ${healAmount} HP` 
        };
    }
    
    return choices;
}

function selectChoice(choice) {
    switch(choice.type) {
        case 'stat':
            gameState.player[choice.stat] += choice.value;
            if (choice.stat === 'strength') {
                gameState.player.currentMaxHp += choice.value * 5;
            }
            break;
            
        case 'skill':
            gameState.skills.push(choice.skill);
            break;
            
        case 'heal':
            gameState.player.hp = Math.min(gameState.player.hp + choice.value, gameState.player.currentMaxHp);
            break;
    }
    
    updatePlayerStats();
    document.getElementById('battleBtn').disabled = false;
    showScreen('battleScreen');
}

function saveToLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('roguelikeLeaderboard') || '[]');
    leaderboard.push({ 
        class: gameState.className, 
        score: gameState.score, 
        wave: gameState.wave - 1, 
        date: new Date().toLocaleDateString() 
    });
    leaderboard.sort((a, b) => b.score - a.score).splice(10);
    localStorage.setItem('roguelikeLeaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
}