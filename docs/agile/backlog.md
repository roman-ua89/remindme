# Tasks

## Done Task 1. Entity visibility

Goal: exclude entity from Player's collection.
Description: database table Entity already has field 'visibility'. Frontend does not handle changing this value. This implements visibility switcher. The switcher is turned on by default, which means that Topic/Entity is visible and can be included in result collection for the player.
Where:
- on Topics list page. If turned off: all nested entities must not be added to result collection for the Player.
- on Entities list page for each item. If turned off: Entity item must not be added to result collection for Player.
- add new marker option for not visible Entities. If Entity set to not visible: indicate it on parent Topics, Categories levels and on Entity itself. Use light gray color. Put the marker on the left from existing. If visibility turned off on Topics level - still add maker on Topics level and make visibility switcher in nested Entities list disabled.
- constructor page in the right panel above the templates. Add label 'Visibility'

Components:
- use shadcn tooltip component when hover over visibility switcher. 

Behavior:
- Topics list level. If visibility is turned on, on hover show tooltip with text 'Exclude all nested entities from Player'. When turned off: 'Make nested entities visible for Player'. 
- If visibility is turned off on Topic level, nested Entities should have switcher turned off. In this case user still able to turn on visibility of some Entities, but now visibility on parent Topic should be turned on automatically.
- Entities list level. If switcher is turned on show tooltip 'Item is visible in Player'. If turned off 'Item is not visible in Player'.

Notes:
- make wording of tooltips text better if you think they sounds not appropriate.

