
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    ChartNoAxesCombined,
    Settings,
    HelpCircle,
    X,
    Zap,
    LogOut,
    ChevronRight,
} from "lucide-react";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    onAddLead: () => void;
}

const navigation = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/",
                icon: LayoutDashboard,
                end: true,
            },
            {
                label: "All Leads",
                path: "/leads",
                icon: Users,
                end: false,
            },
            {
                label: "Analytics",
                path: "/analytics",
                icon: ChartNoAxesCombined,
                end: false,
            },
        ],
    },
    {
        title: "PREFERENCES",
        items: [
            {
                label: "Settings",
                path: "/settings",
                icon: Settings,
                end: false,
            },
            {
                label: "Help & Support",
                path: "/help",
                icon: HelpCircle,
                end: false,
            },
        ],
    },
];

export default function Sidebar({
    open,
    onClose,
    onAddLead,
}: SidebarProps) {
    const location = useLocation();

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-[#07122F]/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50
          flex w-[260px] flex-col
          border-r border-white/10
          bg-[#0B1535] text-white
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
            >
                <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/10 px-6">
                    <NavLink
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1685FF] to-[#2857EC] shadow-lg shadow-blue-500/20">
                            <Zap size={23} strokeWidth={2.5} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                Lead<span className="text-[#49C6FF]">Flow</span>
                            </h1>
                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[2px] text-slate-400">
                                CRM Workspace
                            </p>
                        </div>
                    </NavLink>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-5 pb-5 pt-6">
                    <button
                        type="button"
                        onClick={onAddLead}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2857EC] to-[#1685FF] px-4 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30"
                    >
                        <UserPlus size={18} />
                        <span>Add New Lead</span>
                    </button>
                </div>

                <nav className="flex-1 space-y-7 overflow-y-auto px-4 pb-5">
                    {navigation.map((section) => (
                        <div key={section.title}>
                            <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-slate-500">
                                {section.title}
                            </p>

                            <div className="space-y-1.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    const isActive =
                                        item.path === "/"
                                            ? location.pathname === "/"
                                            : location.pathname === item.path ||
                                            location.pathname.startsWith(
                                                `${item.path}/`
                                            );

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            end={item.end}
                                            onClick={onClose}
                                            className={({ isActive: routeActive }) =>
                                                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all ${routeActive || isActive
                                                    ? "bg-[#2857EC]/20 text-white"
                                                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                                                }`
                                            }
                                        >
                                            {({ isActive: routeActive }) => (
                                                <>
                                                    {(routeActive || isActive) && (
                                                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#49C6FF]" />
                                                    )}

                                                    <Icon
                                                        size={19}
                                                        strokeWidth={1.8}
                                                        className={
                                                            routeActive || isActive
                                                                ? "text-[#49C6FF]"
                                                                : "text-slate-400 transition-colors group-hover:text-white"
                                                        }
                                                    />

                                                    <span className="flex-1">
                                                        {item.label}
                                                    </span>

                                                    {item.label === "All Leads" && (
                                                        <ChevronRight
                                                            size={15}
                                                            className="text-slate-500"
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                           <div className="mx-4 mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#172957] to-[#111D40] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#49C6FF]/10 text-[#49C6FF]">
                        <Zap size={19} />
                    </div>

                    <h3 className="text-sm font-semibold">Grow your business</h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                        Manage your leads and track your progress in one place.
                    </p>
                </div>

                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.05]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-sm font-bold text-white">
                            VP
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                Vishal Prajapati
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-400">
                                Frontend Developer
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Logout"
                            title="Logout"
                            onClick={() => {
                                console.log("Connect your logout logic here");
                            }}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        >
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
