'use client'

import { useEffect, useState } from 'react';
import {
  TbBook, TbApps, TbChecklist, TbShoppingCartDollar,
  TbLogout, TbBook2, TbBulb, TbFileAlert, TbTooltip, TbBinaryTree, TbBuildingFortress,
  TbBuildingCommunity, TbDatabaseCog, TbHome, TbFileDelta, TbFile3D,
  TbCircleArrowLeftFilled, TbBadges, TbBuilding, TbChevronRight, TbCircleCheck,
  TbBuildingEstate, TbFileChart, TbFileDots, TbFileCode, TbFileCode2, TbUsers,
  TbUser, TbHexagonLetterR, TbBinaryTree2, TbTarget, TbMapPin, TbChartBar, TbCalendarShare,
  TbCalendar, TbHexagonLetterV, TbHexagonLetterM, TbClipboardText, TbZoomExclamation,
  TbListDetails, TbAlertTriangle, TbDatabasePlus, TbCalendarPlus, TbDeviceImacDollar, 
  TbFocus2, TbHexagonLetterC, TbHexagonLetterO, TbHexagonLetterI,
  TbBuildingCottage, TbCalendarStar, TbChartPie, TbListTree
} from "react-icons/tb";
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import "@/app/globals.css";
import { logout, getUser } from '../lib/Cookie';
import { useBrandingContext } from '@/context/BrandingContext';

interface SidebarProps {
  isOpen: boolean | null;
  isZoomed: boolean | null;
  toggleSidebar: () => void;
}

