"use client";

import React, { useState } from 'react';
import { crud } from '../../lib/axios'; // Pastikan path axios benar

interface FormAddChildModalProps {
    parentId: number;
    childInfo: {
        nextLevel: number;
        nextJenis: string;
        label: string;
    };
    tahun: number;
    onCancel: () => void;
    onSuccess: () => void;
}

interface IndikatorState {
    indikator: string;
    keterangan: string;
    targets: { nilai: string | number; satuan: string }[];
}

export const FormAddChildModal: React.FC<FormAddChildModalProps> = ({ parentId, childInfo, tahun, onCancel, onSuccess }) => {
    const [namaPohon, setNamaPohon] = useState("");
    const [keteranganPohon, setKeteranganPohon] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Default 1 Indikator kosong
    const [indikators, setIndikators] = useState<IndikatorState[]>([
        { indikator: "", keterangan: "", targets: [{ nilai: "", satuan: "" }] }
    ]);

    // --- LOGIC FORM ---
    const addIndikator = () => {
        setIndikators([...indikators, { indikator: "", keterangan: "", targets: [{ nilai: "", satuan: "" }] }]);
    };

    const removeIndikator = (index: number) => {
        const newIndikators = [...indikators];
        newIndikators.splice(index, 1);
        setIndikators(newIndikators);
    };

    const handleIndikatorChange = (idx: number, field: string, value: any) => {
        const newIndikators = [...indikators];
        // @ts-ignore
        newIndikators[idx][field] = value;
        setIndikators(newIndikators);
    };

    const handleTargetChange = (indIdx: number, targetIdx: number, field: string, value: any) => {
        const newIndikators = [...indikators];
        // @ts-ignore
        newIndikators[indIdx].targets[targetIdx][field] = value;
        setIndikators(newIndikators);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            parentId: parentId,
            namaPohon: namaPohon,
            keterangan: keteranganPohon,
            tahun: tahun,
            jenisPohon: childInfo.nextJenis,
            levelPohon: childInfo.nextLevel,
            status: "DRAFT",
            indikators: indikators.map(ind => ({
                indikator: ind.indikator,
                keterangan: ind.keterangan,
                tahun: tahun,
                targets: ind.targets.map(t => ({
                    nilai: Number(t.nilai),
                    satuan: t.satuan,
                    tahun: tahun
                }))
            }))
        };

        try {
            const response = await crud.post(`/pohon-kinerja`, payload);
            if (response.success || response.status === 200 || response.status === 201) {
                onSuccess();
            } else {
                alert("Gagal menyimpan");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper Style untuk Header (PILL STYLE)
    const getHeaderStyle = (jenisPohon: string) => {
        switch (jenisPohon) {
            case "STRATEGIC_PEMDA": return "border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]";
            case "TACTICAL_PEMDA": return "border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]";
            case "OPERATIONAL_PEMDA": return "border-green-500 text-white bg-gradient-to-r from-[#139052] from-40% to-[#2DCB06]";
            case "TEMATIK":
            case "SUB_TEMATIK":
            case "SUB_SUB_TEMATIK":
            case "SUPER_SUB_TEMATIK": return "border-black bg-white text-black";
            default: return "border-gray-300 bg-white text-gray-800";
        }
    };

    return (
        // Wrapper card utama
        <div className="flex flex-col rounded-lg shadow-xl border border-gray-800 bg-white max-w-sm w-87.5 relative text-left">
            
            {/* Header Form (Model Pill seperti Node) */}
            <div className={`flex flex-col rounded-lg shadow-sm mb-2 border p-3 mx-2 mt-2 ${getHeaderStyle(childInfo.nextJenis)}`}>
                <span className="text-xs text-center font-bold uppercase opacity-90">
                    TAMBAH {childInfo.label}
                </span>
            </div>

            <div className="p-3 pt-0">
                <form id="form-add-node" onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Input Nama Pohon */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Sub Tematik / Nama Pohon</label>
                        <input
                            type="text"
                            required
                            placeholder="Masukkan nama pohon..."
                            value={namaPohon}
                            onChange={(e) => setNamaPohon(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Indikator Area */}
                    <div className="border border-blue-200 rounded p-2 bg-blue-50/30">
                        <div className="text-center mb-2">
                             <label className="text-[10px] font-bold text-blue-600 uppercase">INDIKATOR {childInfo.label} :</label>
                        </div>

                        {indikators.map((ind, idx) => (
                            <div key={idx} className="mb-3 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <div className="mb-2">
                                    <label className="text-[9px] font-bold text-gray-500">NAMA INDIKATOR {idx + 1}:</label>
                                    <input
                                        type="text"
                                        required
                                        value={ind.indikator}
                                        onChange={(e) => handleIndikatorChange(idx, 'indikator', e.target.value)}
                                        className="w-full border border-gray-800 rounded p-1.5 text-xs font-semibold"
                                        placeholder={`Masukkan nama indikator ${idx+1}`}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="text-[9px] font-bold text-gray-500">TARGET:</label>
                                    <input
                                        type="number"
                                        required
                                        value={ind.targets[0].nilai}
                                        onChange={(e) => handleTargetChange(idx, 0, 'nilai', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-1.5 text-xs bg-gray-50"
                                        placeholder="Target"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="text-[9px] font-bold text-gray-500">SATUAN:</label>
                                    <input
                                        type="text"
                                        required
                                        value={ind.targets[0].satuan}
                                        onChange={(e) => handleTargetChange(idx, 0, 'satuan', e.target.value)}
                                        className="w-full border border-gray-200 rounded p-1.5 text-xs bg-gray-50"
                                        placeholder="Satuan"
                                    />
                                </div>
                                    <button type="button" onClick={() => removeIndikator(idx)} className="text-red-500 text-[10px] hover:underline w-full text-right">Hapus Indikator</button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addIndikator}
                            className="w-full border border-blue-400 text-blue-600 rounded text-[10px] py-1 hover:bg-blue-50 transition"
                        >
                            + Tambah Indikator
                        </button>
                    </div>

                    {/* Keterangan */}
                    <div>
                         <label className="text-[10px] font-bold text-gray-500 uppercase">KETERANGAN:</label>
                        <textarea
                            rows={2}
                            placeholder="Masukkan keterangan..."
                            value={keteranganPohon}
                            onChange={(e) => setKeteranganPohon(e.target.value)}
                            className="w-full border border-gray-300 rounded p-1.5 text-xs outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-bold text-xs transition"
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded font-bold text-xs transition"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};