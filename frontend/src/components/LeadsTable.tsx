import { useNavigate } from "react-router-dom";
import { ChevronDown, Inbox, Mail, Phone, Trash2 } from "lucide-react";
import type { Lead, LeadStatus } from "../types/lead";

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: number, status: LeadStatus) => void;
  onDelete: (id: number) => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" },
];

const statusStyles: Record<string, { pill: string; dot: string }> = {
  new: {
    pill: "bg-blue-50 text-[#2857EC] ring-blue-100",
    dot: "bg-[#2857EC]",
  },
  contacted: {
    pill: "bg-amber-50 text-amber-700 ring-amber-100",
    dot: "bg-amber-500",
  },
  qualified: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  lost: {
    pill: "bg-rose-50 text-rose-600 ring-rose-100",
    dot: "bg-rose-500",
  },
};

const fallbackStyle = {
  pill: "bg-slate-100 text-slate-600 ring-slate-200",
  dot: "bg-slate-400",
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function LeadsTable({
  leads,
  onStatusChange,
  onDelete,
}: LeadsTableProps) {
  const navigate = useNavigate();

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F6FE] text-[#2857EC]">
          <Inbox size={22} />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-800">
          No leads found
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Add your first lead or try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="bg-[#F7F9FE] text-xs font-semibold text-slate-500">
            <th className="px-5 py-3 sm:px-6">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-5 py-3 text-right sm:px-6">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const style = statusStyles[lead.status] ?? fallbackStyle;

            return (
              <tr
                key={lead.id}
                className="transition-colors hover:bg-[#F7F9FE]/80"
              >
                <td className="px-5 py-3.5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="group flex items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#49C6FF] to-[#2857EC] text-[11px] font-bold text-white ring-2 ring-blue-50">
                      {initials(lead.name)}
                    </span>
                    <span className="font-semibold text-slate-800 transition-colors group-hover:text-[#2857EC]">
                      {lead.name}
                    </span>
                  </button>
                </td>

                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{lead.email}</span>
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2 tabular-nums text-slate-600">
                    <Phone size={14} className="shrink-0 text-slate-400" />
                    {lead.phone}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <div
                    className={`relative inline-flex items-center rounded-full ring-1 ring-inset transition focus-within:ring-2 ${style.pill}`}
                  >
                    <span
                      className={`pointer-events-none absolute left-3 h-1.5 w-1.5 rounded-full ${style.dot}`}
                    />
                    <select
                      value={lead.status}
                      aria-label={`Status for ${lead.name}`}
                      onChange={(event) =>
                        onStatusChange(
                          lead.id,
                          event.target.value as LeadStatus
                        )
                      }
                      className="cursor-pointer appearance-none rounded-full bg-transparent py-1.5 pl-6 pr-7 text-xs font-semibold outline-none"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-white text-slate-700"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={13}
                      className="pointer-events-none absolute right-2.5 opacity-70"
                    />
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => onDelete(lead.id)}
                    aria-label={`Delete ${lead.name}`}
                    title="Delete lead"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}