import React, { useEffect, useState } from 'react';
import {
    TbPrinter, TbLayersLinked, TbBookmarkPlus, TbCheck, TbCircleLetterXFilled,
    TbCirclePlus, TbHourglass, TbPencil, TbTrash, TbEye, TbEyeClosed, TbArrowAutofitWidth,
    TbDeviceTabletSearch, TbZoom, TbCircleCheckFilled
} from 'react-icons/tb';
import { ButtonSky, ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import { FormPohonOpd, FormEditPohon } from './FormPohonOpd';
import { getToken, getUser } from '../../Cookie';
import { ModalAddCrosscutting } from '@/components/pages/Pohon/ModalCrosscutting';
import { ModalPindahPohonOpd } from '@/components/pages/Pohon/ModalPindahPohonOpd';
import { ModalReview } from '@/components/pages/Pohon/ModalReview';
import { ModalCetak } from '@/components/pages/Pohon/ModalCetak';
import { LoadingClip } from '@/components/global/Loading';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
    fetchTrigger: () => void;
    show_all?: boolean;
    show_detail?: boolean;
    set_show_all: () => void;
}
interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

interface Indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: Target[];
}

interface Cross {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    kode_opd: string;
    nama_opd: string;
    keterangan: string;
    tahun: string;
    status: string;
    indikator: Indikator[];
}

interface Tagging {
    id: number;
    id_pokin: number;
    nama_tagging: string;
    keterangan_tagging_program: KeteranganTagging[];
}
interface KeteranganTagging {
    id: number;
    id_tagging: number;
    kode_program_unggulan: string;
    keterangan_tagging_program: string;
    tahun: string;
}

interface Review {
    id: number;
    id_pohon_kinerja: number;
    review: string;
    keterangan: string;
    nama_pegawai: string;
}

