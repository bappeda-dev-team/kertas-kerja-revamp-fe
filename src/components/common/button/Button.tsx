'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButtonClip2 }from "../../global/loading/Loading";

interface button {
    onClick? : () => void;
    children: React.ReactNode;
    type? : 'reset' | 'submit' | 'button';
    className? : string;
    halaman_url? : string;
    disabled? : boolean;
}

export const ButtonSky: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false} />
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonSkyBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r border-2 border-[#3072D6] hover:bg-[#3072D6] text-[#3072D6] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false} />
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonGreen: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
        disabled={disabled || Loading}
        type={type}
        onClick={onClick || pindahHalaman}
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r from-[#1CE978] to-[#11B935] hover:from-[#1EB281] hover:to-[#0D7E5C] text-white rounded-lg ${className}`}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false}/>
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonBlack: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r from-[#1C201A] to-[#434848] hover:from-[#3A4238] hover:to-[#676C6F] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false}/>
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonGreenBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false} />
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonBlackBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r border-2 border-[#1C201A] hover:bg-[#1C201A] text-[#1C201A] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false}/>
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonRed: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r from-[#DA415B] to-[#BC163C] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false}/>
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}
export const ButtonRedBorder: React.FC<button> = ({children, type, className, halaman_url, onClick, disabled}) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if(halaman_url){
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return(
        <button
            className={`px-3 flex justify-center items-center py-1 bg-linear-to-r border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ? 
                (
                <>
                    <LoadingButtonClip2 loading={false} />
                    {children}
                </>
                )
            :
                (children)
            }
        </button>
    )
}