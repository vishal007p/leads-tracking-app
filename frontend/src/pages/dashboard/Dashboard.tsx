import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Mail,
  Phone,
  AlertCircle,
  PieChart,
} from "lucide-react";
import type { Lead } from "../../types/lead";
import api from "../../services/api";

const statusStyles: Record<string, { pill: string; dot: string; bar: string }> = {
  new: {
    pill: "bg-blue-50 text-[#2857EC] ring-blue-100",
    dot: "bg-[#2857EC]",
    bar: "bg-[#2857EC]",
  },
  contacted: {
    pill: "bg-amber-50 text-amber-700 ring-amber-100",
    dot: "bg-amber-500",
    bar: "bg-amber-400",
  },
  qualified: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  lost: {
    pill: "bg-rose-50 text-rose-600 ring-rose-100",
    dot: "bg-rose-500",
    bar: "bg-rose-400",
  },
};

const fallbackStyle = {
  pill: "bg-slate-100 text-slate-600 ring-slate-200",
  dot: "bg-slate-400",
  bar: "bg-slate-300",
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/leads");
        if (!cancelled) setLeads(response.data.data);
      } catch {
        if (!cancelled) {
          setError("Unable to load leads. Please check your API server.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, []);

  const count = (status: string) =>
    leads.filter((lead) => lead.status === status).length;

  const stats = [
    {
      label: "Total leads",
      value: leads.length,
      icon: Users,
      tone: "bg-blue-50 text-[#2857EC]",
    },
    {
      label: "New leads",
      value: count("new"),
      icon: UserPlus,
      tone: "bg-sky-50 text-[#1685FF]",
    },
    {
      label: "Contacted",
      value: count("contacted"),
      icon: UserCheck,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Qualified",
      value: count("qualified"),
      icon: TrendingUp,
      tone: "bg-emerald-50 text-emerald-600",
    },
  ];

  const pipeline = [
    { key: "new", label: "New" },
    { key: "contacted", label: "Contacted" },
    { key: "qualified", label: "Qualified" },
    { key: "lost", label: "Lost" },
  ].map((s) => ({
    ...s,
    value: count(s.key),
    percent: leads.length ? Math.round((count(s.key) / leads.length) * 100) : 0,
  }));

  const recent = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#2857EC]">Welcome back</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0B1535] sm:text-[28px]">
            Dashboard overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your leads and manage your business pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/leads/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <UserPlus size={16} />
            Add lead
          </Link>
          <Link
            to="/leads"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2857EC] to-[#1685FF] px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30"
          >
            View all leads
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{label}</p>
              {loading ? (
                <div className="mt-2 h-7 w-12 animate-pulse rounded-md bg-slate-100" />
              ) : (
                <p className="mt-1 text-2xl font-bold leading-none text-[#0B1535]">
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Main grid */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent leads */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-[#0B1535]">
                Recent leads
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest leads in your pipeline
              </p>
            </div>

            <Link
              to="/leads"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2857EC] transition hover:text-[#1D46D8]"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-44 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F6FE] text-[#2857EC]">
                <Users size={22} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                No leads yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your leads will appear here when you add them.
              </p>
              <Link
                to="/leads/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#2857EC] px-4 text-sm font-semibold text-white transition hover:bg-[#1D46D8]"
              >
                <UserPlus size={16} />
                Add your first lead
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="bg-[#F7F9FE] text-xs font-semibold text-slate-500">
                    <th className="px-5 py-3 sm:px-6">Lead</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right sm:px-6">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recent.map((lead) => {
                    const style = statusStyles[lead.status] ?? fallbackStyle;

                    return (
                      <tr
                        key={lead.id}
                        className="transition-colors hover:bg-[#F7F9FE]/80"
                      >
                        <td className="px-5 py-3.5 sm:px-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-[11px] font-bold text-white ring-2 ring-blue-50">
                              {initials(lead.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800">
                                {lead.name}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                                <Mail size={12} className="shrink-0 text-slate-400" />
                                {lead.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-2 tabular-nums text-slate-600">
                            <Phone size={14} className="shrink-0 text-slate-400" />
                            {lead.phone || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${style.pill}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                            {lead.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right sm:px-6">
                          <Link
                            to={`/leads/${lead.id}`}
                            className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold text-[#2857EC] transition hover:bg-blue-50"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:sticky lg:top-[100px]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2857EC]">
                <PieChart size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#0B1535]">
                  Pipeline
                </h2>
                <p className="text-xs text-slate-500">Leads by status</p>
              </div>
            </div>

            {/* Stacked bar */}
            <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              {!loading &&
                pipeline
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <div
                      key={s.key}
                      className={statusStyles[s.key].bar}
                      style={{ width: `${s.percent}%` }}
                    />
                  ))}
            </div>

            <ul className="mt-5 space-y-3.5">
              {pipeline.map((s) => (
                <li key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 text-slate-600">
                    <span className={`h-2 w-2 rounded-full ${statusStyles[s.key].dot}`} />
                    {s.label}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {loading ? "—" : `${s.percent}%`}
                    </span>
                    <span className="w-6 text-right font-semibold text-slate-800">
                      {loading ? "—" : s.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}