"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Import CSS dan Component
import './treeflex.css';
import PohonNode from '@/components/PohonNode'; // Pastikan path ini benar sesuai struktur folder kamu

// Import Type
import { PohonKinerja, TematikItem } from '@/app/pohon-kinerja/types';

// Konfigurasi Axios Base URL
const api = axios.create({
    baseURL: 'http://localhost:8181/kertas-kerja/api/v2'
});

const PohonKinerjaPage = () => {
    // State untuk Dropdown
    const [listTematik, setListTematik] = useState<TematikItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // State untuk Tree Data
    const [treeData, setTreeData] = useState<PohonKinerja | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch List Tematik saat halaman pertama kali dimuat
    useEffect(() => {
        const fetchTematikList = async () => {
            try {
                const response = await api.get('/pohon-kinerja/tematik');
                if (response.data.success) {
                    setListTematik(response.data.data);
                }
            } catch (err) {
                console.error("Gagal load list tematik", err);
                setError("Gagal memuat daftar pohon.");
            }
        };

        fetchTematikList();
    }, []);

    // 2. Fetch Detail Pohon saat user memilih ID dari dropdown
    useEffect(() => {
        if (!selectedId) return; // Jangan fetch kalau belum ada yang dipilih

        const fetchTreeDetail = async () => {
            setLoading(true);
            setError(null);
            setTreeData(null); // Reset tree lama biar tidak bingung

            try {
                const response = await api.get(`/pohon-kinerja/${selectedId}`);
                if (response.data.success) {
                    setTreeData(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error("Gagal load tree detail", err);
                setError("Gagal memuat visualisasi pohon.");
            } finally {
                setLoading(false);
            }
        };

        fetchTreeDetail();
    }, [selectedId]); // Jalankan setiap kali selectedId berubah

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Visualisasi Pohon Kinerja
            </h1>

            {/* --- Bagian Dropdown Pilihan --- */}
            <div className="flex flex-col items-center justify-center mb-8 gap-2">
                <label className="text-sm font-semibold text-gray-600">Pilih Pohon Tematik:</label>
                <select 
                    className="p-2 border border-gray-300 rounded-md shadow-sm bg-white min-w-75 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setSelectedId(Number(e.target.value))}
                    defaultValue=""
                >
                    <option value="" disabled>-- Pilih Tematik --</option>
                    {listTematik.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.namaPohon} ({item.tahun})
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Bagian Visualisasi Tree --- */}
            <div className="w-full overflow-x-auto pb-10">
                {loading && (
                    <div className="text-center py-10 text-gray-500 animate-pulse">
                        Memuat data pohon...
                    </div>
                )}

                {error && (
                    <div className="text-center py-10 text-red-500 font-medium">
                        {error}
                    </div>
                )}

                {!loading && !error && !selectedId && (
                    <div className="text-center py-10 text-blue-400 italic">
                        Silakan pilih tematik di atas untuk melihat pohon kinerja.
                    </div>
                )}

                {!loading && !error && treeData && (
                    <div className="tf-tree tf-gap-lg flex justify-center items-start min-w-max mx-auto">
                        <ul>
                            <PohonNode node={treeData} />
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PohonKinerjaPage;