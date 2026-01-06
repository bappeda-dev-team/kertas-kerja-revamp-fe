import { useEffect, useState } from 'react';
import { TbTrashX, TbUsersPlus, TbEye, TbPrinter, TbCircleCheckFilled } from 'react-icons/tb';
import { ButtonSky, ButtonGreenBorder, ButtonBlackBorder } from '@/components/global/Button';
import { AlertNotification, AlertQuestion } from '@/components/global/Alert';
import { FormEditCascading } from './FormCascading';
import { getToken, getUser } from '../../Cookie';
import { ModalCetak } from '@/components/pages/Pohon/ModalCetak';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
    show_all?: boolean;
    set_show_all: () => void;
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

export const PohonCascading: React.FC<pohon> = ({ tema, deleteTrigger, show_all, set_show_all }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs

    const [IsCetak, setIsCetak] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

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

    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }
    const hapusPelaksana = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete_pelaksana/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pelaksana Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {edit ?
                <FormEditCascading
                    level={tema.level_pohon}
                    id={tema.id}
                    key={tema.id}
                    formId={tema.id}
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
                :
                <>
                    <div
                        className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
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
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                            ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === "Strategic Crosscutting") && 'border-red-500 text-red-700'}
                            ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === "Tactical Crosscutting") && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                        `}
                        >
                            {tema.jenis_pohon === 'Operational N' ?
                                <h1>Operational {tema.level_pohon - 6}  </h1>
                                :
                                <h1>{tema.jenis_pohon} </h1>
                            }
                        </div>
                        {/* BODY */}
                        <div className="flex justify-center my-3">
                            {Edited ?
                                <TablePohonEdited item={Edited} hapusPelaksana={hapusPelaksana} user={User?.roles} />
                                :
                                <TablePohon item={tema} hapusPelaksana={hapusPelaksana} user={User?.roles} />
                            }
                        </div>
                        {/* BUTTON ACTION TAMPILKAN DAN PELAKSANA*/}
                        <div
                            className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
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
                            {/* BUTTON PELAKSANA SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 */}
                            {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1') &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 2 */}
                            {(User?.roles == 'level_2' &&
                                (
                                    tema.jenis_pohon === 'Tactical' ||
                                    tema.jenis_pohon === 'Tactical Pemda' ||
                                    tema.jenis_pohon === 'Tactical Crosscutting' ||
                                    tema.jenis_pohon === 'Operational' ||
                                    tema.jenis_pohon === 'Operational Pemda' ||
                                    tema.jenis_pohon === 'Operational Crosscutting' ||
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 3 */}
                            {(User?.roles == 'level_3' &&
                                (
                                    tema.jenis_pohon === 'Operational' ||
                                    tema.jenis_pohon === 'Operational Pemda' ||
                                    tema.jenis_pohon === 'Operational Crosscutting' ||
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 4 */}
                            {(User?.roles == 'level_4' &&
                                (
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                        </div>
                    </div>
                </>
            }
            <ul style={{ display: Show ? '' : 'none' }}>
                {childPohons.map((dahan: any, index: any) => (
                    <PohonCascading
                        tema={dahan}
                        key={index}
                        deleteTrigger={deleteTrigger}
                        show_all={show_all}
                        set_show_all={() => set_show_all()}
                    />
                ))}
            </ul>
            <ModalCetak
                jenis='cascading'
                onClose={() => setIsCetak(false)}
                isOpen={IsCetak}
                pohon={tema}
            />
        </li>
    )
}
export const PohonCascadingEdited: React.FC<pohon> = ({ tema, deleteTrigger }) => {

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [edit, setEdit] = useState<boolean>(false);
    const [Show, setShow] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);
    const [User, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, [])

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }

    const hapusPelaksana = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/delete_pelaksana/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            AlertNotification("Berhasil", "Pelaksana Berhasil Dihapus", "success", 1000);
            deleteTrigger();
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    return (
        <li>
            {edit ?
                <FormEditCascading
                    level={tema.level_pohon}
                    id={tema.id}
                    key={tema.id}
                    formId={tema.id}
                    pokin={'opd'}
                    onCancel={() => setEdit(false)}
                    EditBerhasil={handleEditSuccess}
                />
                :
                <>
                    <div
                        className={`tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg
                        ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                        ${tema.jenis_pohon === "OperationalPemda" && 'shadow-slate-500'}
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
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#007982] from-40% to-[#2DCB06]'}
                            ${(tema.jenis_pohon === "Strategic" || tema.jenis_pohon === "Strategic Crosscutting") && 'border-red-500 text-red-700'}
                            ${(tema.jenis_pohon === "Tactical" || tema.jenis_pohon === "Tactical Crosscutting") && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational Crosscutting" || tema.jenis_pohon === "Operational N" || tema.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                        `}
                        >
                            {tema.jenis_pohon === 'Operational N' ?
                                <h1>Operational {tema.level_pohon - 6}  </h1>
                                :
                                <h1>{tema.jenis_pohon}</h1>
                            }
                        </div>
                        {/* BODY */}
                        <div className="flex justify-center my-3">
                            {Edited ?
                                <TablePohonEdited item={Edited} hapusPelaksana={hapusPelaksana} user={User?.roles} />
                                :
                                <TablePohon item={tema} hapusPelaksana={hapusPelaksana} user={User?.roles} />
                            }
                        </div>
                        {/* BUTTON ACTION TAMPILKAN DAN PELAKSANA*/}
                        <div
                            className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white hide-on-capture
                                ${tema.jenis_pohon === "Strategic Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Tactical Pemda" && 'border-black'}
                                ${tema.jenis_pohon === "Operational Pemda" && 'border-black'}
                                `}
                        >
                            <ButtonBlackBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-gradient-to-r rounded-lg hide-on-capture`}
                                onClick={handleShow}
                            >
                                <TbEye className='mr-1' />
                                {Show ? 'Sembunyikan' : 'Tampilkan'}
                            </ButtonBlackBorder>
                            {/* BUTTON PELAKSANA SUPER ADMIN, ADMIN OPD, ASN LEVEL 1 */}
                            {(User?.roles == 'super_admin' || User?.roles == 'admin_opd' || User?.roles == 'level_1') &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 2 */}
                            {(User?.roles == 'level_2' &&
                                (
                                    tema.jenis_pohon === 'Tactical' ||
                                    tema.jenis_pohon === 'Tactical Pemda' ||
                                    tema.jenis_pohon === 'Tactical Crosscutting' ||
                                    tema.jenis_pohon === 'Operational' ||
                                    tema.jenis_pohon === 'Operational Pemda' ||
                                    tema.jenis_pohon === 'Operational Crosscutting' ||
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 3 */}
                            {(User?.roles == 'level_3' &&
                                (
                                    tema.jenis_pohon === 'Operational' ||
                                    tema.jenis_pohon === 'Operational Pemda' ||
                                    tema.jenis_pohon === 'Operational Crosscutting' ||
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                            {/* BUTTON PELAKSANA ASN LEVEL 4 */}
                            {(User?.roles == 'level_4' &&
                                (
                                    tema.jenis_pohon === 'Operational N' ||
                                    tema.jenis_pohon === 'Operational N Pemda' ||
                                    tema.jenis_pohon === 'Operational N Crosscutting'
                                )) &&
                                <ButtonGreenBorder onClick={() => setEdit(true)}>
                                    <TbUsersPlus className="mr-1" />
                                    Pelaksana
                                </ButtonGreenBorder>
                            }
                        </div>
                    </div>
                </>
            }
        </li>
    )
}

export const TablePohon = (props: any) => {

    const { item, hapusPelaksana, user } = props;
    const tema = props.item.nama_pohon;
    const tagging = props.item.tagging;
    const jenis = props.item.jenis_pohon;
    const pelaksana = props.item.pelaksana;

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
            <table className='mb-2'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-l-lg
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
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
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
                </tbody>
            </table>
            <table className='mt-2'>
                <tbody >
                    {pelaksana ?
                        pelaksana.length > 1 ?
                            pelaksana.map((item: any, index: number) => (
                                <tr key={item.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    `}
                                    >
                                        Pelaksana {index + 1}
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
                                        {item.nama_pegawai}
                                    </td>
                                </tr>
                            ))
                            :
                            pelaksana.map((data: any) => (
                                <tr key={data.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                                    `}
                                    >
                                        Pelaksana
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
                                        {data.nama_pegawai}
                                    </td>
                                </tr>
                            ))
                        :
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}   
                            `}
                            >
                                Pelaksana
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
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
                </tbody>
            </table>
        </div>
    )
}
export const TablePohonEdited = (props: any) => {
    const { item, hapusPelaksana, user } = props;
    const tagging = props.item.tagging;
    const tema = props.item.nama_pohon;
    const jenis = props.item.jenis_pohon;
    const pelaksana = props.item.pelaksana;
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
            <table className='mb-2'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-l-lg
                            ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                            ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                        >
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda' || jenis === "Strategic Crosscutting") && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda' || jenis === 'Tactical Crosscutting') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda' || jenis === "Operational Crosscutting") && 'Operational'}
                            {(jenis === 'Operational N' || jenis === 'Operational N Crosscutting') && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                            ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                            ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                            ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                            ${jenis === "Strategic Pemda" && "border-black"}
                            ${jenis === "Tactical Pemda" && "border-black"}
                            ${jenis === "Operational Pemda" && "border-black"}
                        `}
                        >
                            {tema ? tema : "-"}
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className='mt-2'>
                <tbody >
                    {pelaksana ?
                        pelaksana.length > 1 ?
                            pelaksana.map((item: any, index: number) => (
                                <tr key={item.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                        ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                        ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                    >
                                        Pelaksana {index + 1}
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                        ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                        ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                        ${jenis === "Strategic Pemda" && "border-black"}
                                        ${jenis === "Tactical Pemda" && "border-black"}
                                        ${jenis === "Operational Pemda" && "border-black"}    
                                    `}
                                    >
                                        {item.nama_pegawai}
                                    </td>
                                </tr>
                            ))
                            :
                            pelaksana.map((data: any) => (
                                <tr key={data.id_pelaksana}>
                                    <td
                                        className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                    ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                    ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                                    >
                                        Pelaksana
                                    </td>
                                    <td
                                        className={`min-w-[300px] border px-2 py-3 bg-white text-start
                                    ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                    ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                    ${jenis === "Strategic Pemda" && "border-black"}
                                    ${jenis === "Tactical Pemda" && "border-black"}
                                    ${jenis === "Operational Pemda" && "border-black"}    
                                `}
                                    >
                                        {data.nama_pegawai}
                                    </td>

                                </tr>
                            ))
                        :
                        <tr>
                            <td
                                className={`min-w-[100px] border px-2 py-1 bg-white text-start rounded-l-lg
                                ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                            >
                                Pelaksana
                            </td>
                            <td
                                className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-r-lg
                                ${(jenis === "Strategic" || jenis === "Strategic Crosscutting") && "border-red-700"}
                                ${(jenis === "Tactical" || jenis === "Tactical Crosscutting") && "border-blue-500"}
                                ${(jenis === "Operational" || jenis == "Operational N" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-green-500"}
                                ${jenis === "Strategic Pemda" && "border-black"}
                                ${jenis === "Tactical Pemda" && "border-black"}
                                ${jenis === "Operational Pemda" && "border-black"}    
                            `}
                            >
                                -
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export const newChildButtonName = (jenis: string): string => {
    switch (jenis) {
        case 'Strategic Pemda':
            return 'Tactical';
        case 'Tactical Pemda':
            return 'Operational';
        case 'Strategic':
            return 'Tactical';
        case 'Tactical':
            return 'Opertional';
        default:
            return '-'
    }
}