import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [orders, setOrders] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  }, []);

  const handleSearch = () => {
    const found = orders.find(
      (o) => o.id.toLowerCase() === trackingId.toLowerCase()
    );
    setResult(found || null);
  };

  return (
    <div className="p-8 bg-[#e0e5ec] min-h-screen">

      <PageHeader
        title="Tracking Status"
        breadcrumb={["Laundry", "Tracking"]}
      />

      {/* INPUT */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Masukkan ID Order (contoh: TRX123...)"
          className="p-3 rounded-xl w-full bg-[#e0e5ec] 
          shadow-[inset_6px_6px_10px_#b8bec6,inset_-6px_-6px_10px_#ffffff]
          outline-none"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="px-6 rounded-xl bg-[#e0e5ec] 
          shadow-[6px_6px_10px_#b8bec6,-6px_-6px_10px_#ffffff]
          active:scale-95"
        >
          Cek
        </button>
      </div>

      {/* RESULT */}
      {result ? (
        <div className="p-6 rounded-2xl bg-[#e0e5ec] 
        shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">

          <h2 className="text-lg font-bold mb-2">
            Order: {result.id}
          </h2>
          <p className="mb-6 text-gray-600">
            Pelanggan: {result.customer}
          </p>

          {/* PROGRESS */}
          <div className="flex items-center justify-between mb-6">
            {result.steps.map((step, index) => (
              <div key={index} className="flex-1 text-center relative">

                {/* GARIS */}
                {index !== result.steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-1 
                  ${index < result.currentStep ? "bg-green-400" : "bg-gray-300"}`} />
                )}

                {/* BULATAN */}
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white z-10 relative
                  ${index <= result.currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                    }`}
                >
                  {index + 1}
                </div>

                <p className="text-xs mt-2">{step}</p>
              </div>
            ))}
          </div>

          <p className="font-semibold">
            Status Saat Ini: {result.status}
          </p>
        </div>
      ) : (
        trackingId && (
          <p className="text-red-500">Order tidak ditemukan</p>
        )
      )}
    </div>
  );
}