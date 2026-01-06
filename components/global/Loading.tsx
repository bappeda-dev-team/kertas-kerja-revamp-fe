// components/Loading.tsx
import { ClipLoader, BeatLoader, SyncLoader, HashLoader } from 'react-spinners';

// Interface untuk props biar rapi (opsional, tapi disarankan)
interface LoadingProps {
  loading: boolean;
  color?: string; // Optional
}

export const LoadingClip = ({ loading }: LoadingProps) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <ClipLoader color="#1f2937" loading={loading} size={50} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

export const LoadingBeat = ({ loading }: LoadingProps) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <BeatLoader color="#1f2937" loading={loading} size={20} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

export const LoadingSync = ({ loading }: LoadingProps) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <SyncLoader color="#1f2937" loading={loading} size={10} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

export const LoadingButtonClip = ({ loading }: LoadingProps) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      <ClipLoader color="#ffffff" loading={loading} size={15} />
    </div>
  );
};

// FIX UTAMA DISINI: Pakai kurung kurawal { loading, color }
export const LoadingButtonClip2 = ({ loading, color }: LoadingProps) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      {/* Hapus template literal string jika color sudah string */}
      <ClipLoader color={color} loading={loading} size={15} />
    </div>
  );
};

export const IsLoadingBranding = () => {
  return (
    <div className='flex flex-col items-center gap-5 my-5'>
      <HashLoader color={'#182842'} loading={true} size={150} />
      <div className="flex flex-col items-center">
        <h1 className='text-[#182842] font-bold text-xl'>Memuat Data Branding Website</h1>
        <p className='text-[#14233b] font-light text-sm'>Jika loading lebih dari 10 detik, reload halaman</p>
      </div>
    </div>
  );
};