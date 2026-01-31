// app/pohon-kinerja/utils.ts

// 1. Fungsi untuk Styling (Warna Card, Header, Badge)
export const getPohonStyle = (level: number) => {
  switch (level) {
    case 0: // TEMATIK
      return {
        card: "border-black shadow-slate-500",
        header: "border-black text-black bg-white",
        badge: "bg-gray-800 text-white"
      };
    case 1: // SUB_TEMATIK
      return {
        card: "border-gray-600 shadow-slate-500",
        header: "border-gray-600 text-black bg-gray-100",
        badge: "bg-gray-600 text-white"
      };
    case 2: // SUB_SUB_TEMATIK
    case 3: // SUPER_SUB_TEMATIK
      return {
        card: "border-gray-500 shadow-slate-500",
        header: "border-gray-500 text-black bg-gray-50",
        badge: "bg-gray-500 text-white"
      };
    case 4: // STRATEGIC_PEMDA
      return {
        card: "border-red-500 bg-red-50 shadow-red-200",
        header: "border-red-500 text-white bg-gradient-to-r from-[#CA3636] to-[#BD04A1]",
        badge: "bg-red-600 text-white"
      };
    case 5: // TACTICAL_PEMDA
      return {
        card: "border-blue-500 bg-blue-50 shadow-blue-200",
        header: "border-blue-500 text-white bg-gradient-to-r from-[#3673CA] to-[#08D2FB]",
        badge: "bg-blue-600 text-white"
      };
    case 6: // OPERATIONAL_PEMDA
      return {
        card: "border-green-500 bg-green-50 shadow-green-200",
        header: "border-green-500 text-white bg-gradient-to-r from-[#007982] to-[#2DCB06]",
        badge: "bg-green-600 text-white"
      };
    default:
      return {
        card: "border-gray-300",
        header: "border-gray-300 bg-gray-100",
        badge: "bg-gray-400"
      };
  }
};

// 2. Fungsi untuk Logika Anak (Level Selanjutnya & Jenis Pohon)
export const getChildInfo = (level: number) => {
  switch (level) {
      case 0: // Parent: TEMATIK (0) -> Child: SUB_TEMATIK (1)
          return { 
              nextLevel: 1, 
              nextJenis: 'SUB_TEMATIK', 
              label: 'Sub Tematik' 
          };
      case 1: // Parent: SUB_TEMATIK (1) -> Child: SUB_SUB_TEMATIK (2)
          return { 
              nextLevel: 2, 
              nextJenis: 'SUB_SUB_TEMATIK', 
              label: 'Sub Sub Tematik' 
          };
      case 2: // Parent: SUB_SUB_TEMATIK (2) -> Child: SUPER_SUB_TEMATIK (3)
          // Catatan: Jika di aturan bisnismu level 3 ditiadakan/langsung ke Strategic,
          // ubah nextLevel jadi 4 dan nextJenis jadi 'STRATEGIC_PEMDA'
          return { 
              nextLevel: 3, 
              nextJenis: 'SUPER_SUB_TEMATIK', 
              label: 'Super Sub Tematik' 
          };
      case 3: // Parent: SUPER_SUB_TEMATIK (3) -> Child: STRATEGIC_PEMDA (4)
          return { 
              nextLevel: 4, 
              nextJenis: 'STRATEGIC_PEMDA', 
              label: 'Strategic Pemda' 
          };
      case 4: // Parent: STRATEGIC_PEMDA (4) -> Child: TACTICAL_PEMDA (5)
          return { 
              nextLevel: 5, 
              nextJenis: 'TACTICAL_PEMDA', 
              label: 'Tactical Pemda' 
          };
      case 5: // Parent: TACTICAL_PEMDA (5) -> Child: OPERATIONAL_PEMDA (6)
          return { 
              nextLevel: 6, 
              nextJenis: 'OPERATIONAL_PEMDA', 
              label: 'Operational Pemda' 
          };
      default:
          // Level 6 (Operational) tidak punya anak lagi (return null)
          return null; 
  }
};