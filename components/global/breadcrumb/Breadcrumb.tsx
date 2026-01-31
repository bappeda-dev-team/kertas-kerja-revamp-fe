"use client"; 

import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Crumb = {
  label: string;
  href: string;
};

const MENU_TREE: Record<string, Crumb[]> = {
  // Dashboard
  dashboard: [
    { label: "Dashboard", href: "/dashboard" }
  ],

  // Perencanaan Pemda
  tematik: [
    { label: "Perencanaan Pemda", href: "/perencanaan-pemda" },
    { label: "Tematik Pemda", href: "/perencanaan-pemda/tematik" },
  ],
  "pohon-kinerja": [
    { label: "Perencanaan Pemda", href: "/perencanaan-pemda" },
    { label: "Pohon Kinerja Pemda", href: "/perencanaan-pemda/pohon-kinerja" },
  ],

  // Perencanaan OPD
  "pohon-kinerja-opd": [
    { label: "Perencanaan OPD", href: "/perencanaan-opd" },
    { label: "Pohon Kinerja OPD", href: "/pohon-kinerja-opd" },
  ],

  // Data Master
  "master-opd": [
    { label: "Data Master", href: "/data-master" },
    { label: "Master OPD", href: "/data-master/master-opd" },
  ],
  "master-role": [
    { label: "Data Master", href: "/data-master" },
    { label: "Master Role", href: "/data-master/master-role" },
  ],
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const items = useMemo(() => {
    if (!pathname) return [];

    const lastSegment = pathname.split("/").filter(Boolean).at(-1);
    if (!lastSegment) return [];

    return MENU_TREE[lastSegment] || [];
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
      <Link href="/dashboard" className="hover:text-blue-500 transition-colors">
        <Home size={16} />
      </Link>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span>/</span>
          {idx === items.length - 1 ? (
            <span className="font-semibold text-gray-700">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-blue-500 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
