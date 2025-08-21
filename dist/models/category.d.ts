/**
 * Category Model
 */
export interface Category {
    id?: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}
export declare class CategoryModel {
    static create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category>;
    static findAll(): Promise<Category[]>;
    static findById(id: number): Promise<Category | null>;
    static findByName(name: string): Promise<Category | null>;
    static findOrCreate(name: string, description?: string): Promise<Category>;
}
//# sourceMappingURL=category.d.ts.map