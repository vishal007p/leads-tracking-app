
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { RefreshCw, Users } from "lucide-react";
import type { Lead, LeadStatus } from "../../types/lead";
import api from "../../services/api";
import LeadsTable from "../../components/LeadsTable";



interface LayoutContext {
  search: string;
  setSearch: (value: string) => void;
}

export default function Leads() {
  const { search, setSearch } = useOutletContext<LayoutContext>();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leads");
      const data = response?.data?.data;
      setLeads(data);
    } catch {
      setError("Unable to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        [
          lead.name,
          lead.email,
          lead.phone ?? "",
          lead.phone ?? "",
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        status === "all" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  async function handleStatusChange(
    id: number,
    nextStatus: LeadStatus
  ) {
    const previousLeads = leads;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id ? { ...lead, status: nextStatus } : lead
      )
    );

    try {
      await api.patch(`/leads/${id}`, { status: nextStatus });
    } catch {
      setLeads(previousLeads);
      setError("Could not update lead status.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    const previousLeads = leads;

    setLeads((current) => current.filter((lead) => lead.id !== id));

    try {
      await api.delete(`/leads/${id}`);
    } catch {
      setLeads(previousLeads);
      setError("Could not delete this lead.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-[#2857EC]">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700">All Leads</span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-[#0B1535]">
            All Leads
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View, search and manage your leads.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Leads</p>
          <p className="mt-2 text-2xl font-bold text-[#0B1535]">
            {leads.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Matching Leads</p>
          <p className="mt-2 text-2xl font-bold text-[#2857EC]">
            {filteredLeads.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Qualified Leads</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {leads.filter((lead) => lead.status === "qualified").length}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#0B1535]">
              <Users size={20} className="text-[#2857EC]" />
              Lead Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredLeads.length} lead(s) found
            </p>
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-[#2857EC]"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={36} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No matching leads found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the search or status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("all");
              }}
              className="mt-4 text-sm font-semibold text-[#2857EC] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <LeadsTable
            leads={filteredLeads}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
