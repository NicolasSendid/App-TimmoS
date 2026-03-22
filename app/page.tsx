"use client";
import React, { useState } from 'react';
import { Camera, Search, FileDown, ShieldCheck, MapPin } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AgentTimmosReport } from '@/components/PdfReport';

export default function AgentTimmosApp() {
  const [city, setCity] = useState("");
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState("");

  const handleSearch = () => {
    if (!city) return;
    setHistory(`${city} est une commune reconnue pour son patrimoine architectural et sa qualité de vie. Située dans un secteur dynamique, elle offre un accès privilégié aux services et commerces de proximité.`);
    setStep(2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Premium */}
      <header className="p-8 border-b border-timmos-cream/10 flex justify-between items-center backdrop-blur-md sticky top-0 bg-timmos-blue/80 z-50">
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl tracking-[0.2em] uppercase">Agent TimmoS</h1>
          <span className="text-[10px] tracking-[0.4em] text-timmos-cream/40 uppercase">Expertise & Data</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-widest text-timmos-cream/60">
          <ShieldCheck size={14} className="text-timmos-cream/80" /> ACCÈS COLLABORATEUR
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12">
        {step === 1 ? (
          <div className="max-w-2xl mx-auto text-center space-y-12 py-20 animate-in fade-in duration-1000">
            <h2 className="font-serif text-6xl leading-tight">Nouvelle Estimation</h2>
            <p className="text-timmos-cream/60 font-light tracking-widest text-sm uppercase">Recherchez une commune pour démarrer l'analyse</p>
            <div className="flex bg-white/5 border border-timmos-cream/20 p-2 group focus-within:border-timmos-cream transition-all">
              <input 
                type="text" 
                placeholder="VILLE OU CODE POSTAL..." 
                className="flex-1 bg-transparent p-4 outline-none uppercase tracking-[0.2em] text-sm"
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="bg-timmos-cream text-timmos-blue px-8 hover:bg-white transition">
                <Search size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-8 duration-700">
            {/* Colonne Data */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 border border-timmos-cream/10 p-10">
                <h3 className="font-serif text-4xl mb-6 flex items-center gap-4">
                  <MapPin className="text-timmos-cream/40" /> {city}
                </h3>
                <div className="grid grid-cols-2 gap-8 py-8 border-y border-timmos-cream/10">
                  <div>
                    <p className="text-[10px] tracking-widest text-timmos-cream/40 uppercase mb-2">Estimation DVF</p>
                    <p className="text-3xl font-serif">4 250 €/m²</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest text-timmos-cream/40 uppercase mb-2">Marché Actuel</p>
                    <p className="text-3xl font-serif">4 600 €/m²</p>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-timmos-cream/40 block mb-4">Note de synthèse (Modifiable)</label>
                  <textarea 
                    className="w-full bg-transparent border border-timmos-cream/10 p-6 text-sm font-light leading-relaxed h-48 outline-none focus:border-timmos-cream/40 transition"
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Colonne Actions */}
            <div className="space-y-6">
              <div className="bg-timmos-cream text-timmos-blue p-8 shadow-2xl sticky top-32">
                <h4 className="font-serif text-xl mb-6 uppercase tracking-tight border-b border-timmos-blue/10 pb-4">Dossier Photos</h4>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square border border-timmos-blue/20 flex items-center justify-center hover:bg-timmos-blue/5 cursor-pointer">
                      <Camera size={20} className="text-timmos-blue/40" />
                    </div>
                  ))}
                </div>

                <PDFDownloadLink 
                  document={<AgentTimmosReport 
                    data={{ m2Dvf: 4250, m2Ads: 4600, totalPrice: 395000 }} 
                    cityInfo={{ name: city, history: history }} 
                  />}
                  fileName={`Expertise_${city}.pdf`}
                >
                  <button className="w-full bg-timmos-blue text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition">
                    <FileDown size={16} /> Télécharger le Rapport
                  </button>
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
