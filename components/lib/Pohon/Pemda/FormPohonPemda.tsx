'use client'

import React, { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed, ButtonRedBorder, ButtonSkyBorder } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { getOpdTahun } from '../../Cookie';
import { AlertNotification } from '@/components/global/Alert';
import Select from 'react-select';
import { Pohon } from './Pohon';
import { getToken } from '../../Cookie';
import { LoadingButtonClip, LoadingSync } from '@/components/global/Loading';
import { TbCheck, TbDeviceFloppy, TbCircleX, TbCirclePlus } from 'react-icons/tb';

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface FormValue {
    id: number;
    peryataan_kondisi?: string;
    alasan_kondisi?: string;
    data_pendukung?: string;
    data_terukur?: string;
    penyebab_permasalahan?: string;
    isu_strategis?: string;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging_program: KeteranganTaggingProgram[];
}
interface KeteranganTaggingProgram {
    kode_program_unggulan: OptionTypeString | null;
    tahun: string;
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const FormPohonPemda: React.FC<{
    formId: number;
    id: number | null;
    level: number;
    onSave?: (data: any, id: number) => void;
    onCancel?: () => void
    pokin: 'pemda' | 'opd';
}> = ({ id, level, formId, onSave, onCancel, pokin }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [BupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
    const [HariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
    const [PusatValue, setPusatValue] = useState<OptionTypeString[]>([]);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [ProgramOption, setProgramOption] = useState<OptionTypeString[]>([]);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [UnggulanBupati, setUnggulanBupati] = useState<boolean>(false);
    const [HariKerja, setHariKerja] = useState<boolean>(false);
    const [UnggulanPusat, setUnggulanPusat] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
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
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchProgramUnggulan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/program_unggulan/findbytahun/${Tahun?.value}`, {
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
            if (data == null) {
                setProgramOption([]);
                console.log(`data program unggulan belum di tambahkan / kosong`)
            } else {
                const program = data.data.map((item: any) => ({
                    value: item.kode_program_unggulan,
                    label: `${item.nama_program_unggulan} - ${item.rencana_implementasi}`,
                }));
                setProgramOption(program);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const bupatiValue = BupatiValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const hariValue = HariKerjaValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const pusatValue = PusatValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const taggingData = [
            ...(UnggulanBupati ? [{
                nama_tagging: "Program Unggulan Bupati",
                keterangan_tagging_program: bupatiValue,
            }] : []),
            ...(HariKerja ? [{
                nama_tagging: "100 Hari Kerja Bupati",
                keterangan_tagging_program: hariValue,
            }] : []),

            ...(UnggulanPusat ? [{
                nama_tagging: "Program Unggulan Pemerintah Pusat",
                keterangan_tagging_program: pusatValue,
            }] : []),
        ];
        const formData = {
            //key : value
            ...(level === 0 && {
                penyebab_permasalahan: data.penyebab_permasalahan,
                data_terukur: data.data_terukur,
            }),
            ...(level === 1 && {
                penyebab_permasalahan: data.penyebab_permasalahan,
            }),
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: level === 0 ? "Sub Tematik" :
                level === 1 ? "Sub Sub Tematik" :
                    level === 2 ? "Super Sub Tematik" :
                        level === 3 ? "Strategic Pemda" :
                            level === 4 ? "Tactical Pemda" :
                                level === 5 ? "Operational Pemda" : "Unknown",
            level_pohon: level === 0 ? 1 :
                level === 1 ? 2 :
                    level === 2 ? 3 :
                        level === 3 ? 4 :
                            level === 4 ? 5 :
                                level === 5 ? 6 : "Unknown",
            parent: id,
            tahun: Tahun?.value?.toString(),
            kode_opd: (level === 0 || level === 1 || level === 2) ? null : data.kode_opd?.value,
            status: (level === 0 || level === 1 || level === 2) ? '' : 'menunggu_disetujui',
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
            tagging: taggingData,
        };
        // console.log(formData);
        try {
            setProses(true);
            const url = '/pohon_kinerja_admin/create';
            const response = await fetch(`${API_URL}${url}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan pohon", "success", 1000);
                setIsAdded(true);
                const result = await response.json();
                const data = result.data;
                setDataAdd(data);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <React.Fragment>
            {IsAdded && DataAdd ?
                <Pohon
                    tema={DataAdd}
                    deleteTrigger={() => setDeleted((prev) => !prev)}
                    set_show_all={() => null}
                    idForm={formId}
                />
                :
                <li>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-pohon">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {level == 0 &&
                                <h1>Tambah Sub Tematik</h1>
                            }
                            {level == 1 &&
                                <h1>Tambah Sub Sub Tematik</h1>
                            }
                            {level == 2 &&
                                <h1>Tambah Super Sub Tematik</h1>
                            }
                            {level == 3 &&
                                <h1>Tambah Strategic Pemda</h1>
                            }
                            {level == 4 &&
                                <h1>Tambah Tactical Pemda</h1>
                            }
                            {level == 5 &&
                                <h1>Tambah Operational Pemda</h1>
                            }
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="nama_pohon"
                                    >
                                        {level == 0 &&
                                            "Sub Tematik"
                                        }
                                        {level == 1 &&
                                            "Sub Sub Tematik"
                                        }
                                        {level == 2 &&
                                            "Super Sub Tematik"
                                        }
                                        {level == 3 &&
                                            "Strategic Pemda"
                                        }
                                        {level == 4 &&
                                            "Tactical Pemda"
                                        }
                                        {level == 5 &&
                                            "Operational Pemda"
                                        }
                                    </label>
                                    <Controller
                                        name="nama_pohon"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="nama_pohon"
                                                type="text"
                                                placeholder="masukkan Pohon"
                                                value={field.value || NamaPohon}
                                                maxLength={255}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setNamaPohon(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                {/* TAGGING */}
                                {level > 2 &&
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Tagging :
                                        </label>
                                        <div className="border border-sky-500 rounded-lg p-3">
                                            <div className="grid grid-flow-col gap-2 items-center">
                                                <div className="flex flex-col items-center">
                                                    {UnggulanBupati ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanBupati(false)}
                                                            className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanBupati(true)}
                                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setUnggulanBupati((prev) => !prev)} className={`cursor-pointer ${UnggulanBupati && 'text-emerald-500'}`}>Program Bupati</p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    {HariKerja ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setHariKerja(false)}
                                                            className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setHariKerja(true)}
                                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setHariKerja((prev) => !prev)} className={`cursor-pointer ${HariKerja && 'text-emerald-500'}`}>100 Hari Kerja Bupati</p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    {UnggulanPusat ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanPusat(false)}
                                                            className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanPusat(true)}
                                                            className="w-[20px] h-[20px] border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setUnggulanPusat((prev) => !prev)} className={`cursor-pointer ${UnggulanPusat && 'text-emerald-500'}`}>Program Pusat</p>
                                                </div>
                                            </div>
                                            {UnggulanBupati &&
                                                <Controller
                                                    name={`tagging.0.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3 border border-emerald-500 mt-1 px-2 rounded-lg">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-1">
                                                                Keterangan Program Unggulan Bupati :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={BupatiValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setBupatiValue(option as OptionTypeString[]);
                                                                }}
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                            {HariKerja &&
                                                <Controller
                                                    name={`tagging.1.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Keterangan 100 Hari Kerja Bupati :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={HariKerjaValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setHariKerjaValue(option as OptionTypeString[]);
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                            {UnggulanPusat &&
                                                <Controller
                                                    name={`tagging.2.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Keterangan Program Unggulan Pemerintah Pusat :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={PusatValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setPusatValue(option as OptionTypeString[]);
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                        </div>
                                    </>
                                }
                                {(level === 3 || level === 4 || level === 5 || level === 6) &&
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="kode_opd"
                                        >
                                            Perangkat Daerah
                                        </label>
                                        <Controller
                                            name="kode_opd"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field}
                                                        placeholder="Masukkan Perangkat Daerah"
                                                        value={KodeOpd}
                                                        options={OpdOption}
                                                        isLoading={isLoading}
                                                        isSearchable
                                                        isClearable
                                                        onMenuOpen={() => {
                                                            if (OpdOption.length === 0) {
                                                                fetchOpd();
                                                            }
                                                        }}
                                                        onChange={(option) => {
                                                            field.onChange(option);
                                                            setKodeOpd(option);
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
                                    </div>
                                }
                                <label className="uppercase text-base font-bold text-sky-700 my-2">
                                    {
                                        level == 0 ?
                                            <h1>Indikator Sub Tematik :</h1>
                                            :
                                            level == 1 ?
                                                <h1>Indikator Sub Sub Tematik :</h1>
                                                :
                                                level == 2 ?
                                                    <h1>Indikator Super Sub Tematik :</h1>
                                                    :
                                                    level == 3 ?
                                                        <h1>Indikator Strategic :</h1>
                                                        :
                                                        level == 4 ?
                                                            <h1>Indikator Tactical :</h1>
                                                            :
                                                            level == 5 ?
                                                                <h1>Indikator Operational :</h1>
                                                                :
                                                                <h1>Indikator</h1>
                                    }
                                </label>
                                {fields.map((field, index) => (
                                    <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.nama_indikator`}
                                            control={control}
                                            defaultValue={field.nama_indikator}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Nama Indikator {index + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        maxLength={255}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan nama indikator ${index + 1}`}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {field.targets.map((_, subindex) => (
                                            <>
                                                <Controller
                                                    name={`indikator.${index}.targets.${subindex}.target`}
                                                    control={control}
                                                    defaultValue={_.target}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Target :
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                className="border px-4 py-2 rounded-lg"
                                                                placeholder="Masukkan target"
                                                            />
                                                        </div>
                                                    )}
                                                />
                                                <Controller
                                                    name={`indikator.${index}.targets.${subindex}.satuan`}
                                                    control={control}
                                                    defaultValue={_.satuan}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Satuan :
                                                            </label>
                                                            <input
                                                                {...field}
                                                                className="border px-4 py-2 rounded-lg"
                                                                placeholder="Masukkan satuan"
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </>
                                        ))}
                                        {index >= 0 && (
                                            <ButtonRedBorder
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="w-[200px] my-3"
                                            >
                                                Hapus
                                            </ButtonRedBorder>
                                        )}
                                    </div>
                                ))}
                                <ButtonSkyBorder
                                    className="flex items-center gap-1 mb-3 mt-2 w-full"
                                    type="button"
                                    onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                                >
                                    <TbCirclePlus />
                                    Tambah Indikator
                                </ButtonSkyBorder>
                                <div className="flex flex-col pb-3 pt-1 border-t-2">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="keterangan"
                                    >
                                        Keterangan:
                                    </label>
                                    <Controller
                                        name="keterangan"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="keterangan"
                                                placeholder="masukkan keterangan"
                                                value={field.value || Keterangan}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setKeterangan(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                    {Proses ?
                                        <span className="flex">
                                            <LoadingButtonClip />
                                            Menyimpan...
                                        </span>
                                        :
                                        <span className="flex items-center gap-1">
                                            <TbDeviceFloppy />
                                            Simpan
                                        </span>
                                    }
                                </ButtonSky>
                                <ButtonRed className="flex items-center gap-1  w-full my-3" onClick={onCancel}>
                                    <TbCircleX />
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                </li>
            }
        </React.Fragment>
    );
};

export const FormAmbilPohon: React.FC<{
    formId: number;
    id: number;
    level: number;
    onCancel: () => void
}> = ({ id, level, formId, onCancel }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [PohonOpd, setPohonOpd] = useState<OptionType | null>(null);
    const [Turunan, setTurunan] = useState<boolean>(false);

    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [PohonOption, setPohonOption] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
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
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchPohon = async (SelectedOpd: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const url =
                (level === 0 || level === 1 || level === 2 || level === 3)
                    ? `pohon_kinerja_opd/strategic_no_parent/${SelectedOpd}/${Tahun?.value}`
                    : level === 4
                        ? `pohon_kinerja/tactical/${SelectedOpd}/${Tahun?.value}`
                        : level === 5
                            ? `pohon_kinerja/operational/${SelectedOpd}/${Tahun?.value}`
                            : `unknown`;
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
            if (level === 0 || level === 1 || level === 2 || level === 3) {
                const pohon = data.data.map((item: any) => ({
                    value: item.id,
                    label: item.nama_pohon,
                }));
                setPohonOption(pohon);
            } else if (level === 4 || level === 5) {
                const pohon = data.data.map((item: any) => ({
                    value: item.id,
                    label: item.nama_pohon,
                }));
                setPohonOption(pohon);
            }
        } catch (err) {
            console.log('gagal mendapatkan data pohon');
        } finally {
            setIsLoading(false);
        }
    };
    const handleTurunan = () => {
        if (Turunan) {
            setTurunan(false);
        } else {
            setTurunan(true);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            id: data.pohon?.value,
            turunan: Turunan,
            parent: id,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/clone_strategic/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan pohon", "success", 1000);
                setIsAdded(true);
                const data = result.data;
                setDataAdd(data);
                console.log(result);
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <React.Fragment>
            {IsAdded && DataAdd ?
                <Pohon
                    tema={DataAdd}
                    deleteTrigger={() => setDeleted((prev) => !prev)}
                    set_show_all={() => null}
                />
                :
                <li>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-ambil">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {(level === 0 || level === 1 || level === 2 || level === 3) &&
                                <h1>Ambil Strategic </h1>
                            }
                            {level === 4 &&
                                <h1>Ambil Tactical </h1>
                            }
                            {level === 5 &&
                                <h1>Ambil Operational </h1>
                            }
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="kode_opd"
                                    >
                                        Perangkat Daerah
                                    </label>
                                    <Controller
                                        name="kode_opd"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Masukkan Perangkat Daerah"
                                                    value={KodeOpd}
                                                    options={OpdOption}
                                                    isLoading={isLoading}
                                                    isSearchable
                                                    isClearable
                                                    onMenuOpen={() => {
                                                        if (OpdOption.length === 0) {
                                                            fetchOpd();
                                                        }
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                        setKodeOpd(option);
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
                                </div>
                                {KodeOpd &&
                                    <>
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="pohon"
                                            >
                                                {(level === 0 || level === 1 || level === 2 || level === 3) &&
                                                    <h1>Strategic</h1>
                                                }
                                                {level == 4 &&
                                                    <h1>Tactical</h1>
                                                }
                                                {level == 5 &&
                                                    <h1>Operational</h1>
                                                }
                                            </label>
                                            <Controller
                                                name="pohon"
                                                control={control}
                                                rules={{ required: "Pohon Harus Terisi" }}
                                                render={({ field }) => (
                                                    <>
                                                        <Select
                                                            {...field}
                                                            placeholder="Pilih Pohon"
                                                            value={PohonOpd}
                                                            options={PohonOption}
                                                            isLoading={isLoading}
                                                            isSearchable
                                                            isClearable
                                                            onMenuOpen={() => {
                                                                if (KodeOpd?.value != null) {
                                                                    fetchPohon(KodeOpd?.value);
                                                                } else if (KodeOpd?.value == null) {
                                                                    setPohonOption([]);
                                                                    setPohonOpd(null);
                                                                }
                                                            }}
                                                            onChange={(option) => {
                                                                field.onChange(option);
                                                                setPohonOpd(option);
                                                            }}
                                                            styles={{
                                                                control: (baseStyles) => ({
                                                                    ...baseStyles,
                                                                    borderRadius: '8px',
                                                                    textAlign: 'start',
                                                                })
                                                            }}
                                                        />
                                                        {errors.pohon ?
                                                            <h1 className="text-red-500">
                                                                {errors.pohon.message}
                                                            </h1>
                                                            :
                                                            <h1 className="text-slate-300 text-xs">*Pohon Harus Terisi</h1>
                                                        }
                                                    </>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center justify-center gap-3 py-3">
                                                {Turunan ?
                                                    <button
                                                        type="button"
                                                        onClick={handleTurunan}
                                                        className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                    >
                                                        <TbCheck />
                                                    </button>
                                                    :
                                                    <button
                                                        type="button"
                                                        onClick={handleTurunan}
                                                        className="w-[20px] h-[20px] border border-black rounded-full"
                                                    ></button>
                                                }
                                                <p onClick={handleTurunan} className={`cursor-pointer ${Turunan && 'text-emerald-500'}`}>Turunan</p>
                                            </div>
                                            <h1 className="text-slate-400 text-xs">*Jika di centang, turunan pohon tersebut akan ikut terambil</h1>
                                        </div>
                                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                            {Proses ?
                                                <span className="flex">
                                                    <LoadingButtonClip />
                                                    Menyimpan...
                                                </span>
                                                :
                                                "Simpan"
                                            }
                                        </ButtonSky>
                                    </>
                                }
                                <ButtonRed className="w-full my-3" onClick={onCancel}>
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                </li>
            }
        </React.Fragment>
    );
};

export const FormEditPohon: React.FC<{
    formId: number;
    id: number;
    level: number;
    onCancel: () => void
    pokin: 'pemda' | 'opd';
    EditBerhasil: (data: any) => void;
}> = ({ id, level, EditBerhasil, onCancel, pokin }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Status, setStatus] = useState<string>('');
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [Parent, setParent] = useState<number | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [ProgramOption, setProgramOption] = useState<OptionTypeString[]>([]);
    const [BupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
    const [HariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
    const [PusatValue, setPusatValue] = useState<OptionTypeString[]>([]);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [UnggulanBupati, setUnggulanBupati] = useState<boolean>(false);
    const [HariKerja, setHariKerja] = useState<boolean>(false);
    const [UnggulanPusat, setUnggulanPusat] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [ProsesDetail, setProsesDetail] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator"
    });

    const fetchOpd = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/opd/findall`, {
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
            const opd = data.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        } catch (err) {
            console.log('gagal mendapatkan data opd');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPokinById = async () => {
            try {
                setProsesDetail(true);
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                if (data.parent) {
                    setParent(data.parent);
                }
                if (data.status) {
                    setStatus(data.status);
                }
                if (data.kode_opd) {
                    const opd = {
                        value: data.kode_opd,
                        label: data.nama_opd,
                    }
                    setKodeOpd(opd);
                }

                if (data.tagging != null) {
                    const { tagging } = data;
                    const unggulanBupatiTag = tagging?.find((t: Tagging) => t.nama_tagging === "Program Unggulan Bupati");
                    const hariKerjaTag = tagging?.find((t: Tagging) => t.nama_tagging === "100 Hari Kerja Bupati");
                    const unggulanPusatTag = tagging?.find((t: Tagging) => t.nama_tagging === "Program Unggulan Pemerintah Pusat");

                    if (unggulanBupatiTag) {
                        if (unggulanBupatiTag.keterangan_tagging_program != null) {
                            const tag = unggulanBupatiTag.keterangan_tagging_program.map((ktg: any) => ({
                                value: ktg.kode_program_unggulan,
                                label: ktg.keterangan_tagging_program,
                            }));
                            setBupatiValue(tag);
                        } else {
                            setBupatiValue([]);
                        }
                    }
                    if (hariKerjaTag) {
                        if (hariKerjaTag.keterangan_tagging_program != null) {
                            const tag = hariKerjaTag.keterangan_tagging_program.map((ktg: any) => ({
                                value: ktg.kode_program_unggulan,
                                label: ktg.keterangan_tagging_program,
                            }));
                            setHariKerjaValue(tag);
                        } else {
                            setHariKerjaValue([]);
                        }
                    }
                    if (unggulanPusatTag) {
                        if (unggulanPusatTag.keterangan_tagging_program != null) {
                            const tag = unggulanPusatTag.keterangan_tagging_program.map((ktg: any) => ({
                                value: ktg.kode_program_unggulan,
                                label: ktg.keterangan_tagging_program,
                            }));
                            setPusatValue(tag);
                        } else {
                            setPusatValue([]);
                        }
                    }
                    setUnggulanBupati(!!unggulanBupatiTag);
                    setHariKerja(!!hariKerjaTag);
                    setUnggulanPusat(!!unggulanPusatTag);
                }

                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: data.keterangan || '',
                    parent: data.parent || '',
                    pelaksana: data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || [],
                    indikator: data.indikator?.map((item: indikator) => ({
                        nama_indikator: item.nama_indikator,
                        targets: item.targets.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                });
                if (data.indikator) {
                    replace(data.indikator.map((item: indikator) => ({
                        indikator: item.nama_indikator,
                        targets: item.targets,
                    })));
                }
            } catch (err) {
                console.error(err, 'gagal mengambil data sesuai id pohon')
            } finally {
                setProsesDetail(false);
            }
        }
        fetchPokinById();
    }, [id, reset, token, replace]);

    const fetchProgramUnggulan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/program_unggulan/findbytahun/${Tahun?.value}`, {
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
            if (data == null) {
                setProgramOption([]);
                console.log(`data program unggulan belum di tambahkan / kosong`);
            } else {
                const program = data.data.map((item: any) => ({
                    value: item.kode_program_unggulan,
                    label: `${item.nama_program_unggulan} - ${item.rencana_implementasi}`,
                }));
                setProgramOption(program);
                // console.log("option : ", program);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value,
        })) || [];
        const bupatiValue = BupatiValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const hariValue = HariKerjaValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const pusatValue = PusatValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(Tahun?.value ?? ""),
        })) || [];
        const taggingData = [
            ...(UnggulanBupati ? [{
                nama_tagging: "Program Unggulan Bupati",
                keterangan_tagging_program: bupatiValue,
            }] : []),
            ...(HariKerja ? [{
                nama_tagging: "100 Hari Kerja Bupati",
                keterangan_tagging_program: hariValue,
            }] : []),

            ...(UnggulanPusat ? [{
                nama_tagging: "Program Unggulan Pemerintah Pusat",
                keterangan_tagging_program: pusatValue,
            }] : []),
        ];
        const formData = {
            //key : value
            ...(level === 1 && {
                penyebab_permasalahan: data.penyebab_permasalahan,
                data_terukur: data.data_terukur,
            }),
            ...(level === 2 && {
                penyebab_permasalahan: data.penyebab_permasalahan,
            }),
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: level === 0 ? "Tematik" :
                level === 1 ? "Sub Tematik" :
                    level === 2 ? "Sub Sub Tematik" :
                        level === 3 ? "Super Sub Tematik" :
                            level === 4 ? "Strategic Pemda" :
                                level === 5 ? "Tactical Pemda" :
                                    level === 6 ? "Operational Pemda" : "Unknown",
            level_pohon: level,
            parent: Number(Parent),
            tahun: Tahun?.value?.toString(),
            pelaksana: pelaksanaIds,
            status: Status,
            kode_opd: (level === 0 || level === 1 || level === 2 || level === 3) ? null : KodeOpd?.value,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
            tagging: taggingData
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200) {
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                const berhasil = true;
                const data = result.data;
                if (berhasil) {
                    EditBerhasil(data);
                }
            } else {
                AlertNotification("Gagal", `${result.data || 'terdapat kesalahan pada backend'}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (ProsesDetail) {
        return (
            <div className="tf-nc tf flex flex-col w-[600px] min-h-[400px] items-center justify-center rounded-lg shadow-lg shadow-slate-500">
                <LoadingSync />
            </div>
        )
    }

    return (
        <>
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-edit-pohon">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    {level == 0 &&
                        <h1>Edit Tematik </h1>
                    }
                    {level == 1 &&
                        <h1>Edit Sub Tematik</h1>
                    }
                    {level == 2 &&
                        <h1>Edit Sub Sub Tematik </h1>
                    }
                    {level == 3 &&
                        <h1>Edit Super Sub Tematik </h1>
                    }
                    {level == 4 &&
                        <h1>Edit Strategic </h1>
                    }
                    {level == 5 &&
                        <h1>Edit Tactical </h1>
                    }
                    {level == 6 &&
                        <h1>Edit Operational </h1>
                    }
                </div>
                <div className="flex justify-center my-3 w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full'
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                {level == 0 &&
                                    "Tematik"
                                }
                                {level == 1 &&
                                    "Sub Tematik"
                                }
                                {level == 2 &&
                                    "Sub Sub Tematik"
                                }
                                {level == 3 &&
                                    "Super Sub Tematik"
                                }
                                {level == 4 &&
                                    "Strategic"
                                }
                                {level == 5 &&
                                    "Tactical"
                                }
                                {level == 6 &&
                                    "Operational"
                                }
                            </label>
                            <Controller
                                name="nama_pohon"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_pohon"
                                        maxLength={255}
                                        type="text"
                                        placeholder="masukkan Pohon"
                                        value={field.value || NamaPohon}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaPohon(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {/* TAGGING */}
                        {level > 2 &&
                            <>
                                <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                    Tagging :
                                </label>
                                <div className="grid grid-flow-col gap-2 items-center border border-sky-700 rounded-lg p-3">
                                    <div className="flex flex-col items-center">
                                        {UnggulanBupati ?
                                            <button
                                                type="button"
                                                onClick={() => setUnggulanBupati(false)}
                                                className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                            >
                                                <TbCheck />
                                            </button>
                                            :
                                            <button
                                                type="button"
                                                onClick={() => setUnggulanBupati(true)}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></button>
                                        }
                                        <p onClick={() => setUnggulanBupati((prev) => !prev)} className={`cursor-pointer ${UnggulanBupati && 'text-emerald-500'}`}>Program Bupati</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        {HariKerja ?
                                            <button
                                                type="button"
                                                onClick={() => setHariKerja(false)}
                                                className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                            >
                                                <TbCheck />
                                            </button>
                                            :
                                            <button
                                                type="button"
                                                onClick={() => setHariKerja(true)}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></button>
                                        }
                                        <p onClick={() => setHariKerja((prev) => !prev)} className={`cursor-pointer ${HariKerja && 'text-emerald-500'}`}>100 Hari Kerja Bupati</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        {UnggulanPusat ?
                                            <button
                                                type="button"
                                                onClick={() => setUnggulanPusat(false)}
                                                className="border w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                            >
                                                <TbCheck />
                                            </button>
                                            :
                                            <button
                                                type="button"
                                                onClick={() => setUnggulanPusat(true)}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></button>
                                        }
                                        <p onClick={() => setUnggulanPusat((prev) => !prev)} className={`cursor-pointer ${UnggulanPusat && 'text-emerald-500'}`}>Program Pusat</p>
                                    </div>
                                </div>
                                {UnggulanBupati &&
                                    <Controller
                                        name={`tagging.0.keterangan_tagging_program`}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Keterangan Program Unggulan Bupati :
                                                </label>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih Program Unggulan"
                                                    value={BupatiValue}
                                                    options={ProgramOption}
                                                    isSearchable
                                                    isClearable
                                                    isMulti
                                                    onMenuOpen={() => {
                                                        if (ProgramOption.length === 0) {
                                                            fetchProgramUnggulan();
                                                        }
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option || []);
                                                        setBupatiValue(option as OptionTypeString[]);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                            textAlign: 'start',
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                }
                                {HariKerja &&
                                    <Controller
                                        name={`tagging.1.keterangan_tagging_program`}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Keterangan 100 Hari Kerja Bupati :
                                                </label>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih Program Unggulan"
                                                    value={HariKerjaValue}
                                                    options={ProgramOption}
                                                    isSearchable
                                                    isClearable
                                                    isMulti
                                                    onMenuOpen={() => {
                                                        if (ProgramOption.length === 0) {
                                                            fetchProgramUnggulan();
                                                        }
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option || []);
                                                        setHariKerjaValue(option as OptionTypeString[]);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                            textAlign: 'start',
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                }
                                {UnggulanPusat &&
                                    <Controller
                                        name={`tagging.2.keterangan_tagging_program`}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Keterangan Program Unggulan Pemerintah Pusat :
                                                </label>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih Program Unggulan"
                                                    value={PusatValue}
                                                    options={ProgramOption}
                                                    isSearchable
                                                    isClearable
                                                    isMulti
                                                    onMenuOpen={() => {
                                                        if (ProgramOption.length === 0) {
                                                            fetchProgramUnggulan();
                                                        }
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option || []);
                                                        setPusatValue(option as OptionTypeString[]);
                                                    }}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                            textAlign: 'start',
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                }
                            </>
                        }
                        {(level == 4 || level == 5 || level == 6) &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="kode_opd"
                                >
                                    Perangkat Daerah
                                </label>
                                <Controller
                                    name="kode_opd"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field}
                                                placeholder="Masukkan Perangkat Daerah"
                                                value={KodeOpd}
                                                options={OpdOption}
                                                isLoading={isLoading}
                                                isSearchable
                                                isClearable
                                                onMenuOpen={() => {
                                                    if (OpdOption.length === 0) {
                                                        fetchOpd();
                                                    }
                                                }}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                    setKodeOpd(option);
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
                            </div>
                        }
                        <label className="uppercase text-base font-bold text-sky-700 my-2">
                            {
                                level == 0 ?
                                    <h1>Indikator Tematik :</h1>
                                    :
                                    level == 1 ?
                                        <h1>Indikator Sub Tematik :</h1>
                                        :
                                        level == 2 ?
                                            <h1>Indikator Sub Sub Tematik :</h1>
                                            :
                                            level == 3 ?
                                                <h1>Indikator Super Sub Tematik :</h1>
                                                :
                                                level == 4 ?
                                                    <h1>Indikator Strategic :</h1>
                                                    :
                                                    level == 5 ?
                                                        <h1>Indikator Tactical :</h1>
                                                        :
                                                        level == 6 ?
                                                            <h1>Indikator Operational :</h1>
                                                            :
                                                            level >= 6 ?
                                                                <h1>Indikator Operational N :</h1>
                                                                :
                                                                <h1>Indikator</h1>
                            }
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                <Controller
                                    name={`indikator.${index}.nama_indikator`}
                                    control={control}
                                    defaultValue={field.nama_indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                Nama Indikator {index + 1} :
                                            </label>
                                            <input
                                                {...field}
                                                maxLength={255}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                                {field.targets.map((_, subindex) => (
                                    <>
                                        <Controller
                                            name={`indikator.${index}.targets.${subindex}.target`}
                                            control={control}
                                            defaultValue={_.target}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Target :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan target"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.targets.${subindex}.satuan`}
                                            control={control}
                                            defaultValue={_.satuan}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Satuan :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan satuan"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </>
                                ))}
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] my-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="flex items-center gap-1 mb-3 mt-2 w-full"
                            type="button"
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            <TbCirclePlus />
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <div className="flex flex-col pb-3 pt-1 border-t-2">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="keterangan"
                            >
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="masukkan keterangan"
                                        value={field.value || Keterangan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKeterangan(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                            {Proses ?
                                <span className="flex items-center gap-1 ">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                <span className="flex items-center gap-1 ">
                                    <TbDeviceFloppy />
                                    Simpan
                                </span>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={onCancel}>
                            <TbCircleX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        </>
    );
};
