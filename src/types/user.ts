/**
 * User Type Definitions
 * Business user roles and permissions
 */

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  BUSINESS_MANAGER = 'business_manager',
  INVENTORY_STAFF = 'inventory_staff',
  CUSTOMER_SERVICE = 'customer_service',
}

export enum Permission {
  // Product permissions
  PRODUCTS_VIEW = 'products.view',
  PRODUCTS_CREATE = 'products.create',
  PRODUCTS_UPDATE = 'products.update',
  PRODUCTS_DELETE = 'products.delete',
  
  // Inventory permissions
  INVENTORY_VIEW = 'inventory.view',
  INVENTORY_UPDATE = 'inventory.update',
  INVENTORY_BULK_OPERATIONS = 'inventory.bulk_operations',
  
  // Order permissions
  ORDERS_VIEW = 'orders.view',
  ORDERS_CREATE = 'orders.create',
  ORDERS_UPDATE = 'orders.update',
  ORDERS_DELETE = 'orders.delete',
  ORDERS_PROCESS = 'orders.process',
  
  // Supplier permissions
  SUPPLIERS_VIEW = 'suppliers.view',
  SUPPLIERS_MANAGE = 'suppliers.manage',
  
  // User management
  USERS_VIEW = 'users.view',
  USERS_MANAGE = 'users.manage',
  
  // Reporting
  REPORTS_VIEW = 'reports.view',
  REPORTS_FINANCIAL = 'reports.financial',
  
  // System administration
  SYSTEM_CONFIG = 'system.config',
  SYSTEM_LOGS = 'system.logs',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SYSTEM_ADMIN]: Object.values(Permission),
  
  [UserRole.BUSINESS_MANAGER]: [
    Permission.PRODUCTS_VIEW,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_BULK_OPERATIONS,
    Permission.ORDERS_VIEW,
    Permission.ORDERS_CREATE,
    Permission.ORDERS_UPDATE,
    Permission.ORDERS_PROCESS,
    Permission.SUPPLIERS_VIEW,
    Permission.SUPPLIERS_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_FINANCIAL,
  ],
  
  [UserRole.INVENTORY_STAFF]: [
    Permission.PRODUCTS_VIEW,
    Permission.INVENTORY_VIEW,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_BULK_OPERATIONS,
    Permission.ORDERS_VIEW,
  ],
  
  [UserRole.CUSTOMER_SERVICE]: [
    Permission.ORDERS_VIEW,
    Permission.ORDERS_UPDATE,
    Permission.ORDERS_PROCESS,
  ],
};

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