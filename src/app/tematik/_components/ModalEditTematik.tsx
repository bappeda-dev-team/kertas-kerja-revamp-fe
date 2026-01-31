"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { fetchApi } from "@/src/lib/fetcher";

interface ModalEditTematikProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: any;
}

const ModalEditTematik: React.FC<ModalEditTematikProps> = ({
  isOpen,
  onClose,
  onSuccess,
  data,
}) => {
  const [namaTema, setNamaTema] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tahun, setTahun] = useState("");
  const [indikators, setIndikators] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  // === FIX UTAMA ADA DI SINI ===
  useEffect(() => {
    if (isOpen && data) {
      setNamaTema(data.namaPohon || "");
      setKeterangan(data.keterangan || "");
      setTahun(String(data.tahun || ""));
      setIndikators(
        data.indikators?.map((i: any) => i.indikator) || [""]
      );
    }
  }, [isOpen, data]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedIndikators = indikators
        .filter(i => i.trim() !== "")
        .map((indikator) => ({
          id: 0,
          indikator,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold uppercase">
            Form Edit Tematik Pemda
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div>
            <label className="text-xs font-bold">Nama Tema *</label>
            <input
              required
              value={namaTema}
              onChange={(e) => setNamaTema(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="text-xs font-bold">Keterangan *</label>
            <textarea
              required
              rows={3}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="text-xs font-bold">Tahun *</label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              {[2024,2025,2026,2027,2028,2029].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4">
            <label className="text-xs font-bold">Indikator</label>

            {indikators.map((indikator, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  value={indikator}
                  onChange={(e) =>
                    handleChangeIndikator(e.target.value, i)
                  }
                  className="flex-1 border rounded px-4 py-2"
                />
                {indikators.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIndikator(i)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIndikator}
              className="mt-3 w-full border-2 border-dashed py-2 text-blue-500"
            >
              <Plus size={16} /> Tambah Indikator
            </button>
          </div>

          <div className="border-t pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white py-3 rounded-lg"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-3 rounded-lg"
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalEditTematik;
