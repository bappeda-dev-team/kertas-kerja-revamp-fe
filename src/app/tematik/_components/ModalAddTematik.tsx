"use client";

import { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { fetchApi } from "@/src/lib/fetcher";

interface ModalAddTematikProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalAddTematik: React.FC<ModalAddTematikProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // State Form
  const [namaTema, setNamaTema] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tahun, setTahun] = useState("2025");

  // Indikator (string aja, nanti dimapping)
  const [indikators, setIndikators] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Logic Indikator ---
  const handleAddIndikator = () => {
    setIndikators([...indikators, ""]);
  };

  const handleRemoveIndikator = (index: number) => {
    const list = [...indikators];
    list.splice(index, 1);
    setIndikators(list);
  };

  const handleChangeIndikator = (value: string, index: number) => {
    const list = [...indikators];
    list[index] = value;
    setIndikators(list);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mapping indikator ke format backend
      const formattedIndikators = indikators
        .filter(i => i.trim() !== "")
        .map((indikator) => ({
          id: 0,
          indikator: indikator,
          keterangan: "",
          tahun: Number(tahun),
          targets: [
            {
              id: 0,
              nilai: 0,
              satuan: "",
              tahun: Number(tahun)
            }
          ]
        }));

      const payload = {
        namaPohon: namaTema,
        keterangan: keterangan,
        tahun: Number(tahun),
        jenisPohon: "TEMATIK",
        levelPohon: 0,
        kodeOpd: "",
        kodePemda: "",
        status: "DRAFT",
        indikators: formattedIndikators
      };


      console.log("Payload:", payload);

      const res = await fetchApi({
        type: "withoutAuth",
        url: "/pohon-kinerja",
        method: "POST",
        body: payload
      });

      if (res?.data?.success) {
        alert("Data berhasil disimpan!");
        setNamaTema("");
        setKeterangan("");
        setIndikators([""]);
        onSuccess();
        onClose();
      } else {
        alert(res?.data?.message || "Gagal menyimpan data");
      }

    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 uppercase">
            Form Tambah Tematik Pemda
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nama Tema */}
          <div>
            <label className="block text-xs font-bold mb-2">Nama Tema *</label>
            <input
              type="text"
              required
              value={namaTema}
              onChange={(e) => setNamaTema(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold mb-2">Keterangan *</label>
            <textarea
              required
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm"
            />
          </div>

          {/* Tahun */}
          <div>
            <label className="block text-xs font-bold mb-2">Tahun *</label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-sm"
            >
              {[2024,2025,2026,2027,2028,2029].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Indikator */}
          <div className="border-t pt-4">
            <label className="block text-xs font-bold mb-4">
              Indikator Tematik
            </label>

            {indikators.map((indikator, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={indikator}
                  onChange={(e) =>
                    handleChangeIndikator(e.target.value, index)
                  }
                  className="flex-1 border rounded-lg px-4 py-2 text-sm"
                  placeholder={`Indikator ${index + 1}`}
                />
                {indikators.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIndikator(index)}
                    className="text-red-500 border border-red-200 px-3 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIndikator}
              className="mt-3 w-full border-2 border-dashed py-2 rounded-lg text-blue-500"
            >
              <Plus size={16} /> Tambah Indikator
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 rounded-lg"
            >
              {isLoading ? "Menyimpan..." : (
                <>
                  <Save size={16} /> Simpan
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-red-500 text-white py-3 rounded-lg"
            >
              Kembali
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalAddTematik;
