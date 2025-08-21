/**
 * Database Connection and Schema Management
 */
export declare class Database {
    private pool;
    connect(): Promise<void>;
    query(text: string, params?: any[]): Promise<any>;
    private createTables;
    close(): Promise<void>;
}
export declare const db: Database;
//# sourceMappingURL=database.d.ts.map