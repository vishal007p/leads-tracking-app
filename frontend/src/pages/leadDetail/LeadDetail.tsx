import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronRight,
    Hash,
    Loader2,
    Mail,
    Phone,
    RefreshCw,
    SearchX,
} from "lucide-react";
import type { Lead, LeadStatus } from "../../types/lead";
import api from "../../services/api";

const unwrapLead = (payload: any): Lead | null => {
    const candidate = payload?.lead ?? payload?.data ?? payload;
    return candidate && typeof candidate === "object" && "id" in candidate
        ? (candidate as Lead)
        : null;
};

const statuses: { value: LeadStatus; label: string; hint: string }[] = [
    { value: "new", label: "New", hint: "Just added, not contacted yet" },
    { value: "contacted", label: "Contacted", hint: "Reached out to the lead" },
    { value: "qualified", label: "Qualified", hint: "Good fit, ready to move on" },
    { value: "lost", label: "Lost", hint: "No longer interested" },
];

const statusStyles: Record<string, { pill: string; dot: string }> = {
    new: { pill: "bg-blue-50 text-[#2857EC] ring-blue-100", dot: "bg-[#2857EC]" },
    contacted: { pill: "bg-amber-50 text-amber-700 ring-amber-100", dot: "bg-amber-500" },
    qualified: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-100", dot: "bg-emerald-500" },
    lost: { pill: "bg-rose-50 text-rose-600 ring-rose-100", dot: "bg-rose-500" },
};

const fallbackStyle = {
    pill: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
};

const initials = (name?: string) =>
    (name ?? "")
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const card =
    "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]";

export default function LeadDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchLead = useCallback(async () => {
        if (!id || id === "new") return;

        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/leads/${id}`);
            const found = unwrapLead(response.data);

            if (!found) throw new Error("Unexpected response");
            setLead(found);
        } catch {
            setLead(null);
            setError("Unable to load this lead. It may not exist.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchLead();
    }, [fetchLead]);

    async function handleStatusChange(nextStatus: LeadStatus) {
        if (!lead || nextStatus === lead.status || saving) return;

        const previousStatus = lead.status;

        setLead({ ...lead, status: nextStatus });
        setSaving(true);
        setError("");

        try {
            const response = await api.patch(`/leads/${lead.id}`, {
                status: nextStatus,
            });

            const updated = unwrapLead(response.data);

            if (updated) setLead(updated);
        } catch {
            setLead({ ...lead, status: previousStatus });
            setError("Could not update the lead status.");
        } finally {
            setSaving(false);
        }
    }

    /* ---------- Loading (first load only) ---------- */
    if (loading && !lead) {
        return (
            <div className="space-y-6">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200/70" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className={`${card} h-72 animate-pulse`} />
                    <div className={`${card} h-72 animate-pulse`} />
                </div>
            </div>
        );
    }

    /* ---------- Not found ---------- */
    if (!lead) {
        return (
            <div className={`${card} mx-auto mt-6 max-w-lg px-6 py-14 text-center`}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F6FE] text-[#2857EC]">
                    <SearchX size={22} />
                </div>
                <h1 className="mt-4 text-lg font-bold text-[#0B1535]">Lead not found</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                    {error || "The requested lead could not be found."}
                </p>
                <Link
                    to="/leads"
                    className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2857EC] to-[#1685FF] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
                >
                    <ArrowLeft size={16} />
                    Back to leads
                </Link>
            </div>
        );
    }

    const current = statusStyles[lead.status] ?? fallbackStyle;
    const currentLabel =
        statuses.find((s) => s.value === lead.status)?.label ?? lead.status;

    return (
        <div className="space-y-6">
            {/* Breadcrumb + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <nav className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Link to="/" className="transition hover:text-[#2857EC]">
                        Dashboard
                    </Link>
                    <ChevronRight size={12} />
                    <Link to="/leads" className="transition hover:text-[#2857EC]">
                        All Leads
                    </Link>
                    <ChevronRight size={12} />
                    <span className="font-medium text-slate-700">{lead.name}</span>
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchLead}
                        disabled={loading}
                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/leads")}
                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#2857EC]"
                    >
                        <ArrowLeft size={16} />
                        Back to Leads
                    </button>
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                {/* ---------- Left: profile ---------- */}
                <section className={`${card} overflow-hidden`}>
                    <div className="h-1 bg-gradient-to-r from-[#2857EC] via-[#1685FF] to-[#49C6FF]" />

                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-xl font-bold text-white shadow-lg shadow-blue-600/20 ring-4 ring-blue-50">
                                {initials(lead.name)}
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-bold tracking-tight text-[#0B1535]">
                                    {lead.name}
                                </h1>
                                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                    <Hash size={13} />
                                    Lead ID {lead.id}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${current.pill}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
                            {currentLabel}
                        </span>
                    </div>

                    <div className="border-t border-slate-100 p-5 sm:p-8">
                        <h2 className="text-sm font-semibold text-[#0B1535]">
                            Contact information
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {/* Email */}
                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F7F9FE] p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2857EC] shadow-sm">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500">Email</p>
                                    {lead.email ? (
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="mt-1 block break-all text-sm font-semibold text-slate-800 transition hover:text-[#2857EC]"
                                        >
                                            {lead.email}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-400">Not provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F7F9FE] p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2857EC] shadow-sm">
                                    <Phone size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500">Phone</p>
                                    {lead.phone ? (
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="mt-1 block text-sm font-semibold tabular-nums text-slate-800 transition hover:text-[#2857EC]"
                                        >
                                            {lead.phone}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-400">Not provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ---------- Right: status ---------- */}
                <aside className={`${card} p-5 lg:sticky lg:top-[100px]`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[#0B1535]">
                            Lead status
                        </h2>
                        {saving && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                <Loader2 size={13} className="animate-spin" />
                                Saving...
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Update where this lead is in your pipeline.
                    </p>

                    <div
                        role="radiogroup"
                        aria-label="Lead status"
                        className="mt-4 space-y-2"
                    >
                        {statuses.map((item) => {
                            const active = lead.status === item.value;
                            const style = statusStyles[item.value];

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    disabled={saving}
                                    onClick={() => handleStatusChange(item.value)}
                                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${active
                                            ? "border-[#2857EC]/40 bg-blue-50/60 ring-2 ring-[#2857EC]/10"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                >
                                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold text-slate-800">
                                            {item.label}
                                        </span>
                                        <span className="block text-xs text-slate-500">
                                            {item.hint}
                                        </span>
                                    </span>
                                    {active && (
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2857EC] text-white">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
}