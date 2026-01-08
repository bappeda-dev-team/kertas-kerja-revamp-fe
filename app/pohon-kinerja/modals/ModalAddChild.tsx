"use client";

import React, { useState } from 'react';
import { ButtonGreen } from '@/components/global/Button';
import apiClient from '@/app/lib/axios';

interface ModalAddChildProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    parentId: number;
    childInfo: {
        nextLevel: number;
        nextJenis: string;
        label: string;
    };
    tahun: number;
}

// Interface untuk State Lokal (Frontend)
interface TargetState {
    nilai: string | number;
    satuan: string;
}

interface IndikatorState {
    indikator: string;
    keterangan: string;
    targets: TargetState[];
}

export const ModalAddChild: React.FC<ModalAddChildProps> = ({ isOpen, onClose, onSuccess, parentId, childInfo, tahun }) => {
    const [namaPohon, setNamaPohon] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // State untuk Indikator yang dinamis (Array of Object)
    const [indikators, setIndikators] = useState<IndikatorState[]>([
        {
            indikator: "",
            keterangan: "",
            targets: [{ nilai: "", satuan: "" }] // Default minimal 1 target
        }
    ]);

    if (!isOpen) return null;

    // --- HANDLERS UNTUK INDIKATOR ---
    const addIndikator = () => {
        setIndikators([...indikators, { indikator: "", keterangan: "", targets: [{ nilai: "", satuan: "" }] }]);
    };

    const removeIndikator = (index: number) => {
        const newIndikators = [...indikators];
        newIndikators.splice(index, 1);
        setIndikators(newIndikators);
    };

    const handleIndikatorChange = (index: number, field: keyof IndikatorState, value: string) => {
        const newIndikators = [...indikators];
        // @ts-ignore - kita tahu fieldnya string
        newIndikators[index][field] = value;
        setIndikators(newIndikators);
    };

    // --- HANDLERS UNTUK TARGET (NESTED DALAM INDIKATOR) ---
    const addTarget = (indikatorIndex: number) => {
        const newIndikators = [...indikators];
        newIndikators[indikatorIndex].targets.push({ nilai: "", satuan: "" });
        setIndikators(newIndikators);
    };

    const removeTarget = (indikatorIndex: number, targetIndex: number) => {
        const newIndikators = [...indikators];
        newIndikators[indikatorIndex].targets.splice(targetIndex, 1);
        setIndikators(newIndikators);
    };

    const handleTargetChange = (indikatorIndex: number, targetIndex: number, field: keyof TargetState, value: string | number) => {
        const newIndikators = [...indikators];
        // @ts-ignore
        newIndikators[indikatorIndex].targets[targetIndex][field] = value;
        setIndikators(newIndikators);
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mapping state indikator ke format Payload yang diinginkan
        // Pastikan konversi tipe data (misal string ke number untuk nilai)
        const formattedIndikators = indikators.map(ind => ({
            indikator: ind.indikator,
            keterangan: ind.keterangan,
            tahun: tahun,
            targets: ind.targets.map(tgt => ({
                nilai: Number(tgt.nilai), // Convert ke number
                satuan: tgt.satuan,
                tahun: tahun
            }))
        }));

        const payload = {
            parentId: parentId,
            namaPohon: namaPohon,
            keterangan: keterangan,
            tahun: tahun,
            jenisPohon: childInfo.nextJenis,
            levelPohon: childInfo.nextLevel,
            kodeOpd: "",
            kodePemda: "",
            status: "DRAFT",
            indikators: formattedIndikators
        };

        try {
            // URL sudah sesuai base_url apiClient
            const response = await apiClient.post(`/pohon-kinerja`, payload);

            if (response.data.success || response.status === 200 || response.status === 201) {
                alert("Berhasil menambahkan " + childInfo.label);
                onSuccess();
                onClose();
                // Reset Form
                setNamaPohon("");
                setKeterangan("");
                setIndikators([{ indikator: "", keterangan: "", targets: [{ nilai: "", satuan: "" }] }]);
            }
        } catch (error: any) {
            console.error("Gagal create pohon:", error);
            const errMsg = error?.response?.data?.message || "Gagal menyimpan data.";
            alert(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 flex flex-col max-h-[90vh]">
                {/* Header Modal */}
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        Tambah {childInfo.label}
                    </h3>
                    <p className="text-sm text-gray-500">Tahun Anggaran: {tahun}</p>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="form-pohon" onSubmit={handleSubmit} className="space-y-6">

                        {/* BAGIAN 1: IDENTITAS POHON */}
                        <div className="space-y-4 border-b pb-6">
                            <h4 className="font-semibold text-gray-700">A. Informasi Pohon Kinerja</h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pohon / Kinerja</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder={`Nama ${childInfo.label}`}
                                    value={namaPohon}
                                    onChange={(e) => setNamaPohon(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Pohon</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    rows={2}
                                    placeholder="Keterangan tambahan..."
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* BAGIAN 2: INDIKATOR KINERJA (DINAMIS) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-700">B. Indikator & Target</h4>
                                <button
                                    type="button"
                                    onClick={addIndikator}
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 font-medium border border-blue-200"
                                >
                                    + Tambah Indikator
                                </button>
                            </div>

                            {indikators.map((ind, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                                    {/* Tombol Hapus Indikator */}
                                    {indikators.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIndikator(idx)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                                        >
                                            Hapus
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Indikator</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: Persentase..."
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-green-500 outline-none"
                                                value={ind.indikator}
                                                onChange={(e) => handleIndikatorChange(idx, 'indikator', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Penjelasan Indikator</label>
                                            <input
                                                type="text"
                                                placeholder="Penjelasan..."
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-green-500 outline-none"
                                                value={ind.keterangan}
                                                onChange={(e) => handleIndikatorChange(idx, 'keterangan', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* NESTED TARGETS */}
                                    <div className="bg-white p-3 rounded border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-gray-500">Target (Tahun {tahun})</label>
                                            <button
                                                type="button"
                                                onClick={() => addTarget(idx)}
                                                className="text-[10px] text-blue-600 hover:underline"
                                            >
                                                + Tambah Target Lain
                                            </button>
                                        </div>

                                        {ind.targets.map((tgt, tIdx) => (
                                            <div key={tIdx} className="flex gap-2 items-center mb-2">
                                                <div className="w-1/3">
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="Nilai"
                                                        className="w-full border border-gray-300 rounded p-1.5 text-sm"
                                                        value={tgt.nilai}
                                                        onChange={(e) => handleTargetChange(idx, tIdx, 'nilai', e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Satuan (ex: %)"
                                                        className="w-full border border-gray-300 rounded p-1.5 text-sm"
                                                        value={tgt.satuan}
                                                        onChange={(e) => handleTargetChange(idx, tIdx, 'satuan', e.target.value)}
                                                    />
                                                </div>
                                                {ind.targets.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTarget(idx, tIdx)}
                                                        className="text-red-500 hover:text-red-700 text-lg px-2"
                                                        title="Hapus Target"
                                                    >
                                                        &times;
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </form>
                </div>

                {/* Footer Modal (Fixed Button) */}
                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition text-sm"
                    >
                        Batal
                    </button>
                    {/* Ganti ButtonGreen dengan button biasa */}
                    <button
                        type="submit"
                        form="form-pohon" // Attribute ini sekarang valid karena ini tag HTML standar
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};