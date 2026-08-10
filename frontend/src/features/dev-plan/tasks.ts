export type DevPlanTask = {
    id: string;
    label: string;
    done: boolean;
};

/** Edit this list manually during MVP development. Set `done: true` when complete. */
export const devPlanTasks: DevPlanTask[] = [
    // { id: 'auth-registration', label: 'Registration page', done: false },
    // { id: 'auth-forgot-password', label: 'Forgot password flow', done: false },
    { id: 'global-back', label: 'Show Back button on Topic and Entity page', done: false },
    { id: 'amount-tree', label: 'Show amount of topics and entities on category card', done: false },
    { id: 'entity-preview', label: 'Preview mode for entity', done: true },
    { id: 'entity-close', label: 'Entity page: add back button', done: true },
    { id: 'entity-save-default', label: 'Entity page: save button should be active only after changes', done: true },
    { id: 'entity-back-confirm', label: 'Entity page: confirmation modal when user leave page with changes', done: true },
    { id: 'categories-pagination', label: 'Category pagination', done: true },
    { id: 'topics-pagination', label: 'Topics pagination', done: true },
    { id: 'entities-pagination', label: 'Entities pagination', done: true },
    { id: 'entity-blocks', label: 'Entity page: Show plus icon when hover on block', done: true },
    { id: 'entity-blocks-counter', label: 'Entity page: move max blocks counter to the right', done: true },
    { id: 'favicon', label: 'Add favicon and other app icons', done: true },
    { id: 'new-entity-title', label: 'When creating new entity, update title in breadcrumbs dynamically', done: true },
    { id: 'min-1-block-in-entity', label: 'New entity must have at least one block', done: true },
    {
        id: 'player-page',
        label: 'Player page. Entity in the middle. Two buttons: Done and Skip. Prefetch next entity. Take items randomly among lower revised_count.',
        done: false,
    },
    { id: 'entity-page-delete', label: 'Entity page: add delete button with confirmation modal.', done: true },
    { id: 'home-metrics', label: 'after login show some info blocks of how many entities were skipped (with buttons), revised', done: false },
    // { id: '', label: '', done: false },
];
