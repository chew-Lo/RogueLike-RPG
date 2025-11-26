// This part of the code is very similar to the GD script I made from my past project 
// It is a translated version of the GD script code from my game ZeroToHero

function selectClass(className) {
    gameState.className = className;
    gameState.player = { 
        ...classData[className], 
        hp: classData[className].maxHp, 
        currentMaxHp: classData[className].maxHp 
    };
    
    const startingSkill = allSkills.find(skill => skill.name === classData[className].startingSkill);
    if (startingSkill) {
        gameState.skills.push(startingSkill);
    }
    
    document.getElementById('playerIcon').textContent = classData[className].icon;
    document.getElementById('playerName').textContent = classData[className].name;
    updatePlayerStats();
    showScreen('battleScreen');
}

function generateEnemy() {
    const enemyTypes = [
        { name: 'Goblin', icon: '👹' }, 
        { name: 'Orc', icon: '👺' }, 
        { name: 'Demon', icon: '😈' }, 
        { name: 'Dragon', icon: '🐉' }, 
        { name: 'Skeleton', icon: '💀' }
    ];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const skillsToHave = Math.floor((gameState.wave - 1) / 2);
    
    gameState.enemy = {
        name: type.name, 
        icon: type.icon,
        hp: 80 + (gameState.wave * 10), 
        strength: 8 + Math.floor(gameState.wave * 1.5), 
        speed: 3 + Math.floor(gameState.wave * 0.8),
        skills: enemySkills.slice(0, skillsToHave),
        currentSkill: null
    };
    
    gameState.enemy.maxHp = gameState.enemy.hp;
    gameState.battleRound = 0;
    gameState.player.berserkRounds = 0;
    
    document.getElementById('enemyIcon').textContent = type.icon;
    document.getElementById('enemyName').textContent = type.name;
    updateHealthBar('enemy', gameState.enemy.hp, gameState.enemy.maxHp);
    
    if (gameState.enemy.skills.length > 0) {
        addBattleLog(`${gameState.enemy.name} has ${gameState.enemy.skills.length} skill(s)!`);
    }
}

function startBattle() {
    document.getElementById('battleBtn').disabled = true;
    document.getElementById('battleLog').innerHTML = '';
    generateEnemy();
    addBattleLog('Battle started!');
    setTimeout(() => runBattle(), 1000);
}

function getPlayerSkillProcChance() {
    return gameState.className === 'wizard' ? 0.5 : 0.4;
}

function activatePlayerSkill() {
    const skillChance = getPlayerSkillProcChance();
    
    if (Math.random() < skillChance && gameState.skills.length > 0) {
        const randomSkill = gameState.skills[Math.floor(Math.random() * gameState.skills.length)];
        
        switch(randomSkill.type) {
            case 'damage':
                addBattleLog(`🔥 ${randomSkill.name} activates! +${randomSkill.value} damage this round.`);
                return { type: 'damage', value: randomSkill.value };
                
            case 'critical':
                addBattleLog(`💥 ${randomSkill.name} activates! Double damage this round.`);
                return { type: 'critical', value: 2 };
                
            case 'heal':
                const healAmount = randomSkill.value;
                const oldHp = gameState.player.hp;
                gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.currentMaxHp);
                addBattleLog(`💚 ${randomSkill.name} activates! Heal ${gameState.player.hp - oldHp} HP.`);
                updateHealthBar('player', gameState.player.hp, gameState.player.currentMaxHp);
                return { type: 'heal' };
                
            case 'shield':
                addBattleLog(`🛡️ ${randomSkill.name} activates! Next attack will be blocked.`);
                return { type: 'shield' };
                
            case 'lifesteal':
                addBattleLog(`🩸 ${randomSkill.name} activates! You will lifesteal this round.`);
                return { type: 'lifesteal', value: randomSkill.value };
                
            case 'defense':
                addBattleLog(`💎 ${randomSkill.name} activates! Damage reduced by ${randomSkill.value}.`);
                return { type: 'defense', value: randomSkill.value };
                
            case 'speed':
                gameState.player.speed += randomSkill.value;
                addBattleLog(`💨 ${randomSkill.name} activates! +${randomSkill.value} speed.`);
                setTimeout(() => {
                    gameState.player.speed -= randomSkill.value;
                    addBattleLog(`💨 ${randomSkill.name} wears off.`);
                }, 3000);
                return { type: 'speed' };
                
            case 'berserk':
                gameState.player.strength += randomSkill.value;
                gameState.player.berserkRounds = 2;
                addBattleLog(`😠 ${randomSkill.name} activates! +${randomSkill.value} strength for 2 rounds.`);
                return { type: 'berserk' };
                
            case 'reflect':
                addBattleLog(`✨ ${randomSkill.name} activates! You will reflect damage.`);
                return { type: 'reflect', value: randomSkill.value };
                
            case 'stun':
                addBattleLog(`🌀 ${randomSkill.name} activates! Enemy is stunned and will miss next attack.`);
                return { type: 'stun' };
        }
    }
    return null;
}

