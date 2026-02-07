"use client";

import React, { useState } from "react";
import { PohonKinerja } from "@/src/app/pohon-kinerja/_types";
import { fetchApi } from "@/src/lib/fetcher";
import { AlertNotification } from "@/src/components/global/Alert";

// UPDATE INTERFACE: Tambahkan kodeOpd dan tahun
interface FormEditNodeProps {
  node: PohonKinerja;
  onCancel: () => void;
  onSuccess: () => void;
  kodeOpd: string;
  tahun: number;
}

export const FormEditNode: React.FC<FormEditNodeProps> = ({ node, onCancel, onSuccess, kodeOpd, tahun }) => {
  const [loading, setLoading] = useState(false);

  // State Form Utama
  const [formData, setFormData] = useState({
    namaPohon: node.namaPohon,
    keterangan: node.keterangan || "",
  });

  const [indikators, setIndikators] = useState<any[]>(
    node.indikator?.map((ind) => ({
      id: ind.id,
      indikator: ind.indikator,
      nilai: ind.targets?.[0]?.nilai || 0,
      satuan: ind.targets?.[0]?.satuan || "",
      targetId: ind.targets?.[0]?.id || null,
    })) || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Logic Indikator Dinamis ---
  const handleIndikatorChange = (index: number, field: string, value: any) => {
    const newIndikators = [...indikators];
    newIndikators[index] = { ...newIndikators[index], [field]: value };
    setIndikators(newIndikators);
  };

  const addIndikator = () => {
    setIndikators([...indikators, { id: null, indikator: "", nilai: 0, satuan: "", targetId: null }]);
  };

  const removeIndikator = (index: number) => {
    const newIndikators = indikators.filter((_, i) => i !== index);
    setIndikators(newIndikators);
  };

  // --- Submit Data ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Gunakan tahun dari props (Cookie) jika ada, jika tidak fallback ke node
    const activeTahun = tahun ? Number(tahun) : Number(node.tahun);

    const payload = {
      parentId: node.parentId || null,
      namaPohon: formData.namaPohon,
      keterangan: formData.keterangan,
      tahun: activeTahun,
      jenisPohon: node.jenisPohon,
      levelPohon: Number(node.levelPohon),
      kodeOpd: kodeOpd || node.kodeOpd || "",
      kodePemda: node.kodePemda || "",
      status: node.status || "DRAFT",
    };

    console.log("Payload Edit Final:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetchApi({
        url: `/pohon-kinerja/${node.id}`,
        method: "PUT",
        body: payload,
        type: "auth",
      });

      if (response.status === 200 || response.data?.success) {
        AlertNotification("Berhasil", "Data berhasil diperbarui", "success");
        onSuccess();
      } else {
        throw new Error(response.data?.message || "Gagal memperbarui data");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      AlertNotification("Gagal", error.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-xl w-[384px] relative text-left p-5">
      {/* Header */}
      <h3 className="text-center font-bold text-sm uppercase border rounded-lg py-2 mb-4">
        Edit {node.jenisPohon?.replace(/_/g, " ")}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Nama Pohon */}
        <div className="flex flex-col py-3">
          <label className="uppercase text-xs font-bold text-gray-700 my-2">
            {node.jenisPohon}
          </label>
          <input
            type="text"
            name="namaPohon"
            value={formData.namaPohon}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg text-xs"
            required
          />
          <h1 className="text-slate-300 text-xs mt-1">*nama pohon wajib terisi</h1>
        </div>

        {/* Indikator Section */}
        <label className="uppercase text-base font-bold text-sky-700 my-2">
          Indikator {node.jenisPohon} :
        </label>

        {indikators.length === 0 ? (
          <p className="text-center text-gray-400 text-[11px] py-3">
            Belum ada indikator
          </p>
        ) : (
          indikators.map((ind, idx) => (
            <div key={idx} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
              <div className="flex flex-col py-1">
                <label className="uppercase text-[10px] font-bold text-gray-700 mb-1 text-center">
                  Nama Indikator {idx + 1} :
                </label>
                <input
                  type="text"
                  value={ind.indikator}
                  onChange={(e) => handleIndikatorChange(idx, "indikator", e.target.value)}
                  className="border px-4 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2 py-1">
                <div className="w-1/3">
                  <label className="uppercase text-[10px] font-bold text-gray-700 mb-1 block">Target</label>
                  <input
                    type="number"
                    value={ind.nilai}
                    onChange={(e) => handleIndikatorChange(idx, "nilai", e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg text-xs"
                  />
                </div>
                <div className="w-2/3">
                  <label className="uppercase text-[10px] font-bold text-gray-700 mb-1 block">Satuan</label>
                  <input
                    type="text"
                    value={ind.satuan}
                    onChange={(e) => handleIndikatorChange(idx, "satuan", e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeIndikator(idx)}
                className="px-3 py-1 border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white rounded-lg w-[120px] text-[10px] font-semibold my-2"
              >
                Hapus
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addIndikator}
          className="px-3 flex justify-center items-center py-1 border-2 border-[#3072D6] hover:bg-[#3072D6] text-[#3072D6] hover:text-white rounded-lg gap-1 mb-3 mt-2 w-full text-xs font-bold transition"
        >
          Tambah Indikator
        </button>

        {/* Keterangan */}
        <div className="flex flex-col pb-3 pt-1 border-t-2">
          <label className="uppercase text-xs font-bold text-gray-700 my-2">
            Keterangan :
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={3}
            className="border px-4 py-2 rounded-lg text-xs resize-none"
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          disabled={loading}
          className="px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-lg w-full my-3 font-bold text-xs transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#DA415B] to-[#BC163C] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg w-full font-bold text-xs transition disabled:opacity-50"
        >
          Batal
        </button>
      </form>
    </div>
  );
};