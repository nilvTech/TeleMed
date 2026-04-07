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

  // Title
  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  // Invoice Details
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${Data.invoiceNumber}`, 14, 30);
  doc.text(`Date: ${Data.invoiceDate}`, 14, 36);
  doc.text(`Patient: ${Data.patient}`, 14, 42);
  doc.text(`Provider: ${Data.provider}`, 14, 48);

  // Table Data
  const items = [["Consultation", "1", Data.total, Data.total]];

  autoTable(doc, {
    head: [["Description", "Qty", "Price", "Total"]],
    body: items,
    startY: 55,
  });

  // // Calculate total
  // const total = Data.items.reduce(
  //   (sum, item) => sum + item.quantity * item.price,
  //   0,
  // );

  //const finalY = (doc as any).lastAutoTable.finalY || 70;

  //doc.text(`Total: $${total}`, 14, finalY + 10);

  // Open PDF in new tab (View Invoice behavior)
  if (action === "View") {
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  }
  if (action === "Download") {
    doc.save(`Invoice-${Data.patient}.pdf`);
  }
};
