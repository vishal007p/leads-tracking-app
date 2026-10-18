import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F3F6FE] text-slate-900 antialiased">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAddLead={() => {
          setSidebarOpen(false);
          navigate("/leads/new");
        }}
      />

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <Topbar
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-8 pt-[88px] sm:px-6 sm:pt-[100px] lg:px-8 lg:pb-10 lg:pt-[112px]">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  );
}