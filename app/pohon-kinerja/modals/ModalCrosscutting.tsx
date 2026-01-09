'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
// import { getOpdTahun, getToken } from "@/components/lib/Cookie";
import Select from 'react-select';

interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    level?: number;
    nama_pohon: string;
    // onSuccess: () => void;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const ModalAddCrosscutting: React.FC<modal> = ({isOpen, onClose, id, nama_pohon}) => {

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<FormValue>();
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [Parent, setParent] = useState<string>('');
    const [JenisPohon, setJenisPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [LevelPohon, setLevelPohon] = useState<number | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    // const token = getToken();
    
    // useEffect(() => {
    //     const data = getOpdTahun();
    //     if(data.tahun){
    //         const tahun = {
    //             value: data.tahun.value,
    //             label: data.tahun.label,
    //         }
    //         setTahun(tahun);
    //     }
    //     if(data.opd){
    //         const opd = {
    //             value: data.opd.value,
    //             label: data.opd.label,
    //         }
    //         setSelectedOpd(opd);
    //     }
    // },[]);

    const { replace } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPohonIdUntukCross = async() => {
            try{
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                    headers: {
                    //   Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                if(data.parent){
                    setParent(data.parent);
                }
                if(data.jenis_pohon){
                    setJenisPohon(data.jenis_pohon);
                }
                if(data.level_pohon){
                    setLevelPohon(data.level_pohon);
                }
                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: '',
                    parent: data.parent || '',
                    level_pohon: data.level_pohon || '',
                    indikator: data.indikator?.map((item: indikator) => ({
                        nama_indikator: item.nama_indikator,
                        targets: item.targets.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                });
            } catch(err) {
                console.error(err, 'gagal mengambil data sesuai id pohon')
            }
        }
        if(isOpen){
            fetchPohonIdUntukCross();
        }
    },[id, reset, replace, isOpen]);
    
    const fetchOpd = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/opd/findall`,{
          method: 'GET',
          headers: {
            // Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const opd = data.data.map((item: any) => ({
          value : item.kode_opd,
          label : item.nama_opd,
        }));
        setOpdOption(opd);
      } catch (err){
        console.log('gagal mendapatkan data opd');
      } finally {
        setIsLoading(false);
      }
    };

    const handleClose = () => {
      reset(); // Mereset seluruh form
      setKodeOpd(null);
      setKeterangan('');
      onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            Keterangan : data.keterangan,
            kode_opd: KodeOpd?.value,
            tahun: Tahun?.value?.toString(),
        };
        if(KodeOpd?.value == null || undefined){
            AlertNotification("pilih opd terlebih dahulu", "", "warning", 1000);
        } else {
            // console.log(formData);
            try{
                const response = await fetch(`${API_URL}/crosscutting_opd/create/${id}`, {
                    method: "POST",
                    headers: {
                        // Authorization: `${token}`,
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                if(response.ok){
                    AlertNotification("Berhasil", "Berhasil menambahkan crosscutting", "success", 1000);
                    onClose();
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
                }
            } catch(err){
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
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
            <div className={`bg-white rounded-lg p-8 z-10 w-3/5 text-start`}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="w-max-[500px] py-2 border-b text-center">
                       Cross Cutting
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                        >
                            Pohon :
                        </label>
                        <div className="border px-4 py-2 rounded-lg">{nama_pohon || "-"}</div>
                    </div>
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
                                    isLoading={IsLoading}
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
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="keterangan"
                        >
                            Keterangan:
                        </label>
                        <Controller
                            name="keterangan"
                            control={control}
                            rules={{ required: "Keterangan harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="keterangan"
                                        placeholder="masukkan keterangan kebutuhan crosscutting ke OPD lain"
                                        value={field.value || Keterangan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKeterangan(e.target.value);
                                        }}
                                    />
                                    {errors.keterangan ?
                                        <h1 className="text-red-500">{errors.keterangan.message}</h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Keternagan Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
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