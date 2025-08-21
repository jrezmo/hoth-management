"use strict";
/**
 * User Type Definitions
 * Business user roles and permissions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.Permission = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SYSTEM_ADMIN"] = "system_admin";
    UserRole["BUSINESS_MANAGER"] = "business_manager";
    UserRole["INVENTORY_STAFF"] = "inventory_staff";
    UserRole["CUSTOMER_SERVICE"] = "customer_service";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    // Product permissions
    Permission["PRODUCTS_VIEW"] = "products.view";
    Permission["PRODUCTS_CREATE"] = "products.create";
    Permission["PRODUCTS_UPDATE"] = "products.update";
    Permission["PRODUCTS_DELETE"] = "products.delete";
    // Inventory permissions
    Permission["INVENTORY_VIEW"] = "inventory.view";
    Permission["INVENTORY_UPDATE"] = "inventory.update";
    Permission["INVENTORY_BULK_OPERATIONS"] = "inventory.bulk_operations";
    // Order permissions
    Permission["ORDERS_VIEW"] = "orders.view";
    Permission["ORDERS_CREATE"] = "orders.create";
    Permission["ORDERS_UPDATE"] = "orders.update";
    Permission["ORDERS_DELETE"] = "orders.delete";
    Permission["ORDERS_PROCESS"] = "orders.process";
    // Supplier permissions
    Permission["SUPPLIERS_VIEW"] = "suppliers.view";
    Permission["SUPPLIERS_MANAGE"] = "suppliers.manage";
    // User management
    Permission["USERS_VIEW"] = "users.view";
    Permission["USERS_MANAGE"] = "users.manage";
    // Reporting
    Permission["REPORTS_VIEW"] = "reports.view";
    Permission["REPORTS_FINANCIAL"] = "reports.financial";
    // System administration
    Permission["SYSTEM_CONFIG"] = "system.config";
    Permission["SYSTEM_LOGS"] = "system.logs";
})(Permission || (exports.Permission = Permission = {}));
exports.ROLE_PERMISSIONS = {
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
//# sourceMappingURL=user.js.map