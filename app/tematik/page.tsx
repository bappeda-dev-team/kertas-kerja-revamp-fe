"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/global/sidebar/Sidebar";
import Header from "@/src/components/global/header/Header";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ModalAddTematik from "./_components/ModalAddTematik";
import ModalEditTematik from "./_components/ModalEditTematik";
import Breadcrumb from "@/src/components/global/breadcrumb/Breadcrumb";
import { fetchApi } from "@/src/lib/fetcher";
import { getOpdTahun } from "@/src/components/lib/Cookie";

const TematikPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);
  const [dataTematik, setDataTematik] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedOpd, setSelectedOpd] = useState<any>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState<any>(null);

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
        url: "/pohon-kinerja/tematik",
        method: "GET",
      });

      if (res?.data?.success) {
        // FILTER SESUAI TAHUN COOKIE
        const filtered = res.data.data.filter(
          (it: any) => it.tahun === selectedYear
        );

        setDataTematik(filtered);
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                TEMATIK PEMDA TAHUN {selectedYear ?? "-"}
              </h1>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah Tematik
              </button>
            </div>

            <div className="overflow-x-auto rounded-t-lg border border-gray-200">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-white uppercase bg-[#93C5FD]">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3">Tema</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3">Tahun</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
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
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4 text-center">{index + 1}</td>
                        <td className="px-4 py-4 font-medium">
                          {item.namaPohon}
                        </td>
                        <td className="px-4 py-4">
                          {item.keterangan || "-"}
                        </td>
                        <td className="px-4 py-4">{item.tahun}</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col gap-2 items-center">
                            <button
                              onClick={() => {
                                setSelectedEditData(item);
                                setIsEditModalOpen(true);
                              }}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs w-20 flex items-center justify-center gap-1"
                            >
                              <Pencil size={12} /> Edit
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs w-20 flex items-center justify-center gap-1"
                            >
                              <Trash2 size={12} /> Hapus
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