// TODO: REFACTOR SIDEBAR LOGIC
export const Sidebar = ({ isZoomed, isOpen, toggleSidebar }: SidebarProps) => {

  const [User, setUser] = useState<any>(null);
  const { id } = useParams();
  const url = usePathname();

  const { branding } = useBrandingContext();

  // MENU UTAMA
  const [DataMaster, setDataMaster] = useState<boolean | null>(null);
  const [DataMasterOpd, setDataMasterOpd] = useState<boolean | null>(null);
  const [PerencanaanKota, setPerencanaanKota] = useState<boolean | null>(null);
  const [PerencanaanOPD, setPerencanaanOPD] = useState<boolean | null>(null);
  const [Perencanaan, setPerencanaan] = useState<boolean | null>(null);
  const [Laporan, setLaporan] = useState<boolean | null>(null);
  // SUB MENU
  const [MasterProgramKegiatan, setMasterProgramKegiatan] = useState<boolean | null>(null);
  const [TematikKota, setTematikKota] = useState<boolean | null>(null);
  const [RPJMD, setRPJMD] = useState<boolean | null>(null);
  const [RKPD, setRKPD] = useState<boolean | null>(null);
  const [Renstra, setRenstra] = useState<boolean | null>(null);
  const [Renja, setRenja] = useState<boolean | null>(null);
  const [UsulanLaporan, setUsulanLaporan] = useState<boolean | null>(null);
  const [Review, setReview] = useState<boolean | null>(null);
  const [RenstraView, setRenstraView] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = getUser();
    if (fetchUser) {
      setUser(fetchUser.user);
    }
  }, [])

  useEffect(() => {
    //DATA MASTER
    if (
      url.startsWith("/DataMaster")
    ) {
      setDataMaster(true);
      setDataMasterOpd(false);
      setPerencanaanKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
      // sub menu
      setMasterProgramKegiatan(false);
    }
    if (
      url.startsWith("/DataMaster/masterprogramkegiatan")
    ) {
      setMasterProgramKegiatan(true);
    }
    //DATA MASTER OPD
    if (
      url === "/useropd" ||
      url === "/subkegiatanopd"
    ) {
      setDataMaster(false);
      setDataMasterOpd(true);
      setPerencanaanKota(false);
      setPerencanaanOPD(false);
      setLaporan(false);
    }
    //PERENCANAAN PEMDA
    if (
      url === "/CSF" || url === "/outcome" || url === "/intermediate" ||
      url.startsWith("/RKPD") ||
      url === "/tematikpemda" ||
      url === "/pohonkinerjapemda" ||
      url === "/visi" ||
      url === "/misi" ||
      url === "/tujuanpemda" ||
      url === "/sasaranpemda" ||
      url === "/ikupemda"
    ) {
      setDataMaster(false);
      setDataMasterOpd(false);
      setPerencanaanKota(true);
      setPerencanaanOPD(false);
      setLaporan(false);
      // sub menu
      setRPJMD(false);
      setRKPD(false);
      setTematikKota(false);
    }
    if (
      url === "/CSF" ||
      url === "/outcome" ||
      url === "/intermediate"
    ) {
      // sub menu
      setTematikKota(true);
      setRPJMD(false);
      setRKPD(false);
    }
    if (
      url === "/visi" ||
      url === "/misi" ||
      url === "/tujuanpemda" ||
      url === "/sasaranpemda" ||
      url === "/ikupemda"
    ) {
      // sub menu
      setRPJMD(true);
      setTematikKota(false);
      setRKPD(false);
    }
    if (
      url.startsWith("/RKPD")
    ) {
      // sub menu
      setRPJMD(false);
      setTematikKota(false);
      setRKPD(true);
    }
    //PERENCANAAN OPD
    if (
      url === "/pohonkinerjaopd" ||
      url === "/pohoncascadingopd" ||
      url === "/permasalahanopd" ||
      url === "/isustrategisopd" ||
      url === "/tujuanopd" || url === "/sasaranopd" || url === "/ikuopd" || url === "/matrix-renstra" ||
      url.startsWith("/Renja") ||
      url === "/rencanaaksiopd"
    ) {
      setDataMaster(false);
      setDataMasterOpd(false);
      setPerencanaanKota(false);
      setPerencanaanOPD(true);
      setPerencanaan(false);
      setLaporan(false);
      // sub menu
      setRenstra(false);
      setRenja(false);
    }
    if (
      url === "/permasalahanopd" ||
      url === "/isustrategisopd" ||
      url === "/tujuanopd" ||
      url === "/sasaranopd" ||
      url === "/ikuopd" ||
      url === "/matrix-renstra"
    ) {
      setRenstra(true);
      setRenja(false);
    }
    if (
      url.startsWith("/Renja")
    ) {
      setRenstra(false);
      setRenja(true);
    }
    //PERENCANAAN ASN
    if (
      url === "/musrenbang" ||
      url === "/pokokpikiran" ||
      url === "/mandatori" ||
      url === "/inisiatif" ||
      url === "/pohoncascading" ||
      url === "/rencanakinerja" ||
      url === `/rencanakinerja/${id}` ||
      url === `/rencanakinerja/manual_ik/${id}` ||
      url === "/rincianbelanja"
    ) {
      setDataMaster(false);
      setDataMasterOpd(false);
      setPerencanaanKota(false);
      setPerencanaanOPD(false);
      setPerencanaan(true);
      setLaporan(false);
    }
    if (
      url === "/musrenbang" ||
      url === "/pokokpikiran" ||
      url === "/mandatori" ||
      url === "/inisiatif"
    ) {
      setUsulanLaporan(true);
    }
    //LAPORAN
    if (
      url === "/listopd" ||
      url === "/reviewpemda" ||
      url === "/reviewopd" ||
      url === "/tujuanopdview" ||
      url === "/sasaranopdview" ||
      url === "/ikuopdview" ||
      url === `/laporanrenstra` ||
      url === "/rencanakinerja-kak" ||
      url === `/laporanrincianbelanja` ||
      url === `/laporantaggingpohon` ||
      url === `/laporancascadingpemda` ||
      url === `/controlpokin` ||
      url === `/leaderboardrekin` ||
      url === "/laporancascadingopd"
    ) {
      setDataMaster(false);
      setDataMasterOpd(false);
      setPerencanaanKota(false);
      setPerencanaanOPD(false);
      setPerencanaan(false);
      setLaporan(true);
    }
    if (
      url === "/reviewpemda" ||
      url === "/reviewopd"
    ) {
      setReview(true);
      setRenstraView(false);
    }
    if (
      url === "/tujuanopdview" ||
      url === "/sasaranopdview" ||
      url === "/ikuopdview" ||
      url === "/laporanrenstra"
    ) {
      setReview(false);
      setRenstraView(true);
    }
  }, [url, id]);

  return (
    <div className="flex">
      {/* tombol sidebar zoom 150% */}
      {isZoomed && (
        <div
          className={`fixed top-1 bg-gradient-to-bl from-[#182C4E] to-[#17212D] border border-white p-2 cursor-pointer duration-200 text-white rounded-md z-50 ${!isOpen ? 'rotate-180 ' : 'left-[13rem]'}`}
          onClick={() => toggleSidebar()}
        >
          <TbCircleArrowLeftFilled />
        </div>
      )}

      {/* awal sidebar */}
      <div className={`bg-gradient-to-bl from-[#182C4E] to-[#17212D] overflow-y-auto text-white h-full ${isOpen ? 'w-64 py-5 px-3' : 'w-0'} duration-300 fixed custom-scrollbar`}>
        <div className="flex items-center justify-center">
          <Image
            className="mb-3 transition-all duration-300 ease-in-out"
            src={branding.logo}
            // src="/universal.png"
            alt="logo"
            width={!isZoomed ? 80 : 80}
            height={!isZoomed ? 80 : 80}
          />
        </div>
        {/* tombol sidebar default */}
        {!isZoomed && (
          <div
            className={`fixed top-1 p-2 mt-5 cursor-pointer border border-white text-white duration-200 rounded-md z-50 hover:bg-white hover:text-[#182C4E] ${!isOpen ? 'rotate-180 bg-gray-800' : 'left-[13rem]'}`}
            onClick={toggleSidebar}
          >
            <TbCircleArrowLeftFilled />
          </div>
        )}
        {/* header sidebar */}
        <div className="flex gap-x-4 items-center">
          <div className={`flex flex-wrap justify-center text-white text-center text-lg ${!isOpen && 'scale-0'} duration-300`}>
            <h2 className='font-bold uppercase'>
              {branding.title}
            </h2>
            <h3 className='font-thin text-lg'>{branding.client}</h3>
          </div>
        </div>

        {/* AWAL MENU SIDEBAR */}
        <ul className="pt-6">


          {/* LABEL DASHBOARD */}
          <Link href="/">
            <li className={`flex items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ${url === "/" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
              <TbHome className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Dashboard</span>
            </li>
          </Link>



          {/* LABEL DATA MASTER */}
          {User?.roles == 'super_admin' &&
            <li
              className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
              onClick={() => setDataMaster(DataMaster ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbDatabaseCog className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Data Master</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${DataMaster ? "rotate-90" : ""}`} />
            </li>
          }
          {/* SUB MENU DATA MASTER */}
          {User?.roles == 'super_admin' &&
            <div className={`transition-all duration-300 ease-in-out ${DataMaster ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/DataMaster/masterlembaga">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterlembaga" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBuildingEstate className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Lembaga</span>
                </li>
              </Link>
              <Link href="/DataMaster/masteropd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masteropd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBuilding className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master OPD</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterrole">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterrole" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbHexagonLetterR className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Role</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterpegawai">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterpegawai" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbUsers className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Pegawai</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterperiode">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterperiode" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbCalendar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Periode</span>
                </li>
              </Link>
              <Link href="/DataMaster/masteruser">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url.startsWith("/DataMaster/masteruser") ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbUser className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master User</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterjabatan">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterjabatan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBadges className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Jabatan</span>
                </li>
              </Link>
              <Link href="/DataMaster/masterusulan">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterusulan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbApps className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Master Usulan</span>
                </li>
              </Link>
              <Link href="/DataMaster/programunggulan">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/programunggulan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbChartPie className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Program Unggulan</span>
                </li>
              </Link>
              {/* LABEL MASTER PROGRAM KEGIATAN */}
              <li
                className={`flex justify-between items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out hover:bg-slate-500`}
                onClick={() => setMasterProgramKegiatan(MasterProgramKegiatan ? false : true)}
              >
                <div className="flex items-center gap-2">
                  <TbFile3D className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} text-sm origin-left duration-200`}>Program Kegiatan</span>
                </div>
                <TbChevronRight className={`transition-all duration-200 ease-in-out ${MasterProgramKegiatan ? "rotate-90" : ""}`} />
              </li>
              {/* DATA MASTER PROGRAM KEGIATAN */}
              <div className={`transition-all duration-300 ease-in-out ${MasterProgramKegiatan ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <Link href="/DataMaster/masterprogramkegiatan/urusan">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterprogramkegiatan/urusan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFileChart className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Urusan</span>
                  </li>
                </Link>
                <Link href="/DataMaster/masterprogramkegiatan/bidangurusan">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterprogramkegiatan/bidangurusan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFileDelta className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Bidang Urusan</span>
                  </li>
                </Link>
                <Link href="/DataMaster/masterprogramkegiatan/program">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterprogramkegiatan/program" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFileDots className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Program</span>
                  </li>
                </Link>
                <Link href="/DataMaster/masterprogramkegiatan/kegiatan">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterprogramkegiatan/kegiatan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFileCode className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Kegiatan</span>
                  </li>
                </Link>
                <Link href="/DataMaster/masterprogramkegiatan/subkegiatan">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-in-out ${url === "/DataMaster/masterprogramkegiatan/subkegiatan" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFileCode2 className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sub Kegiatan</span>
                  </li>
                </Link>
              </div>
            </div>
          }


          {/* LABEL DATA MASTER OPD */}
          {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'reviewer') &&
            <li
              className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
              onClick={() => setDataMasterOpd(DataMasterOpd ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbDatabasePlus className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Data Master OPD</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${DataMasterOpd ? "rotate-90" : ""}`} />
            </li>
          }
          {/* SUB MENU DATA MASTER OPD */}
          {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'reviewer') &&
            <div className={`transition-all duration-300 ease-in-out ${DataMasterOpd ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/useropd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${(url === "/useropd" || url === "/useropd/tambah" || url === `/useropd/${id}`) ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbUser className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>User OPD</span>
                </li>
              </Link>
              <Link href="/subkegiatanopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/subkegiatanopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbFileCode2 className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sub Kegiatan OPD</span>
                </li>
              </Link>
            </div>
          }



          {/* LABEL PERENCANAAN PEMDA */}
          {(User?.roles == 'super_admin' || User?.roles == 'reviewer') &&
            <>
              <li
                className={`flex justify-between font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                onClick={() => setPerencanaanKota(PerencanaanKota ? false : true)}
              >
                <div className="flex items-center gap-2">
                  <TbBuildingFortress className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} text-sm origin-left duration-200`}>Perencanaan Pemda</span>
                </div>
                <TbChevronRight className={`transition-all duration-200 ease-in-out ${PerencanaanKota ? "rotate-90" : ""}`} />
              </li>
              {/* SUB MENU PERENCANAAN PEMDA */}
              {User?.roles != 'reviewer' ?
                <div className={`transition-all duration-300 ease-in-out ${PerencanaanKota ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <Link href="/tematikpemda">
                    <li className={`flex items-center text-sm gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/tematikpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                      <TbBinaryTree className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tematik</span>
                    </li>
                  </Link>
                  {/* LABEL TEMATIK (CSF, Outcome, intermediate) */}
                  {/* <li
                    className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                    onClick={() => setTematikKota(TematikKota ? false : true)}
                  >
                    <div className="flex items-center gap-2">
                      <TbCalendarShare className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Isu Stategis</span>
                    </div>
                    <TbChevronRight className={`transition-all duration-200 ease-in-out ${TematikKota ? "rotate-90" : ""}`} />
                  </li> */}
                  {/* SUB MENU TEMATIK (CSF, Outcome, Intermediate) */}
                  <div className={`transition-all duration-300 ease-in-out ${TematikKota ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <Link href="/CSF">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/CSF" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbHexagonLetterC className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>CSF</span>
                      </li>
                    </Link>
                    <Link href="/outcome">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/outcome" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbHexagonLetterO className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Outcome</span>
                      </li>
                    </Link>
                    <Link href="/intermediate">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/intermediate" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbHexagonLetterI className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Intermediate</span>
                      </li>
                    </Link>
                  </div>
                  <Link href="/pohonkinerjapemda">
                    <li className={`flex items-center text-sm gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohonkinerjapemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                      <TbBinaryTree className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja Pemda</span>
                    </li>
                  </Link>
                  {/* LABEL RPJMD */}
                  <li
                    className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                    onClick={() => setRPJMD(RPJMD ? false : true)}
                  >
                    <div className="flex items-center gap-2">
                      <TbCalendarShare className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>RPJMD</span>
                    </div>
                    <TbChevronRight className={`transition-all duration-200 ease-in-out ${RPJMD ? "rotate-90" : ""}`} />
                  </li>
                  {/* SUB MENU RPJMD */}
                  <div className={`transition-all duration-300 ease-in-out ${RPJMD ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <Link href="/visi">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/visi" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbHexagonLetterV className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Visi</span>
                      </li>
                    </Link>
                    <Link href="/misi">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/misi" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbHexagonLetterM className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Misi</span>
                      </li>
                    </Link>
                    <Link href="/tujuanpemda">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/tujuanpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbMapPin className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tujuan Pemda</span>
                      </li>
                    </Link>
                    <Link href="/sasaranpemda">
                      <li className={`flex items-center text-sm gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/sasaranpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbTarget className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sasaran Pemda</span>
                      </li>
                    </Link>
                    <Link href="/ikupemda">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/ikupemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbChartBar className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>IKU</span>
                      </li>
                    </Link>
                  </div>
                  {/* LABEL RKPD */}
                  <li
                    className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                    onClick={() => setRKPD(RKPD ? false : true)}
                  >
                    <div className="flex items-center gap-2">
                      <TbCalendarStar className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>RKPD</span>
                    </div>
                    <TbChevronRight className={`transition-all duration-200 ease-in-out ${RKPD ? "rotate-90" : ""}`} />
                  </li>
                  {/* SUB MENU RKPD */}
                  <div className={`transition-all duration-300 ease-in-out ${RKPD ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <Link href="/RKPD/tujuanpemda">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/RKPD/tujuanpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbMapPin className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tujuan Pemda</span>
                      </li>
                    </Link>
                    <Link href="/RKPD/sasaranpemda">
                      <li className={`flex items-center text-sm gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/RKPD/sasaranpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbTarget className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sasaran Pemda</span>
                      </li>
                    </Link>
                    <Link href="/RKPD/ikupemda">
                      <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/RKPD/ikupemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                        <TbChartBar className="text-xl" />
                        <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>IKU</span>
                      </li>
                    </Link>
                  </div>
                </div>
                :
                <div className={`transition-all duration-300 ease-in-out ${PerencanaanKota ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <Link href="/pohonkinerjapemda">
                    <li className={`flex items-center text-sm gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohonkinerjapemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                      <TbBinaryTree className="text-xl" />
                      <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja Pemda</span>
                    </li>
                  </Link>
                </div>
              }
            </>
          }



          {/* LABEL PERENCANAAN OPD */}
          {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'reviewer') &&
            <li
              className={`flex justify-between font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
              onClick={() => setPerencanaanOPD(PerencanaanOPD ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbBuildingCommunity className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Perencanaan OPD</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${PerencanaanOPD ? "rotate-90" : ""}`} />
            </li>
          }
          {/* SUB MENU PERENCANAAN OPD */}
          {(User?.roles == 'super_admin' || User?.roles == 'admin_opd') ?
            <div className={`transition-all duration-300 ease-in-out ${PerencanaanOPD ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/pohonkinerjaopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohonkinerjaopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja OPD</span>
                </li>
              </Link>
              <Link href="/pohoncascadingopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohoncascadingopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBinaryTree2 className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Cascading</span>
                </li>
              </Link>
              {/* LABEL RENSTRA */}
              <li
                className={`flex justify-between font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                onClick={() => setRenstra(Renstra ? false : true)}
              >
                <div className="flex items-center gap-2">
                  <TbBuildingCommunity className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Renstra</span>
                </div>
                <TbChevronRight className={`transition-all duration-200 ease-in-out ${Renstra ? "rotate-90" : ""}`} />
              </li>
              {/* SUBS MENU RENSTRA */}
              <div className={`transition-all duration-300 ease-in-out ${Renstra ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <Link href="/permasalahanopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/permasalahanopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbAlertTriangle className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Permasalahan</span>
                  </li>
                </Link>
                <Link href="/isustrategisopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/isustrategisopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbFocus2 className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Isu Strategis</span>
                  </li>
                </Link>
                <Link href="/tujuanopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/tujuanopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbMapPin className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tujuan OPD</span>
                  </li>
                </Link>
                <Link href="/sasaranopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/sasaranopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbTarget className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sasaran OPD</span>
                  </li>
                </Link>
                <Link href="/ikuopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/ikuopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbChartBar className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>IKU OPD</span>
                  </li>
                </Link>
                <Link href="/matrix-renstra">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/matrix-renstra" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbShoppingCartDollar className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Matrix Renstra</span>
                  </li>
                </Link>
              </div>
              {/* LABEL RENJA */}
              <li
                className={`flex justify-between font-medium items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
                onClick={() => setRenja(Renja ? false : true)}
              >
                <div className="flex items-center gap-2">
                  <TbBuildingCottage className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Renja</span>
                </div>
                <TbChevronRight className={`transition-all duration-200 ease-in-out ${Renja ? "rotate-90" : ""}`} />
              </li>
              {/* SUBS MENU RENJA */}
              <div className={`transition-all duration-300 ease-in-out ${Renja ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <Link href="/Renja/tujuanopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/Renja/tujuanopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbMapPin className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tujuan OPD</span>
                  </li>
                </Link>
                <Link href="/Renja/sasaranopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/Renja/sasaranopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbTarget className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sasaran OPD</span>
                  </li>
                </Link>
                <Link href="/Renja/ikuopd">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/Renja/ikuopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbChartBar className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>IKU OPD</span>
                  </li>
                </Link>
                <Link href="/Renja/matrix-renja">
                  <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/Renja/matrix-renja" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                    <TbShoppingCartDollar className="text-xl" />
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Matrix Renja</span>
                  </li>
                </Link>
              </div>
              <Link href="/rencanaaksiopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/rencanaaksiopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbCalendarPlus className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rencana Aksi OPD</span>
                </li>
              </Link>
            </div>
            :
            <div className={`transition-all duration-300 ease-in-out ${PerencanaanOPD ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/pohonkinerjaopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohonkinerjaopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBinaryTree className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja OPD</span>
                </li>
              </Link>
            </div>
          }



          {/* LABEL PERENCANAAN ASN */}
          {(User?.roles == 'eselon_1' || User?.roles == 'eselon_2' || User?.roles == 'eselon_3' || User?.roles == 'eselon_4' || User?.roles == 'level_1' || User?.roles == 'level_2' || User?.roles == 'level_3' || User?.roles == 'level_4') &&
            <li
              className={`flex font-medium justify-between items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 transition-all duration-300 ease-in-out`}
              onClick={() => setPerencanaan(Perencanaan ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbBuildingFortress className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Perencanaan</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${Perencanaan ? "rotate-90" : ""}`} />
            </li>
          }
          {/* SUB MENU PERENCANAAN ASN */}
          <div className={`transition-all duration-300 ease-in-out ${Perencanaan ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            {/* LABEL USULAN ASN */}
            {User?.roles == 'level_3' &&
              <li
                className="flex items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out"
                onClick={() => setUsulanLaporan(UsulanLaporan ? false : true)}
              >
                <TbApps className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Usulan</span>
              </li>
            }
            {/* subs menu USULAN ASN */}
            <div className={`transition-all duration-300 ease-in-out ${UsulanLaporan ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/musrenbang">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/musrenbang" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBook2 className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Musrenbang</span>
                </li>
              </Link>
              <Link href="/pokokpikiran">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pokokpikiran" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbBulb className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pokok Pikiran</span>
                </li>
              </Link>
              <Link href="/mandatori">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/mandatori" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbFileAlert className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Mandatori</span>
                </li>
              </Link>
              <Link href="/inisiatif">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/inisiatif" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbTooltip className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Inisiatif Bupati</span>
                </li>
              </Link>
            </div>
            <Link href="/pohonkinerjaopd">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohonkinerjaopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbBinaryTree className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Kinerja</span>
              </li>
            </Link>
            <Link href="/pohoncascading">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/pohoncascading" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbBinaryTree2 className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Pohon Cascading</span>
              </li>
            </Link>
            <Link href="/rencanakinerja">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${(url === "/rencanakinerja" || url === `/rencanakinerja/${id}` || url === `/rencanakinerja/manual_ik/${id}`) ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbChecklist className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rencana Kinerja</span>
              </li>
            </Link>
            {User?.roles == 'level_3' &&
              <Link href="/rincianbelanja">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/rincianbelanja" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbShoppingCartDollar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rincian Belanja</span>
                </li>
              </Link>
            }
          </div>



          {/* LABEL LAPORAN */}
          <li
            onClick={() => setLaporan(Laporan ? false : true)}
            className="flex justify-between font-medium items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center gap-2">
              <TbBook className="text-xl" />
              <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Laporan</span>
            </div>
            <TbChevronRight className={`transition-all duration-200 ease-in-out ${Laporan ? "rotate-90" : ""}`} />
          </li>
          {/* SUB MENU LAPORAN */}
          <div className={`transition-all duration-300 ease-in-out ${Laporan ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>

            <Link href="/listopd">
              <li className={`flex items-center gap-x-2 text-sm cursor-pointer p-2 rounded-xl ${url === "/listopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbListDetails className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>List OPD di Tematik</span>
              </li>
            </Link>
            <Link href="/controlpokin">
              <li className={`flex items-center gap-x-2 text-sm cursor-pointer p-2 rounded-xl ${url === "/controlpokin" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbListTree className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Control Pokin</span>
              </li>
            </Link>
            <Link href="/leaderboardrekin">
              <li className={`flex items-center gap-x-2 text-sm cursor-pointer p-2 rounded-xl ${url === "/leaderboardrekin" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbChartBar className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Leaderboard Rekin</span>
              </li>
            </Link>
            {/* LABEL LAPORAN REVIEW */}
            <li
              className="flex justify-between items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out"
              onClick={() => setReview(Review ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbClipboardText className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left`}>Review Pokin</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${Review ? "rotate-90" : ""}`} />
            </li>
            {/* SUBS MENU LAPORAN REVIEW */}
            <div className={`transition-all duration-300 ease-in-out ${Review ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/reviewpemda">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/reviewpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbZoomExclamation className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Review Pemda</span>
                </li>
              </Link>
              <Link href="/reviewopd">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/reviewopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbZoomExclamation className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Review OPD</span>
                </li>
              </Link>
            </div>
            {/* LABEL LAPORAN RENSTRA OPD (view only) */}
            <li
              className="flex justify-between items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl transition-all duration-300 ease-in-out"
              onClick={() => setRenstraView(RenstraView ? false : true)}
            >
              <div className="flex items-center gap-2">
                <TbBuildingCommunity className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left`}>Renstra OPD</span>
              </div>
              <TbChevronRight className={`transition-all duration-200 ease-in-out ${RenstraView ? "rotate-90" : ""}`} />
            </li>
            {/* SUBS MENU LAPORAN RENSTRA OPD */}
            <div className={`transition-all duration-300 ease-in-out ${RenstraView ? 'px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2  max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <Link href="/tujuanopdview">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/tujuanopdview" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbMapPin className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Tujuan OPD</span>
                </li>
              </Link>
              <Link href="/sasaranopdview">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/sasaranopdview" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbTarget className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Sasaran OPD</span>
                </li>
              </Link>
              <Link href="/ikuopdview">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/ikuopdview" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbChartBar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>IKU OPD</span>
                </li>
              </Link>
              <Link href="/laporanrenstra">
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/laporanrenstra" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                  <TbShoppingCartDollar className="text-xl" />
                  <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Matrix Renstra</span>
                </li>
              </Link>
            </div>
            <Link href="#">
              <li className={`flex items-center gap-x-2 text-sm cursor-pointer p-2 rounded-xl ${url === "/rencanakinerja-kak" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbChecklist className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rencana Kinerja KAK</span>
              </li>
            </Link>
            <Link href="/laporanrincianbelanja">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/laporanrincianbelanja" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbDeviceImacDollar className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Rincian Belanja</span>
              </li>
            </Link>
            <Link href="/laporantaggingpohon">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/laporantaggingpohon" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbCircleCheck className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Renaksi Tematik</span>
              </li>
            </Link>
            <Link href="/laporancascadingopd">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/laporancascadingopd" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbListDetails className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Cascading OPD</span>
              </li>
            </Link>
            <Link href="/laporancascadingpemda">
              <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl ${url === "/laporancascadingpemda" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                <TbListDetails className="text-xl" />
                <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Cascading PEMDA</span>
              </li>
            </Link>
          </div>



          {/* LOGOUT */}
          <li className="flex font-medium items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl" onClick={() => logout()}>
            <TbLogout className="text-xl text-red-500" />
            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};