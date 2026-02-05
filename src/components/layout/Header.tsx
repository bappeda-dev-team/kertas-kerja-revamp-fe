"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "@/src/lib/cookie";
import { AlertNotification } from "../global/Alert";
import { usePathname } from "next/navigation";

// JSON lokal
import opdData from "@/src/data/opd.json";
import tahunData from "@/src/data/tahun.json";

interface OptionTypeString {
  value: string;
  label: string;
}

const safeParse = (v: string | null | undefined) => {
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

const Header = () => {
  const pathname = usePathname();
  const HIDE_ON = ["/login", "/register"];
  if (HIDE_ON.includes(pathname)) return null;

  const [isClient, setIsClient] = useState(false);

  // OPD
  const [dinasOptions, setDinasOptions] = useState<OptionTypeString[]>([]);
  const [selectedDinas, setSelectedDinas] =
    useState<OptionTypeString | null>(null);

  // TAHUN
  const [tahunOptions, setTahunOptions] = useState<OptionTypeString[]>([]);
  const [selectedTahun, setSelectedTahun] =
    useState<OptionTypeString | null>(null);

  // INIT dari COOKIE
  useEffect(() => {
    setIsClient(true);
    const d = safeParse(getCookie("opd"));
    const t = safeParse(getCookie("tahun"));
    if (d) setSelectedDinas(d);
    if (t) setSelectedTahun(t);
  }, []);

  // Load OPD dari JSON
  useEffect(() => {
    if (!isClient) return;
    const options = opdData.map((it: any) => ({
      value: String(it.kode),
      label: String(it.nama),
    }));
    setDinasOptions(options);
  }, [isClient]);

  // Load TAHUN dari JSON
  useEffect(() => {
    if (!isClient) return;
    const options = tahunData.map((it: any) => ({
      value: String(it.id),
      label: it.label,
    }));
    setTahunOptions(options);
  }, [isClient]);

  // SYNC COOKIE (REAL GLOBAL STATE)
  useEffect(() => {
    if (!isClient) return;
    if (selectedDinas)
      setCookie("opd", JSON.stringify(selectedDinas));
    else Cookies.remove("opd");
  }, [isClient, selectedDinas]);

  useEffect(() => {
    if (!isClient) return;
    if (selectedTahun)
      setCookie("tahun", JSON.stringify(selectedTahun));
    else Cookies.remove("tahun");
  }, [isClient, selectedTahun]);

  const handleActivate = () => {
    if (!selectedDinas) {
      AlertNotification("Gagal", "Pilih OPD dulu", "error", 2000, true);
      return;
    }
    if (!selectedTahun) {
      AlertNotification("Gagal", "Pilih Tahun dulu", "error", 2000, true);
      return;
    }

    AlertNotification(
      "Berhasil",
      "Filter OPD & Tahun diaktifkan",
      "success",
      1200,
      false
    );

    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="bg-[#0f172a] text-white p-3 rounded-lg flex flex-col md:flex-row items-center justify-end gap-3 shadow-md border border-white/5">

      {isClient && (
        <>
          {/* OPD */}
          <div className="w-full sm:w-64 text-sm text-gray-800">
            <Select
              instanceId="select-dinas"
              value={selectedDinas}
              options={dinasOptions}
              onChange={(opt) => setSelectedDinas(opt)}
              placeholder="Pilih OPD"
              isSearchable
              isClearable
            />
          </div>

          {/* TAHUN */}
          <div className="w-full sm:w-40 text-sm text-gray-800">
            <Select
              instanceId="select-tahun"
              value={selectedTahun}
              options={tahunOptions}
              onChange={(opt) => setSelectedTahun(opt)}
              placeholder="Pilih Tahun"
              isSearchable
              isClearable
            />
          </div>
        </>
      )}

      <button
        className="bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
        onClick={handleActivate}
      >
        Aktifkan
      </button>
    </div>
  );
};

export default Header;
