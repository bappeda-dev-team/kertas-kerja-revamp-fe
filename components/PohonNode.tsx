// components/PohonNode.tsx
import React, { useState } from "react";
import { PohonKinerja, Indikator } from "@/app/pohon-kinerja/types";
import { getChildInfo, getPohonStyle } from "@/app/pohon-kinerja/utils";
// import { ButtonGreen } from "@/components/global/Button";
import { ModalReview } from "@/app/pohon-kinerja/modals/ModalReview";
import { ModalAddChild } from "@/app/pohon-kinerja/modals/ModalAddChild";
// import { ModalCetak } from "@/app/pohon-kinerja/modals/ModalCetak";

interface PohonNodeProps {
  node: PohonKinerja;
  onTreeRefresh?: () => void; // Opsional: Callback untuk refresh tree dari parent
}

const PohonNode: React.FC<PohonNodeProps> = ({ node, onTreeRefresh }) => {
  const styles = getPohonStyle(node.levelPohon);
  const childInfo = getChildInfo(node.levelPohon); // Dapat info anak (level & label)
  const hasChildren = node.children && node.children.length > 0;
  
  // State untuk Modal Add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Icon Plus (SVG)
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );

  return (
    <li>
      <div className={`tf-nc tf flex flex-col rounded-lg shadow-lg ${styles.card} max-w-sm relative`}>
        
        {/* Header Card */}
        <div className={`flex flex-col rounded-t-lg shadow-sm mb-2 border p-3 ${styles.header}`}>
          <span className="text-xs font-semibold uppercase opacity-80 mb-1">{node.jenisPohon}</span>
          <h2 className="text-sm font-bold text-center leading-tight">{node.namaPohon}</h2>
        </div>

        {/* Tabel Data */}
        <div className="bg-white p-2 rounded-b-lg">
            <table className="w-full border-collapse text-xs">
            <tbody>
                {/* ... (Bagian Indikator sama seperti sebelumnya) ... */}
                {node.indikator.length > 0 ? (
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
                                <td className="border p-2 font-semibold text-gray-600">Target</td>
                                <td className="border p-2">
                                    {ind.targets.map((t) => (
                                        <div key={t.id}>
                                            {t.nilai} {t.satuan} ({t.tahun})
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td className="border p-2 font-semibold text-gray-600">Indikator</td>
                        <td className="border p-2 text-gray-400 italic">-</td>
                    </tr>
                )}

                {/* Kolom Aksi */}
                <tr>
                    <td className="border p-2 font-semibold text-gray-600 align-middle">Aksi</td>
                    <td className="border p-2">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            
                            {/* Tombol Existing (Detail/Review) */}
                            <ModalReview
                                jenis={'baru'}
                                pokin="pemda"
                                isOpen={false}
                                onClose={() => {}}
                                idPohon={node.id}
                                onSuccess={() => {}}
                            />

                            {/* TOMBOL ADD CHILD (Hanya muncul jika childInfo ada / belum level mentok) */}
                            {childInfo && (
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-[10px] py-1 px-3 rounded-full flex items-center gap-1 transition-all shadow-md w-max"
                                >
                                    <div className="border-2 border-white rounded-full p-px">
                                      <PlusIcon />
                                    </div>
                                    <span className="font-semibold">{childInfo.label}</span>
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
      </div>
        
      {/* Render Modal Add Child */}
      {childInfo && (
          <ModalAddChild
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => {
                // Trigger refresh data di page utama jika prop onTreeRefresh diberikan
                if (onTreeRefresh) onTreeRefresh();
                // Atau reload window sementara
                else window.location.reload(); 
            }}
            parentId={node.id}
            childInfo={childInfo}
            tahun={node.tahun}
          />
      )}

      {/* Rekursif Children */}
      {hasChildren && (
        <ul>
          {node.children.map((child) => (
            <PohonNode 
                key={child.id} 
                node={child} 
                onTreeRefresh={onTreeRefresh} // Pass function refresh ke anak
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default PohonNode;