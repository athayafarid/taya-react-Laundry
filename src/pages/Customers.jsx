import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
import { Button, Card, Input, Badge, Table } from "../components/Anatomy";
import { supabase } from "../lib/supabase";

// DATA AWAL
const initialCustomers = [
  { id: 1, name: "Andi Saputra", email: "andi@example.com", phone: "081234567801", loyalty: "Gold" },
  { id: 2, name: "Budi Santoso", email: "budi@example.com", phone: "081234567802", loyalty: "Silver" },
  { id: 3, name: "Citra Lestari", email: "citra@example.com", phone: "081234567803", loyalty: "Bronze" },
  { id: 4, name: "Dewi Anggraini", email: "dewi@example.com", phone: "081234567804", loyalty: "Gold" },
  { id: 5, name: "Eko Prasetyo", email: "eko@example.com", phone: "081234567805", loyalty: "Silver" },
  { id: 6, name: "Fina Melati", email: "fina@example.com", phone: "081234567806", loyalty: "Bronze" },
  { id: 7, name: "Gilang Ramadhan", email: "gilang@example.com", phone: "081234567807", loyalty: "Silver" },
  { id: 8, name: "Hani Safitri", email: "hani@example.com", phone: "081234567808", loyalty: "Gold" },
  { id: 9, name: "Indra Wijaya", email: "indra@example.com", phone: "081234567809", loyalty: "Bronze" },
  { id: 10, name: "Joko Anwar", email: "joko@example.com", phone: "081234567810", loyalty: "Silver" },
];

const getLoyaltyBadge = (loyalty) => {
  switch (loyalty) {
    case "Gold":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Silver":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "Bronze":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
  getCustomers();
}, []);

const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setCustomers(data);
};

  return (
    <div className="p-8">
      <PageHeader
        title="Customers"
        breadcrumb={["Laundry", "Customers"]}
        actionLabel="Add Customer"
        actionTo="/add-customer"
      />

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left min-w-max">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="p-4">Nama</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Loyalty</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-blue-50">
                <td className="p-4 font-semibold">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getLoyaltyBadge(c.loyalty)}`}>
                    {c.loyalty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}