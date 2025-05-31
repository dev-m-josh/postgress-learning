import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "youcanguessit";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};
