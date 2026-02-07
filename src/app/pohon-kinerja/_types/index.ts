// types.ts

export interface Target {
  id: number;
  nilai: number;
  satuan: string;
  tahun: number;
}

export interface Indikator {
  id: number;
  indikator: string;
  keterangan: string;
  tahun: number;
  targets: Target[];
}

export interface PohonKinerja {
  id: number;
  parentId: number | null;
  namaPohon: string;
  keterangan: string;
  tahun: number;
  jenisPohon: string;
  levelPohon: number;
  status: string;
  kodeOpd?: string;
  kodePemda?: string;
  indikator: Indikator[]; 
  children: PohonKinerja[];
}

interface TematikItem {
    id: number;
    parentId: number | null;
    tema: string;
    jenisPohon: string;
    levelPohon: number;
    keterangan: string;
    indikator: any[];
}

export interface ApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: PohonKinerja;
}