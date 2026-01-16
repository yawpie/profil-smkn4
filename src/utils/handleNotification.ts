import { Notification } from "@/types/Notification";
export const handleNotification = (
  notification: Notification | null,
  setNotification: (notification: Notification | null) => void
) => {
  if (notification?.type === "error") {
    alert("Error: " + notification.message);
  } else if (notification?.type === "success") {
    alert(notification.message);
  }
  setNotification(null);
};
