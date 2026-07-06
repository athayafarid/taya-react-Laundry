import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import productData from '../data/products.json';
import { 
  MdSettings, 
  MdHandyman, 
  MdScience, 
  MdInventory2,
  MdArrowForward,
  MdSearch,
  MdCheckroom
} from "react-icons/md";

const getCategoryStyles = (category) => {
  switch (category) {
    case "Mesin":
      return {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        icon: <MdSettings size={28} />,
        accent: "from-blue-500 to-indigo-500",
      };
    case "Peralatan":
      return {
        bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        icon: <MdHandyman size={28} />,
        accent: "from-indigo-500 to-purple-500",
      };
    case "Bahan Kimia":
      return {
        bg: "bg-amber-50 text-amber-600 border-amber-100",
        icon: <MdScience size={28} />,
        accent: "from-amber-500 to-orange-500",
      };
    case "Pakaian":
      return {
        bg: "bg-purple-50 text-purple-600 border-purple-100",
        icon: <MdCheckroom size={28} />,
        accent: "from-purple-500 to-pink-500",
      };
    default: // Perlengkapan
      return {
        bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        icon: <MdInventory2 size={28} />,
        accent: "from-emerald-500 to-teal-500",
      };
  }
};

const Produk = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Mesin", "Peralatan", "Bahan Kimia", "Perlengkapan", "Pakaian"];

  // Filter products based on search and category
  const filteredProducts = productData.filter((item) => {
    const matchSearch = 
      item.tittle?.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase()) ||
      item.code?.toLowerCase().includes(search.toLowerCase());
      
    const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Daftar Produk"
        breadcrumb={["Laundry", "Products"]}
        actionLabel=""
      />

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        {/* Category Tabs */}
        <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition duration-150 cursor-pointer whitespace-nowrap
                ${selectedCategory === cat 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MdSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari nama / kode / brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* PRODUCT CARD GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const styles = getCategoryStyles(item.category);
            
            return (
              <div 
                key={item.code} 
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* Visual Header */}
                <div className="h-44 overflow-hidden relative bg-slate-150 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.tittle} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${styles.accent}`}></div>
                  )}
                  
                  {/* Category Pill Overlay */}
                  <span className="absolute top-3 left-3 bg-slate-950/60 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-white/10 backdrop-blur-md">
                    {item.category}
                  </span>
                  
                  {/* Category Visual Icon Overlay */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-slate-950/60 rounded-lg flex items-center justify-center text-white border border-white/10 shadow-inner backdrop-blur-md">
                    {React.cloneElement(styles.icon, { size: 18 })}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Brand & Code */}
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 tracking-wider mb-2">
                      <span className="uppercase">Brand: {item.brand}</span>
                      <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{item.code}</span>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition duration-150 line-clamp-2">
                      {item.tittle}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50">
                    {/* Price & Stock */}
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Harga</p>
                        <p className="text-sm font-black text-blue-600">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Stok</p>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border
                          ${item.stock <= 15 
                            ? "bg-red-50 text-red-700 border-red-150" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-150"}`}
                        >
                          {item.stock} Unit
                        </span>
                      </div>
                    </div>

                    {/* Detail Button */}
                    <Link 
                      to={`/products/${item.id}`} 
                      className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 border border-slate-200 hover:border-blue-600 rounded-2xl text-slate-600 hover:text-white font-extrabold text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition duration-150 active:scale-95 cursor-pointer"
                    >
                      Lihat Detail <MdArrowForward size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400 font-bold text-sm">
          Tidak ada produk yang cocok dengan pencarian Anda.
        </div>
      )}
    </div>
  );
};

export default Produk;