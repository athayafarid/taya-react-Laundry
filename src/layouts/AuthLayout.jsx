import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-4xl font-poppins font-extrabold text-gray-800">
                        {/* Mengganti Sedap menjadi Bilas */}
                        <span className="text-black">Bilas</span>
                        {/* Mengganti titik hijau menjadi titik biru */}
                        <span className="text-blue-600">.</span>
                    </h1>
                </div>

                <Outlet/>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {/* Menyesuaikan teks copyright ke tema Laundry dan tahun 2026 */}
                    © 2026 Bilas Laundry Admin Dashboard. All rights
                    reserved.
                </p>
            </div>
        </div>
    )
}