export interface Review{
    id: number,
    reviewDescription: string,
    createdDate: Date,
    userId: number,
    nickName: string
    isEditMode: boolean;
}