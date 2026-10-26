export type DevPlanTask = {
    id: string;
    label: string;
    done: boolean;
};

/** Edit this list manually during MVP development. Set `done: true` when complete. */
export const devPlanTasks: DevPlanTask[] = [
    { id: '10', label: 'List item visibility: icon on list page + icon on constructor page', done: false },
    { id: '20', label: 'Entity constructor - page has no fixed width with Code block.', done: false },
    { id: '22', label: 'Increase font size in player everywhere.', done: false },
    { id: '23', label: 'When called run player on a single entity, when pressed Done - ask for next 3 from same Topic or Close player. ', done: false },
    // { id: '', label: '', done: false },
];
