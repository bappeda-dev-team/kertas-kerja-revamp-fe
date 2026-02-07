"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/src/lib/fetcher';
import './_styles/treeflex.css';
import PohonNodeOpd from '@/src/app/pohon-kinerja-opd/_components/Pohon';
import { PohonKinerja } from '@/src/app/pohon-kinerja/_types';

import Sidebar from "@/src/components/layout/Sidebar";
import PageHeader from "@/src/components/layout/Header";
import Breadcrumb from '@/src/components/global/Breadcrumb';
import { getOpdTahun } from "@/src/lib/cookie";
import CountCard from './_components/CountCard';

const PohonKinerjaOpdPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tambahkan state untuk kodeOpd dan tahun
  const [kodeOpd, setKodeOpd] = useState<string>('');
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const { opd, tahun: tahunCookie } = getOpdTahun();

    if (!opd || !tahunCookie) {
      setError("Silakan pilih OPD dan Tahun di header terlebih dahulu.");
      return;
    }

    // Set state dari cookie
    setKodeOpd(opd.value);
    setTahun(Number(tahunCookie.value));

    const fetchTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchApi({
          type: "withoutAuth",
          url: `/pohon-kinerja/opd/${opd.value}/${tahunCookie.value}`,
          method: "GET"
        });

        if (res?.data?.success && res.data.data) {
          const responseData = res.data.data;

          if (responseData.roots && Array.isArray(responseData.roots) && responseData.roots.length > 0) {
            setTreeData(responseData.roots[0]);
          } else {
            setTreeData(null);
            setError("Data pohon tidak ditemukan dalam response.");
          }
        } else {
          setTreeData(null);
          setError(res?.data?.message || "Belum ada pohon kinerja untuk OPD & tahun ini.");
        }

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

            {/* CountCard - hanya tampil jika kodeOpd dan tahun tersedia */}
            {!loading && !error && kodeOpd && tahun && (
              <div className="flex flex-wrap gap-4 mb-4">
                <CountCard
                  kodeOpd={kodeOpd}
                  tahun={tahun}
                  onLevelClick={(level) => {
                    console.log('Clicked level:', level);
                    // handle modal atau aksi lainnya
                  }}
                />
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