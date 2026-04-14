import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Invoice = {
  invoiceNumber: string;
  patient: string;
  encounterId: string;
  provider: string;
  invoiceDate: string;
  dueDate: string;
  total: string;
  patientDue: string;
  status: string;
  paymentStatus: string;
};
export const handleViewInvoice = (
  Data: Invoice,
  action: "View" | "Download",
) => {
  const doc = new jsPDF();
  const blueTheme = [37, 99, 235]; // Royal Blue

  // --- 1. Header Section ---
  doc.setFillColor(blueTheme[0], blueTheme[1], blueTheme[2]);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("TeleMed", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Secure Medical Billing", 14, 32);

  // --- 2. Invoice Meta Info ---
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(20);
  doc.text("INVOICE", 140, 25);
  
  doc.setFontSize(10);
  doc.text(`No: ${Data.invoiceNumber}`, 140, 32);

  // --- 3. Billing Details ---
  doc.setTextColor(107, 114, 128); // Gray
  doc.text("BILL TO:", 14, 55);
  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "bold");
  doc.text(Data.patient, 14, 61);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("PROVIDER:", 100, 55);
  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "bold");
  doc.text(Data.provider, 100, 61);

  // Summary Dates
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Invoice Date: ${Data.invoiceDate}`, 14, 75);
  doc.text(`Due Date: ${Data.dueDate}`, 14, 80);

  // Status Badge
  const isPaid = Data.paymentStatus.toLowerCase() === "paid";
  doc.setFillColor(isPaid ? 236 : 254, isPaid ? 253 : 242, isPaid ? 245 : 242); // Light Green vs Light Red
  doc.roundedRect(160, 70, 35, 10, 2, 2, "F");
  doc.setTextColor(isPaid ? 5 : 185, isPaid ? 150 : 28, isPaid ? 105 : 28); // Dark Green vs Dark Red
  doc.setFontSize(10);
  doc.text(Data.paymentStatus.toUpperCase(), 177.5, 76.5, { align: "center" });

  // --- 4. Items Table ---
  const items = [["Consultation (Encounter ID: " + Data.encounterId + ")", "1", Data.total, Data.total]];

  autoTable(doc, {
    head: [["Description", "Qty", "Price", "Total"]],
    body: items,
    startY: 90,
    theme: "striped",
    headStyles: { fillColor: blueTheme as [number, number, number], fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // --- 5. Summary Section ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setTextColor(107, 114, 128);
  doc.text("Total Amount:", 140, finalY);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(Data.total, 190, finalY, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // Red for Patient Due
  doc.text("Patient Due:", 140, finalY + 8);
  doc.text(Data.patientDue, 190, finalY + 8, { align: "right" });

  // --- 6. Footer ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Thank you for choosing TeleMed Services.", 105, 280, { align: "center" });

  // Behavior
  if (action === "View") {
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  } else {
    doc.save(`Invoice-${Data.invoiceNumber}.pdf`);
  }
};