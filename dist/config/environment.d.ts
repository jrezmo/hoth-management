/**
 * Environment Configuration
 * Centralized configuration management with validation
 */
interface Config {
    nodeEnv: string;
    port: number;
    database: {
        url?: string;
        type: 'postgresql' | 'sqlite';
        sqlite: {
            filename: string;
        };
        postgresql: {
            host: string;
            port: number;
            database: string;
            username: string;
            password: string;
        };
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        allowedOrigins: string[];
    };
    storefront: {
        apiUrl: string;
        deployHook?: string;
    };
    logging: {
        level: string;
    };
}
export declare const config: Config;
export {};
//# sourceMappingURL=environment.d.ts.map