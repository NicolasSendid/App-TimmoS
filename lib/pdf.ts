import jsPDF from "jspdf";

type ReportData = {
  title: string;
  price: number;
  address: string;
  surface: number;
  type: string;
  score?: number | null;
};

export async function generatePDF(data: ReportData) {
  const pdf = new jsPDF("p", "mm", "a4");

  /* TITRE */
  pdf.setFontSize(22);
  pdf.text("Rapport d'estimation immobilière", 15, 20);

  /* INFO BIEN */
  pdf.setFontSize(12);

  pdf.text(`Adresse : ${data.address}`, 15, 40);
  pdf.text(`Type : ${data.type}`, 15, 50);
  pdf.text(`Surface : ${data.surface} m²`, 15, 60);

  /* PRIX */
  pdf.setFontSize(16);
  pdf.text(`Prix estimé : ${data.price.toLocaleString()} €`, 15, 80);

  /* SCORE */
  if (data.score !== undefined && data.score !== null) {
    pdf.setFontSize(12);
    pdf.text(`Score qualité du marché : ${data.score}/3`, 15, 95);
  }

  /* ANALYSE TEXTE AUTO */
  pdf.setFontSize(11);

  const analysis = generateAnalysis(data);

  const split = pdf.splitTextToSize(analysis, 180);

  pdf.text(split, 15, 110);

  /* FOOTER */
  pdf.setFontSize(9);
  pdf.text(
    "Document généré automatiquement à titre indicatif",
    15,
    280
  );

  pdf.save("estimation.pdf");
}

/* 🧠 ANALYSE AUTOMATIQUE */
function generateAnalysis(data: ReportData) {
  let text = `L'analyse de ce bien situé à ${data.address} met en évidence plusieurs éléments. `;

  if (data.price > 0) {
    text += `Le prix estimé est de ${data.price.toLocaleString()} €, basé sur les données du marché local et les transactions comparables. `;
  }

  if (data.score && data.score >= 2) {
    text += `Le bien présente une position favorable sur le marché, avec un potentiel de valorisation intéressant. `;
  } else {
    text += `Le bien semble se situer dans une fourchette de marché plus classique, nécessitant une analyse fine pour optimiser sa valorisation. `;
  }

  text += `Cette estimation reste indicative et doit être complétée par une visite sur place et une analyse approfondie.`;

  return text;
}
