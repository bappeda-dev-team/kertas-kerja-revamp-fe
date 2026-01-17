"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api } from '../../lib/axios';
import './treeflex.css';
import Pohon from '@/components/Pohon';
import { PohonKinerja, TematikItem } from '@/app/pohon-kinerja/types';

import Sidebar from "@/components/layout/Sidebar"; 
import PageHeader from "@/components/layout/PageHeader"; 
import { AlertNotification } from '@/components/global/Alert';

const PohonKinerjaContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [listTematik, setListTematik] = useState<TematikItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleted, setDeleted] = useState(false);

    // --- STATE UNTUK MODAL DELETE ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const pohonIdParam = searchParams.get('pohon_id');
        if (pohonIdParam) {
            setSelectedId(Number(pohonIdParam));
        } else {
            setSelectedId(null);
            setTreeData(null);
        }
    }, [searchParams]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        const params = new URLSearchParams(searchParams);

        if (newId) {
            params.set('pohon_id', newId);
        } else {
            params.delete('pohon_id');
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    // 1. Fungsi yang dipanggil saat tombol Delete ditekan (Hanya buka modal)
    const confirmDelete = (id: number | string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    // 2. Fungsi Eksekusi Hapus (Dipanggil saat klik "Ya" di modal)
    const handleDeleteExecute = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const response = await api.delete(`/pohon-kinerja/${deleteId}`);

            if (response.success) {
                AlertNotification("Berhasil", "Data Pohon Berhasil Dihapus", "success", 1000);
                setDeleted(prev => !prev);
                
                // Jika yang dihapus adalah pohon yang sedang dibuka
                if (Number(deleteId) === selectedId) {
                    const params = new URLSearchParams(searchParams);
                    params.delete('pohon_id');
                    router.replace(`${pathname}?${params.toString()}`);
                    setTreeData(null);
                    setSelectedId(null);
                }
            }
        } catch (error: any) {
            const message = error?.message || "Cek koneksi internet atau database server";
            AlertNotification("Gagal", message, "error", 2000);
            console.error(error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false); // Tutup modal apa pun hasilnya
            setDeleteId(null);
        }
    };

    useEffect(() => {
        const fetchTematikList = async () => {
            try {
                const response = await api.get<TematikItem[]>('/pohon-kinerja/tematik');
                if (response.success) {
                    setListTematik(response.data);
                }
            } catch (err) {
                console.error("Gagal load list tematik", err);
                setError("Gagal memuat daftar pohon.");
            }
        };
        fetchTematikList();
    }, [deleted]);

    useEffect(() => {
        if (!selectedId) return; 

        const fetchTreeDetail = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await api.get<PohonKinerja>(`/pohon-kinerja/${selectedId}`);
                if (response.success) {
                    setTreeData(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error("Gagal load tree detail", err);
                setError("Gagal memuat visualisasi pohon.");
            } finally {
                setLoading(false);
            }
        };

        fetchTreeDetail();
    }, [selectedId]); 

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-800 relative">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="p-4">
                    <PageHeader />
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h1 className="text-xl font-bold text-gray-800">
                                Visualisasi Pohon Kinerja
                            </h1>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                                <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                                    Pilih Pohon Tematik:
                                </label>
                                <select 
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    onChange={handleSelectChange}
                                    value={selectedId || ""}
                                >
                                    <option value="" disabled>-- Pilih Tematik --</option>
                                    {listTematik.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.namaPohon} ({item.tahun})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 min-h-125 overflow-x-auto">
                        {loading && (
                            <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p>Memuat data pohon...</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center justify-center h-64 text-red-500 font-medium text-center">
                                {error}
                            </div>
                        )}

                        {!loading && !error && !selectedId && (
                            <div className="flex items-center justify-center h-64 text-blue-400 italic text-center">
                                Silakan pilih tematik di atas untuk melihat pohon kinerja.
                            </div>
                        )}

                        {!loading && !error && treeData && (
                            <div className="tf-tree tf-gap-lg flex justify-center items-start min-w-max mx-auto py-10">
                                <ul>
                                    {/* Pastikan Pohon menerima props onDelete */}
                                    <Pohon node={treeData} onDeleteAction={confirmDelete} />
                                </ul>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* --- MODAL CONFIRMATION DIALOG --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleDeleteExecute}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Menghapus...
                                    </>
                                ) : (
                                    "Ya, Hapus"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const PohonKinerjaPage = () => {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Memuat Halaman...</p>
                </div>
            </div>
        }>
            <PohonKinerjaContent />
        </Suspense>
    );
}

export default PohonKinerjaPage;