function activateEnemySkill() {
    if (Math.random() < 0.38 && gameState.enemy.skills.length > 0) {
        const randomSkill = gameState.enemy.skills[Math.floor(Math.random() * gameState.enemy.skills.length)];
        
        switch(randomSkill.type) {
            case 'damage':
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! +${randomSkill.value} damage.`);
                return { type: 'damage', value: randomSkill.value };
                
            case 'defense':
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! Damage reduced by ${randomSkill.value}.`);
                return { type: 'defense', value: randomSkill.value };
                
            case 'heal':
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! Will heal from damage.`);
                return { type: 'heal', value: randomSkill.value };
                
            case 'buff':
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! +${randomSkill.value} strength.`);
                return { type: 'buff', value: randomSkill.value };
                
            case 'speed':
                gameState.enemy.speed += randomSkill.value;
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! +${randomSkill.value} speed.`);
                return { type: 'speed' };
                
            case 'stun':
                addBattleLog(`⚡ ${gameState.enemy.name} uses ${randomSkill.name}! You are stunned and will miss next attack.`);
                return { type: 'stun' };
        }
    }
    return null;
}

function runBattle() {
    const battle = setInterval(() => {
        gameState.battleRound++;
        
        const playerActivatedSkill = activatePlayerSkill();
        
        let playerCanAttack = true;
        if (playerActivatedSkill?.type === 'stun') {
            addBattleLog(`🌀 ${gameState.enemy.name} is stunned and cannot attack this round!`);
            playerCanAttack = false;
        }
        
        if (playerCanAttack && Math.random() * 100 < gameState.enemy.speed + 2) {
            addBattleLog(`${gameState.enemy.name} dodged the attack with speed!`);
        } else if (playerCanAttack) {
            let playerDamage = gameState.player.strength;
            
            if (playerActivatedSkill) {
                if (playerActivatedSkill.type === 'damage') {
                    playerDamage += playerActivatedSkill.value;
                } else if (playerActivatedSkill.type === 'critical') {
                    playerDamage *= playerActivatedSkill.value;
                }
            }
            
            if (playerActivatedSkill?.type === 'lifesteal') {
                const lifestealAmount = Math.floor(playerDamage * playerActivatedSkill.value);
                const oldHp = gameState.player.hp;
                gameState.player.hp = Math.min(gameState.player.hp + lifestealAmount, gameState.player.currentMaxHp);
                addBattleLog(`🩸 You lifesteal ${lifestealAmount} HP!`);
                updateHealthBar('player', gameState.player.hp, gameState.player.currentMaxHp);
            }
            
            if (gameState.enemy.currentSkill?.type === 'defense') {
                playerDamage = Math.max(1, playerDamage - gameState.enemy.currentSkill.value);
                addBattleLog(`${gameState.enemy.name}'s ${gameState.enemy.currentSkill.name} reduced damage!`);
            }
            
            gameState.enemy.hp -= playerDamage;
            addBattleLog(`You dealt ${playerDamage} damage!`);
            updateHealthBar('enemy', gameState.enemy.hp, gameState.enemy.maxHp);
        }

        if (gameState.enemy.hp <= 0) {
            clearInterval(battle);
            addBattleLog('Victory!');
            
            const healAmount = Math.floor(gameState.player.currentMaxHp * 0.35);
            const oldHp = gameState.player.hp;
            gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.currentMaxHp);
            addBattleLog(`✨ You heal ${gameState.player.hp - oldHp} HP after victory!`);
            updateHealthBar('player', gameState.player.hp, gameState.player.currentMaxHp);
            
            gameState.score += Math.floor(gameState.wave * 100);
            gameState.wave++;
            setTimeout(() => showChoices(), 1500);
            return;
        }

        setTimeout(() => {
            const enemyActivatedSkill = activateEnemySkill();
            if (enemyActivatedSkill) {
                gameState.enemy.currentSkill = enemyActivatedSkill;
            } else {
                gameState.enemy.currentSkill = null;
            }
            
            let enemyCanAttack = true;
            if (enemyActivatedSkill?.type === 'stun') {
                addBattleLog(`🌀 You are stunned and cannot attack this round!`);
                enemyCanAttack = false;
            }
            
            let enemyDamage = gameState.enemy.strength;
            
            if (gameState.enemy.currentSkill) {
                if (gameState.enemy.currentSkill.type === 'damage' || gameState.enemy.currentSkill.type === 'buff') {
                    enemyDamage += gameState.enemy.currentSkill.value;
                }
            }
            
            if (!enemyCanAttack) {
                addBattleLog(`${gameState.enemy.name} misses their attack due to stun!`);
            } else if (Math.random() * 100 < gameState.player.speed) {
                addBattleLog(`You dodged ${gameState.enemy.name}'s attack with your speed!`);
            } else {
                let finalDamage = enemyDamage;
                
                if (playerActivatedSkill?.type === 'defense') {
                    finalDamage = Math.max(1, finalDamage - playerActivatedSkill.value);
                    addBattleLog(`💎 Your defense reduces damage by ${playerActivatedSkill.value}!`);
                }
                
                if (playerActivatedSkill?.type === 'shield') {
                    addBattleLog(`🛡️ Your activated Shield blocked ${gameState.enemy.name}'s attack!`);
                    finalDamage = 0;
                }
                
                if (finalDamage > 0 && playerActivatedSkill?.type === 'reflect') {
                    const reflectedDamage = Math.floor(finalDamage * playerActivatedSkill.value);
                    gameState.enemy.hp -= reflectedDamage;
                    addBattleLog(`✨ You reflect ${reflectedDamage} damage back!`);
                    updateHealthBar('enemy', gameState.enemy.hp, gameState.enemy.maxHp);
                }
                
                gameState.player.hp -= finalDamage;
                
                if (finalDamage > 0 && gameState.enemy.currentSkill?.type === 'heal') {
                    const healAmount = Math.floor(finalDamage * gameState.enemy.currentSkill.value);
                    gameState.enemy.hp = Math.min(gameState.enemy.hp + healAmount, gameState.enemy.maxHp);
                    addBattleLog(`${gameState.enemy.name} steals ${healAmount} health!`);
                    updateHealthBar('enemy', gameState.enemy.hp, gameState.enemy.maxHp);
                }
                
                if (finalDamage > 0) {
                    addBattleLog(`${gameState.enemy.name} dealt ${finalDamage} damage!`);
                }
                updateHealthBar('player', gameState.player.hp, gameState.player.currentMaxHp);
            }

            if (gameState.player.hp <= 0) {
                clearInterval(battle);
                addBattleLog('Defeated...');
                setTimeout(() => gameOver(), 1500);
            }
        }, 800);
    }, 1600);
}

function gameOver() {
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalWave').textContent = gameState.wave - 1;
    saveToLeaderboard();
    showScreen('gameOverScreen');
}