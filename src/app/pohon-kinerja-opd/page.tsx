"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/src/lib/fetcher';
import './treeflex.css';
import PohonNodeOpd from '@/src/components/PohonNodeOpd';
import { PohonKinerja } from '@/src/app/pohon-kinerja/types';

import Sidebar from "@/src/components/global/Sidebar"; 
import PageHeader from "@/src/components/global/Header"; 
import Breadcrumb from '@/src/components/global/Breadcrumb';
import { getOpdTahun } from "@/src/components/lib/Cookie";

const PohonKinerjaOpdPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Perubahan: Kita mungkin punya banyak root (Multi-tree), jadi state bisa berupa array
  // Tapi jika ingin menampilkan satu saja dulu, gunakan single object.
  // Disini saya siapkan logic untuk mengambil root pertama.
  const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === AMBIL DARI COOKIE ===
  useEffect(() => {
    const { opd, tahun } = getOpdTahun();

    if (!opd || !tahun) {
      setError("Silakan pilih OPD dan Tahun di header terlebih dahulu.");
      return;
    }

    const fetchTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchApi({
          type: "withoutAuth", 
          url: `/pohon-kinerja/opd/${opd.value}/${tahun.value}`,
          method: "GET"
        });

        // --- PERBAIKAN UTAMA DI SINI ---
        if (res?.data?.success && res.data.data) {
          const responseData = res.data.data;
          
          // Cek apakah ada array 'roots' dan isinya tidak kosong
          if (responseData.roots && Array.isArray(responseData.roots) && responseData.roots.length > 0) {
             // Ambil pohon pertama dari array roots
             setTreeData(responseData.roots[0]);
          } else {
             setTreeData(null);
             setError("Data pohon tidak ditemukan dalam response.");
          }
        } else {
          setTreeData(null);
          setError(res?.data?.message || "Belum ada pohon kinerja untuk OPD & tahun ini.");
        }
        // -------------------------------

      } catch (err) {
        console.error(err);
        setError("Gagal memuat pohon kinerja OPD.");
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-800">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="p-4">
          <PageHeader />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Breadcrumb />

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h1 className="text-xl font-bold text-gray-800 text-center">
              Visualisasi Pohon Kinerja OPD
            </h1>
          </div>

          <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 min-h-[500px] overflow-x-auto">

            {loading && (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Memuat pohon kinerja...
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-64 text-red-500 font-medium text-center">
                {error}
              </div>
            )}

            {!loading && !error && treeData && (
              <div className="tf-tree tf-gap-lg flex justify-center items-start min-w-max mx-auto py-10">
                <ul>
                  <PohonNodeOpd node={treeData} />
                </ul>
              </div>
            )}
            
            {!loading && !error && !treeData && (
                <div className="flex items-center justify-center h-64 text-gray-500 italic">
                    Data tidak tersedia.
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PohonKinerjaOpdPage;