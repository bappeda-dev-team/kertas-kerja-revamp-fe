'use client'

import { useState, useEffect, useRef } from "react";
import { ButtonSkyBorder, ButtonRed } from '@/src/components/common/button/Button';
import { TbPrinter, TbXboxX } from "react-icons/tb";
import html2canvas from "html2canvas";
import { LoadingButtonClip2 } from "@/src/components/global/loading/Loading";


interface modal {
    jenis: 'cascading' | 'non_cascading' | 'laporan';
    isOpen: boolean;
    onClose: () => void;
    pohon: any;
}
interface tahun {
    label: string;
    value: number;
}

export const ModalCetak: React.FC<modal> = ({ jenis, isOpen, onClose, pohon }) => {

    const modalRef = useRef<HTMLDivElement | null>(null);
    const [LoadingCetak, setLoadingCetak] = useState<boolean>(false);
    const [Tahun, setTahun] = useState<tahun | null>(null);

    // useEffect(() => {
    //     const data = getOpdTahun();
    //     if(data.tahun){
    //         const tahun = {
    //             value: data.tahun.value,
    //             label: data.tahun.label,
    //         }
    //         setTahun(tahun);
    //     }
    // }, [])

    const handleDownloadPdf = async () => {
        if (!modalRef.current) return;

        const elementsToHide = document.querySelectorAll(".hide-on-capture") as NodeListOf<HTMLElement>;
        elementsToHide.forEach((el) => (el.style.display = "none"));

        try {
            setLoadingCetak(true);
            const element = modalRef.current;
            const canvas = await html2canvas(element, {
                scale: 1, // Higher scale for better quality
                // width: element.scrollWidth + 50, // Use full scrollable width
                // height: element.scrollHeight + 250, // Use full scrollable height
                windowWidth: element.scrollWidth + 250, // Force full width rendering
                windowHeight: element.scrollHeight + 250, // Force full height rendering
                // useCORS: true, // For cross-origin images
            });

            // Create a new canvas with extra padding
            const paddingTop = 50 // Extra padding for the top of the canvas
            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + paddingTop;

            const ctx = newCanvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white"; // Optional: Background color
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                ctx.drawImage(canvas, 0, paddingTop);

                //hitung posisi horizontal untuk centering
                const horizontalOffset = (newCanvas.width - canvas.width) / 2;

                // Gambar canvas di tengah horizontal
                ctx.drawImage(canvas, horizontalOffset, paddingTop);
            }

            const imgData = newCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${pohon.nama_pohon !== undefined ? pohon.nama_pohon : pohon.tema}_${Tahun?.value}${jenis === 'cascading' ? '_cascading' : ''}.jpg`;
            link.click();
        } catch (error) {
            alert("Error capturing the element");
            console.error("Error capturing the element:", error);
        } finally {
            // Ensure elements are restored even if an error occurs
            elementsToHide.forEach((el) => (el.style.display = ""));
            setLoadingCetak(false);
        }
    };

    const handleClose = () => {
        onClose();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-5 z-10 w-[98%] min-h-[98%] max-h-[98%] text-start overflow-y-hidden`}>
                    <div className="flex flex-wrap justify-between items-center border-b pb-2">
                        <ButtonSkyBorder
                            className="flex flex-wrap items-center gap-2"
                            onClick={handleDownloadPdf}
                        >
                            {LoadingCetak ?
                                <>
                                    <LoadingButtonClip2 loading={false} />
                                    <p>Downloading</p>
                                </>
                                :
                                <>
                                    <TbPrinter />
                                    <p>Download</p>
                                </>
                            }
                        </ButtonSkyBorder>
                        <ButtonRed onClick={handleClose}>
                            <TbXboxX className="text-2xl" />
                        </ButtonRed>
                    </div>
                    <div className="flex py-3 relative justify-center items-center h-[calc(100vh-50px)]">
                        <div ref={modalRef} className="flex flex-wrap justify-evenly w-full max-h-full overflow-auto pr-5">
                            {/* <PohonCetak
                                jenis={jenis === 'cascading' ? "cascading" : jenis === 'non_cascading' ? "non_cascading" : "laporan"}
                                tema={pohon}
                                closeTrigger={handleClose}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}