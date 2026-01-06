import React, { useEffect, useState } from 'react';
import { TbEye, TbPrinter } from 'react-icons/tb';
import { ButtonSky, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { ModalCetak } from '@/components/pages/Pohon/ModalCetak';
import { ModalIndikator } from '@/components/pages/Pohon/ModalIndikator';

interface pohon {
    tema: any;
    show_all?: boolean;
    set_show_all: () => void;
}
interface ProgramKegiatan {
    jenis: string;
    tipe: string;
    program?: program[];
    kegiatan?: string;
    urusan?: urusan[];
    bidang_urusan?: bidangUrusan;
    kode?: string;
    indikator?: indikator[];
}
interface rencana_kinerja {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string; // Tahun dalam JSON adalah string
    indikator: indikator[]; // Array yang berisi objek IndikatorItem
    pegawai_id: string;
    nama_pegawai: string;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    anggaran: number;
    pagu: number;
    indikator_subkegiatan: indikator[]; // Secara eksplisit null
    kode_kegiatan: string;
    nama_kegiatan: string;
    indikator_kegiatan: indikator[]; // Secara eksplisit null
}
interface indikator {
    id_indikator: string;
    id_rekin: string;
    kode: string;
    nama_indikator: string;
    targets: target[];
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface program {
    kode_program: string;
    nama_program: string;
    indikator: indikator[];
}
interface urusan {
    kode_urusan: string;
    nama_urusan: string;
}
interface bidangUrusan {
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
}
interface Periode {
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
}
interface TujuanSasaranPemda {
    id_tujuan_pemda: number;
    tematik_id: number;
    tujuan_pemda: string;
    id_sasaran_pemda: number;
    subtema_id: number;
    sasaran_pemda: string;
    periode_id: number;
    periode: Periode;
}

export const PohonLaporan: React.FC<pohon> = ({ tema, show_all, set_show_all }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);

    const [IsCetak, setIsCetak] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (show_all) {
            setShow(true);
        }
        if (show_all && (Show === false)) {
            set_show_all();
        }
    }, [show_all, Show, set_show_all]);

    const handleShow = () => {
        setShow((prev) => !prev);
    }

    return (
        <li>
            <div
                className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                    ${(tema.jenis_pohon === "Tematik" || tema.jenis_pohon === "Sub Tematik" || tema.jenis_pohon === "Sub Sub Tematik" || tema.jenis_pohon === "Super Sub Tematik") && 'shadow-slate-500'}
                    ${(tema.jenis_pohon === "Strategic Pemda" || tema.jenis_pohon === "Tactical Pemda" || tema.jenis_pohon === "Operational Pemda") && 'shadow-slate-500'}
                    ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                    ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                    ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                    ${(tema.jenis_pohon === "Operational N") && 'shadow-green-500'}
                    ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
                `}
            >
                {/* HEADER */}
                <div
                    className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                        ${(tema.jenis_pohon === "Tematik" || tema.jenis_pohon === "Sub Tematik" || tema.jenis_pohon === "Sub Sub Tematik" || tema.jenis_pohon === "Super Sub Tematik") && 'border-black'}
                        ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                        ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                        ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === "Strategic Crosscutting") && 'border-red-500 text-red-700'}
                        ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === "Tactical Crosscutting") && 'border-blue-500 text-blue-500'}
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                    `}
                >
                    {tema.jenis_pohon === 'Operational N' ?
                        <h1>Operational {tema.level_pohon - 6} {tema.id_pohon}</h1>
                        :
                        <h1>{tema.jenis_pohon} {tema.id_pohon}</h1>
                    }
                </div>
                {/* BODY */}
                <div className="flex flex-col justify-center my-3">
                    <TablePohonLaporan item={tema} tipe="non-cetak" />
                    <div className="mt-3">
                        <Pagu
                            jenis={tema.jenis_pohon}
                            anggaran={tema.total_anggaran || tema.pagu_anggaran || tema.pagu || '0'}
                        />
                    </div>
                    {(tema.program) &&
                        <div className="mt-5">
                            <ProgramKegiatan
                                jenis={tema.jenis_pohon}
                                tipe="non-cetak"
                                program={tema.program}
                            />
                        </div>
                    }
                    {tema.urusan_pokin &&
                        tema.urusan_pokin.map((u: any, index: number) => (
                            <div className="mt-5" key={index}>
                                <ProgramKegiatan
                                    jenis={tema.jenis_pohon}
                                    tipe="non-cetak"
                                    urusan={u}
                                />
                            </div>
                        ))
                    }
                    {tema.bidang_urusan &&
                        tema.bidang_urusan.map((bu: any, index: number) => (
                            <div className="mt-5" key={index}>
                                <ProgramKegiatan
                                    jenis={tema.jenis_pohon}
                                    tipe="non-cetak"
                                    bidang_urusan={bu}
                                />
                            </div>
                        ))
                    }
                </div>
                {/* BUTTON ACTION TAMPILKAN DAN PELAKSANA*/}
                <div
                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                        ${(tema.jenis_pohon === "Tematik" || tema.jenis_pohon === "Sub Tematik" || tema.jenis_pohon === "Sub Sub Tematik" || tema.jenis_pohon === "Super Sub Tematik") && "border-black"}
                        ${(tema.jenis_pohon === "Strategic Pemda" || tema.jenis_pohon === "Tactical Pemda" || tema.jenis_pohon === "Operational Pemda") && 'border-black'}
                    `}
                >
                    <ButtonSky className='flex items-center gap-1' onClick={() => setIsCetak(true)}>
                        <TbPrinter />
                        Cetak
                    </ButtonSky>
                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg hide-on-capture`}
                        onClick={handleShow}
                    >
                        <TbEye className='mr-1' />
                        {Show ? 'Sembunyikan' : 'Tampilkan'}
                    </ButtonBlackBorder>
                </div>
            </div>
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: number) => (
                    <React.Fragment key={index}>
                        <PohonLaporan
                            tema={dahan}
                            key={index}
                            show_all={show_all}
                            set_show_all={() => set_show_all()}
                        />
                    </React.Fragment>
                ))}
            </ul>
            <ModalCetak
                jenis='laporan'
                onClose={() => setIsCetak(false)}
                isOpen={IsCetak}
                pohon={tema}
            />
        </li>
    )
}

