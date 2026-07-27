export type PlayerCategoryScope = {
    type: 'category';
    categoryId: string;
};

export type PlayerTopicScope = {
    type: 'topic';
    topicId: string;
};

export type PlayerEntityScope = {
    type: 'entity';
    entityId: string;
    preview?: boolean;
};

export type PlayerScope = PlayerCategoryScope | PlayerTopicScope | PlayerEntityScope;
