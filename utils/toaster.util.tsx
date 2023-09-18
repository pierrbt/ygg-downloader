import { NotificationProps, showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";

const error = (message: string, config?: Omit<NotificationProps, "message">) =>
  showNotification({
    icon: <TbX />,
    color: "red",
    radius: "md",
    title: "Erreur",
    message: message,

    autoClose: true,

    ...config,
  });

const success = (
  message: string,
  config?: Omit<NotificationProps, "message">
) =>
  showNotification({
    icon: <TbCheck />,
    color: "green",
    radius: "md",
    title: "Succès",
    message: message,
    autoClose: true,
    ...config,
  });

const toast = {
  error,
  success,
};
export default toast;