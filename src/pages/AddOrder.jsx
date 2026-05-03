import PageHeader from "../components/PageHeader";

export default function AddOrder() {
    return (
        <div className="p-8">
            <PageHeader 
                title="Add New Order" 
                breadcrumb={["Laundry", "Orders", "Add Order"]} 
                actionLabel="Back to Orders"
                actionLink="/orders"
            />
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl animate-in fade-in duration-500">
                <form className="flex flex-col gap-6">
                    
                    {/* Menggunakan Grid agar form menjadi 2 kolom di layar desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Order ID */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Order ID</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: ORD-1031" 
                                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50" 
                                required 
                            />
                        </div>

                        {/* Order Date */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Order Date</label>
                            <input 
                                type="date" 
                                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                required 
                            />
                        </div>

                        {/* Customer Name */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Customer Name</label>
                            <input 
                                type="text" 
                                placeholder="Masukkan nama customer" 
                                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                required 
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700">Status</label>
                            <select 
                                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white" 
                                required
                            >
                                <option value="">-- Pilih Status --</option>
                                <option value="Pending">Pending (Menunggu)</option>
                                <option value="Washing">Washing (Proses Cuci/Setrika)</option>
                                <option value="Ready">Ready (Siap Diambil)</option>
                                <option value="Completed">Completed (Selesai)</option>
                                <option value="Cancelled">Cancelled (Dibatalkan)</option>
                            </select>
                        </div>
                    </div>

                    {/* Total Price (Sengaja dibuat full width) */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Total Price (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                            <input 
                                type="number" 
                                placeholder="0" 
                                className="w-full border border-gray-300 rounded-xl py-3 pr-3 pl-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
                        {/* Tombol Cancel */}
                        <button 
                            type="button" 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                        
                        {/* Tombol Submit */}
                        <button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            Save Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}