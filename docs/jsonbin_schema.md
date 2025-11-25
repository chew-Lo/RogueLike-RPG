# JSONBin Schema & Merge Policy

## Schema

Leaderboard entries will be stored as an array of objects with the following structure:

```json
[
  {
    "class": "warrior|archer|wizard",
    "score": 12500,
    "wave": 8,
    "date": "2024-01-15",
    "timestamp": 1705334400000
  }
]
```

## Examples

### PUT Payload (truncated):

```json
[
  {
    "class": "wizard",
    "score": 18700,
    "wave": 12,
    "date": "2024-01-15",
    "timestamp": 1705334400000
  }
]
```

## Merge Policy

- **Last-write-wins** based on timestamp for entire leaderboard array
- On app start: load local cache, then fetch latest from JSONBin, merge keeping highest scores
- **Deduplication** by composite key (score + class + wave) to prevent identical entries