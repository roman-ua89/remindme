export type DevPlanTask = {
    id: string;
    label: string;
    done: boolean;
};

/** Edit this list manually during MVP development. Set `done: true` when complete. */
export const devPlanTasks: DevPlanTask[] = [
    { id: '5', label: 'On home page show how many entities were added for the last 7 days.', done: false },
    { id: '6', label: 'On home page show how many entities were revised for the last 7 days.', done: false },
    { id: '7', label: 'On home page show how many entities were skipped for the last 7 days.', done: false },
    { id: '8', label: 'For list item: added date + last edited.', done: false },
    { id: '10', label: 'List item visibility: icon on list page + icon on constructor page', done: false },
    { id: '11', label: 'Stay on the page where Player was triggered.', done: false },
    { id: '13', label: 'Calculate how much time Player was opened and save this data per week.', done: false },
    { id: '14', label: 'User revise score logic. Increase score for every day activity.', done: false },
    { id: '15', label: 'On player page show Topic and Category the entity had been taken from.', done: false },
    { id: '16', label: 'External link on Entity Constructor. Show the link in Player and preview.', done: false },
    { id: '17', label: '12 items per page', done: false },
    { id: '18', label: 'Notes for next entities. Bottom right corner.', done: false },
    { id: '19', label: 'When new Entity added: it must have (view_count - 1) from highest among existing items.', done: false },
    { id: '20', label: 'Entity constructor - page has no fixed width with Code block.', done: false },
    { id: '21', label: 'Italic style does not work in text editor.', done: false },
    { id: '22', label: 'Increase font size in player everywhere.', done: false },
    { id: '23', label: 'When called run player on a single entity, when pressed Done - ask for next 3 from same Topic or Close player. ', done: false },
    // { id: '', label: '', done: false },
];
