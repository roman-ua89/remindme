# Decisions

- 2026-11-12 Topic visibility has no DB column: it is derived from its entities (`excluded` iff the topic has ≥1 entity and all are excluded). Toggling a topic cascades `updateMany` to all its entities; turning it back on resets every entity to visible.
- 2026-11-12 Entity visibility switches stay enabled when the parent topic is off (backlog Task 1 line 18 wins over line 10); turning one entity on makes the topic visible again.
- 2026-11-12 Visibility has dedicated endpoints (`PATCH …/entities/:id/visibility`, `PATCH …/topics/:id/visibility`) like `/marker`, so toggling does not bump `editedAt`.
