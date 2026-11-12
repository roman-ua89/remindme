# Progress

Each line: date (YYYY-mm-dd), what had been done.

2026-11-12 Entity visibility (backlog Task 1): visibility switches with tooltips on Topic and Entity cards and in the Constructor panel, plus a gray "hidden" marker on Category/Topic/Entity cards. Topic visibility is derived from its entities and cascades; new PATCH `/visibility` endpoints for topics and entities.
2026-11-12 Constructor no longer discards unsaved edits when visibility or a marker is toggled: the form resets only when the entity id or `editedAt` changes.

