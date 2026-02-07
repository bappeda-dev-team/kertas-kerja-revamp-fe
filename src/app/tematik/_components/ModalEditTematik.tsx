"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/src/lib/fetcher";

interface ModalEditTematikProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: any;
  tahunFromParent?: number | null;
}

const ModalEditTematik: React.FC<ModalEditTematikProps> = ({
  isOpen,
  onClose,
  onSuccess,
  data,
  tahunFromParent,
}) => {
  const [namaTema, setNamaTema] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tahun, setTahun] = useState("");
  const [indikators, setIndikators] = useState<{ nama_indikator: string; target: string; satuan: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form dari data yang akan diedit
  useEffect(() => {
    if (isOpen && data) {
      setNamaTema(data.tema || data.namaPohon || "");
      setKeterangan(data.keterangan || "");
      setTahun(String(data.tahun || tahunFromParent || ""));
      setIndikators(
        (data.indikator || data.indikators)?.map((i: any) => ({
          nama_indikator: i.indikator || "",
          target: String(i.targets?.[0]?.nilai ?? ""),
          satuan: i.targets?.[0]?.satuan || "",
        })) || []
      );
    }
  }, [isOpen, data, tahunFromParent]);

  const handleAddIndikator = () => {
    setIndikators([...indikators, { nama_indikator: "", target: "", satuan: "" }]);
  };

  const handleRemoveIndikator = (index: number) => {
    const list = [...indikators];
    list.splice(index, 1);
    setIndikators(list);
  };

  const handleChangeIndikator = (field: string, value: string, index: number) => {
    const list = [...indikators];
    list[index] = { ...list[index], [field]: value };
    setIndikators(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedIndikators = indikators
        .filter(i => i.nama_indikator.trim() !== "")
        .map((ind) => ({
          id: 0,
          indikator: ind.nama_indikator,
          keterangan: "",
          tahun: Number(tahun),
          targets: [
            {
              id: 0,
              nilai: Number(ind.target) || 0,
              satuan: ind.satuan,
              tahun: Number(tahun)
            }
          ]
        }));

      const payload = {
        parentId: data.parentId,
        namaPohon: namaTema,
        keterangan,
        tahun: Number(tahun),
        jenisPohon: "TEMATIK",
        levelPohon: data.levelPohon,
        kodeOpd: data.kodeOpd || "",
        kodePemda: data.kodePemda || "",
        status: data.status || "DRAFT",
        indikators: formattedIndikators
      };

      const res = await fetchApi({
        type: "withoutAuth",
        url: `/pohon-kinerja/${data.id}`,
        method: "PUT",
        body: payload
      });

      if (res?.data?.success) {
        alert("Data berhasil diperbarui!");
        onSuccess();
        onClose();
      } else {
        alert(res?.data?.message || "Gagal update data");
      }

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="border rounded-xl shadow-xl bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 overflow-y-auto max-h-[90vh]">
        <h1 className="uppercase font-bold">Form Edit Tematik Pemda :</h1>

        <form onSubmit={handleSubmit} className="flex flex-col mx-5 py-5">
          {/* Nama Tema */}
          <div className="flex flex-col py-3">
            <label className="uppercase text-base font-bold text-gray-700 my-2">
              Nama Tema :
            </label>
            <input
              type="text"
              required
              value={namaTema}
              onChange={(e) => setNamaTema(e.target.value)}
              placeholder="masukkan Nama Tema"
              className="w-full border rounded-lg px-4 py-3 text-sm"
            />
            <span className="text-xs text-red-300 mt-1">*Nama Tema Harus Terisi</span>
          </div>

          {/* Keterangan */}
          <div className="flex flex-col py-3">
            <label className="uppercase text-base font-bold text-gray-700 my-2">
              Keterangan :
            </label>
            <textarea
              required
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="masukkan Keterangan"
              className="w-full border rounded-lg px-4 py-3 text-sm"
            />
            <span className="text-xs text-red-300 mt-1">*Keterangan Harus Terisi</span>
          </div>

          {/* Tahun */}
          <div className="flex flex-col py-3">
            <label className="uppercase text-base font-bold text-gray-700 my-2">
              Tahun:
            </label>
            <select
              required
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm"
            >
              <option value="" disabled>Masukkan tahun</option>
              {[2024, 2025, 2026, 2027, 2028, 2029].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="text-xs text-red-300 mt-1">*tahun Harus Terisi</span>
          </div>

          {/* Indikator */}
          <label className="uppercase text-base font-bold text-gray-700 my-2">
            indikator tematik :
          </label>

          {indikators.map((indikator, index) => (
            <div key={index} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
              {/* Nama Indikator */}
              <div className="flex flex-col py-3">
                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                  Nama Indikator {index + 1} :
                </label>
                <input
                  type="text"
                  value={indikator.nama_indikator}
                  onChange={(e) => handleChangeIndikator("nama_indikator", e.target.value, index)}
                  className="border px-4 py-2 rounded-lg"
                  placeholder={`Masukkan nama indikator ${index + 1}`}
                />
              </div>
              {/* Target */}
              <div className="flex flex-col py-3">
                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                  Target :
                </label>
                <input
                  type="text"
                  value={indikator.target}
                  onChange={(e) => handleChangeIndikator("target", e.target.value, index)}
                  className="border px-4 py-2 rounded-lg"
                  placeholder="Masukkan target"
                />
              </div>
              {/* Satuan */}
              <div className="flex flex-col py-3">
                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                  Satuan :
                </label>
                <input
                  type="text"
                  value={indikator.satuan}
                  onChange={(e) => handleChangeIndikator("satuan", e.target.value, index)}
                  className="border px-4 py-2 rounded-lg"
                  placeholder="Masukkan satuan"
                />
              </div>
              {/* Hapus */}
              <button
                type="button"
                onClick={() => handleRemoveIndikator(index)}
                className="px-3 flex justify-center items-center py-1 border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white rounded-lg w-[200px] my-3"
              >
                Hapus
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddIndikator}
            className="px-3 flex justify-center items-center py-1 border-2 border-[#3072D6] hover:bg-[#3072D6] text-[#3072D6] hover:text-white rounded-lg mb-3 mt-2 w-full"
          >
            Tambah Indikator
          </button>

          {/* Simpan */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#1CE978] to-[#11B935] hover:from-[#1EB281] hover:to-[#0D7E5C] text-white rounded-lg my-4"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          {/* Kembali */}
          <button
            type="button"
            onClick={onClose}
            className="px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#DA415B] to-[#B7384D] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg"
          >
            Kembali
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditTematik;
