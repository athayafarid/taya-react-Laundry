import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

export default function PageHeader({
  title = "Dashboard",
  breadcrumb = ["Dashboard"],
  actionLabel = "Add New",
  actionLink = "#",
  description = "",
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 rounded-[28px] border border-white bg-white/80 p-5 shadow-sm shadow-slate-200/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em]">
          {breadcrumb.map((item, index) => (
            <div key={item + index} className="flex items-center gap-2">
              <span
                className={
                  index === breadcrumb.length - 1
                    ? "text-slate-400"
                    : "text-blue-600"
                }
              >
                {item}
              </span>
              {index !== breadcrumb.length - 1 && (
                <span className="text-slate-300">/</span>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <MdAdd size={20} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
