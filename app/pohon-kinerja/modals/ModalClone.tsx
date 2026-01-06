'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification, AlertQuestion2 } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';

interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    jenis: "pemda" | "opd";
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    nama_pohon?: string;
    nama_opd?: string;
    kode_opd: string;
    tahun: string;
    onSuccess: () => void;
}
interface FormValue {
    kode_opd: string;
    tahun_sumber: string;
    tahun_tujuan: OptionTypeString;
}

export const ModalClone: React.FC<modal> = ({ isOpen, onClose, onSuccess, id, tahun, nama_pohon, kode_opd, nama_opd, jenis }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();

    const [TahunTarget, setTahunTarget] = useState<OptionTypeString | null>(null);

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        setTahunTarget(null);
        onClose();
    }

    const tahunOption = [
        { label: "2019", value: "2019" },
        { label: "2020", value: "2020" },
        { label: "2021", value: "2021" },
        { label: "2022", value: "2022" },
        { label: "2023", value: "2023" },
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" },
        { label: "2026", value: "2026" },
        { label: "2027", value: "2027" },
        { label: "2028", value: "2028" },
        { label: "2029", value: "2029" },
        { label: "2030", value: "2030" },
    ];

    const clonePokin = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataOpd = {
            //key : value
            kode_opd: kode_opd,
            tahun_sumber: String(tahun),
            tahun_tujuan: TahunTarget?.value,
        };
        const formDataPemda = {
            //key : value
            tahun_target: TahunTarget?.value,
        };
        // console.log(formDataOpd);
        // console.log(formDataPemda);
        try {
            setProses(true);
            const response = await fetch(`
                    ${jenis === 'pemda' ? 
                        `${API_URL}/clone_pokin_pemda/${id}`
                        :
                        `${API_URL}/pohon_kinerja_opd/clone`
                    }
                `, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jenis === "pemda" ? formDataPemda : formDataOpd),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "", "success", 1000);
                handleClose();
            } else {
                AlertNotification(`Gagal`, `${result.data}`, "error", 2000);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (Number(tahun) === Number(TahunTarget?.value)) {
            AlertNotification("Tahun Sekarang sama dengan Tahun Tujuan", "", "warning", 2000);
        } else if (TahunTarget?.value === undefined) {
            AlertNotification("Tahun Tujuan Wajib Diisi", "", "warning", 2000);
        } else {
            // CHECKER TRUE FALSE
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/check_pokin/${kode_opd}/${TahunTarget?.value}`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const hasil_check = await response.json();
                if (hasil_check.data === true) {
                    AlertQuestion2("Peringatan", `data pohon di tahun ${TahunTarget?.value} sudah ada (cloning tidak akan menghapus data pohon yang sudah ada di tahun ${TahunTarget?.value}), lanjutkan cloning?`, "question", "Clone", "Batal").then((result) => {
                        if (result.isConfirmed) {
                            clonePokin();
                        }
                    });
                } else {
                    clonePokin();
                }
            } catch (err) {
                AlertNotification("Error at Checker Pokin", "terdapat kesalahan pada backend / database server, cek koneksi internet", "error", 2000);
                console.error(err);
            }
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            Clone Pohon Kinerja {jenis === 'pemda' ? "Pemda" : "OPD"}
                        </div>
                        {jenis === 'pemda' &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_pohon"
                                >
                                    Nama Tematik
                                </label>
                                <div className="border px-4 py-2 rounded-lg">{nama_pohon}</div>
                            </div>
                        }
                        {jenis === 'opd' &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_opd"
                                >
                                    Nama OPD
                                </label>
                                <div className="border px-4 py-2 rounded-lg">{nama_opd}</div>
                            </div>
                        }
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_objek"
                            >
                                Tahun Sekarang
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{tahun}</div>
                        </div>
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tahun_tujuan"
                            >
                                Tahun Tujuan Clone
                            </label>
                            <Controller
                                name="tahun_tujuan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Tahun Tujuan Clone"
                                            value={TahunTarget}
                                            options={tahunOption}
                                            isSearchable
                                            isClearable
                                            // menuShouldBlockScroll={true}
                                            // menuPlacement="top"
                                            menuPortalTarget={document.body} // Render menu ke document.body
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setTahunTarget(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 9999
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButtonClip />
                                    <span>Cloning</span>
                                </>
                                :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Clone</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}