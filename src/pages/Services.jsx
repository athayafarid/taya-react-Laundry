import { useState, useEffect } from "react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("services")) || [];
    setServices(data);
  }, []);

  const addService = () => {
    if (!name || !price) return alert("Isi semua field!");
    if (price <= 0) return alert("Harga harus lebih dari 0!");

    const newService = {
      id: Date.now(),
      name,
      price: Number(price), // 🔥 FIX penting
    };

    const updated = [...services, newService];
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));

    setName("");
    setPrice("");
  };

  const deleteService = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Layanan & Harga</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nama layanan"
            className="border rounded-xl p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Harga (per kg)"
            className="border rounded-xl p-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={addService}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            Tambah Layanan
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Layanan</th>
              <th>Harga / Kg</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-4">{s.name}</td>
                  <td>Rp {s.price}</td>
                  <td className="text-center">
                    <button
                      onClick={() => deleteService(s.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-400">
                  Belum ada layanan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}