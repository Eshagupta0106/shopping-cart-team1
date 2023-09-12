export interface Filter {
    category: { [category: string]: boolean };
    availability: string;
    minPrice: number;
    maxPrice: number;
    minRating: number | null;
}