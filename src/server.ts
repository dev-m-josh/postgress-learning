
import express from "express";
import customer from "./customer/customer.routes";
import reservation from "./reservation/reservation.routes";
import booking from "./booking/booking.routes";
import carRoutes from "./car/car.routes";
import locationRoutes from "./location/location.routes";
import auth from "./auth/auth.routes";
import payment from "./payment/payment.routes";
import maintenanceRoutes from "./mantainance/mantainace.route";
import insurance from "./insurance/insurance.routes";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use routes
auth(app);
customer(app);
reservation(app);
booking(app);
carRoutes(app);
locationRoutes(app);
payment(app);
maintenanceRoutes(app);
insurance(app);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
