// app/tematik/types.ts
export interface TematikData {
    id: number;
    tema: string;
    keterangan: string;
    indikator: string; 
    target: string;
    satuan: string;
    tahun: number;
}

interface TargetItem {
  id: number;
  nilai: string;
  satuan: string;
}

interface IndikatorItem {
  id: number;
  indikator: string;
  keterangan: string;
  targets: TargetItem[];
}

interface TematikItem {
  id: number;
  parentId: number | null;
  tema: string;
  jenisPohon: string;
  levelPohon: number;
  keterangan: string;
  indikator: IndikatorItem[];
}