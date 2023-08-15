import "./ManagerUser.css"; // Bạn có thể muốn chỉnh sửa hoặc xóa file này nếu không cần thiết

import React from "react";

const ManageUser = () => {
  // ... (Phần code không thay đổi)

  return (
    <div className="manager-order">
      <h3 className="font-bold text-center my-3">MANAGEMENT USER</h3>

      <table className="min-w-full border-t border-gray-200 divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Fullname
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-200 ">
            <td className="px-6 py-4 border border-gray-200 ">sds</td>
            <td className="px-6 py-4 border border-gray-200">sđs</td>
            <td className="px-6 py-4 border border-gray-200">sdssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">
              <button className="bg-green-500 rounded-lg px-5 py-1 text-white font-bold">
                Active
              </button>
              <button className="bg-red-500 rounded-lg px-5 py-1 text-white font-bold">
                Block
              </button>
            </td>
          </tr>
          <tr className="hover:bg-gray-200 ">
            <td className="px-6 py-4 border border-gray-200 ">sds</td>
            <td className="px-6 py-4 border border-gray-200">sđs</td>
            <td className="px-6 py-4 border border-gray-200">sdssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">
              {" "}
              <button className="bg-green-500 rounded-lg px-5 py-1 text-white font-bold">
                Active
              </button>
              <button className="bg-red-500 rounded-lg px-5 py-1 text-white font-bold">
                Block
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
