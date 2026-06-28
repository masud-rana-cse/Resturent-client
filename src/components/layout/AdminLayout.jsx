import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminNavbar from "../common/AdminNavbar";
import AdminHeader from "../common/AdminHeader";


export default function AdminLayout() {

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5]">
      <AdminNavbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <AdminHeader />

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
