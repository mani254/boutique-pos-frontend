// Notification.js
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { hideNotification } from "../../redux/notification/notificationActions";

function Notification({ notifications, hideNotification }) {
  useEffect(() => {
    const timeoutIds = notifications.map((notification) =>
      setTimeout(() => hideNotification(notification.id), 3500),
    );
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [notifications, hideNotification]);

  const handleHide = (id) => {
    hideNotification(id);
  };

  return (
    <>
      {notifications.length > 0 && (
        <div
          className="absolute bottom-20 left-1/2 inline-block -translate-x-1/2 rounded-md bg-gray-900 bg-opacity-90 p-2"
          style={{ zIndex: 100 }}
        >
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="flex items-center text-sm"
              style={{
                marginTop:
                  index === notifications.length - 1
                    ? "0px"
                    : index === notifications.length - 2
                      ? "5px"
                      : "8px",
              }}
            >
              <p className="mr-2 text-sm text-white">{notification.message}</p>
              <span
                className="cursor-pointer text-lg text-white"
                onClick={() => handleHide(notification.id)}
              >
                <IoIosCloseCircleOutline />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  hideNotification: (id) => dispatch(hideNotification(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
