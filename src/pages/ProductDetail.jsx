import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Sesuaikan path import ini dengan lokasi file JSON produk Anda
import productData from '../data/products.json';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mencari data produk dari file JSON lokal berdasarkan ID
        const foundProduct = productData.find(p => p.id === parseInt(id));

        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            setError("Data produk tidak ditemukan.");
        }
    }, [id]);

    // Fungsi tambahan untuk memformat angka menjadi format Rupiah yang rapi
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    if (error) return <div className="text-red-600 p-8 text-center font-medium">{error}</div>;
    if (!product) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 md:p-8 max-w-lg mx-auto mt-6 font-sans">
            <Link to="/product" className="text-blue-500 hover:text-blue-600 mb-6 inline-block font-medium">
                &larr; Kembali ke Daftar Produk
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Menggunakan placeholder image karena di JSON kita tidak ada link gambar thumbnail */}
                <div className="bg-gray-100 flex justify-center items-center h-56 border-b border-gray-200">
                    <img
                        src={`https://placehold.co/600x400/f3f4f6/a1a1aa?text=${encodeURIComponent(product.tittle)}`}
                        alt={product.tittle}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-6">
                    {/* Menggunakan product.tittle sesuai format JSON Anda */}
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">{product.tittle}</h2>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                            {product.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200">
                            Kode: {product.code}
                        </span>
                    </div>

                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Brand</span>
                            <span className="font-semibold text-gray-800">{product.brand}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Stok Tersedia</span>
                            <span className={`${product.stock < 10 ? 'text-red-600' : 'text-green-600'} font-semibold`}>
                                {product.stock} Unit
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Harga Retail</p>
                        <p className="text-blue-600 font-bold text-3xl">
                            {formatRupiah(product.price)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}