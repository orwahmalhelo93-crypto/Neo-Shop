import "dotenv/config.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";

const app = express();

const PORT = 4000;

app.use(express.json());

// app.use(cors());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://neo-shop-navy.vercel.app",
		],
		credentials: true,
	}),
);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/notifications", notificationsRoutes);

app.get("/", (req, res) => {
	res.send("API working");
});

// app.listen(PORT, async () => {
// 	connectDB();
// 	console.log(`Server is running ${PORT}`);
// });
const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
};

startServer();
