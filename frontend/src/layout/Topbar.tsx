import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  Plus,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Command,
  X,
  CheckCircle2,
} from "lucide-react";

interface TopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

export default function Topbar({
  search,
  onSearchChange,
  onMenuClick,
}: TopbarProps) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileSearchOpen(false);
      }
      // Cmd/Ctrl + K focuses search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth < 640) {
          setMobileSearchOpen(true);
        } else {
          searchRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) mobileSearchRef.current?.focus();
  }, [mobileSearchOpen]);

  const goTo = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.02),0_8px_24px_-12px_rgba(40,87,236,0.12)] backdrop-blur-xl lg:left-[260px]">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:h-[76px] lg:px-8">
        {mobileSearchOpen ? (
          <div className="flex w-full items-center gap-2 sm:hidden">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={mobileSearchRef}
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search leads, contacts..."
                aria-label="Search leads and contacts"
                className="h-11 w-full rounded-xl border border-[#2857EC]/40 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none ring-4 ring-[#2857EC]/10 placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2857EC] hover:bg-blue-50"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open navigation menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 lg:hidden"
              >
                <Menu size={20} />
              </button>

              =              <div className="group relative hidden w-full max-w-[460px] sm:block">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#2857EC]"
                />
                <input
                  ref={searchRef}
                  type="search"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search leads, contacts..."
                  aria-label="Search leads and contacts"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#F7F9FE] pl-11 pr-20 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#2857EC]/50 focus:bg-white focus:ring-4 focus:ring-[#2857EC]/10 [&::-webkit-search-cancel-button]:hidden"
                />

                {search ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
                  >
                    <X size={15} />
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 font-sans text-[10px] font-medium text-slate-400 shadow-sm md:flex">
                    <Command size={10} />K
                  </kbd>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Open search"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 sm:hidden"
              >
                <Search size={19} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/leads/new")}
                aria-label="Add lead"
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2857EC] to-[#1685FF] px-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 active:translate-y-0 sm:px-4"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="hidden sm:inline">Add Lead</span>
              </button>

              <div ref={notifRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition active:scale-95 ${notificationsOpen
                      ? "border-blue-200 bg-blue-50 text-[#2857EC]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Bell size={19} />
                  <span className="absolute right-[10px] top-[9px] h-2 w-2 rounded-full border-2 border-white bg-[#FF6B6B]" />
                </button>

                {notificationsOpen && (
                  <div className="fixed inset-x-4 top-[72px] z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:absolute sm:inset-x-auto sm:right-0 sm:top-[52px] sm:w-[340px]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        aria-label="Close notifications"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-[#F5F8FF] p-3.5">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#2857EC] shadow-sm">
                        <CheckCircle2 size={17} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          You’re all caught up
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          New lead updates and activity will appear here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotificationsOpen(false);
                  }}
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                  className={`flex items-center gap-2.5 rounded-xl p-1 transition sm:py-1.5 sm:pl-1.5 sm:pr-2 ${profileOpen ? "bg-slate-100" : "hover:bg-slate-50"
                    }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-xs font-bold text-white ring-2 ring-blue-100">
                    VP
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="text-[13px] font-semibold leading-tight text-slate-800">
                      Vishal Prajapati
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                      Administrator
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-slate-400 transition-transform sm:block ${profileOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[52px] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                    <div className="mb-1 flex items-center gap-3 rounded-xl bg-[#F5F8FF] px-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-xs font-bold text-white">
                        VP
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          Vishal Prajapati
                        </p>
                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => goTo("/settings")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#2857EC]"
                    >
                      <User size={17} />
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => goTo("/settings")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-[#2857EC]"
                    >
                      <Settings size={17} />
                      Settings
                    </button>

                    <div className="my-1 h-px bg-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        console.log("Connect your logout logic here");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}