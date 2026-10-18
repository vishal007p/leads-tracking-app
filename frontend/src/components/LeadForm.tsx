import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Plus } from "lucide-react";
import type { CreateLeadInput } from "../types/lead";

interface LeadFormProps {
  onSubmit: (data: CreateLeadInput) => Promise<void> | void;
  onCancel: () => void;
}

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Lost"];

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

const inputBase =
  "h-11 w-full rounded-xl border bg-[#F7F9FE] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4";
const inputOk =
  "border-slate-200 focus:border-[#2857EC]/50 focus:ring-[#2857EC]/10";
const inputErr =
  "border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-100";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13px] font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

export default function LeadForm({ onSubmit, onCancel }: LeadFormProps) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set =
    (key: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((v) => ({ ...v, [key]: e.target.value }));
        if (key in errors) setErrors((er) => ({ ...er, [key]: undefined }));
      };

  function validate(): Errors {
    const er: Errors = {};
    if (!values.name.trim()) er.name = "Full name is required.";
    if (!values.email.trim()) er.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      er.email = "Enter a valid email address.";
    if (!values.phone.trim()) er.phone = "Phone number is required.";
    else if (values.phone.replace(/\D/g, "").length < 7)
      er.phone = "Enter a valid phone number.";
    return er;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        status: values.status as CreateLeadInput["status"],
      } as CreateLeadInput);
    } catch {
      setSubmitError("Couldn’t create the lead. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            value={values.name}
            onChange={set("name")}
            placeholder="e.g. Rahul Patel"
            autoComplete="name"
            className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
          />
        </Field>

        <Field label="Email address" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={set("email")}
            placeholder="rahul@example.com"
            autoComplete="email"
            className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
          />
        </Field>

        <Field label="Phone number" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="9876543210"
            autoComplete="tel"
            className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
          />
        </Field>

        <Field label="Lead status" htmlFor="status">
          <select
            id="status"
            value={values.status}
            onChange={set("status")}
            className={`${inputBase} ${inputOk} cursor-pointer`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
        >
          {submitError}
        </p>
      )}

      {/* Footer */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2857EC] to-[#1685FF] px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 disabled:translate-y-0 disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={17} strokeWidth={2.5} />
              Create lead
            </>
          )}
        </button>
      </div>
    </form>
  );
}