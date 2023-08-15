import "./ManagerOrder.css"; // Bạn có thể muốn chỉnh sửa hoặc xóa file này nếu không cần thiết

import React from "react";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ManageOrder = () => {
  // ... (Phần code không thay đổi)

  return (
    <div className="manager-order p-4">
      <h3 className="font-bold text-center my-3">MANAGEMENT VERIFY ORDER</h3>
      <form className="flex justify-between items-center mb-4 .search-date-form">
        <label className="flex items-center">
          From:
          <input type="date" className="ml-2 border rounded p-1" />
        </label>
        <label className="flex items-center">
          To:
          <input type="date" className="ml-2 border rounded p-1" />
        </label>
        <button
          type="submit"
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none .search-btn"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <table className="min-w-full border-t border-gray-200 divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              User Verify
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Verification Type
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Verified Date
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Expired Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-200 ">
            <td className="px-6 py-4 border border-gray-200 ">sds</td>
            <td className="px-6 py-4 border border-gray-200">sđs</td>
            <td className="px-6 py-4 border border-gray-200">sdssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">adggfgf</td>
            <td className="px-6 py-4 border border-gray-200">xsssdsd</td>
          </tr>
          <tr className="hover:bg-gray-200 ">
            <td className="px-6 py-4 border border-gray-200 ">sds</td>
            <td className="px-6 py-4 border border-gray-200">sđs</td>
            <td className="px-6 py-4 border border-gray-200">sdssd</td>
            <td className="px-6 py-4 border border-gray-200">dsssd</td>
            <td className="px-6 py-4 border border-gray-200">adggfgf</td>
            <td className="px-6 py-4 border border-gray-200">xsssdsd</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 font-bold">Total Revenue: {"sdhksdhkh"}</div>
    </div>
  );
};

export default ManageOrder;
