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

    // Build Indikator Payload
    const indikatorsPayload = indikators.map(ind => {
      const targetObj: any = {
        nilai: Number(ind.nilai), 
        satuan: ind.satuan,
        tahun: activeTahun
      };
      if (ind.targetId) targetObj.id = ind.targetId;

      const indikatorObj: any = {
        indikator: ind.indikator,
        tahun: activeTahun,
        targets: [targetObj]
      };
      if (ind.id) indikatorObj.id = ind.id;

      return indikatorObj;
    });

    const payload = {
      // Pastikan semua field terisi
      id: Number(node.id),
      parentId: node.parentId || null,
      namaPohon: formData.namaPohon,
      keterangan: formData.keterangan,
      tahun: activeTahun,
      jenisPohon: node.jenisPohon,
      levelPohon: Number(node.levelPohon),
      status: "UPDATE", 
      
      // Data Konteks (Penting agar tidak hilang)
      kodeOpd: kodeOpd || node.kodeOpd || "",
      kodePemda: node.kodePemda || "",

      indikators: indikatorsPayload
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
    <div className="bg-white border-2 border-gray-800 rounded-lg p-4 shadow-xl max-w-sm w-full relative text-left">
      <h3 className="text-center font-bold text-sm uppercase mb-4 border-b pb-2">Edit {node.jenisPohon?.replace(/_/g, " ")}</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="font-bold text-gray-500 block mb-1">Nama {node.jenisPohon}</label>
          <input
            type="text"
            name="namaPohon"
            value={formData.namaPohon}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="border border-blue-200 rounded p-2 bg-blue-50/50">
          <label className="font-bold text-blue-600 block mb-2 text-center border-b border-blue-200 pb-1">INDIKATOR</label>
          {indikators.map((ind, idx) => (
            <div key={idx} className="mb-4 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
              <div className="mb-2">
                <label className="text-[10px] font-semibold text-gray-500">Nama Indikator {idx + 1}</label>
                <input
                  type="text"
                  value={ind.indikator}
                  onChange={(e) => handleIndikatorChange(idx, "indikator", e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-[10px] font-semibold text-gray-500">Target</label>
                  <input
                    type="number"
                    value={ind.nilai}
                    onChange={(e) => handleIndikatorChange(idx, "nilai", e.target.value)}
                    className="w-full border border-gray-300 rounded p-1.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="w-2/3">
                  <label className="text-[10px] font-semibold text-gray-500">Satuan</label>
                  <input
                    type="text"
                    value={ind.satuan}
                    onChange={(e) => handleIndikatorChange(idx, "satuan", e.target.value)}
                    className="w-full border border-gray-300 rounded p-1.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <button type="button" onClick={() => removeIndikator(idx)} className="text-red-500 text-[10px] mt-1 hover:underline w-full text-right">Hapus Indikator</button>
            </div>
          ))}
          <button type="button" onClick={addIndikator} className="w-full mt-2 border border-dashed border-blue-400 text-blue-600 rounded p-1 hover:bg-blue-50 transition">+ Tambah Indikator</button>
        </div>

        <div>
          <label className="font-bold text-gray-500 block mb-1">Keterangan</label>
          <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="flex gap-2 mt-2">
          <button type="button" onClick={onCancel} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition disabled:opacity-50">Batal</button>
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition disabled:opacity-50">{loading ? "..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
};