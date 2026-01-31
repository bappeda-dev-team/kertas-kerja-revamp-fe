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

export interface TematikItem {
    id: number;
    namaPohon: string;
    tahun: number;
    jenisPohon: string;
    status: string;
}

export interface ApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: PohonKinerja;
}