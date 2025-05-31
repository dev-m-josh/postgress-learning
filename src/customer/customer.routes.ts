import { Express } from "express";
import * as CustomerController from "./customer.controller";

const customer = (app: Express) => {

    app.route("/customer").get(
        async (req, res, next) => {
            try {
                await CustomerController.getAllCustomers(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").get(
        async (req, res, next) => {
            try {
                await CustomerController.getCustomerById(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").put(
        async (req, res, next) => {
            try {
                await CustomerController.updateCustomer(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/customer/:id").delete(
        async (req, res, next) => {
            try {
                await CustomerController.deleteCustomer(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
};
export default customer;
