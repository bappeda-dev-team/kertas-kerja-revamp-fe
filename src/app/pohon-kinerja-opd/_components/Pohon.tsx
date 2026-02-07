// components/PohonNodeOpd.tsx
"use client";

import React, { useState } from "react";
import { PohonKinerja, Indikator } from "@/src/app/pohon-kinerja-opd/_types";
import { getChildInfo, getPohonStyle } from "@/src/app/pohon-kinerja-opd/_utils";
import { FormAddChildModal } from "@/src/app/pohon-kinerja-opd/_components/_modals/ModalAdd";
import { FormEditNode } from "@/src/app/pohon-kinerja-opd/_components/_modals/ModalEdit";
import { getCookie } from "@/src/lib/cookie";

interface PohonNodeOpdProps {
  node: PohonKinerja;
  onTreeRefresh?: () => void;
  onDeleteAction?: (nodeId: number) => void;
  isRoot?: boolean; 
}

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

const getButtonColor = (jenisPohon: string) => {
  if (jenisPohon === 'STRATEGIC_PEMDA') return 'border-[#3072D6] text-[#3072D6] hover:bg-[#3072D6]';
  if (jenisPohon === 'SUPER_SUB_TEMATIK') return 'border-[#D20606] text-[#D20606] hover:bg-[#D20606]';
  return 'border-[#00A607] text-[#00A607] hover:bg-[#00A607]';
};

