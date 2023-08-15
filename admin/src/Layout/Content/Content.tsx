import React from "react";
import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <div className="content mx-4 p-4 flex-1">
      <Outlet />
    </div>
  );
};

export default Content;
