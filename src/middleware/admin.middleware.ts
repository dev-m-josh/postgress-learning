import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            error: "Access denied. Admins only."
        });
    };
    next();
};
