import { createContext, useContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import NotificationModal from "@/components/common/NotificationModal";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success", // "success" or "error"
    message: "",
  });

  const showNotification = useCallback((type, message, duration = 3000) => {
    setNotification({
      isOpen: true,
      type,
      message,
      duration,
    });
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showNotification("success", message, duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    showNotification("error", message, duration);
  }, [showNotification]);

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const contextValue = useMemo(
    () => ({ showSuccess, showError, showNotification }),
    [showSuccess, showError, showNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        duration={notification.duration}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

