/**
 * User Type Definitions
 * Business user roles and permissions
 */
export declare enum UserRole {
    SYSTEM_ADMIN = "system_admin",
    BUSINESS_MANAGER = "business_manager",
    INVENTORY_STAFF = "inventory_staff",
    CUSTOMER_SERVICE = "customer_service"
}
export declare enum Permission {
    PRODUCTS_VIEW = "products.view",
    PRODUCTS_CREATE = "products.create",
    PRODUCTS_UPDATE = "products.update",
    PRODUCTS_DELETE = "products.delete",
    INVENTORY_VIEW = "inventory.view",
    INVENTORY_UPDATE = "inventory.update",
    INVENTORY_BULK_OPERATIONS = "inventory.bulk_operations",
    ORDERS_VIEW = "orders.view",
    ORDERS_CREATE = "orders.create",
    ORDERS_UPDATE = "orders.update",
    ORDERS_DELETE = "orders.delete",
    ORDERS_PROCESS = "orders.process",
    SUPPLIERS_VIEW = "suppliers.view",
    SUPPLIERS_MANAGE = "suppliers.manage",
    USERS_VIEW = "users.view",
    USERS_MANAGE = "users.manage",
    REPORTS_VIEW = "reports.view",
    REPORTS_FINANCIAL = "reports.financial",
    SYSTEM_CONFIG = "system.config",
    SYSTEM_LOGS = "system.logs"
}
export declare const ROLE_PERMISSIONS: Record<UserRole, Permission[]>;
export interface BusinessUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBusinessUserRequest {
    email: string;
    name: string;
    role: UserRole;
    temporaryPassword?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: Omit<BusinessUser, 'password'>;
    token: string;
    expiresAt: Date;
}
//# sourceMappingURL=user.d.ts.map