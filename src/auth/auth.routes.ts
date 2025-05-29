import { Express } from "express";
import * as AuthController from "./auth.controller";

const auth = (app: Express) => {
    app.route("/auth/register").post(async (req, res, next) => {
        try {
            await AuthController.register(req, res);
        } catch (error) {
            next(error);
        }
    });

    app.route("/auth/login").post(async (req, res, next) => {
        try {
            await AuthController.login(req, res);
        } catch (error) {
            next(error);
        }
    });
};

export default auth;
