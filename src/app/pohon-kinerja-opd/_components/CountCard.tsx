// _components/CountCard.tsx
'use client';

import { fetchApi } from '@/src/lib/fetcher';
import React, { useState, useEffect } from 'react';
import { TbHourglass, TbCheck } from 'react-icons/tb';

interface LevelDetail {
  levelPohon: number;
  jenisPohon: string;
  pending: number;
  approved: number;
}

interface CountCardProps {
  kodeOpd: string;
  tahun: number;
  onLevelClick?: (level: number) => void;
}

const CountCard: React.FC<CountCardProps> = ({ 
  kodeOpd, 
  tahun, 
  onLevelClick 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<LevelDetail[]>([]);

  const levelConfig = [
    { level: 4, name: 'Strategic', borderColor: 'border-red-500', textColor: 'text-red-500', hoverBg: 'hover:bg-red-500' },
    { level: 5, name: 'Tactical', borderColor: 'border-blue-500', textColor: 'text-blue-500', hoverBg: 'hover:bg-blue-500' },
    { level: 6, name: 'Operational', borderColor: 'border-green-500', textColor: 'text-green-500', hoverBg: 'hover:bg-green-500' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gunakan fetchApi yang sama seperti di page.tsx
        const res = await fetchApi({
          type: "withoutAuth",
          url: `/pohon-kinerja/count?kodeOpd=${encodeURIComponent(kodeOpd)}&tahun=${tahun}`,
          method: "GET"
        });
        
        if (res?.data?.success && res.data.data?.details) {
          const mappedData = res.data.data.details.map((item: any) => ({
            levelPohon: item.levelPohon,
            jenisPohon: item.jenisPohon,
            pending: item.pending || 0,
            approved: item.approved || 0,
          }));
          setData(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch pohon pemda count:', error);
      } finally {
        setLoading(false);
      }
    };

    if (kodeOpd && tahun) {
      fetchData();
    }
  }, [kodeOpd, tahun]);

  const getDataByLevel = (level: number): LevelDetail | undefined => {
    return data.find((d) => d.levelPohon === level);
  };

  return (
    <div className="flex flex-col justify-between border-2 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
      <h1 className="font-semibold border-b-2 py-1 text-center">
        Pohon Pemda
      </h1>
      
      <div className="flex flex-col py-2 mt-1 justify-between">
        <div className="flex flex-col gap-2">
          {levelConfig.map((config) => {
            const levelData = getDataByLevel(config.level);
            
            return (
              <div
                key={config.level}
                onClick={() => onLevelClick?.(config.level)}
                className={`flex items-center border ${config.borderColor} ${config.textColor} 
                  cursor-pointer rounded-lg px-2 ${config.hoverBg} hover:text-white 
                  transition-colors duration-200`}
              >
                {/* Label */}
                <div className="px-2 py-1 text-start min-w-[130px]">
                  <button type="button" className="font-semibold">
                    {config.name}
                  </button>
                </div>
                
                {/* Separator */}
                <div className="py-1">
                  <span className="font-semibold">:</span>
                </div>
                
                {/* Pending Count */}
                <div className="flex justify-center px-2 py-1 text-center w-full">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold">
                      {levelData?.pending ?? 0}
                      <TbHourglass />
                    </span>
                  )}
                </div>
                
                {/* Divider */}
                <div className="py-1">
                  <span className="font-semibold">/</span>
                </div>
                
                {/* Approved Count */}
                <div className="flex justify-center px-2 py-1 text-center w-full">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold">
                      {levelData?.approved ?? 0}
                      <TbCheck />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountCard;