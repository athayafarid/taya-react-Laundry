import { useState } from "react";

export default function Notifications() {
  const [notifications] = useState(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const notif = orders.map((o) => ({
      id: o.id,
      message: `Order ${o.id} - ${o.status}`,
      time: new Date().toLocaleString(),
    }));

    return notif.reverse();
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifikasi</h1>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <span>{n.message}</span>
              <span className="text-gray-400 text-sm">{n.time}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Belum ada notifikasi</p>
        )}
      </div>
    </div>
  );
}
