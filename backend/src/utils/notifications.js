// Helper functions for creating user notifications.
// Supports single notifications and bulk notifications for many recipients.
import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipientType,
  recipientId,
  title,
  message,
  link = "",
}) => {
  await Notification.create({
    recipient_type: recipientType,
    recipient_id: recipientId,
    title,
    message,
    link,
    is_read: false,
    created_at: new Date(),
  });
};

export const createBulkNotifications = async ({
  recipientType,
  recipientIds,
  title,
  message,
  link = "",
}) => {
  if (!recipientIds.length) {
    return;
  }

  await Notification.insertMany(
    recipientIds.map((recipientId) => ({
      recipient_type: recipientType,
      recipient_id: String(recipientId),
      title,
      message,
      link,
      is_read: false,
      created_at: new Date(),
    }))
  );
};
