export interface Subnote{
    _id: string;
    title: string;
    content: string;
    noteId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubnoteDto{
    title: string;
    content: string;
    noteId: string;
}

export interface UpdateSubnoteDto{
    title?: string;
    content?: string;
}