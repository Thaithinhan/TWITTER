import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import Auth from "../Layouts/Auth/Auth";
import Home from "../Layouts/Home/Home";
import MessagesLayout from "../Layouts/Messages/Messages";
import Notification from "../Layouts/Notifications/Notification";
import Profile from "../Layouts/Profile/Profile";
import TweetDetail from "../Layouts/TweetDetail/TweetDetail";
import NotFound from "../Pages/Notfound/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route path="login" index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post-detail/:id" element={<TweetDetail />} />{" "}
      <Route path="/notifications" element={<Notification />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/messages" element={<MessagesLayout />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default Router;
