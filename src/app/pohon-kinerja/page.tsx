"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { fetchApi } from '@/src/lib/fetcher';
import './_styles/treeflex.css';
import PohonNode from '@/src/app/pohon-kinerja/_components/Pohon';
import { PohonKinerja } from '@/src/app/pohon-kinerja/_types';

import Sidebar from "@/src/components/layout/Sidebar"; 
import PageHeader from "@/src/components/layout/Header"; 
import Breadcrumb from "@/src/components/global/Breadcrumb";
import { TematikItem } from '../pohon-kinerja-opd/_types';
import { getCookie } from '@/src/lib/cookie';

const PohonKinerjaContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [listTematik, setListTematik] = useState<TematikItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [tahun, setTahun] = useState<number | null>(null);

    const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getTahunFromCookie = (): number => {
    try {
        const tahunRaw = getCookie("tahun");
        
        if (tahunRaw) {
            const parsedTahun = JSON.parse(tahunRaw as string);
            return Number(parsedTahun.value || parsedTahun.tahun || new Date().getFullYear());
        }
        
        return new Date().getFullYear();
    } catch (error) {
        console.warn("Gagal parsing cookie tahun, menggunakan default", error);
        return new Date().getFullYear();
    }
};

    // LOGIC SINKRONISASI URL & STATE
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
        const params = new URLSearchParams(searchParams.toString());

        if (newId) {
            params.set('pohon_id', newId);
        } else {
            params.delete('pohon_id');
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const fetchTematikList = async () => {
            const tahunCookie = getTahunFromCookie(); // ambil tahun terbaru dari cookie
            
            try {
                const res = await fetchApi({
                    type: "withoutAuth",
                    url: `/pohon-kinerja/tematik/${tahunCookie}`, // tahun dinamis
                    method: "GET"
                });

                if (res?.data?.success && res.data.data) {
                    setListTematik(res.data.data.tematiks || []);
                    setTahun(res.data.data.tahun || tahunCookie);
                }
            } catch (err) {
                console.error("Gagal load list tematik", err);
                setError("Gagal memuat daftar pohon.");
            }
        };
        fetchTematikList();
    }, []);

    // FETCH TREE DETAIL
    useEffect(() => {
        if (!selectedId) return; 

        const fetchTreeDetail = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const res = await fetchApi({
                    type: "withoutAuth",
                    url: `/pohon-kinerja/${selectedId}`,
                    method: "GET"
                });

                if (res?.data?.success) {
                    setTreeData(res.data.data);
                } else {
                    setError(res?.data?.message || "Gagal memuat data");
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
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-800">
            
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                <header className="p-4">
                    <PageHeader />
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Breadcrumb />

                    {/* Kotak Kontrol/Dropdown */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h1 className="text-xl font-bold text-gray-800">
                                Visualisasi Pohon Kinerja Pemda {tahun && `(${tahun})`}
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
                                            {item.tema}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Area Visualisasi Tree */}
                    <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 min-h-[500px] overflow-x-auto">
                        
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
};

const PohonKinerjaPage = () => {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Memuat Halaman...</p>
                </div>
            </div>
        }>
            <PohonKinerjaContent />
        </Suspense>
    );
};

export default PohonKinerjaPage;