"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "@/components/lib/Cookie";
import { AlertNotification } from "../global/Alert";
import { usePathname } from "next/navigation";

interface OptionTypeString {
  value: string;
  label: string;
}

const API_PERIODE =
  process.env.NEXT_PUBLIC_PERIODE_API ??
  "https://periode-service-test.zeabur.app/periode";

const PageHeader = () => {
  const pathname = usePathname();
  const HIDE_ON = ["/login", "/register"];
  const hideHeader = HIDE_ON.includes(pathname);

  const [isClient, setIsClient] = useState(false);

  // State hanya untuk Periode (sumber data tahun) dan Tahun Terpilih
  const [periodeOptions, setPeriodeOptions] = useState<OptionTypeString[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(false);
  const [periodeError, setPeriodeError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>("");

  // 1. Load Cookie Awal
  useEffect(() => {
    setIsClient(true);
    const yCookie = getCookie("selectedYear") || "";
    if (yCookie) setSelectedYear(yCookie);
  }, []);

  // 2. Fetch Data API Periode (Untuk generate list tahun)
  useEffect(() => {
    if (!isClient) return;

    const fetchPeriodeOptions = async () => {
      setLoadingPeriode(true);
      setPeriodeError(null);
      try {
        const res = await fetch(API_PERIODE, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Kita butuh data periode untuk memecah tahun awal s/d akhir
        const options: OptionTypeString[] = (json?.data ?? []).map(
          (it: any) => ({
            value: String(it.id),
            label: `${it.tahun_awal}-${it.tahun_akhir}`,
          })
        );
        setPeriodeOptions(options);
      } catch (e: any) {
        setPeriodeError(e?.message || "Gagal memuat periode");
        setPeriodeOptions([]);
      } finally {
        setLoadingPeriode(false);
      }
    };

    fetchPeriodeOptions();
  }, [isClient]);

  // 3. Simpan Cookie saat selectedYear berubah
  useEffect(() => {
    if (!isClient) return;
    if (selectedYear) setCookie("selectedYear", selectedYear);
    else Cookies.remove("selectedYear");
  }, [isClient, selectedYear]);

  // 4. Generate List Tahun dari Data Periode
  const allYearOptions: OptionTypeString[] = useMemo(() => {
    if (!periodeOptions.length) return [];
    let minStart = Infinity;
    let maxEnd = -Infinity;
    
    // Cari tahun terkecil dan terbesar dari semua periode
    for (const p of periodeOptions) {
      const [sStr, eStr] = p.label.split("-");
      const s = Number(sStr);
      const e = Number(eStr);
      if (!Number.isNaN(s) && s < minStart) minStart = s;
      if (!Number.isNaN(e) && e > maxEnd) maxEnd = e;
    }
    
    if (!Number.isFinite(minStart) || !Number.isFinite(maxEnd)) return [];
    
    const arr: OptionTypeString[] = [];
    // Loop dari tahun terbesar ke terkecil
    for (let y = maxEnd; y >= minStart; y--) {
      arr.push({ value: String(y), label: `Tahun ${y}` });
    }
    return arr;
  }, [periodeOptions]);

  // 5. Handle Tombol Aktifkan
  const handleActivate = () => {
    if (!selectedYear) {
      AlertNotification(
        "Gagal",
        "Harap pilih Tahun terlebih dahulu",
        "error",
        2000,
        true
      );
      return;
    }

    AlertNotification(
      "Berhasil",
      "Filter Tahun diaktifkan",
      "success",
      1200,
      false
    );
    setTimeout(() => window.location.reload(), 1200);
  };

  if (hideHeader) return null;

  return (
  <div className="bg-[#0f172a] text-white p-3 rounded-lg flex flex-col md:flex-row items-center justify-end gap-4 shadow-md border border-white/5">
      {/* Bagian Kiri Kosong atau bisa diisi judul halaman jika perlu */}
      
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        {isClient && (
          <Select
    instanceId="select-tahun"
    name="tahun"
    className="text-sm w-full sm:w-44 text-gray-800" // Tambahkan text-gray-800 di class induk
    classNamePrefix="rs"
    value={
        selectedYear
        ? { value: selectedYear, label: `Tahun ${selectedYear}` }
        : null
    }
    options={allYearOptions}
    onChange={(opt) => setSelectedYear(opt?.value ?? "")}
    placeholder={loadingPeriode ? "Memuat..." : "Pilih Tahun"}
    isLoading={loadingPeriode}
    isSearchable
    isClearable
    isDisabled={!allYearOptions.length}
    
    // TAMBAHKAN PROPERTI STYLES INI:
    styles={{
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        color: '#1f2937'
    }),
    control: (provided) => ({
        ...provided,
        borderColor: '#e5e7eb',
        color: '#1f2937',
        minHeight: '40px', // Menjaga konsistensi tinggi dengan tombol "Aktifkan"
        minWidth: '150px', // MENAMBAH LEBAR MINIMAL KOTAK agar teks tahun tidak terpotong
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 8px',
        overflow: 'visible', // MEMASTIKAN teks yang panjang tidak tersembunyi
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#1f2937',
        position: 'relative', // Mengubah dari absolute agar kontainer melebar mengikuti teks
        maxWidth: 'none',     // Menghapus batasan lebar teks
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : '#1f2937',
        backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
    })
}}
/>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            className="bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition w-full sm:w-auto"
            onClick={handleActivate}
          >
            Aktifkan
          </button>
          
          
        </div>
      </div>
    </div>
  );
};

export default PageHeader;