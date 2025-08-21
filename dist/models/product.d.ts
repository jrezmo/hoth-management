/**
 * Product Model
 * Database operations for product management
 */
export interface Product {
    id?: number;
    supplier_id: number;
    category_id: number;
    size_id: number;
    name: string;
    description?: string;
    wholesale_price: number;
    customer_price: number;
    quantity: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}
export interface ProductWithDetails extends Product {
    supplier_name?: string;
    category_name?: string;
    size_name?: string;
}
export declare class ProductModel {
    static create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    static findAll(): Promise<ProductWithDetails[]>;
    static findById(id: number): Promise<ProductWithDetails | null>;
    static update(id: number, product: Partial<Product>): Promise<Product | null>;
    static delete(id: number): Promise<boolean>;
    static search(term: string): Promise<ProductWithDetails[]>;
}
//# sourceMappingURL=product.d.ts.map