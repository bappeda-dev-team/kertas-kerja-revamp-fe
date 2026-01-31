"use client"; // 1. Wajib ada karena menggunakan useState untuk Sidebar

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import ContentContainer from '../../components/global/contentContainer';

// 2. Import komponen layout
import Sidebar from "@/src/components/global/Sidebar";
import PageHeader from "@/src/components/global/Header";
import Breadcrumb from '@/src/components/global/Breadcrumb';

const DashboardPage = () => {
  // State untuk Sidebar (Sama seperti di PohonKinerja)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    // 3. Wrapper Utama (Layout Shell)
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-800">
      
      {/* --- SIDEBAR --- */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* --- AREA KANAN (Header + Konten) --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="p-4">
          <PageHeader />
        </header>

        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Breadcrumb />
          {/* Konten Asli Dashboard Kamu */}
          <ContentContainer>
            <div className="pb-4">
              <p className="text-gray-700 text-lg font-medium">Selamat Datang, Admin Pemda!</p>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FileText color="#1679AB" size={24} />
                    <div className="flex flex-col">
                      <p className="text-gray-800 font-medium">Panduan Website</p>
                      <span className="text-gray-500 text-sm">Dokumentasi manual penggunaan aplikasi</span>
                    </div>
                </div>
                
                <a
                    href="https://drive.google.com/drive/u/1/folders/1B7V2IOXVOGd9pp8HMrf8N2VhWp3lMnCe"
                    download
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                    <Download size={18} />
                    <span>Download Manual</span>
                </a>
            </div>
          </ContentContainer>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;