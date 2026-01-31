import { redirect } from "next/navigation";

export default function Home() {
  // Ganti '/dashboard' dengan alamat tujuanmu.
  // Misal kalau mau langsung ke pohon kinerja, ganti jadi '/pohon-kinerja'
  redirect("/dashboard"); 
}