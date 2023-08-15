import "./NotificationComponent.css";

import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Images } from "../../Assets/images";

const NotificationComponent = () => {
  const [activeTab, setActiveTab] = useState("All");
  //   const [notifications, setNotifications] = useState([]);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Hàm hỗ trợ để định dạng thời gian đăng bài post
  const formatTimestamp = (timestamp: string | Date): string => {
    // console.log(timestamp);
    const date = moment(timestamp); // Tạo đối tượng moment từ timestamp
    const now = moment(); // Đối tượng moment hiện tại

    if (now.diff(date, "days") < 1) {
      // Nếu chưa đủ 1 ngày
      return date.fromNow(); // Hiển thị dưới dạng "x phút trước", "vài giây trước",...
    } else {
      return date.format("DD/MM/YYYY"); // Hiển thị dưới dạng "ngày/tháng"
    }
  };

  return (
    <div className="notifications-container border border-gray">
      <h4 className="p-2 font-bold text-xl">Notifications</h4>
      <div className="notification-menu">
        <div
          className={`menu-item ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          All
        </div>
        <div
          className={`menu-item ${activeTab === "Verified" ? "active" : ""}`}
          onClick={() => handleTabClick("Verified")}
        >
          Verified
        </div>
        <div
          className={`menu-item ${activeTab === "Mention" ? "active" : ""}`}
          onClick={() => handleTabClick("Mention")}
        >
          Mention
        </div>
      </div>

      {/* {notifications.map((noti) => ( */}
      <div className="notification">
        {/* {noti.type === "like" ? ( */}
        <>
          <Link to={`/profile/id`} className="avatar">
            <img src={Images.Notfound} alt="Avatar" />
          </Link>
          <div className="notification-content">
            <Link to={`/profile/id`} className="header nav-link">
              <span className="fullname">Thái Thị Nhàn</span>{" "}
              <span className="username">@NhanThai</span>
              <span className="date">{formatTimestamp(new Date())}</span>
            </Link>
            <div className="content">
              {/* {noti.type} */}
              <Link to={`/post-detail/id`} className="mx-2">
                your tweet
              </Link>
            </div>
          </div>
        </>
        {/* ) : ( */}
        {/* <>
          <div className="avatar">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553"
              alt="Avatar"
            />
          </div>
          <div className="notification-content">
            <div className="content">
              You Registered Twitter Successfully !!!
            </div>
          </div>
        </> */}
        {/* )} */}
      </div>
      {/* ))} */}
    </div>
  );
};

export default NotificationComponent;
