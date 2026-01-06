'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getOpdTahun, getToken, getUser } from "@/components/lib/Cookie";
import Select from 'react-select';
import { TbCheck, TbCircleLetterXFilled, TbHourglass, TbCircleCheckFilled } from 'react-icons/tb';
import { LoadingSync } from "@/components/global/Loading";

interface OptionType {
    value: number;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    pohon?: any;
    level?: number;
    onSuccess: () => void;
}
interface FormValue {
    parent: OptionType;
}
interface pohon {
    value: number;
    label?: string;
    id: number;
    parent: OptionType;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan?: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: string;
    nama_opd: string;
    pelaksana?: OptionTypeString[];
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging: string;
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const ModalPindahPohonOpd: React.FC<modal> = ({isOpen, onClose, onSuccess, id, pohon}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();

    const [PohonParent, setPohonParent] = useState<pohon | null>(null);
    const [Pohon, setPohon] = useState<pohon | null>(null);
    const [OptionPohonParent, setOptionPohonParent] = useState<pohon[]>([]);
    
    const [Loading, setLoading] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    
    const [User, setUser] = useState<any>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();
    
    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        if(data.tahun){
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);

    useEffect(() => {
        const fetchPohonPilihan = async() => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                    method: "GET",
                    headers : {
                        Authorization : `${token}`,
                    }
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan server backend saat fetch pohon yang akan dipindah');
                }
                const result = await response.json();
                const data = result.data;
                setPohon(data);
            } catch(err){
                console.log('gagal mendapatkan data pohon yang akan dipindahkan');
            } finally {
                setLoading(false);
            }
        }
        if(isOpen){
            fetchPohonPilihan();
        }
    }, [isOpen, id, token]);


    const fetchPohonParent = async (level: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        let url = ''; // Deklarasikan di luar blok
        setIsLoading(true);
        try {
            if (User?.roles == 'super_admin') {
                url = `pohon_kinerja/pilih_parent/${SelectedOpd?.value}/${Tahun?.value}/${level}`;
            } else {
                url = `pohon_kinerja/pilih_parent/${User?.kode_opd}/${Tahun?.value}/${level}`;
            }

            if (!url) {
                throw new Error('URL tidak valid.');
            }

            const response = await fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            if(data.data == null){
                console.log("pohon opd untuk parent kosong, tambahkan di pohon kinerja OPD untuk membuat pohon parent");
            } else if(data.data != null) {
                const parent = data.data.map((item: any) => ({
                    value: item.id,
                    label: `${item.jenis_pohon} - ${item.nama_pohon}`,
                    nama_pohon: item.nama_pohon,
                    jenis_pohon: item.jenis_pohon,
                    level_pohon: item.level_pohon,
                    nama_opd: item.nama_opd,
                    indikator: item.indikator,
                    tahun: item.tahun
                }));
                setOptionPohonParent(parent);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon dari opd', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPohonParent(null);
        onClose();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            parent: data.parent?.value
        };
        if(PohonParent == null || undefined){
            AlertNotification("pilih Parent terlebih dahulu", "", "warning", 1000);
        } else {
            // console.log(formData);
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/pindah_parent/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                if(response.ok){
                    AlertNotification("Berhasil", "Berhasil Pindah Pohon", "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
                }
            } catch(err){
                AlertNotification("Error", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
                console.error(err);
            }
        }
      };

    if(!isOpen){
        return null;
    } else {

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
            <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                       Pindah Pohon
                    </div>
                    <div className="flex-[1_1_50%] flex-col justify-center pr-2">
                        <label
                            className="uppercase text-xs font-medium text-gray-700 my-2"
                            htmlFor="parent"
                        >
                            Pilih Pohon Parent
                        </label>
                        <Controller
                            name="parent"
                            control={control}
                            render={({ field }) => (
                            <>
                                <Select
                                    {...field}
                                    placeholder="Pilih Pohon Parent"
                                    isLoading={IsLoading}
                                    value={PohonParent}
                                    options={OptionPohonParent}
                                    isSearchable
                                    isClearable
                                    onMenuOpen={() => {
                                        if(pohon?.level_pohon === 5){
                                            fetchPohonParent(4)
                                        } else if(pohon?.level_pohon === 6){
                                            fetchPohonParent(5)
                                        } else if(pohon?.level_pohon === 7){
                                            fetchPohonParent(6)
                                        } else if(pohon?.level_pohon === 8){
                                            fetchPohonParent(7)
                                        } else if(pohon?.level_pohon === 9){
                                            fetchPohonParent(8)
                                        }
                                    }}
                                    onMenuClose={() => setOptionPohonParent([])}
                                    onChange={(option) => {
                                        field.onChange(option);
                                        setPohonParent(option);
                                    }}
                                    styles={{
                                        control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderRadius: '8px',
                                        textAlign: 'start',
                                        })
                                    }}
                                />
                            </>
                            )}
                        />
                        <p className="text-xs italic text-gray-400 mt-1">*Pohon yang dipilih akan menjadi parent bagi pohon yang ingin dipindah</p>
                    </div>
                    <div className={`flex pt-2 ${PohonParent ? 'justify-around mr-4':'justify-start'}`}>
                        <p className="text-sm fotnt-bold">Preview pohon yang ingin dipindahkan :</p>
                        {PohonParent &&
                            <p className="text-sm fotnt-bold">Preview pohon parent :</p>
                        }
                    </div>
                    {/* PREVIEW KEDUA POHON */}
                    <div className="flex justify-between items-start py-2 gap-2 h-full overflow-auto">
                        {Loading ? 
                            <div className="flex w-full justify-center">
                                <LoadingSync />
                            </div>
                        :
                            <>
                                {/* POHON YANG DIPINDAH */}
                                <div className="flex flex-col w-full justify-center items-center">
                                    <div 
                                        className={`flex flex-col rounded-lg shadow-lg px-2
                                            ${pohon?.jenis_pohon === "Strategic Pemda" && 'border'}
                                            ${pohon?.jenis_pohon === "Tactical Pemda" && 'border'}
                                            ${pohon?.jenis_pohon === "OperationalPemda" && 'border'}
                                            ${pohon?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                            ${pohon?.jenis_pohon === "Tactical"&& 'bg-blue-500'}
                                            ${pohon?.jenis_pohon === "Operational" && 'bg-green-500'}
                                            ${pohon?.jenis_pohon === "Operational N" && 'bg-white'}
                                            ${(pohon?.jenis_pohon === "Strategic Crosscutting" || pohon?.jenis_pohon === "Tactical Crosscutting" || pohon?.jenis_pohon === "Operational Crosscutting" || pohon?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                        `}
                                    >
                                        <div
                                            className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                                ${pohon?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                                ${pohon?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                                ${pohon?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                                ${(pohon?.jenis_pohon === "Strategic" || pohon?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                                ${(pohon?.jenis_pohon === "Tactical" || pohon?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                                ${(pohon?.jenis_pohon === "Operational" || pohon?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                                ${(pohon?.jenis_pohon === "Operational Crosscutting" || pohon?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                            `}
                                        >
                                            {Pohon?.jenis_pohon}
                                        </div>
                                        <div className="mb-3">
                                            {Pohon &&
                                                <TablePohon item={Pohon}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* POHON PARENT */}
                                <div className="flex flex-col w-full justify-center items-center">
                                    {(PohonParent?.value != null) || (PohonParent?.value != undefined) ? 
                                        <div 
                                            className={`flex flex-col rounded-lg shadow-lg px-2
                                                ${PohonParent?.jenis_pohon === "Strategic Pemda" && 'border'}
                                                ${PohonParent?.jenis_pohon === "Tactical Pemda" && 'border'}
                                                ${PohonParent?.jenis_pohon === "OperationalPemda" && 'border'}
                                                ${PohonParent?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                                ${PohonParent?.jenis_pohon === "Tactical"&& 'bg-blue-500'}
                                                ${PohonParent?.jenis_pohon === "Operational" && 'bg-green-500'}
                                                ${PohonParent?.jenis_pohon === "Operational N" && 'bg-white'}
                                                ${(PohonParent?.jenis_pohon === "Strategic Crosscutting" || PohonParent?.jenis_pohon === "Tactical Crosscutting" || PohonParent?.jenis_pohon === "Operational Crosscutting" || PohonParent?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                            `}
                                        >
                                            <div
                                                className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                                    ${PohonParent?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                                    ${PohonParent?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                                    ${PohonParent?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                                    ${(PohonParent?.jenis_pohon === "Strategic" || PohonParent?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                                    ${(PohonParent?.jenis_pohon === "Tactical" || PohonParent?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                                    ${(PohonParent?.jenis_pohon === "Operational" || PohonParent?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                                    ${(PohonParent?.jenis_pohon === "Operational Crosscutting" || PohonParent?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                                `}
                                            >
                                                {PohonParent?.jenis_pohon}
                                            </div>
                                            <div className="mb-3">
                                                {PohonParent &&
                                                    <TablePohon item={PohonParent}/>
                                                }
                                            </div>
                                        </div>
                                    :
                                        <div className={`flex rounded-lg shadow-lg p-2 items-center`}>
                                            <p>Preview Pohon Parent setelah memilih pohon parent</p>
                                        </div>
                                    }
                                </div>
                            </>
                        }
                    </div>
                    <ButtonSky type="submit" className="w-full my-3">
                        Simpan
                    </ButtonSky>
                    <ButtonRed className="w-full my-3" onClick={handleClose}>
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    )
    }
}

export const TablePohon = ({item} : {item: pohon}) => {
    const id = item.id;
    const tema = item.nama_pohon;
    const tagging = item.tagging;
    const keterangan = item.keterangan;
    const opd = item.kode_opd;
    const nama_opd = item.nama_opd;
    const jenis = item.jenis_pohon;
    const indikator = item.indikator;
    const status = item.status;

    return (
        <div className="flex flex-col w-full">
            {/* TAGGING */}
            {tagging &&
                tagging.map((tg: Tagging, tag_index: number) => (
                    <div key={tag_index} className="flex flex-col gap-1 w-full px-3 py-1 border border-yellow-400 rounded-lg bg-white mb-2">
                        <div className='flex items-center gap-1'>
                            <h1 className='text-emerald-500'><TbCircleCheckFilled /></h1>
                            <h1 className='font-semibold'>{tg.nama_tagging || "-"}</h1>
                        </div>
                        <h1 className="p-1 text-slate-600 text-start">{tg.keterangan_tagging || ""}</h1>
                    </div>
                ))
            }
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[50px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            Nama Pohon
                        </td>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {tema ? tema : "-"}
                        </td>
                    </tr>
                    {indikator ?
                        indikator.length > 1 ?
                            indikator.map((data: any, index: number) => (
                                <React.Fragment key={data.id_indikator}>
                                    <tr>
                                        <td
                                            className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Indikator {index + 1}
                                        </td>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ? 
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan {index + 1}
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    :
                                            <tr>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    -
                                                </td>
                                            </tr>
                                    }
                                </React.Fragment>
                            ))
                            :
                            indikator.map((data: any) => (
                                <React.Fragment key={data.id_indikator}>
                                    <tr>
                                        <td
                                            className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Indikator
                                        </td>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ? 
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    :
                                            <tr>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    -
                                                </td>
                                            </tr>
                                    }
                                </React.Fragment>
                            ))
                        :
                        <>
                            <tr>
                                <td
                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    `}
                                >
                                    Indikator
                                </td>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                                >
                                    Target/Satuan
                                </td>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                        </>
                    }
                    {opd &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Kode OPD
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {opd ? opd : "-"}
                            </td>
                        </tr>
                    }
                    {nama_opd &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Perangkat Daerah
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {nama_opd ? nama_opd : "-"}
                            </td>
                        </tr>
                    }
                    {keterangan &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Keterangan
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-br-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {keterangan ? keterangan : "-"}
                            </td>
                        </tr>
                    }
                    {status &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start rounded-l-lg
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                `}
                            >
                                Status
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-r-lg
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                `}
                            >
                                {status === 'menunggu_disetujui' ? (
                                    <div className="flex items-center">
                                        Pending
                                        <TbHourglass />
                                    </div>
                                ) : status === 'crosscutting_disetujui_existing' ? (
                                    <div className="flex items-center text-green-500">
                                        Pilihan Crosscutting
                                        <TbCheck />
                                    </div>
                                ) : status === 'disetujui' ? (
                                    <div className="flex items-center text-green-500">
                                        Disetujui
                                        <TbCheck />
                                    </div>
                                ) : status === 'ditolak' ? (
                                    <div className="flex items-center text-red-500">
                                        Ditolak
                                        <TbCircleLetterXFilled />
                                    </div>
                                ) : (
                                    <span>{status || "-"}</span>
                                )}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}