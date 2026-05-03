export default function PageHeader({
    title = "Dashboard Laundry",
    breadcrumb = ["Laundry", "Dashboard"],
    actionLabel = "Tambah Pesanan",
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
                                        : "text-blue-600 hover:underline" // Mengubah warna hover text ke biru
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
            <div id="action-button">
                {/* Mengubah warna tombol dan bayangan ke biru agar identik dengan air/kebersihan */}
                <button className="group flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <span className="text-lg transition-transform group-hover:rotate-90">
                        +
                    </span>
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}