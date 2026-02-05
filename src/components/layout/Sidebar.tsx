'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { 
    Home, 
    LogOut,
    PanelLeftClose, 
    PanelRightClose, 
    Network, 
    ChevronDown,
    FileText,   // Icon untuk Perencanaan
    Layers,     // Icon untuk Tematik
    Building2   // Icon untuk OPD
} from 'lucide-react';

// Tipe untuk setiap item navigasi
type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    subItems?: NavItem[]; 
    action?: () => void; 
};

// MODIFIKASI: Struktur Data Hierarki (Beranak)
const navItems: NavItem[] = [
    { 
        href: '/', 
        icon: Home, 
        label: 'Dashboard' 
    },
    {
        href: 'pemda-group', // ID unik untuk state menu (bukan link halaman)
        icon: FileText,
        label: 'Perencanaan Pemda',
        subItems: [
            { href: '/tematik', icon: Layers, label: 'Tematik' },
            { href: '/pohon-kinerja', icon: Network, label: 'Pohon Kinerja Pemda' },
        ]
    },
    {
        href: 'opd-group', // ID unik untuk state menu
        icon: Building2,
        label: 'Perencanaan OPD',
        subItems: [
            { href: '/pohon-kinerja-opd', icon: Network, label: 'Pohon Kinerja OPD' },
        ]
    },
    // { href: '/logout', icon: LogOut, label: 'Logout', action: logout },
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Effect: Otomatis buka menu parent jika url child aktif saat refresh
    useEffect(() => {
        navItems.forEach(item => {
            if (item.subItems) {
                const isChildActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                if (isChildActive) {
                    setOpenMenus(prev => ({ ...prev, [item.href]: true }));
                }
            }
        });
    }, [pathname]);

    const handleMenuClick = (href: string) => {
        // Jika sidebar tertutup, buka dulu
        if (!isOpen) setIsOpen(true);
        setOpenMenus(prevState => ({ ...prevState, [href]: !prevState[href] }));
    };

    const HIDE_ON = ['/login', '/register'];
    if (HIDE_ON.includes(pathname)) {
        return null;
    }

    const renderNavItems = () => {
        return navItems.map((item) => {
            // Cek apakah item ini aktif (untuk single link) atau anaknya aktif (untuk dropdown)
            const isSingleActive = pathname === item.href;
            
            // Logic baru: Parent dianggap aktif jika salah satu anaknya aktif
            const isParentActive = item.subItems 
                ? item.subItems.some(sub => pathname.startsWith(sub.href))
                : isSingleActive;
            
            // Render logic untuk Dropdown (Menu Beranak)
            if (item.subItems) {
                return (
                    <li key={item.label} className="mb-1">
                        <button
                            onClick={() => handleMenuClick(item.href)}
                            className={`w-full flex items-center justify-between gap-3 p-3 rounded-md transition-colors ${
                                // Jika parent aktif (anaknya dibuka), beri warna background sedikit
                                isParentActive ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/10 text-sidebar-text/80'
                            } ${!isOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={isParentActive ? 'text-sky-400' : ''} />
                                <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                            </div>
                            {isOpen && (
                                <ChevronDown size={16} className={`transition-transform duration-200 ${openMenus[item.href] ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                        
                        {/* Sub Menu / Anak-anak */}
                        {isOpen && openMenus[item.href] && (
                            <ul className="pl-4 mt-1 space-y-1 bg-black/10 rounded-md py-1">
                                {item.subItems.map((subItem) => {
                                    const isSubItemActive = pathname === subItem.href;
                                    return (
                                        <li key={subItem.label}>
                                            <Link
                                                href={subItem.href}
                                                className={`flex items-center gap-3 p-2 rounded-md transition-colors text-sm ${
                                                    isSubItemActive 
                                                        ? 'bg-sky-600 text-white shadow-md font-medium' // Style Active Child
                                                        : 'text-sidebar-text/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {/* Dot kecil atau Icon Child */}
                                                <subItem.icon size={16} /> 
                                                <span>{subItem.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            }

            // Render logic untuk menu biasa (Single)
            return (
                <li key={item.label} className="mb-1">
                    {item.action ? (
                        <button
                            onClick={(e) => { e.preventDefault(); item.action?.(); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-md transition-all duration-200 hover:bg-white/10 ${!isOpen && 'justify-center'}`}
                        >
                            <item.icon size={20} className={item.label === 'Logout' ? 'text-red-400' : ''} />
                            <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                        </button>
                    ) : (
                        <Link 
                            href={item.href} 
                            className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${
                                isSingleActive 
                                ? 'bg-sky-600 text-white font-bold shadow-md' 
                                : 'text-sidebar-text/80 hover:bg-white/10 hover:text-white'
                            } ${!isOpen && 'justify-center'}`}
                        >
                            <item.icon size={20} />
                            <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                        </Link>
                    )}
                </li>
            );
        });
    };

    return (
        <aside
            className={`min-h-full bg-[#1e293b] text-white flex flex-col transition-all duration-300
                ${isOpen ? 'w-72' : 'w-20'}
                fixed md:static z-40 h-full md:translate-x-0 border-r border-gray-700
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                {/* Header dan Logo */}
                <div className="flex items-center justify-center mb-8 relative h-14">
                    {isOpen && (
                        <Image
                            src="/Kab-Ponorogo.svg"
                            alt="Logo Kab Ponorogo"
                            width={50}
                            height={50}
                            className="transition-opacity duration-300"
                        />
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white absolute ${isOpen ? 'right-0 top-0' : 'center'}`}
                    >
                        {isOpen ? <PanelLeftClose size={18} /> : <PanelRightClose size={20} />}
                    </button>
                </div>

                {/* Judul Aplikasi */}
                {isOpen && (
                    <div className="text-center mb-8 px-2">
                        <h1 className="font-bold text-[14px] leading-tight tracking-wide text-white-400">KINERJA PEMBANGUNAN</h1>
                        <p className="text-[12px] text-white-400 mt-1 uppercase tracking-widest">Kabupaten Ponorogo</p>
                    </div>
                )}
                
                {/* Navigasi */}
                <nav>
                    <ul className="space-y-1">
                        {renderNavItems()}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;