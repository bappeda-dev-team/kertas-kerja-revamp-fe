"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import apiClient from '../lib/axios';
import './treeflex.css';
import PohonNode from '@/components/PohonNode';
import { PohonKinerja, TematikItem } from '@/app/pohon-kinerja/types';

import Sidebar from "@/components/layout/Sidebar"; 
import PageHeader from "@/components/layout/PageHeader"; 

const PohonKinerjaContent = () => {
    // Hooks untuk URL Params
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State untuk Layout
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // State untuk Dropdown
    const [listTematik, setListTematik] = useState<TematikItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // State untuk Tree Data
    const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. LOGIC SINKRONISASI URL & STATE
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

    // 2. FETCH DATA
    useEffect(() => {
        const fetchTematikList = async () => {
            try {
                const response = await apiClient.get('/pohon-kinerja/tematik');
                if (response.data.success) {
                    setListTematik(response.data.data);
                }
            } catch (err) {
                console.error("Gagal load list tematik", err);
                setError("Gagal memuat daftar pohon.");
            }
        };
        fetchTematikList();
    }, []);

    useEffect(() => {
        if (!selectedId) return; 

        const fetchTreeDetail = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await apiClient.get(`/pohon-kinerja/${selectedId}`);
                if (response.data.success) {
                    setTreeData(response.data.data);
                } else {
                    setError(response.data.message);
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
        // Container Utama (Sama dengan Home/Dashboard)
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-800">
            
            {/* 1. SIDEBAR */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* 2. AREA KANAN */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Header Container */}
                <header className="p-4">
                    <PageHeader />
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    
                    {/* Kotak Kontrol/Dropdown */}
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

                    {/* Area Visualisasi Tree */}
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
                                    <PohonNode node={treeData} />
                                </ul>
                            </div>
                        )}
                    </div>
                </main>
            </div>
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