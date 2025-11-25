// This has all the global game state
let gameState = {
    player: null,
    enemy: null,
    wave: 1,
    score: 0,
    className: '',
    skills: [],
    battleRound: 0
};

const classData = {
    warrior: { 
        name: 'Warrior', 
        icon: '🛡️', 
        strength: 13, 
        dodge: 10, 
        maxHp: 130, 
        startingSkill: 'Shield' 
    },
    archer: { 
        name: 'Archer', 
        icon: '🏹', 
        strength: 10, 
        dodge: 30, 
        maxHp: 100, 
        startingSkill: 'Critical Strike' 
    },
    wizard: { 
        name: 'Wizard', 
        icon: '🧙', 
        strength: 12, 
        dodge: 20, 
        maxHp: 115, 
        startingSkill: 'Fireball' 
    }
};

const allSkills = [
    { name: 'Fireball', description: '+15 damage on attack', type: 'damage', value: 15 },
    { name: 'Lightning Strike', description: '+20 damage on attack', type: 'damage', value: 20 },
    { name: 'Heal', description: 'Restore 30 HP', type: 'heal', value: 30 },
    { name: 'Shield', description: 'Block next attack', type: 'shield', value: 1 },
    { name: 'Critical Strike', description: 'Double damage next attack', type: 'critical', value: 2 },
    { name: 'Meteor', description: '+30 damage on attack', type: 'damage', value: 30 },
    { name: 'Poison Dart', description: 'Deals 5 damage over 3 rounds', type: 'poison', value: 5 },
    { name: 'Vampire Bite', description: 'Heal 50% of damage dealt', type: 'lifesteal', value: 0.5 },
    { name: 'Stone Skin', description: 'Reduce damage taken by 8', type: 'defense', value: 8 },
    { name: 'Speed Boost', description: 'Dodge chance +20%', type: 'dodge', value: 20 },
    { name: 'Berserk', description: '+10 strength for 2 rounds', type: 'berserk', value: 10 },
    { name: 'Magic Barrier', description: 'Reflect 25% damage back', type: 'reflect', value: 0.25 }
];

const enemySkills = [
    { name: 'Brutal Strike', description: 'Deals extra damage', type: 'damage', value: 10 },
    { name: 'Tough Skin', description: 'Reduces damage taken', type: 'defense', value: 5 },
    { name: 'Life Steal', description: 'Heals from damage dealt', type: 'heal', value: 0.5 },
    { name: 'Enrage', description: 'Increased strength', type: 'buff', value: 5 },
    { name: 'Poison Cloud', description: 'Poisons the player', type: 'poison', value: 3 },
    { name: 'Quick Dodge', description: 'Increased dodge chance', type: 'dodge', value: 15 }
];