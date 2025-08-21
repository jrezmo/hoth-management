/**
 * Authentication Controller
 * Business user authentication logic
 */
import { Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth-controller.d.ts.map