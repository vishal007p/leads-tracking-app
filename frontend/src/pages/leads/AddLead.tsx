import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  UserPlus,
  Mail,
  Phone,
  Tags,
  ShieldCheck,
} from "lucide-react";

import LeadForm from "../../components/LeadForm";
import api from "../../services/api";
import type { CreateLeadInput } from "../../types/lead";

const tips = [
  {
    icon: Mail,
    title: "Use a valid email",
    text: "It’s how you’ll follow up, so double-check the spelling.",
  },
  {
    icon: Phone,
    title: "Include the country code",
    text: "Makes calling or messaging the lead easier later.",
  },
  {
    icon: Tags,
    title: "Set the right status",
    text: "New leads start as “New”. Update it as you make progress.",
  },
];

export default function AddLead() {
  const navigate = useNavigate();

  async function handleCreateLead(data: CreateLeadInput) {
    await api.post("/leads", data);
    navigate("/leads");
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + back */}
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
          <span className="font-medium text-slate-700">Add Lead</span>
        </nav>

        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#2857EC]"
        >
          <ArrowLeft size={16} />
          Back to Leads
        </button>
      </div>

      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2857EC] to-[#1685FF] text-white shadow-lg shadow-blue-600/20">
          <UserPlus size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1535] sm:text-[28px]">
            Add New Lead
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the details below to create a new lead.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Form card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="h-1 bg-gradient-to-r from-[#2857EC] via-[#1685FF] to-[#49C6FF]" />
          <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
            <h2 className="text-base font-semibold text-[#0B1535]">
              Lead details
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Fields marked as required must be filled in.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <LeadForm
              onSubmit={handleCreateLead}
              onCancel={() => navigate("/leads")}
            />
          </div>
        </section>

        {/* Side tips */}
        <aside className="space-y-4 lg:sticky lg:top-[100px]">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#172957] to-[#0B1535] p-5 text-white shadow-lg shadow-blue-900/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#49C6FF]/10 text-[#49C6FF]">
              <ShieldCheck size={19} />
            </div>
            <h3 className="mt-3 text-sm font-semibold">Quick tips</h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              A complete lead is easier to follow up on.
            </p>

            <ul className="mt-4 space-y-4">
              {tips.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-[#49C6FF]">
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-400">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}