'use client'

import React, { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { getOpdTahun } from '../../Cookie';
import { AlertNotification } from '@/components/global/Alert';
import { PohonOpd } from './PohonOpd';
import { getToken, getUser } from '../../Cookie';
import { LoadingButtonClip, LoadingSync } from '@/components/global/Loading';
import { TbCirclePlus, TbCircleX, TbDeviceFloppy, TbCheck } from 'react-icons/tb';
import Select from 'react-select';

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
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
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

export const FormPohonOpd: React.FC<{
    formId: number;
    id: number | null;
    level: number;
    deleteTrigger: () => void;
    fetchTrigger: () => void;
    onCancel?: () => void
}> = ({ id, level, onCancel, deleteTrigger, fetchTrigger }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [BupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
    const [HariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
    const [PusatValue, setPusatValue] = useState<OptionTypeString[]>([]);
    const [ProgramOption, setProgramOption] = useState<OptionTypeString[]>([]);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [UnggulanBupati, setUnggulanBupati] = useState<boolean>(false);
    const [HariKerja, setHariKerja] = useState<boolean>(false);
    const [UnggulanPusat, setUnggulanPusat] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
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
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: level === 0 ? "Sub Tematik" :
                level === 1 ? "Sub Sub Tematik" :
                    level === 2 ? "Super Sub Tematik" :
                        level === 3 ? "Strategic" :
                            level === 4 ? "Tactical" :
                                level === 5 ? "Operational" : "Operational N",
            level_pohon: level >= 0 && level <= 20 ? level + 1 : "Unknown",
            parent: id,
            tahun: Tahun?.value?.toString(),
            kode_opd: user?.roles == 'super_admin' ? SelectedOpd?.value : user?.kode_opd,
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
            const url = '/pohon_kinerja_opd/create';
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
                <PohonOpd
                    tema={DataAdd}
                    deleteTrigger={deleteTrigger}
                    fetchTrigger={fetchTrigger}
                    set_show_all={() => null}
                />
                :
                <li className='form-pohon-opd'>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {
                                level == 3 ?
                                    <h1>Tambah Strategic Baru </h1>
                                    :
                                    level == 4 ?
                                        <h1>Tambah Tactical Baru </h1>
                                        :
                                        level == 5 ?
                                            <h1>Tambah Operational Baru </h1>
                                            :
                                            <h1>Tambah Operational N Baru </h1>
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
                                        {level == 0 ?
                                            "Sub Tematik"
                                            :
                                            level == 1 ?
                                                "Sub Sub Tematik"
                                                :
                                                level == 2 ?
                                                    "Super Sub Tematik"
                                                    :
                                                    level == 3 ?
                                                        "Strategic"
                                                        :
                                                        level == 4 ?
                                                            "Tactical"
                                                            :
                                                            level == 5 ?
                                                                "Operational"
                                                                :
                                                                "Operational N"
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
                                                maxLength={255}
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
                                            name={`tagging.0.keterangan_tagging_program`}
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
                                                        onMenuOpen={() => {
                                                            if (ProgramOption.length === 0) {
                                                                fetchProgramUnggulan();
                                                            }
                                                        }}
                                                        isClearable
                                                        isMulti
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
                                </div>
                                <label className="uppercase text-base font-bold text-sky-700 my-2">
                                    {level == 4 ?
                                        <h1>Indikator Tactical :</h1>
                                        :
                                        level == 5 ?
                                            <h1>Indikator Operational :</h1>
                                            :
                                            level >= 5 ?
                                                <h1>Indikator Operational N :</h1>
                                                :
                                                <h1>Indikator Strategic :</h1>
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
                                <ButtonSky
                                    type="submit"
                                    className="w-full my-3"
                                    disabled={Proses}
                                >
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
    EditBerhasil: (data: any) => void;
}> = ({ id, level, onCancel, EditBerhasil }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Parent, setParent] = useState<number | null>(null);
    const [KodeOpd, setKodeOpd] = useState<number | null>(null);
    const [BupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
    const [HariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
    const [PusatValue, setPusatValue] = useState<OptionTypeString[]>([]);
    const [JenisPohon, setJenisPohon] = useState<string | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [ProgramOption, setProgramOption] = useState<OptionTypeString[]>([]);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [UnggulanBupati, setUnggulanBupati] = useState<boolean>(false);
    const [HariKerja, setHariKerja] = useState<boolean>(false);
    const [UnggulanPusat, setUnggulanPusat] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [ProsesDetail, setProsesDetail] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
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
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailPohon = async () => {
            try {
                setProsesDetail(true);
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
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
                // console.log(data);
                if (data.parent) {
                    setParent(data.parent);
                }
                if (data.kode_opd) {
                    setKodeOpd(data.kode_opd);
                }
                if (data.jenis_pohon) {
                    setJenisPohon(data.jenis_pohon);
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
                setPelaksana(
                    data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || []
                );
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
        fetchDetailPohon();
    }, [id, reset, token, replace]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
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
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: JenisPohon,
            level_pohon: level,
            parent: Number(Parent),
            pelaksana: pelaksanaIds,
            tahun: Tahun?.value?.toString(),
            kode_opd: KodeOpd,
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
            const url = `/pohon_kinerja_opd/update/${id}`;
            const response = await fetch(`${API_URL}${url}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                const berhasil = true;
                const data = result.data;
                if (berhasil) {
                    EditBerhasil(data);
                }
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

    if (ProsesDetail) {
        return (
            <div className="tf-nc tf flex flex-col w-[600px] min-h-[400px] items-center justify-center rounded-lg shadow-lg shadow-slate-500">
                <LoadingSync />
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-edit-pohon">
                <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                    {level == 4 ?
                        <h1>Edit Strategic </h1>
                        :
                        level == 5 ?
                            <h1>Edit Tactical </h1>
                            :
                            level == 6 ?
                                <h1>Edit Operational </h1>
                                :
                                <h1>Edit Operational N</h1>
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
                                        type="text"
                                        maxLength={255}
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
                                    name={`tagging.0.keterangan_tagging_program`}
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
                        </div>
                        <label className="uppercase text-base font-bold text-sky-700 my-2">
                            {level == 4 ?
                                <h1>Indikator Strategic :</h1>
                                :
                                level == 5 ?
                                    <h1>Indikator Tactical :</h1>
                                    :
                                    level == 6 ?
                                        <h1>Indikator Operational :</h1>
                                        :
                                        <h1>Indikator Operational N :</h1>
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
                                    <div key={subindex}>
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
                                    </div>
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

        </React.Fragment>
    );
};
