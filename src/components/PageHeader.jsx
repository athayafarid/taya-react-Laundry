import { Link } from "react-router-dom";

export default function PageHeader({
    title = "Dashboard",
    breadcrumb = ["Dashboard"],
    actionLabel = "Add New",
    actionLink = "#", // Tambahkan prop ini untuk tujuan link
}) {
    return (
        <div
            id="pageheader-container"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 animate-in fade-in duration-700"
        >
            {/* LEFT */}
            <div id="pageheader-left" className="flex flex-col gap-2">
                <h1 className="font-poppins text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                    {title}
                </h1>

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                    {breadcrumb.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span
                                className={`cursor-pointer ${
                                    index === breadcrumb.length - 1
                                        ? "text-gray-400 cursor-default"
                                        : "text-blue-600 hover:underline"
                                }`}
                            >
                                {item}
                            </span>

                            {index !== breadcrumb.length - 1 && (
                                <span className="text-gray-300">/</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT */}
            {actionLabel && (
                <div id="action-button">
                    <Link to={actionLink}>
                        <button className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-500/10 transition-all active:scale-95 cursor-pointer">
                            <span className="text-lg transition-transform group-hover:rotate-90">
                                +
                            </span>
                            {actionLabel}
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}