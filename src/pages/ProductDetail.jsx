import { useParams, Link } from "react-router-dom";
import productData from '../data/products.json';
import { 
  MdArrowBack, 
  MdLayers, 
  MdLoyalty, 
  MdOutbox, 
  MdCheckCircle, 
  MdWarning,
  MdShoppingCart,
  MdVerified,
  MdShield
} from "react-icons/md";

// Deskripsi produk dinamis
const getDynamicDescription = (product) => {
  if (product.category === "Pakaian") {
    return `Pakaian premium dari brand ${product.brand} yang dirancang khusus untuk kenyamanan maksimal Anda. Menggunakan serat katun pilihan dengan sirkulasi udara yang baik (breathable), warna tahan lama tidak mudah pudar meskipun dicuci berulang kali, dan memiliki jahitan presisi super rapi. Sangat cocok dipakai untuk aktivitas santai maupun semi-formal sehari-hari.`;
  }
  if (product.category === "Mesin") {
    return `Mesin operasional laundry profesional dari ${product.brand}. Dilengkapi dengan motor penggerak heavy-duty berteknologi mutakhir yang hemat energi, tangguh untuk durasi pemakaian terus menerus (commercial-grade), serta mudah dalam perawatan berkala. Pilihan investasi terbaik untuk menunjang produktivitas dan kapasitas cuci bisnis laundry Anda.`;
  }
  if (product.category === "Bahan Kimia") {
    return `Bahan formula konsentrat tinggi dari ${product.brand} yang diformulasikan secara khusus untuk hasil cuci pakaian bersih cemerlang. Sangat ampuh membersihkan kotoran membandel hingga ke serat kain terkecil, memberikan keharuman eksklusif yang tahan lama hingga berhari-hari, serta 100% aman untuk segala jenis warna kain dan lembut di tangan.`;
  }
  return `Produk pendukung operasional terbaik dari ${product.brand}. Dibuat menggunakan material bermutu tinggi dengan desain ergonomis untuk mempercepat efisiensi kerja staf laundry Anda. Awet, tidak mudah rusak, dan dirancang khusus sesuai dengan kebutuhan penanganan cucian harian skala bisnis.`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = productData.find(p => p.id === parseInt(id));
  const error = product ? null : "Data produk tidak ditemukan.";

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleOrderPlaceholder = () => {
    alert("Produk ini hanya untuk inventori internal. Hubungi manajer operasional untuk pengajuan pemesanan tambahan.");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Glow blobs in background */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center max-w-sm shadow-xl relative z-10">
          <p className="text-red-500 font-extrabold mb-4">{error}</p>
          <Link to="/product" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md">
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center text-xs font-bold text-slate-400">Loading...</div>;

  const desc = getDynamicDescription(product);

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* GLOW BACKGROUND BLOBS */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-orange-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">
        
        {/* PREMIUM PILL BACK BUTTON */}
        <div className="mb-6 flex justify-start">
          <Link 
            to="/product" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-600 rounded-full text-xs font-extrabold transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <MdArrowBack size={16} /> Kembali ke Daftar Produk
          </Link>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white rounded-[40px] border border-slate-100/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[500px]">
          
          {/* Left Side: Product Image & Badges */}
          <div className="md:col-span-5 h-80 md:h-auto bg-slate-100 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100/50">
            {product.image ? (
              <img
                src={product.image}
                alt={product.tittle}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white p-6">
                <span className="text-sm font-black uppercase tracking-wider text-center">{product.category}</span>
              </div>
            )}
            
            {/* Category Pill Overlay */}
            <span className="absolute top-6 left-6 bg-slate-950/70 text-white text-[9px] font-black px-3.5 py-2 rounded-xl uppercase tracking-wider border border-white/10 backdrop-blur-md shadow-sm">
              {product.category}
            </span>

            {/* Code Badge Overlay */}
            <span className="absolute bottom-6 left-6 bg-white/95 text-slate-700 text-[10px] font-mono px-3.5 py-2 rounded-xl font-black border border-slate-250/20 shadow-md backdrop-blur-md">
              CODE: {product.code}
            </span>
          </div>

          {/* Right Side: Specifications, Description & Order Bar */}
          <div className="p-8 md:p-10 md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Product Brand */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                  {product.brand} Official
                </span>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border flex items-center gap-1
                  ${product.stock <= 15 
                    ? "bg-red-50 text-red-700 border-red-150" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-150"}`}
                >
                  {product.stock <= 15 ? <MdWarning size={12} /> : <MdCheckCircle size={12} />}
                  {product.stock <= 15 ? "Stok Terbatas" : "Ready Stock"}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {product.tittle}
              </h2>

              {/* TRUST BADGES (Removes "plain" feel) */}
              <div className="flex gap-2 mb-5">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                  <MdVerified size={12} /> ORIGINAL BRAND
                </span>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                  <MdShield size={12} /> GARANSI RESMI
                </span>
              </div>

              {/* Product Dynamic Description */}
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">
                {desc}
              </p>

              {/* Specifications Block */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-150/40 text-xs font-bold text-slate-500">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
                  <span className="flex items-center gap-1.5"><MdLoyalty size={16} className="text-slate-400" /> Brand Produsen</span>
                  <span className="font-black text-slate-900">{product.brand}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
                  <span className="flex items-center gap-1.5"><MdLayers size={16} className="text-slate-400" /> Kategori Inventori</span>
                  <span className="font-black text-slate-900">{product.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><MdOutbox size={16} className="text-slate-400" /> Stok Inventori</span>
                  <span className="font-black text-slate-900">{product.stock} Unit</span>
                </div>
              </div>
            </div>

            {/* Price & Action Order Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Harga Retail</p>
                <p className="text-blue-600 font-black text-3xl tracking-tight">
                  {formatRupiah(product.price)}
                </p>
              </div>

              <button
                onClick={handleOrderPlaceholder}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <MdShoppingCart size={16} /> Ajukan Restok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
