# Roadmap

## Setup and Planning (Sprint 1)
- Goal: setup repo and define what needs to be implemented to create RL-RPG. This includes 

## MVP (Sprint 2)
- Basic class selection system (Warrior, Archer, Wizard)
- Automated battle system with wave progression
- Enemy generation with scaling difficulty
- Health bar UI and battle log
- Basic stat upgrade rewards after victories
- Local score persistence
- JSONBin leaderboard integration

## Full (Sprint 3)
- Skill system with unlockable abilities (Fireball, Heal, Critical Strike, etc.)
- Game test(let other people play and give feedbck)
- Comprehensive leaderboard with class icons and dates
- Export/import game data functionality
- Game balancing 

## Risks & Mitigations
1. **Complexity of skill system** → Start with simple stat upgrades, add skills incrementally
2. **Balance issues with class progression** → Extensive testing with different upgrade paths
3. **JSONBin rate limiting** → Implement local caching with background sync