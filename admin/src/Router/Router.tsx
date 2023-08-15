import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../Components/Login/Login";
import ManageOrder from "../Components/ManagerOrder/ManagerOrder";
import ManageTweets from "../Components/ManagerTweets/ManagerTweets";
import ManageUser from "../Components/ManagerUser/ManagerUser";
import AuthLayOut from "../Layout/Auth/Auth";
import Content from "../Layout/Content/Content";

const Router = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayOut />}>
        <Route path="login" index element={<Login />} />
      </Route>
      <Route path="/" element={<Content />}>
        <Route path="" index element={<ManageOrder />} />
        <Route path="manager-user" index element={<ManageUser />} />
        <Route path="manager-tweets" index element={<ManageTweets />} />
      </Route>
    </Routes>
  );
};

export default Router;
