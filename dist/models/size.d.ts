/**
 * Size Model
 */
export interface Size {
    id?: number;
    name: string;
    created_at?: string;
}
export declare class SizeModel {
    static create(size: Omit<Size, 'id' | 'created_at'>): Promise<Size>;
    static findAll(): Promise<Size[]>;
    static findById(id: number): Promise<Size | null>;
    static findByName(name: string): Promise<Size | null>;
    static findOrCreate(name: string): Promise<Size>;
}
//# sourceMappingURL=size.d.ts.map