"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "15px",
      padding: "15px",
      background: "#0f172a",
      color: "white"
    }}>
      <Link href="/">Accueil</Link>
      <Link href="/estimation">Estimation</Link>
      <Link href="/dvf">DVF</Link>
      <Link href="/dpe">DPE</Link>
      <Link href="/cadastre">Cadastre</Link>
      <Link href="/annonces">Annonces</Link>
    </nav>
  );
}