export const TablePohonLaporan = (props: any) => {

    const nama_pohon = props.item.nama_pohon;
    const tema = props.item.tema;
    const tujuan_pemda = props.item.tujuan_pemda;
    const sasaran_pemda = props.item.sasaran_pemda;
    const urusan_pokin = props.item.urusan_pokin;
    const jenis = props.item.jenis_pohon;
    const rekin = props.item.rencana_kinerja;
    const pelaksana = props.item.pelaksana;
    const indikator = props.item.indikator;
    const tipe = props.tipe;


    return (
        <div className="flex flex-col w-full">
            <table className='mb-2'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-l-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(
                                    jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"
                                }
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {(jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && "Tema"}
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                            {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(
                                    jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"
                                }
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {tema ? tema : nama_pohon ? nama_pohon : "-"}
                        </td>
                    </tr>
                    {(jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") &&
                        (indikator ?
                            <TableIndikator indikator={indikator} jenis={jenis} />
                            :
                            <IndikatorKosong jenis={jenis} />
                        )
                    }
                </tbody>
            </table>
            {(jenis !== "Tematik" && jenis !== "Sub Tematik" && jenis !== "Sub Sub Tematik" && jenis !== "Super Sub Tematik") ?
                (
                    (rekin || pelaksana) ?
                        <TablePelaksana jenis={jenis} pelaksana={rekin || pelaksana} tipe={tipe} />
                        :
                        <PelaksanaKosong jenis={jenis} />
                )
                :
                <>
                    {jenis === "Tematik" &&
                        (tujuan_pemda ?
                            tujuan_pemda.map((tp: any, index: number) => (
                                <React.Fragment key={index}>
                                    <TableTujuanSasaran table='tujuan' data={tp} />
                                </React.Fragment>
                            ))
                            :
                            <TableTujuanSasaranKosong table='tujuan' jenis={jenis} />
                        )
                    }
                    {(jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") &&
                        (sasaran_pemda ?
                            sasaran_pemda.map((sp: any, index: number) => (
                                <React.Fragment key={index}>
                                    <TableTujuanSasaran table='sasaran' data={sp} />
                                </React.Fragment>
                            ))
                            :
                            <TableTujuanSasaranKosong table='sasaran' jenis={jenis} />
                        )
                    }
                </>
            }
        </div>
    )
}
export const Pagu: React.FC<{ jenis: string, anggaran: number }> = ({ jenis, anggaran }) => {

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    return (
        <div className="flex flex-col w-full">
            <table>
                <tbody>
                    <tr>
                        <td className={`flex items-center justify-center gap-2 px-2 py-3 rounded-lg bg-white
                                ${(
                                jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda'
                            ) && 'border border-black'}
                                ${jenis === 'Operational N' && 'border border-green-500'}
                                `}>
                            <p>Pagu : </p>
                            <div className={`py-1 px-3 rounded-lg
                                ${(jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik") && 'border border-black'}
                                ${(jenis === 'Strategic Pemda' || jenis === 'Strategic') && 'text-white bg-red-600'}    
                                ${(jenis === 'Tactical Pemda' || jenis === 'Tactical') && 'text-white bg-blue-500'}
                                ${(jenis === 'Operational Pemda' || jenis === 'Operational') && 'text-white bg-green-500'}
                                ${jenis === 'Operational N' && 'text-black border border-green-500'}
                            `}>
                                Rp. {formatRupiah(anggaran)}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export const ProgramKegiatan: React.FC<ProgramKegiatan> = ({ jenis, tipe, urusan, bidang_urusan, program, kegiatan, kode, indikator }) => {

    const [ModalCekIndikator, setModalCekIndikator] = useState<boolean>(false);
    const [DataIndikator, setDataIndikator] = useState<indikator[]>([]);
    const [Isi, setIsi] = useState<string>('');

    const handleModalIndikator = (data: indikator[], isi: string) => {
        if (ModalCekIndikator) {
            setModalCekIndikator(false);
            setDataIndikator([]);
            setIsi('')
        } else {
            setModalCekIndikator(true);
            setDataIndikator(data);
            setIsi(isi);
        }
    }

    return (
        <div className="flex flex-col w-full">
            <table>
                <thead>
                    <tr>
                        <td className={`flex items-center justify-center rounded-t-lg py-2
                            ${(
                                jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda')
                            && 'border border-black'}    
                            ${jenis === 'Strategic' && 'border-b border-red-700 bg-white'}    
                            ${jenis === 'Tactical' && 'border-b border-blue-500 bg-white'}    
                            ${jenis === 'Operational' && 'border-b border-green-500 bg-white'}  
                            ${jenis === 'Operational N' && 'border border-green-500 bg-white'}  
                        `}>
                            {urusan && "Urusan"}
                            {bidang_urusan && "Bidang Urusan"}
                            {program && "Program"}
                            {kegiatan && "Kegiatan"}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={`flex flex-col gap-4 min-w-[300px] px-4 py-3 bg-white
                            ${(
                                jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === 'Strategic Pemda' || jenis === 'Tactical Pemda' || jenis === 'Operational Pemda')
                            && 'border-b border-x border-black rounded-b-lg'}    
                            ${(jenis === 'Strategic' || jenis === 'Tactical' || jenis === 'Operational') && 'rounded-b-lg'}      
                            ${jenis === 'Operational N' && 'border-x border-b border-green-500 rounded-b-lg'}    
                        `}>
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational N') &&
                                <React.Fragment>
                                    <p className='text-center'>{kegiatan} ({kode})</p>
                                    {tipe === 'non-cetak' &&
                                        <ButtonGreenBorder
                                            className='flex items-center gap-1'
                                            onClick={() => handleModalIndikator(indikator ? indikator : [], `${kegiatan} - ${kode}`)}
                                        >
                                            <TbEye />
                                            Tampilkan indikator
                                        </ButtonGreenBorder>
                                    }
                                </React.Fragment>
                            }
                            {(jenis === "Strategic" || jenis === "Strategic Pemda" || jenis === "Tactical" || jenis === "Tactical Pemda") &&
                                program?.map((p: program, p_index) => (
                                    <React.Fragment key={p_index}>
                                        <p className='text-center'>{p.nama_program} ({p.kode_program})</p>
                                        {tipe === 'non-cetak' &&
                                            <ButtonGreenBorder
                                                className='flex items-center gap-1'
                                                onClick={() => handleModalIndikator(p.indikator ? p.indikator : [], `${p.nama_program} - (${p.kode_program})`)}
                                            >
                                                <TbEye />
                                                Tampilkan indikator
                                            </ButtonGreenBorder>
                                        }
                                    </React.Fragment>
                                ))
                            }
                            {(jenis === "Tematik") &&
                                urusan?.map((p: urusan, p_index) => (
                                    <React.Fragment key={p_index}>
                                        <p className='text-center'>{p.nama_urusan} ({p.kode_urusan})</p>
                                    </React.Fragment>
                                ))
                            }
                            {bidang_urusan &&
                                <p className='text-center'>{bidang_urusan?.nama_bidang_urusan} ({bidang_urusan?.kode_bidang_urusan})</p>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
            <ModalIndikator
                isOpen={ModalCekIndikator}
                onClose={() => handleModalIndikator([], '')}
                data={DataIndikator}
                isi={Isi}
            />
        </div>
    )
}
interface TableIndikator {
    indikator: indikator[];
    jenis: string;
}
export const TableIndikator: React.FC<TableIndikator> = ({ jenis, indikator }) => {
    return (
        indikator.map((data: indikator, index: number) => (
            <React.Fragment key={data.id_indikator}>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
                        ${(
                                jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                            ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                    `}
                    >
                        {indikator.length > 1 ?
                            <p>Indikator {index + 1}</p>
                            :
                            <p>Indikator</p>
                        }
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                        ${(
                                jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                            ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                    `}
                    >
                        {data.nama_indikator ? data.nama_indikator : "-"}
                    </td>
                </tr>
                {data.targets.map((data: target) => (
                    <tr key={data.id_target}>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                            ${(
                                    jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                                ) && "border-black"}
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}  
                        `}
                        >
                            {indikator.length > 1 ?
                                <p>Target/Satuan {index + 1}</p>
                                :
                                <p>Target/Satuan</p>
                            }
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                            ${(
                                    jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                                ) && "border-black"}
                            ${jenis === "Strategic" && "border-red-700"}
                            ${jenis === "Tactical" && "border-blue-500"}
                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                        `}
                        >
                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                        </td>
                    </tr>
                ))}
            </React.Fragment>
        ))
    )
}
interface IndikatorKosong {
    jenis: string;
}
export const IndikatorKosong: React.FC<IndikatorKosong> = ({ jenis }) => {
    return (
        <>
            <tr>
                <td
                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                        ${(
                            jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                            jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                        ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                    `}
                >
                    Indikator
                </td>
                <td
                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                        ${(
                            jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                            jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                        ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                    `}
                >
                    -
                </td>
            </tr>
            <tr>
                <td
                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                        ${(
                            jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                            jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                        ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                    `}
                >
                    Target/Satuan
                </td>
                <td
                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
                        ${(
                            jenis === "Tematik" || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                            jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda"
                        ) && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}  
                    `}
                >
                    -
                </td>
            </tr>
        </>
    )
}
interface PelaksanaKosong {
    jenis: string;
}
export const PelaksanaKosong: React.FC<PelaksanaKosong> = ({ jenis }) => {
    return (
        <table className='mt-2'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(
                                jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                            && "border-black"
                            }
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                    `}
                    >
                        Pelaksana
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg italic text-red-300
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(
                                jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                            && "border-black"
                            }
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}  
                                    `}
                    >
                        pelaksana belum di tambahkan di cascading
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
interface TablePelaksana {
    pelaksana: rencana_kinerja[];
    jenis: string;
    tipe: string;
}
export const TablePelaksana: React.FC<TablePelaksana> = ({ jenis, pelaksana, tipe }) => {

    const [ModalCekIndikator, setModalCekIndikator] = useState<boolean>(false);
    const [Isi, setIsi] = useState<string>('');
    const [DataIndikator, setDataIndikator] = useState<indikator[]>([]);


    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    const handleModalIndikator = (data: indikator[], isi: string) => {
        if (ModalCekIndikator) {
            setModalCekIndikator(false);
            setDataIndikator([]);
            setIsi(isi);
        } else {
            setModalCekIndikator(true);
            setDataIndikator(data);
            setIsi(isi);
        }
    }

    return (
        pelaksana.map((item: rencana_kinerja, index: number) => (
            <React.Fragment key={index}>
                <table className='mt-2'>
                    <tbody className='rounded-lg'>
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-tl-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(
                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"
                                    }
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                `}
                            >
                                {pelaksana.length > 1 ?
                                    <span>Rencana Kinerja {index + 1}</span>
                                    :
                                    <span>Rencana Kinerja</span>
                                }
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(
                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"
                                    }
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"} 
                                `}
                            >
                                {item.nama_rencana_kinerja || '-'}
                            </td>
                        </tr>
                        {item.indikator &&
                            item.indikator.map((i: indikator, i_index: number) => (
                                <React.Fragment key={i.id_indikator || i_index}>
                                    <tr>
                                        <td
                                            className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(
                                                    jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                                && "border-black"
                                                }
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                            `}
                                        >
                                            Indikator {item.indikator.length > 1 && `ke ${i_index + 1}`}
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(
                                                    jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                                    jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                                && "border-black"
                                                }
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"} 
                                            `}
                                        >
                                            {i.nama_indikator || "-"}
                                        </td>
                                    </tr>
                                    {i.targets?.map((t: target, t_index: number) => (
                                        <tr key={t_index}>
                                            <td
                                                className={`min-w-[100px] border px-2 py-1 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(
                                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                                    && "border-black"
                                                    }
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                                `}
                                            >
                                                Target / Satuan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                    ${(
                                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                                    && "border-black"
                                                    }
                                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"} 
                                                `}
                                            >
                                                {t.target || "-"} / {t.satuan || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        }
                        {((jenis === 'Operational' || jenis === 'Operational Pemda') && item.nama_rencana_kinerja) &&
                            <React.Fragment>
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start border-green-500`}
                                    >
                                        Anggaran
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start border-green-500`}
                                    >
                                        Rp. {formatRupiah(item.anggaran || item.pagu)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start border-green-500`}
                                    >
                                        Sub Kegiatan
                                    </td>
                                    <td
                                        className={`min-w-[300px] max-w-[400px] items-center border px-2 py-3 bg-white text-start border-green-500`}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <p>({item.kode_subkegiatan || "belum di tambahkan"}) {item.nama_subkegiatan || ""}</p>
                                            {(tipe === 'non-cetak' && item.kode_subkegiatan) &&
                                                <ButtonBlackBorder
                                                    className='flex items-center gap-1'
                                                    onClick={() => handleModalIndikator(item.indikator_subkegiatan === null ? [] : item.indikator_subkegiatan, `${item.nama_subkegiatan} - ${item.kode_subkegiatan}`)}
                                                >
                                                    <TbEye />
                                                    cek indikator
                                                </ButtonBlackBorder>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        }
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(
                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                    && "border-black"
                                    }
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                `}
                            >
                                Pelaksana
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(
                                        jenis === 'Tematik' || jenis === "Sub Tematik" || jenis === "Sub Sub Tematik" || jenis === "Super Sub Tematik" ||
                                        jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda")
                                    && "border-black"
                                    }
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                `}
                            >
                                {item.nama_pegawai}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {item.kode_kegiatan &&
                    <div className="mt-2 mb-3">
                        <ProgramKegiatan
                            jenis={jenis}
                            tipe='non-cetak'
                            kegiatan={item.nama_kegiatan}
                            kode={item.kode_kegiatan}
                            indikator={item.indikator_kegiatan}
                        />
                    </div>
                }
                <ModalIndikator
                    isOpen={ModalCekIndikator}
                    data={DataIndikator}
                    onClose={() => handleModalIndikator([], '')}
                    isi={Isi}
                />
            </React.Fragment>
        ))
    )
}
interface TableTujuanSasaran {
    table: "tujuan" | "sasaran" | "";
    data: TujuanSasaranPemda;
}
export const TableTujuanSasaran: React.FC<TableTujuanSasaran> = ({ table, data }) => {
    return (
        <table className='mt-2'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white border-black text-start rounded-l-lg`}
                    >
                        {table === "tujuan" ?
                            <p>Tujuan Pemda</p>
                            :
                            <p>Sasaran Pemda</p>
                        }
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white border-black text-start`}
                    >
                        {table === "tujuan" ?
                            <p>{data.tujuan_pemda || "-"}</p>
                            :
                            <p>{data.sasaran_pemda || "-"}</p>
                        }
                    </td>
                </tr>
                {/* <IndikatorKosong jenis={jenis}/> */}
            </tbody>
        </table>
    )
}
interface TableTujuanSasaranKosong {
    table: "tujuan" | "sasaran" | "";
    jenis: string;
}
export const TableTujuanSasaranKosong: React.FC<TableTujuanSasaranKosong> = ({ table, jenis }) => {
    return (
        <table className='mt-2'>
            <tbody>
                <tr>
                    <td
                        className={`min-w-[100px] border px-2 py-1 bg-white border-black text-start rounded-l-lg`}
                    >
                        {table === "tujuan" ?
                            <p>Tujuan Pemda</p>
                            :
                            <p>Sasaran Pemda</p>
                        }
                    </td>
                    <td
                        className={`min-w-[300px] border px-2 py-3 bg-white border-black text-start rounded-r-lg italic text-red-300`}
                    >
                        -
                    </td>
                </tr>
                <IndikatorKosong jenis={jenis} />
            </tbody>
        </table>
    )
}
