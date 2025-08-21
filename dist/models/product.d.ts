/**
 * Product Model
 * Database operations for product management
 */
export interface Product {
    id?: number;
    supplier_name: string;
    category_name: string;
    size_name: string;
    name: string;
    description?: string;
    wholesale_price: number;
    customer_price: number;
    quantity: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}
export declare class ProductModel {
    static create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    static findAll(): Promise<Product[]>;
    static findById(id: number): Promise<Product | null>;
    static update(id: number, product: Partial<Product>): Promise<Product | null>;
    static delete(id: number): Promise<boolean>;
    static search(term: string): Promise<Product[]>;
    static getDistinctSuppliers(): Promise<{
        name: string;
    }[]>;
    static getDistinctCategories(): Promise<{
        name: string;
    }[]>;
    static getDistinctSizes(): Promise<{
        name: string;
    }[]>;
}
//# sourceMappingURL=product.d.ts.map