export const PohonOpd: React.FC<pohon> = ({ tema, deleteTrigger, fetchTrigger, show_all, show_detail, set_show_all }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [CrossList, setCrossList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    const [DetailCross, setDetailCross] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Cross, setCross] = useState<boolean>(false);
    const [PindahPohon, setPindahPohon] = useState<boolean>(false);
    const [CrossLoading, setCrossLoading] = useState<boolean>(false);
    const [PohonCross, setPohonCross] = useState<Cross[]>([]);
    const [Edited, setEdited] = useState<any | null>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [User, setUser] = useState<any>(null);
    const token = getToken();
    const [IsCetak, setIsCetak] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    useEffect(() => {
        if (show_all) {
            setShow(true);
        }
        if (show_all && (Show === false)) {
            set_show_all();
        }
    }, [show_all, Show, set_show_all]);

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const handleCross = () => {
        setCross((prev) => !prev);
    }
    const handlePindahPohon = () => {
        setPindahPohon((prev) => !prev);
    }
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }
    const handleDetailCross = () => {
        setDetailCross((prev) => !prev);
    }

    const fetchPohonCross = async (id: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setCrossLoading(true);
            const response = await fetch(`${API_URL}/crosscutting_opd/findall/${id}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('terdapat kesalahan di koneksi backend');
            }
            const result = await response.json();
            const data = result.data || [];
            setPohonCross(data);
        } catch (err) {
            console.error(err);
        } finally {
            setCrossLoading(false);
        }
    }

    const hapusPohonOpd = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.code === 200) {
                AlertNotification("Berhasil", "Data pohon Berhasil Dihapus", "success", 1000);
                setDeleted(true);
                deleteTrigger();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };
    const hapusPohonCross = async (id: any, ori?: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log("id yang dihapus : ", id, "ori : ", ori);
        try {
            const response = await fetch(`${API_URL}/crosscutting_opd/delete/${id}/${User?.nip}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            const data = await response.json();
            if (data.code == 400) {
                AlertNotification("Gagal", "Crosscutting hanya bisa dihapus saat setelah disetujui", "error", 3000, true);
            } else if (data.code == 200) {
                AlertNotification("Berhasil", "Data pohon Crosscutting Di hapus", "success", 1000);
                deleteTrigger();
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };


    return (
        <React.Fragment key={tema.id}>
            {Deleted ?
                <React.Fragment></React.Fragment>
                :
                <React.Fragment>
                    <li>
                        {edit ?
                            <FormEditPohon
                                level={tema.level_pohon}
                                id={tema.id}
                                key={tema.id}
                                formId={tema.id}
                                onCancel={() => setEdit(false)}
                                EditBerhasil={handleEditSuccess}
                            />
                            :
                            <div
                                className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg pohon-opd
                                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                                        ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
                                        ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                                        ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                                        ${tema.jenis_pohon === "Operational" && 'shadow-green-500 bg-green-500'}
                                        ${tema.jenis_pohon === "Operational N" && 'shadow-slate-500 bg-white'}
                                        ${(tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'shadow-yellow-700 bg-yellow-700'}
                                    `}
                            >
                                {/* HEADER */}
                                <div
                                    className={`flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                            ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-700'}
                                            ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                            ${(tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                        `}
                                >
                                    {tema.jenis_pohon === 'Operational N' ?
                                        <h1>Operational {tema.level_pohon - 6} {tema.id}</h1>
                                        :
                                        <h1>{tema.jenis_pohon} {tema.id}</h1>
                                    }
                                </div>
                                {/* BODY */}
                                <div className="flex justify-center my-3">
                                    {Edited ?
                                        <TablePohon
                                            item={Edited}
                                            user={User?.roles}
                                            ShowDetail={show_detail}
                                        />
                                        :
                                        <TablePohon
                                            item={tema}
                                            user={User?.roles}
                                            ShowDetail={show_detail}
                                        />
                                    }
                                </div>
                                {/* BUTTON ACTION INSIDE BOX SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 */}
                                {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1') &&
                                    !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                                        ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                                    `}
                                    >
                                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                                            <TbPencil className="mr-1" />
                                            Edit
                                        </ButtonSkyBorder>
                                        <ButtonGreenBorder onClick={handleCross}>
                                            <TbLayersLinked className="mr-1" />
                                            CrossCuting
                                        </ButtonGreenBorder>
                                        <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id} nama_pohon={tema.nama_pohon} />
                                        <ButtonRedBorder
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        if (tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting") {
                                                            hapusPohonCross(tema.id)
                                                        } else {
                                                            hapusPohonOpd(tema.id);
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className='mr-1' />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                }
                                {/* BUTTON ACTION INSIDE BOX ASN LEVEL 2*/}
                                {(User?.roles == 'level_2' &&
                                    (
                                        tema.jenis_pohon === 'Tactical' ||
                                        tema.jenis_pohon === 'Tactical Crosscutting' ||
                                        tema.jenis_pohon === 'Operational' ||
                                        tema.jenis_pohon === 'Operational Crosscutting' ||
                                        tema.jenis_pohon === 'Operational N' ||
                                        tema.jenis_pohon === 'Operational N Crosscutting'
                                    )) &&
                                    !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                                `}
                                    >
                                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                                            <TbPencil className="mr-1" />
                                            Edit
                                        </ButtonSkyBorder>
                                        <ButtonGreenBorder onClick={handleCross}>
                                            <TbLayersLinked className="mr-1" />
                                            CrossCuting
                                        </ButtonGreenBorder>
                                        <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id} nama_pohon={tema.nama_pohon} />
                                        <ButtonRedBorder
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        if (tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting") {
                                                            hapusPohonCross(tema.id)
                                                        } else {
                                                            hapusPohonOpd(tema.id);
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className='mr-1' />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                }
                                {/* BUTTON ACTION INSIDE BOX ASN LEVEL 3*/}
                                {(User?.roles == 'level_3' &&
                                    (
                                        tema.jenis_pohon === 'Operational' ||
                                        tema.jenis_pohon === 'Operational Crosscutting' ||
                                        tema.jenis_pohon === 'Operational N' ||
                                        tema.jenis_pohon === 'Operational N Crosscutting'
                                    )) &&
                                    !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                                `}
                                    >
                                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                                            <TbPencil className="mr-1" />
                                            Edit
                                        </ButtonSkyBorder>
                                        <ButtonGreenBorder onClick={handleCross}>
                                            <TbLayersLinked className="mr-1" />
                                            CrossCuting
                                        </ButtonGreenBorder>
                                        <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id} nama_pohon={tema.nama_pohon} />
                                        <ButtonRedBorder
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        if (tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting") {
                                                            hapusPohonCross(tema.id)
                                                        } else {
                                                            hapusPohonOpd(tema.id);
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className='mr-1' />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                }
                                {/* BUTTON ACTION INSIDE BOX ASN LEVEL 4*/}
                                {(User?.roles == 'level_4' &&
                                    (
                                        tema.jenis_pohon === 'Operational N' ||
                                        tema.jenis_pohon === 'Operational N Crosscutting'
                                    )) &&
                                    !['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                                    ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                                    ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                                    ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                                    ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                                `}
                                    >
                                        <ButtonSkyBorder onClick={() => setEdit(true)}>
                                            <TbPencil className="mr-1" />
                                            Edit
                                        </ButtonSkyBorder>
                                        <ButtonGreenBorder onClick={handleCross}>
                                            <TbLayersLinked className="mr-1" />
                                            CrossCuting
                                        </ButtonGreenBorder>
                                        <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id} nama_pohon={tema.nama_pohon} />
                                        <ButtonRedBorder
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        if (tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting") {
                                                            hapusPohonCross(tema.id)
                                                        } else {
                                                            hapusPohonOpd(tema.id);
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className='mr-1' />
                                            Hapus
                                        </ButtonRedBorder>
                                    </div>
                                }
                                {/* BUTTON CROSSCUTTING KHUSUS POHON PEMDA */}
                                {['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                                ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                                ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                                `}
                                    >
                                        <ButtonGreenBorder
                                            className='flex items-center gap-1'
                                            onClick={handleCross}
                                        >
                                            <TbLayersLinked />
                                            Crosscutting
                                        </ButtonGreenBorder>
                                        <ButtonRedBorder
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        if (tema.jenis_pohon === "Strategic Crosscutting" || tema.jenis_pohon === "Tactical Crosscutting" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohn === "Operational N Crosscutting") {
                                                            hapusPohonCross(tema.id)
                                                        } else {
                                                            hapusPohonOpd(tema.id);
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className='mr-1' />
                                            Hapus
                                        </ButtonRedBorder>
                                        <ModalAddCrosscutting isOpen={Cross} onClose={handleCross} id={tema.id} nama_pohon={tema.nama_pohon} />
                                    </div>
                                }
                                {/* DETAIL DATA CROSSCUTTING */}
                                {DetailCross &&
                                    <>
                                        <div className="flex justify-center my-3">
                                            {CrossLoading ? (
                                                <p className="bg-white w-full rounded-lg py-3 text-center">Loading...</p>
                                            ) : PohonCross.length === 0 ? (
                                                <p
                                                    className={`bg-white w-full rounded-lg py-3
                                                            ${tema.jenis_pohon === 'Operational N' && 'border border-green-500'}
                                                        `}
                                                >
                                                    tidak ada crosscuting
                                                </p>
                                            ) : (
                                                <TableCrosscuting item={PohonCross} ori={tema.id} hapusPohonOpd={hapusPohonOpd} />
                                            )}
                                        </div>
                                    </>
                                }
                                {/* BUTTON ACTION INSIDE BOX CEK CROSSCUTTING */}
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                            ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                            ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                                            `}
                                >
                                    <ButtonSky
                                        className='flex items-center gap-1'
                                        onClick={() => setIsCetak(true)}
                                    >
                                        <TbPrinter />
                                        Cetak
                                    </ButtonSky>
                                    {/* {!['Strategic Pemda', 'Tactical Pemda', 'Operational Pemda'].includes(tema.jenis_pohon) && */}
                                    <ButtonSkyBorder
                                        onClick={() => {
                                            fetchPohonCross(tema.id);
                                            handleDetailCross();
                                        }}
                                    >
                                        <TbDeviceTabletSearch className="mr-1" />
                                        {DetailCross ? "Sembunyikan" : "Cek Crosscutting"}
                                    </ButtonSkyBorder>
                                    {/* } */}
                                </div>
                                {/* footer */}
                                <div className="flex justify-evenly my-3 py-3 hide-on-capture">
                                    {(tema.level_pohon != 4 && (
                                        User?.roles == 'super_admin' ||
                                        User?.roles == 'admin_opd' ||
                                        User?.roles == 'level_1' ||
                                        User?.roles == 'level_2'
                                    )) &&
                                        <>
                                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                                onClick={handlePindahPohon}
                                            >
                                                <TbArrowAutofitWidth className='mr-1' />
                                                Pindah
                                            </ButtonBlackBorder>
                                            <ModalPindahPohonOpd
                                                onClose={handlePindahPohon}
                                                isOpen={PindahPohon}
                                                id={tema.id}
                                                pohon={tema}
                                                onSuccess={fetchTrigger}
                                            />
                                        </>
                                    }
                                    {(User?.roles == 'level_3' && (
                                        tema.jenis_pohon == "Operational" ||
                                        tema.jenis_pohon == "Operational Pemda" ||
                                        tema.jenis_pohon == "Operational Crosscutting" ||
                                        tema.jenis_pohon == "Operational N" ||
                                        tema.jenis_pohon == "Operational N Crosscutting"
                                    )) &&
                                        <>
                                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                                onClick={handlePindahPohon}
                                            >
                                                <TbArrowAutofitWidth className='mr-1' />
                                                Pindah
                                            </ButtonBlackBorder>
                                            <ModalPindahPohonOpd
                                                onClose={handlePindahPohon}
                                                isOpen={PindahPohon}
                                                id={tema.id}
                                                pohon={tema}
                                                onSuccess={deleteTrigger}
                                            />
                                        </>
                                    }
                                    {(User?.roles == 'level_4' && (
                                        tema.jenis_pohon == "Operational N" ||
                                        tema.jenis_pohon == "Operational N Crosscutting"
                                    )) &&
                                        <>
                                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                                onClick={handlePindahPohon}
                                            >
                                                <TbArrowAutofitWidth className='mr-1' />
                                                Pindah
                                            </ButtonBlackBorder>
                                            <ModalPindahPohonOpd
                                                onClose={handlePindahPohon}
                                                isOpen={PindahPohon}
                                                id={tema.id}
                                                pohon={tema}
                                                onSuccess={deleteTrigger}
                                            />
                                        </>
                                    }
                                    <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                        onClick={handleShow}
                                    >
                                        <TbEye className='mr-1' />
                                        {Show ? 'Sembunyikan' : 'Tampilkan'}
                                    </ButtonBlackBorder>
                                    {/* BUTTON TAMBAH POKIN OPD SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 & 2 */}
                                    {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1' || User?.roles == 'level_2') &&
                                        Show &&
                                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                            onClick={newChild}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            {newChildButtonName(tema.jenis_pohon)}
                                        </ButtonGreenBorder>
                                    }
                                    {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 3 */}
                                    {(User?.roles == 'level_3' &&
                                        (
                                            tema.jenis_pohon === 'Tactical' ||
                                            tema.jenis_pohon === 'Tactical Pemda' ||
                                            tema.jenis_pohon === 'Operational' ||
                                            tema.jenis_pohon === 'Operational Pemda' ||
                                            tema.jenis_pohon === 'Operational N' ||
                                            tema.jenis_pohon === 'Operational N Pemda'
                                        )) &&
                                        Show &&
                                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                            onClick={newChild}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            {newChildButtonName(tema.jenis_pohon)}
                                        </ButtonGreenBorder>
                                    }
                                    {/* BUTTON TAMBAH POKIN OPD ASN LEVEL 4 */}
                                    {(User?.roles == 'level_4' &&
                                        (
                                            tema.jenis_pohon === 'Operational' ||
                                            tema.jenis_pohon === 'Operational Pemda' ||
                                            tema.jenis_pohon === 'Operational N' ||
                                            tema.jenis_pohon === 'Operational N Pemda'
                                        )) &&
                                        Show &&
                                        <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg`}
                                            onClick={newChild}
                                        >
                                            <TbCirclePlus className='mr-1' />
                                            {newChildButtonName(tema.jenis_pohon)}
                                        </ButtonGreenBorder>
                                    }
                                </div>
                            </div>
                        }
                        <ul style={{ display: Show ? '' : 'none' }}>
                            {childPohons.map((dahan: any, index: any) => (
                                <PohonOpd
                                    tema={dahan}
                                    key={index}
                                    deleteTrigger={deleteTrigger}
                                    fetchTrigger={fetchTrigger}
                                    show_all={show_all}
                                    show_detail={show_detail}
                                    set_show_all={() => set_show_all()}
                                />
                            ))}
                            {formList.map((formId) => (
                                <FormPohonOpd
                                    level={tema.level_pohon}
                                    id={tema.id}
                                    key={formId}
                                    formId={formId}
                                    onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                    deleteTrigger={deleteTrigger}
                                    fetchTrigger={fetchTrigger}
                                />
                            ))}
                        </ul>
                        <ModalCetak
                            jenis="non_cascading"
                            onClose={() => setIsCetak(false)}
                            isOpen={IsCetak}
                            pohon={tema}
                        />
                    </li>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export const TablePohon = (props: any) => {
    const id = props.item.id;
    const tema = props.item.nama_pohon;
    const nama_tematik = props.item.nama_tematik;
    const tagging = props.item.tagging;
    const keterangan = props.item.keterangan;
    const keterangan_crosscutting = props.item.keterangan_crosscutting;
    const opd = props.item.perangkat_daerah?.nama_opd;
    const nama_opd = props.item.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    const status = props.item.status;
    const review = props.item.jumlah_review;
    const User = props.user;
    const ShowDetail = props.ShowDetail;

    // REVIEW
    const [IsNewReview, setIsNewReview] = useState<boolean>(false);
    const [IsEditReview, setIsEditReview] = useState<boolean>(false);
    const [idReview, setIdReview] = useState<number | null>(null);
    const [Review, setReview] = useState<Review[]>([]);

    const [OpdAsal, setOpdAsal] = useState<string | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [ShowReview, setShowReview] = useState<boolean>(false);
    const [LoadingReview, setLoadingReview] = useState<boolean>(false);
    const token = getToken();

    const handleNewReview = () => {
        if (IsNewReview) {
            setIsNewReview(false);
        } else {
            setIsNewReview(true);
        }
    };
    const handleEditReview = (id: number) => {
        if (IsEditReview) {
            setIsEditReview(false);
            setIdReview(0);
        } else {
            setIsEditReview(true);
            setIdReview(id);
        }
    };
    const hapusReview = async (id_review: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/review_pokin/delete/${id_review}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.code === 400 || result.code === 500) {
                alert("gagal hapus");
                console.log(result);
            } else {
                AlertNotification("Berhasil", "Review Berhasil Dihapus", "success", 1000);
                fetchReview(id);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    const fetchReview = async (id_pohon: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingReview(true);
            const response = await fetch(`${API_URL}/review_pokin/findall/${id_pohon}`, {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const hasil = await response.json();
            const data = hasil.data;
            if (hasil.code === 200) {
                setReview(data);
                console.log(data);
            } else {
                console.log('tidak ada review di pohon ini');
                setReview([]);
            }
        } catch (err) {
            console.log(`tidak ada review di pohon dengan id : ${id_pohon}`);
            setReview([]);
        } finally {
            setLoadingReview(false);
        }
    }

    useEffect(() => {
        if (ShowDetail) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [ShowDetail]);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOpdAsal = async () => {
            try {
                setProses(true);
                const response = await fetch(`${API_URL}/crosscutting_opd/opd-from/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('kesalahan ketika fetch data opd asal');
                }
                const data = await response.json();
                if (data.code === 500) {
                    setOpdAsal(null);
                } else {
                    setOpdAsal(data.data.nama_opd);
                    // console.log(data.data.nama_opd);
                }
            } catch (err) {
                console.error(err, "gagal fetch data opd asal");
            } finally {
                setProses(false);
            }
        }
        fetchOpdAsal();
    }, [token, id]);

    return (
        <div className='flex flex-col w-full'>
            <div className="flex flex-col w-full">
                {/* TAGGING */}
                {tagging &&
                    tagging.map((tg: Tagging, tag_index: number) => (
                        <div key={tag_index} className="flex flex-col gap-1 w-full px-3 py-1 border border-yellow-400 rounded-lg bg-white mb-2">
                            <div className='flex items-center gap-1'>
                                <h1 className='text-emerald-500'><TbCircleCheckFilled /></h1>
                                <h1 className='font-semibold'>{tg.nama_tagging || "-"}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                {tg?.keterangan_tagging_program?.map((tp: KeteranganTagging, tp_index: number) => (
                                    <h1 key={tp_index} className="py-1 px-3 text-start text-white bg-yellow-500 rounded-lg">
                                        {tg.keterangan_tagging_program.length > 1 && `${tp_index + 1}.`} {tp.keterangan_tagging_program || ""}
                                    </h1>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
            <table className='w-full'>
                <tbody>
                    {(status === 'crosscutting_disetujui' || status === 'crosscutting_disetujui_existing') &&
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 text-start rounded-l-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                            >
                                <div className="flex flex-col">
                                    <p>keterangan</p>
                                    <p>Crosscutting</p>
                                </div>
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 text-start rounded-r-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                            >
                                {keterangan_crosscutting ? keterangan_crosscutting : "-"}
                            </td>
                        </tr>
                    }
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === 'Strategic Crosscutting') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === 'Operational Crosscutting') && 'Operational'}
                            {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-tr-lg
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
                    {Show &&
                        <>
                            {indikator ?
                                indikator.length > 1 ?
                                    indikator.map((data: any, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                    indikator.map((data: any, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
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
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start
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
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start
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
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
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
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-bl-lg
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
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg
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
                            {status &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
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
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
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
                                            <span>{status || "-"} / {nama_tematik || "-"}</span>
                                        )}
                                    </td>
                                </tr>
                            }
                            {(status === "crosscutting_disetujui" || status === "crosscutting_disetujui_existing") &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 text-start rounded-l-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                                    >
                                        Crosscutting Dari
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 text-start rounded-r-lg ${status === 'crosscutting_disetujui' && 'border-yellow-700'} bg-slate-200
                                            ${jenis === "Strategic" && "border-red-700"}
                                            ${jenis === "Tactical" && "border-blue-500"}
                                            ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        `}
                                    >
                                        {Proses ? "Loading.." : OpdAsal ? OpdAsal : "-"}
                                    </td>
                                </tr>
                            }
                        </>
                    }
                </tbody>
            </table>
            <div className="flex mt-2 w-full justify-center bg-white p-3 rounded-lg hide-on-capture">
                <ButtonGreenBorder className='w-full' onClick={() => setShow((prev) => !prev)}>
                    {Show ?
                        <div className="flex items-center gap-1">
                            <TbEye />
                            Sembunyikan
                        </div>
                        :
                        <div className="flex items-center gap-1">
                            <TbEyeClosed />
                            Detail
                        </div>
                    }
                </ButtonGreenBorder>
            </div>
            {/* REVIEW */}
            {ShowReview && (
                LoadingReview ?
                    <div className="flex w-full px-2 bg-white justify-center rounded-lg mt-2">
                        <LoadingClip />
                    </div>
                    :
                    Review.length == 0 ?
                        <div className="flex mt-2 text-center">
                            <h1 className='text-center bg-white w-full rounded-lg p-2'>tidak ada review</h1>
                        </div>
                        :
                        <div className="flex mt-2">
                            <table className="w-full">
                                {Review.map((item: Review, index: number) => (
                                    <tbody key={item.id || index}>
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border-r border-b px-2 py-3 bg-yellow-100 text-start rounded-tl-lg
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                review
                                            </td>
                                            <td
                                                className={`min-w-[300px] border-b px-2 py-3 bg-yellow-100 text-start
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    {item.review}
                                                </div>
                                            </td>
                                            <td
                                                className={`border-l bg-yellow-100 text-start rounded-tr-lg
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    <ButtonSkyBorder onClick={() => handleEditReview(item.id)}>
                                                        <TbPencil />
                                                    </ButtonSkyBorder>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                className={`min-w-[100px] border-r border-b border-black px-2 py-3 bg-yellow-100 text-start rounded-bl-lg
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                Keterangan
                                            </td>
                                            <td
                                                className={`min-w-[300px] border-b px-2 py-3 bg-yellow-100 text-start flex flex-wrap gap-2
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                <p>
                                                    {item.keterangan}
                                                </p>
                                                <p className="font-bold">
                                                    {`( ${item.nama_pegawai} )`}
                                                </p>
                                            </td>
                                            <td
                                                className={`border-l border-b bg-yellow-100 text-start rounded-br-lg
                                                    ${jenis === "Strategic Pemda" && "border-black"}
                                                    ${jenis === "Tactical Pemda" && "border-black"}
                                                    ${jenis === "Operational Pemda" && "border-black"}
                                                    ${jenis === "Strategic" && "border-red-700"}
                                                    ${jenis === "Tactical" && "border-blue-500"}
                                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}    
                                                `}
                                            >
                                                <div className="flex items-center justify-center gap-1"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus Review", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusReview(item.id);
                                                            }
                                                        });
                                                    }}>
                                                    <ButtonRedBorder><TbTrash /></ButtonRedBorder>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
            )
            }
            {/* BUTTON REVIEW */}
            <div
                className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                        ${tema.jenis_pohon === "Operational N" && 'border-green-500'}
                        `}
            >
                {(User == 'super_admin' || User == 'reviewer') &&
                    <ButtonSkyBorder onClick={handleNewReview}>
                        <TbBookmarkPlus className="mr-1" />
                        Tambah Review
                    </ButtonSkyBorder>
                }
                <button
                    className={`px-3 flex justify-center items-center py-1 rounded-lg border border-red-400 text-red-400 hover:bg-red-400 hover:text-white ${review > 0 && "bg-yellow-200 animate-pulse"}`}
                    onClick={() => {
                        setShowReview((prev) => (!prev));
                        fetchReview(id);
                    }}
                >
                    <TbZoom className="mr-1" />
                    <p>{ShowReview ? "sembunyikan review" : "tampilkan review :"} </p>
                    <p className="text-bold ml-1">{review}</p>
                </button>
            </div>
            {/* MODAL TAMBAH REVIEW POHON */}
            <ModalReview
                jenis={'baru'}
                pokin="opd"
                isOpen={IsNewReview}
                onClose={() => {
                    setIsNewReview(false);
                    setIdReview(null);
                }}
                idPohon={id}
                onSuccess={() => {
                    fetchReview(id);
                    setShowReview(true);
                }}
            />
            {/* MODAL EDIT REVIEW POHON */}
            <ModalReview
                jenis={'lama'}
                pokin="opd"
                id={idReview}
                isOpen={IsEditReview}
                onClose={() => setIsEditReview(false)}
                idPohon={id}
                onSuccess={() => {
                    fetchReview(id);
                    setShowReview(true);
                }}
            />
        </div>
    )
}
export const TableCrosscuting = (props: any) => {
    const { item, hapusPohonOpd } = props;

    return (
        <div className={`flex flex-col w-full`}>
            {item.map((data: any, index: number) => (
                <React.Fragment key={index}>
                    <div className={`flex flex-wrap w-full bg-white p-2 mt-2 justify-between items-center rounded-t-xl border`}>
                        <h1 className='p-1'>Crosscutting ke {index + 1}</h1>
                        <ButtonRedBorder
                            onClick={() => {
                                AlertNotification("Maintenance", "Fitur hapus crosscutting masih dalam pengembangan", "info", 3000);
                                // if ((data.status === 'crosscutting_disetujui' || data.status === 'crosscutting_disetujui_existing')) {
                                //     AlertNotification("Pohon Harus Ditolak/Pending", "Pohon harus berstatus ditolak atau Pending untuk bisa dihapus, hal ini mencegah pohon yang sudah diterima (beserta anak pohonnya) terhapus tanpa persetujuan ke dua OPD", "warning", 50000, true);
                                // } else {
                                //     AlertQuestion("Hapus?", "Hapus pohon crosscutting?", "question", "Hapus", "Batal").then((result) => {
                                //         if (result.isConfirmed) {
                                //             hapusPohonOpd(data.id);
                                //         }
                                //     });
                                // }
                            }}
                        >
                            Hapus
                        </ButtonRedBorder>
                    </div>
                    <table key={index} className="w-full">
                        <tbody>
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-yellow-100 text-start`}
                                >
                                    tema {data.id}
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-yellow-100 text-start`}
                                >
                                    {data.nama_pohon ?
                                        <p>{data.nama_pohon}</p>
                                        :
                                        <p className="italic font-thin">*menunggu diterima & diedit</p>
                                    }
                                </td>
                            </tr>
                            {data.indikator ?
                                data.indikator.length > 1 ?
                                    data.indikator.map((data: any, index_i: number) => (
                                        <React.Fragment key={data.id_indikator || index_i}>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    Indikator {index_i + 1}
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    {data.nama_indikator ? data.nama_indikator : "-"}
                                                </td>
                                            </tr>
                                            {data.targets ?
                                                data.targets.map((data: any) => (
                                                    <tr key={data.id_target}>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan {index_i + 1}
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td
                                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                    >
                                                        Target/Satuan
                                                    </td>
                                                    <td
                                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start   
                                                        `}
                                                    >
                                                        -
                                                    </td>
                                                </tr>
                                            }
                                        </React.Fragment>
                                    ))
                                    :
                                    data.indikator.map((data: any, index_i: number) => (
                                        <React.Fragment key={data.id_indikator || index_i}>
                                            <tr key={data.id_indikator}>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    Indikator
                                                </td>
                                                <td
                                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                >
                                                    {data.nama_indikator ? data.nama_indikator : "-"}
                                                </td>
                                            </tr>
                                            {data.targets ?
                                                data.targets.map((data: any) => (
                                                    <tr key={data.id_target}>
                                                        <td
                                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            Target/Satuan
                                                        </td>
                                                        <td
                                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                                        >
                                                            {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td
                                                        className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                                    >
                                                        Target/Satuan
                                                    </td>
                                                    <td
                                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
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
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                        >
                                            Indikator
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                        >
                                            -
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                        >
                                            Target/Satuan
                                        </td>
                                        <td
                                            className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                        >
                                            -
                                        </td>
                                    </tr>
                                </>
                            }
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start`}
                                >
                                    Jenis Pohon
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start 
                                        ${(data.jenis_pohon === "Strategic" || data.jenis_pohon === "Strategic Crosscutting") && 'text-red-700'}
                                        ${(data.jenis_pohon === "Tactical" || data.jenis_pohon === "Tactical Crosscutting") && 'text-blue-500'}
                                        ${(data.jenis_pohon === "Operational" || data.jenis_pohon === "Operational Crosscutting") && 'text-green-500'}
                                        ${(data.jenis_pohon === "Operational N" || data.jenis_pohon === "Operational N Crosscutting") && 'text-green-300'}
                                    `}
                                >
                                    {data.jenis_pohon ?
                                        data.jenis_pohon
                                        :
                                        <p className='italic font-thin'>*menunggu diterima & diedit</p>
                                    }
                                </td>
                            </tr>
                            {data.nama_opd &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-yellow-100 text-start`}
                                    >
                                        Perangkat Daerah
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-yellow-100 text-start`}
                                    >
                                        {data.nama_opd ? data.nama_opd : "-"}
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td
                                    className={`min-w-[100px] border px-2 py-1 bg-white text-start`}
                                >
                                    Keterangan
                                </td>
                                <td
                                    className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                >
                                    {data.keterangan ? data.keterangan : "-"}
                                </td>
                            </tr>
                            {data.status &&
                                <tr>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start`}
                                    >
                                        Status
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start`}
                                    >
                                        {data.status === 'crosscutting_menunggu' ? (
                                            <div className="flex flex-wrap gap-2 items-center">
                                                pending
                                                <TbHourglass />
                                            </div>
                                        ) : data.status === 'crosscutting_disetujui' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-green-500">
                                                diterima dengan pohon baru
                                                <TbCheck />
                                            </div>
                                        ) : data.status === 'crosscutting_ditolak' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-red-500">
                                                ditolak
                                                <TbCircleLetterXFilled />
                                            </div>
                                        ) : data.status === 'crosscutting_disetujui_existing' ? (
                                            <div className="flex flex-wrap gap-2 items-center text-green-500">
                                                diterima dengan pohon OPD pilihan
                                                <TbCheck />
                                            </div>
                                        ) : (
                                            <span>{data.status || "-"}</span>
                                        )}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </React.Fragment>
            ))}
        </div>
    );
};

export const newChildButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return 'Tactical';
        case 'Tactical Pemda':
            return 'Operational';
        case 'Operational Pemda':
            return 'Opertional N';
        case 'Strategic':
            return 'Tactical';
        case 'Tactical':
            return 'Opertional';
        case 'Operational':
            return 'Opertional N';
        case 'Operational N':
            return 'Opertional N';
        case 'Strategic Crosscutting':
            return 'Tactical';
        case 'Tactical Crosscutting':
            return 'Operational';
        case 'Operational Crosscutting':
            return 'Operational N';
        case 'Operational N Crosscutting':
            return 'Operational N';
        default:
            return '-'
    }
}
export const newCrosscutingButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return '(Crosscuting) Tactical';
        case 'Tactical Pemda':
            return '(Crosscuting) Operational';
        case 'Strategic':
            return '(Crosscuting) Tactical';
        case 'Tactical':
            return '(Crosscuting) Opertional';
        case 'Operational':
            return '(Crosscuting) Opertional N';
        case 'Operational Pemda':
            return '(Crosscuting) Opertional N';
        case 'Operational N':
            return '(Crosscuting) Opertional N';
        default:
            return '-'
    }
}