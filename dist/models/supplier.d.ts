/**
 * Supplier Model
 */
export interface Supplier {
    id?: number;
    name: string;
    contact_email?: string;
    contact_phone?: string;
    created_at?: string;
    updated_at?: string;
}
export declare class SupplierModel {
    static create(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier>;
    static findAll(): Promise<Supplier[]>;
    static findById(id: number): Promise<Supplier | null>;
    static findByName(name: string): Promise<Supplier | null>;
    static findOrCreate(name: string): Promise<Supplier>;
}
//# sourceMappingURL=supplier.d.ts.map