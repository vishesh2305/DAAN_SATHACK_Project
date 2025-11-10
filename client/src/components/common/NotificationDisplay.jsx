// src/components/common/NotificationDisplay.jsx

import React from 'react';
import { useNotification } from '../../contexts/NotificationProvider';
import Notification from './Notification';

const NotificationDisplay = () => {
  const { notification, hideNotification } = useNotification();

  if (!notification.show) {
    return null;
  }

  return (
    // This positions the notification at the top-center of the screen
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </div>
  );
};

export default NotificationDisplay;