"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ModalAddTematik from "./_components/ModalAddTematik";
import ModalEditTematik from "./_components/ModalEditTematik";
import Breadcrumb from "@/src/components/global/Breadcrumb";
import { fetchApi } from "@/src/lib/fetcher";
import { getOpdTahun } from "@/src/lib/cookie";

interface TargetItem {
  id: number;
  nilai: string;
  satuan: string;
}

interface IndikatorItem {
  id: number;
  indikator: string;
  keterangan: string;
  targets: TargetItem[];
}

interface TematikItem {
  id: number;
  parentId: number | null;
  tema: string;
  jenisPohon: string;
  levelPohon: number;
  keterangan: string;
  indikator: IndikatorItem[];
}

const TematikPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);
  const [dataTematik, setDataTematik] = useState<TematikItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tahunData, setTahunData] = useState<number | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedOpd, setSelectedOpd] = useState<any>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState<TematikItem | null>(null);

  // AMBIL COOKIE SETELAH MOUNT (ANTI HYDRATION ERROR)
  useEffect(() => {
    setMounted(true);
    const { tahun, opd } = getOpdTahun();

    if (tahun?.value) setSelectedYear(Number(tahun.value));
    if (opd) setSelectedOpd(opd);
  }, []);

  // FETCH DATA
  const fetchData = async () => {
    if (!selectedYear) return;

    setLoading(true);
    try {
      const res = await fetchApi({
        type: "withoutAuth",
        url: `/pohon-kinerja/tematik/${selectedYear}`,
        method: "GET",
      });

      if (res?.data?.success) {
        const responseData = res.data.data;
        setTahunData(responseData.tahun);
        setDataTematik(responseData.tematiks || []);
      } else {
        setDataTematik([]);
      }
    } catch (error) {
      console.error("Gagal ambil data", error);
      setDataTematik([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear) fetchData();
  }, [selectedYear]);

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await fetchApi({
        type: "withoutAuth",
        url: `/pohon-kinerja/${id}`,
        method: "DELETE",
      });

      alert("Berhasil menghapus data");
      fetchData();
    } catch (err) {
      alert("Gagal menghapus data");
    }
  };

  // BLOCK SSR RENDER (ANTI HYDRATION)
  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-gray-800">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="p-4 bg-white shadow-sm z-10">
          <Header />
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Breadcrumb />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[80vh]">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h1 className="text-lg font-bold uppercase tracking-wide text-gray-800">
                TEMATIK PEMDA TAHUN {tahunData ?? selectedYear ?? "-"}
              </h1>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1 flex justify-center items-center bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-lg transition-all duration-200"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                  <path d="M9 12h6"></path>
                  <path d="M12 9v6"></path>
                </svg>
                <span className="text-sm font-medium">Tambah Tematik</span>
              </button>
            </div>

            {/* TABEL */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-[#0EA5E9]">
                  <tr>
                    <th className="px-4 py-3 text-center w-14 border-r border-sky-400">No</th>
                    <th className="px-4 py-3 border-r border-sky-400 w-[200px]">Tema</th>
                    <th className="px-4 py-3 border-r border-sky-400">Keterangan</th>
                    <th className="px-4 py-3 text-center border-r border-sky-400 w-[180px]">Indikator</th>
                    <th className="px-4 py-3 text-center border-r border-sky-400 w-[140px]">Target/Satuan</th>
                    <th className="px-4 py-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        Memuat data...
                      </td>
                    </tr>
                  ) : dataTematik.length > 0 ? (
                    dataTematik.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-50 align-top"
                      >
                        {/* NO */}
                        <td className="px-4 py-4 text-center border-r border-gray-200 font-medium">
                          {index + 1}
                        </td>

                        {/* TEMA */}
                        <td className="px-4 py-4 border-r border-gray-200">
                          <div className="font-semibold text-gray-800 uppercase text-sm leading-relaxed">
                            {item.tema}
                          </div>
                        </td>
                        {/* KETERANGAN */}
                        <td className="px-4 py-4 border-r border-gray-200 text-gray-600 text-sm leading-relaxed">
                          {item.keterangan || "-"}
                        </td>

                        {/* INDIKATOR */}
                        <td className="px-4 py-4 border-r border-gray-200 text-center">
                          {item.indikator && item.indikator.length > 0 ? (
                            <div className="space-y-2">
                              {item.indikator.map((ind, idx) => (
                                <div
                                  key={ind.id || idx}
                                  className="text-sm text-gray-700 uppercase font-medium"
                                >
                                  {ind.indikator}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* TARGET/SATUAN */}
                        <td className="px-4 py-4 text-center border-r border-gray-200">
                          {item.indikator && item.indikator.length > 0 ? (
                            <div className="space-y-2 ">
                              {item.indikator.map((ind, idx) => (
                                <div
                                  key={ind.id || idx}
                                  className="text-sm text-gray-700 font-medium"
                                >
                                  {ind.targets.map((t, i) => (
                                    <div key={i}>
                                      {t.nilai} / {t.satuan}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* TOMBOL AKSI */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            {/* Button Edit */}
                            <button
                              onClick={() => {
                                setSelectedEditData(item);
                                setIsEditModalOpen(true);
                              }}
                              className="px-3 py-1 flex justify-center items-center bg-gradient-to-r from-[#1CE978] to-[#11B935] hover:from-[#1EB281] hover:to-[#0D7E5C] text-white rounded-lg transition-all duration-200 gap-1.5 min-w-[80px]"
                            >
                              <Pencil size={14} />
                              <span className="text-sm font-medium">Edit</span>
                            </button>

                            {/* Button Hapus */}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1 flex justify-center items-center bg-gradient-to-r from-[#DA415B] to-[#BC163C] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg transition-all duration-200 gap-1.5 min-w-[80px]"
                            >
                              <Trash2 size={14} />
                              <span className="text-sm font-medium">Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-400 italic"
                      >
                        Belum ada data tematik tahun {selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* MODAL TAMBAH */}
        <ModalAddTematik
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchData}
        />

        {/* MODAL EDIT */}
        <ModalEditTematik
          isOpen={isEditModalOpen}
          data={selectedEditData}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
};

export default TematikPage;