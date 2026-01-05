export interface Todo {
    id?: string;
    taskName: string;
    description?: string;
    status: boolean;
    embedding: number[];
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    createdBy: string;
    updatedBy?: string;
    deletedBy?: string;
    userId: string;
}