const PohonNodeOpd: React.FC<PohonNodeOpdProps> = ({ node, onTreeRefresh, onDeleteAction, isRoot = false }) => {
  const styles = getPohonStyle(node.levelPohon);
  const childInfo = getChildInfo(node.levelPohon);
  const hasChildren = node.children && node.children.length > 0;

  // State
  const [isExpanded, setIsExpanded] = useState(false); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getContextFromCookie = () => {
    try {
      const opdRaw = getCookie("opd");
      const tahunRaw = getCookie("tahun");
      
      let kodeOpd = "";
      let tahun = new Date().getFullYear();

      if (opdRaw) {
        const parsedOpd = JSON.parse(opdRaw);
        kodeOpd = parsedOpd.value || parsedOpd.kode || "";
      }

      if (tahunRaw) {
        const parsedTahun = JSON.parse(tahunRaw);
        tahun = Number(parsedTahun.value || parsedTahun.tahun || tahun);
      }

      return { kodeOpd, tahun };
    } catch (error) {
      console.warn("Gagal parsing cookie, menggunakan default", error);
      return { kodeOpd: "", tahun: new Date().getFullYear() };
    }
  };

  const { kodeOpd, tahun } = getContextFromCookie();

  // --- HANDLER ---
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getLabelTampilkan = () => {
    if (isExpanded) {
      return isRoot ? "Sembunyikan Anak" : "Sembunyikan";
    } else {
      return isRoot ? "Tampilkan Anak" : "Tampilkan";
    }
  };

  // Icon Components
  const IconAdd = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path><path d="M9 12h6"></path><path d="M12 9v6"></path></svg>);
  const IconEdit = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path><path d="M13.5 6.5l4 4"></path></svg>);
  const IconDelete = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
  const IconCetak = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 w-3.5 h-3.5"><path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"></path><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4"></path><path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"></path></svg>);
  const IconEye = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>);
  const IconEyeOff = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path><path d="M3 3l18 18"></path></svg>);

  return (
    <li>
      {/* --- LOGIC RENDER CARD UTAMA --- */}
      {isEditing ? (
        <div className="tf-nc" style={{ padding: 0, border: 'none', background: 'transparent' }}>
          <FormEditNode
            node={node}
            // Passing context OPD dan Tahun ke Form Edit
            kodeOpd={kodeOpd}
            tahun={tahun}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => {
              setIsEditing(false);
              if (onTreeRefresh) onTreeRefresh();
            }}
          />
        </div>
      ) : (
        <div className={`tf-nc tf flex flex-col rounded-lg shadow-lg ${styles.card} max-w-sm relative`}>
          {/* Header Card */}
          <div className={`flex flex-col rounded-lg shadow-sm mb-2 border p-3 ${styles.header} ${getHeaderStyle(node.jenisPohon)}`}>
            <span className="text-xs text-center font-bold uppercase opacity-80">{node.jenisPohon?.replace(/_/g, " ")} - {node.id}</span>
          </div>

          {/* Body Card */}
          <div className="bg-white p-2 rounded-b-lg">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold text-gray-600 w-24">Tema </td>
                  <td className="border p-2">{node.namaPohon}</td>
                </tr>
                {node.indikator && node.indikator.length > 0 ? (
                  node.indikator.map((ind: Indikator, idx: number) => (
                    <React.Fragment key={ind.id}>
                      <tr>
                        <td className="border p-2 font-semibold text-gray-600 w-24">Indikator {idx + 1}</td>
                        <td className="border p-2">
                          <div className={`${styles.badge} inline-block px-2 py-1 rounded text-[10px]`}>
                            {ind.indikator}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold text-gray-600">Target/Satuan</td>
                        <td className="border p-2">
                          {ind.targets.map((t) => (
                            <div key={t.id}>{t.nilai}/{t.satuan}</div>
                          ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <tr><td className="border p-2 font-semibold text-gray-600">Indikator</td><td className="border p-2 text-gray-400 italic">-</td></tr>
                    <tr><td className="border p-2 font-semibold text-gray-600">Target/Satuan</td><td className="border p-2 text-gray-400 italic">-</td></tr>
                  </>
                )}
                <tr>
                  <td className="border p-2 font-semibold text-gray-600 w-24">Keterangan</td>
                  <td className="border p-2">{node.keterangan || <span className="text-gray-400 italic">-</span>}</td>
                </tr>
              </tbody>
            </table>

            {/* Area Tombol Aksi */}
            <div className="flex-wrap">
              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  <IconEdit /> Edit
                </button>

                <button className="px-2 py-1 text-xs whitespace-nowrap flex justify-center items-center bg-linear-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm">
                  <IconCetak />
                  <span className="font-semibold">Cetak</span>
                </button>

                <button
                  onClick={() => onDeleteAction && onDeleteAction(node.id)}
                  className="px-2 py-1 whitespace-nowrap flex justify-center items-center bg-linear-to-r border-2 border-[#D63030] hover:bg-[#D63030] text-[#D63030] hover:text-white rounded-md transition-colors"
                >
                  <IconDelete /> Hapus
                </button>
              </div>

              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                {childInfo && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={`px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-white border-2 transition-colors hover:text-white ${getButtonColor(node.jenisPohon)}`}
                  >
                    <IconAdd />
                    {childInfo.label}
                  </button>
                )}

                {node.levelPohon < 3 && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-white border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white transition-colors"
                  >
                    <IconAdd />
                    Strategic Pemda
                  </button>
                )}
              </div>
              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">  
                {hasChildren && (
                  <button
                    onClick={handleToggleExpand}
                    className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    {isExpanded ? <IconEyeOff /> : <IconEye />}
                    <span className="font-semibold">{getLabelTampilkan()}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIC RENDER ANAK & FORM TAMBAH --- */}
      {(isExpanded || isAddModalOpen) && (hasChildren || isAddModalOpen) && (
        <ul>
          {/* 1. Render Anak-anak */}
          {isExpanded && hasChildren && node.children.map((child) => (
            <PohonNodeOpd
              key={child.id}
              node={child}
              onTreeRefresh={onTreeRefresh}
              onDeleteAction={onDeleteAction}
              isRoot={false}
            />
          ))}

          {/* 2. Render Form Tambah */}
          {isAddModalOpen && childInfo && (
            <li>
              <div className="tf-nc" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                <FormAddChildModal
                  parentId={node.id}
                  childInfo={childInfo}
                  // Passing context OPD dan Tahun ke Form Add
                  kodeOpd={kodeOpd}
                  tahun={tahun} 
                  onCancel={() => setIsAddModalOpen(false)}
                  onSuccess={() => {
                    setIsAddModalOpen(false);
                    if (onTreeRefresh) onTreeRefresh();
                    else window.location.reload();
                  }}
                />
              </div>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default PohonNodeOpd;