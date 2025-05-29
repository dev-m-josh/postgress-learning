import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { user, token } = await AuthService.registerUser(req.body);
        res.status(201).json({ message: "Registration successful", user, token });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const { user, token } = await AuthService.loginUser(email, password);
        res.json({ message: "Login successful", user, token });
    } catch (error: any) {
        res.status(401).json({ error: error.message || "Login failed" });
    }
};
