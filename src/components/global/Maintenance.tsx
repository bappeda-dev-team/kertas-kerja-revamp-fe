import { TbSettingsCode } from "react-icons/tb";

const Maintenance = () => {
    return(
        <>
        <div className="flex justify-center items-center w-full text-red-500 px-5 py-3 border border-red-500 rounded-lg mt-5">
            <TbSettingsCode className="w-7 h-7"/>
            <h1 className="ml-3 text-xl">Halaman ini sedang dalam perbaikan</h1>
        </div>
        </>
    )
}

export default Maintenance;