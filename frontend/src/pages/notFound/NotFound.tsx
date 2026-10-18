
import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-[#2857EC]">
          <SearchX size={38} />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[3px] text-[#2857EC]">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0B1535]">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2857EC] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={17} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
