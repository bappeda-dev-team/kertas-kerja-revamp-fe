"use client"

import { useEffect, useState } from "react"
import Select from "react-select"
import { getOpdTahun, getUser } from "../lib/Cookie"
import { AlertNotification } from "./Alert"
import { getToken } from "../lib/Cookie"

interface OptionType {
    value: number;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}

const Header = () => {

    const [Tahun, setTahun] = useState<OptionType | null>(null);
    const [SelectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);
    const [Opd, setOpd] = useState<OptionTypeString | null>(null);
    const [user, setUser] = useState<any>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const token = getToken();

    // Fungsi untuk menyimpan nilai ke cookies
    const setCookie = (name: string, value: any) => {
        document.cookie = `${name}=${value}; path=/;`;
    };

    useEffect(() => {
        const data = getOpdTahun();
        const fetchUser = getUser();
        if (data) {
            if (data.tahun) {
                const valueTahun = {
                    value: data.tahun.value,
                    label: data.tahun.label
                }
                setTahun(valueTahun);
            }
            if (data.opd) {
                const valueOpd = {
                    value: data.opd.value,
                    label: data.opd.label
                }
                setOpd(valueOpd);
            }
        }
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, [])

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

    const handleTahun = (selectedOption: { value: number, label: string } | null) => {
        if (selectedOption) {
            const year = { label: selectedOption.label, value: selectedOption.value };
            setCookie('tahun', JSON.stringify(year)); // Simpan value dan label ke cookies
            AlertNotification("Berhasil", "Berhasil Mengganti Perangkat Daerah & Tahun", "success", 1000);
            setTimeout(() => {
                window.location.reload();
            }, 1000); //reload halaman dengan delay 1 detik
        }
    };
    const handleOpd = (selectedOption: { value: string, label: string } | null) => {
        if (selectedOption) {
            const opd = { label: selectedOption.label, value: selectedOption.value };
            setCookie('opd', JSON.stringify(opd)); // Simpan value dan label ke cookies
            AlertNotification("Berhasil", "Berhasil Mengganti Perangkat Daerah", "success", 1000);
            setTimeout(() => {
                window.location.reload();
            }, 1000); //reload halaman dengan delay 1 detik
        }
    };

    const TahunOption = [
        { label: "Tahun 2019", value: 2019 },
        { label: "Tahun 2020", value: 2020 },
        { label: "Tahun 2021", value: 2021 },
        { label: "Tahun 2022", value: 2022 },
        { label: "Tahun 2023", value: 2023 },
        { label: "Tahun 2024", value: 2024 },
        { label: "Tahun 2025", value: 2025 },
        { label: "Tahun 2026", value: 2026 },
        { label: "Tahun 2027", value: 2027 },
        { label: "Tahun 2028", value: 2028 },
        { label: "Tahun 2029", value: 2029 },
        { label: "Tahun 2030", value: 2030 },
    ];

    return (
        <div className="flex flex-wrap gap-2 justify-between items-center rounded-2xl mx-2 mt-2 bg-gradient-to-r from-[#182C4E] to-[#17212D] py-4 pr-2 pl-3">
            <div className="flex flex-col text-white max-w-[400px]">
                {user?.roles == 'super_admin' ?
                    <h1 className="font-light text-sm">{Opd ? Opd?.label : "Pilih OPD"}</h1>
                    :
                    <h1 className="font-light text-sm">{user?.nama_pegawai}</h1>
                }
                {/* <h1 className="font-light text-sm">{Tahun ? Tahun?.value : "Pilih Tahun"} - Kab. Madiun</h1> */}
            </div>
            <div className="flex flex-wrap items-center">
                {(user?.roles == 'super_admin' || user?.roles == 'reviewer') &&
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '157.562px',
                                maxWidth: '160px',
                                minHeight: '38px'
                            })
                        }}
                        onChange={(option) => setSelectedOpd(option)}
                        options={OpdOption} 
                        placeholder="Pilih OPD ..."
                        value={SelectedOpd || Opd}
                        isLoading={IsLoading}
                        isSearchable
                        onMenuOpen={() => {
                            if (OpdOption.length === 0) {
                                fetchOpd();
                            }
                        }}
                    />
                }
                <Select
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            borderTopRightRadius: '0px',
                            borderBottomRightRadius: '0px',
                            borderTopLeftRadius: '8px',
                            borderBottomLeftRadius: '8px',
                            marginLeft: '4px',
                            // marginRight: '4px',
                            minWidth: '157.562px',
                            maxWidth: '160px',
                            minHeight: '38px'
                        })
                    }}
                    options={TahunOption}
                    placeholder="Pilih Tahun ..."
                    onChange={(option) => setTahun(option)}
                    value={Tahun}
                    isSearchable
                />
                <button
                    className="border border-white text-white px-3 py-2 min-w-20 max-h-[37.5px] rounded-br-lg rounded-tr-lg hover:bg-white hover:text-gray-800"
                    onClick={() => {
                        handleOpd(SelectedOpd);
                        handleTahun(Tahun);
                    }}
                >
                    Aktifkan
                </button>
                {user?.roles == "super_admin" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">Super Admin</button>
                }
                {user?.roles == "admin_opd" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">Admin Opd</button>
                }
                {user?.roles == "eselon_1" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 1</button>
                }
                {user?.roles == "eselon_2" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 2</button>
                }
                {user?.roles == "eselon_3" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 3</button>
                }
                {user?.roles == "eselon_4" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 4</button>
                }
                {user?.roles == "level_1" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 1</button>
                }
                {user?.roles == "level_2" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 2</button>
                }
                {user?.roles == "level_3" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 3</button>
                }
                {user?.roles == "level_4" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">ASN Level 4</button>
                }
                {user?.roles == "reviewer" &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">Reviewer</button>
                }
                {user?.roles == undefined &&
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">Loading</button>
                }

                {/* SOLUSI MULTIPLE ROLES */}
                {/* {user?.roles?.some((role: string) => ["level_3", "level_4"].includes(role)) && (
                    <button className="border border-white text-white px-3 py-2 mx-1 min-w-20 max-h-[37.5px] rounded-lg hover:bg-white hover:text-gray-800">USER WITH LEVEL</button>
                )} */}
            </div>
        </div>
    )
}

export default Header;
