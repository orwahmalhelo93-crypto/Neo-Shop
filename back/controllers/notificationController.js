import notificationsModel from "../models/notificationsModel.js";

// 1. جلب جميع الإشعارات، من الأحدث إلى الأقدم
export const getAllNotifications = async (req, res) => {
	try {
		const notifications = await notificationsModel
			.find()
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: notifications,
		});
	} catch (err) {
		console.error("خطأ في جلب الإشعارات:", err);

		return res.status(500).json({
			success: false,
			message: "حدث خطأ أثناء جلب الإشعارات",
		});
	}
};

// 2. حذف إشعار واحد
export const deleteNotification = async (req, res) => {
	try {
		const { id } = req.params;

		const notification = await notificationsModel.findByIdAndDelete(id);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "الإشعار غير موجود",
			});
		}

		return res.status(200).json({
			success: true,
			message: "تم حذف الإشعار",
		});
	} catch (err) {
		console.error("خطأ في حذف الإشعار:", err);

		return res.status(500).json({
			success: false,
			message: "حدث خطأ أثناء حذف الإشعار",
		});
	}
};

// 3. حذف جميع الإشعارات
export const clearAllNotifications = async (req, res) => {
	try {
		const result = await notificationsModel.deleteMany({});

		return res.status(200).json({
			success: true,
			message: "تم حذف جميع الإشعارات",
			deletedCount: result.deletedCount,
		});
	} catch (err) {
		console.error("خطأ في حذف جميع الإشعارات:", err);

		return res.status(500).json({
			success: false,
			message: "حدث خطأ أثناء حذف الإشعارات",
		});
	}
};

// 4. تحديد إشعار كمقروء
export const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;

		const notification = await notificationsModel.findByIdAndUpdate(
			id,
			{ $set: { isRead: true } },
			{ new: true, runValidators: true },
		);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "الإشعار غير موجود",
			});
		}

		return res.status(200).json({
			success: true,
			message: "تم تحديد الإشعار كمقروء",
			data: notification,
		});
	} catch (err) {
		console.error("خطأ في تحديث الإشعار:", err);

		return res.status(500).json({
			success: false,
			message: "حدث خطأ أثناء تحديث الإشعار",
		});
	}
};

// 5. إنشاء إشعار لطلب جديد
export const createNotificationForOrder = async (orderData) => {
	try {
		const { userId, _id } = orderData;

		await notificationsModel.create({
			message: ` تم إنشاء طلب جديد برقم ${_id}`,
			orderId: _id,
			user: userId || "مستخدم مجهول",
		});
	} catch (err) {
		console.error("فشل في إنشاء إشعار الطلب:", err);
	}
};

// import notificationsModel from "../models/notificationsModel.js";
// import orderModel from "../models/orderModel";

// export const getAllNotifications = async (req, res) => {
// 	try {
// 		const notifications = (await notificationsModel.find()).sort({
// 			createdAt: -1,
// 		});
// 		res.json({ success: true, data: notifications });
// 	} catch (err) {
// 		console.error("خطأ في جلب الاشعارات", err);
// 		res.status(500).json({ success: false, message: "خطأ في السيرفر" });
// 	}
// };

// export const deleteNotification = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		await notificationsModel.findByIdAndDelete(id);
// 		res.json({ success: true, message: "تم حذف الاشعار" });
// 	} catch (err) {
// 		res.json({ success: false, message: "فشل في الحذف" });
// 	}
// };

// export const clearAllNotifications = async (req, res) => {
// 	try {
// 		await notificationsModel.deleteMany({});
// 		res.json({ success: true, message: "تم حذف كل الاشعارات" });
// 	} catch (err) {
// 		res.json({ success: false, message: "فشل في الحذف الكلي" });
// 	}
// };

// export const markAsRead = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		await notificationsModel.findByIdAndDelete(id, { isRead: true });
// 		res.json({ success: true, message: "تم تحديد الاشعار كمقروء" });
// 	} catch (err) {
// 		res.json({ success: false, message: "فشل في التحديث" });
// 	}
// };

// export const createNotificationForOrder = async (orderData) => {
// 	try {
// 		const { userId, _id } = orderData;
// 		await notificationsModel.create({
// 			message: `تم انشاء طلب جديد برقم ${_id}`,
// 			orderId: _id,
// 			user: userId || "مستخدم مجهول",
// 		});
// 	} catch (err) {
// 		console.error("فشل في انشاء اشعار الطلب");
// 	}
// };
