
import express from "express";
import { carRoutes } from "./routes/car.routes";
import { customerRoutes } from "./routes/user.route";
import { locationRoutes } from "./routes/location.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use routes
app.use("/cars", carRoutes);
app.use("/customers", customerRoutes);
app.use("/locations", locationRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
