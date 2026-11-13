import express from "express";
import {
	getAllNotifications,
	deleteNotification,
	clearAllNotifications,
	markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/list", getAllNotifications);
router.get("/delete/:id", deleteNotification);
router.get("/clear", clearAllNotifications);
router.get("/read/:id", markAsRead);

export default router;
