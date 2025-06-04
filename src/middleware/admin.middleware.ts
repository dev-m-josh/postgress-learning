import { Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;
    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};
