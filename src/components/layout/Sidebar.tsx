'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { 
    Home, 
    PanelLeftClose, 
    PanelRightClose, 
    Network, // Icon baru untuk Pohon Kinerja
    ChevronDown, 
} from 'lucide-react';

// Tipe untuk setiap item navigasi
type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    subItems?: NavItem[]; 
    action?: () => void; 
};

// MODIFIKASI: Struktur data hanya Dashboard dan Pohon Kinerja (+ Logout)
const navItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/pohon-kinerja', icon: Network, label: 'Pohon Kinerja Pemda' }, // Menu baru
    { href: '/pohon-kinerja-opd', icon: Network, label: 'Pohon Kinerja OPD' },
    // { href: '/logout', icon: LogOut, label: 'Logout', action: logout },
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const handleMenuClick = (href: string) => {
        setOpenMenus(prevState => ({ ...prevState, [href]: !prevState[href] }));
    };

    const HIDE_ON = ['/login', '/register'];
    if (HIDE_ON.includes(pathname)) {
        return null;
    }

    const renderNavItems = () => {
        return navItems.map((item) => {
            const isParentActive = item.subItems 
                ? pathname.startsWith(item.href) 
                : pathname === item.href;
            
            // Render logic untuk Dropdown (jika nanti dibutuhkan lagi)
            if (item.subItems) {
                return (
                    <li key={item.label}>
                        <button
                            onClick={() => handleMenuClick(item.href)}
                            className={`w-full flex items-center justify-between gap-3 p-3 my-1 rounded-md transition-colors ${
                                isParentActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold' : 'hover:bg-white/20'
                            } ${!isOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                            </div>
                            {isOpen && (
                                <ChevronDown size={16} className={`transition-transform ${openMenus[item.href] ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                        {isOpen && openMenus[item.href] && (
                            <ul className="pl-6 mt-1">
                                {item.subItems.map((subItem) => {
                                    const isSubItemActive = pathname.startsWith(subItem.href);
                                    return (
                                        <li key={subItem.label}>
                                            <Link
                                                href={subItem.href}
                                                className={`flex items-center gap-3 p-2 my-1 rounded-md transition-colors text-sm ${
                                                    isSubItemActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-semibold' : 'hover:bg-white/20'
                                                }`}
                                            >
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

            // Render logic untuk menu biasa & action button
            const commonClasses = `flex items-center gap-3 p-3 my-1 rounded-md transition-all duration-200 ${
    isParentActive 
    ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold shadow-sm' 
    : 'text-sidebar-text/80 hover:bg-white/10 hover:text-white'
} ${!isOpen && 'justify-center'}`;

            return (
                <li key={item.label}>
                    {item.action ? (
                        <button
                            onClick={(e) => { e.preventDefault(); item.action?.(); }}
                            className={`w-full ${commonClasses}`}
                        >
                            <item.icon size={20} className={item.label === 'Logout' ? 'text-red-400' : ''} />
                            <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                        </button>
                    ) : (
                        <Link href={item.href} className={commonClasses}>
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
            className={`min-h-full bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-300
                ${isOpen ? 'w-64' : 'w-20'}
                fixed md:static z-40 h-full md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex-1 p-4">
                {/* Header dan Logo */}
                <div className="flex items-center justify-center mb-8 relative h-14">
                    {isOpen && (
                        <Image
                            src="/Kab-Ponorogo.svg"
                            alt="Logo Kab Ponorogo"
                            width={55}
                            height={55}
                            className="transition-opacity duration-300"
                        />
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-400 hover:text-white absolute right-0"
                    >
                        {isOpen ? <PanelLeftClose /> : <PanelRightClose />}
                    </button>
                </div>

                {/* Judul Aplikasi */}
                {isOpen && (
                    <div className="text-center mb-8">
                        <h1 className="font-bold text-[15px] leading-tight">KINERJA PEMBANGUNAN DAERAH</h1>
                        <p className="text-[15px]">Kabupaten Ponorogo</p>
                    </div>
                )}
                
                {/* Navigasi */}
                <nav>
                    <ul>
                        {renderNavItems()}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;