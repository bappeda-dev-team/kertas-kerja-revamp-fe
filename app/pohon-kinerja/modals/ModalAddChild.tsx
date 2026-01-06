"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { ButtonGreen } from '@/components/global/Button'; // Sesuaikan import button kamu

interface ModalAddChildProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Untuk refresh data setelah sukses
    parentId: number;
    childInfo: {
        nextLevel: number;
        nextJenis: string;
        label: string;
    };
    tahun: number;
}

export const ModalAddChild: React.FC<ModalAddChildProps> = ({ isOpen, onClose, onSuccess, parentId, childInfo, tahun }) => {
    const [namaPohon, setNamaPohon] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Payload sesuai request kamu
        const payload = {
            parentId: parentId,
            namaPohon: namaPohon,
            keterangan: keterangan,
            tahun: tahun, // Mewarisi tahun parent
            jenisPohon: childInfo.nextJenis,
            levelPohon: childInfo.nextLevel,
            kodeOpd: "",
            kodePemda: "", 
            status: "DRAFT", // Default status
            // Contoh array indikator kosong atau default sesuai request
            indikators: [
                 {
                  "indikator": "Indikator Baru",
                  "keterangan": "Keterangan Indikator",
                  "tahun": tahun,
                  "targets": [
                    { "nilai": 0, "satuan": "persen", "tahun": tahun }
                  ]
                }
            ]
        };

        try {
            const response = await axios.post('http://localhost:8181/kertas-kerja/api/v2/pohon-kinerja', payload);
            
            if (response.data.success || response.status === 200 || response.status === 201) {
                alert("Berhasil menambahkan " + childInfo.label);
                onSuccess(); // Refresh tree
                onClose();   // Tutup modal
                setNamaPohon("");
                setKeterangan("");
            }
        } catch (error) {
            console.error("Gagal create pohon:", error);
            alert("Gagal menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Tambah {childInfo.label}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pohon / Kinerja</label>
                        <input 
                            type="text" 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder={`Contoh: ${childInfo.label} ...`}
                            value={namaPohon}
                            onChange={(e) => setNamaPohon(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                            rows={3}
                            placeholder="Keterangan tambahan..."
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Batal
                        </button>
                        <ButtonGreen type="submit" disabled={isLoading}>
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </ButtonGreen>
                    </div>
                </form>
            </div>
        </div>
    );
};