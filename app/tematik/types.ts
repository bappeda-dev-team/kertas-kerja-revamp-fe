// app/tematik/types.ts
export interface TematikData {
    id: number;
    tema: string;
    keterangan: string;
    indikator: string; // Atau array string jika indikator banyak
    target: string;
    satuan: string;
    tahun: number;
}