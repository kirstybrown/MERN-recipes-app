export type Recipe = {
    _id: number;
    name: string;
    ingredients: string[];
    instructions: string;
    imageUrl: string;
    cookingTime: number;
    userOwner: number;
}