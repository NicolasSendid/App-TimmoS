"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-black text-white">
      <Link href="/">Accueil</Link>
      <Link href="/estimation">Estimation</Link>
      <Link href="/dvf">DVF</Link>
      <Link href="/dpe">DPE</Link>
      <Link href="/cadastre">Cadastre</Link>
      <Link href="/annonces">Annonces</Link>
    </nav>
  );
}
