# Stage 1

## Priority Logic

Priority is based on:

1. Notification Type
   - Placement = 3
   - Result = 2
   - Event = 1

2. Recency
   - Newer notifications have higher priority.

Priority Score:

```text
score = weight × large_constant + timestamp
```

## Top 10 Selection

1. Fetch notifications from API.
2. Calculate score.
3. Sort descending.
4. Pick first 10.

## Efficient Approach

For continuous incoming notifications:

Use a Min Heap of size 10.

- Insert if heap size < 10.
- If new score > smallest score:
  - Remove smallest.
  - Insert new notification.

Complexity:

- Initial sort: O(n log n)
- Heap update: O(log 10)
- Space: O(10)