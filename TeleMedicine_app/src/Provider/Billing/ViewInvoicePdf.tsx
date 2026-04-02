import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Dummy invoice JSON data (replace with API data later)
const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2026-04-02",
  patient: "John Smith",
  provider: "Dr. Michael Chen",
  items: [
    {
      description: "Consultation",
      quantity: 1,
      price: 120,
    },
    {
      description: "Blood Test",
      quantity: 2,
      price: 50,
    },
  ],
};

const ViewInvoicePDF: React.FC = () => {
  const handleViewInvoice = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    // Invoice Details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${invoiceData.date}`, 14, 36);
    doc.text(`Patient: ${invoiceData.patient}`, 14, 42);
    doc.text(`Provider: ${invoiceData.provider}`, 14, 48);

    // Table Data
    const tableRows = invoiceData.items.map((item) => [
      item.description,
      item.quantity,
      `$${item.price}`,
      `$${item.quantity * item.price}`,
    ]);

    autoTable(doc, {
      head: [["Description", "Qty", "Price", "Total"]],
      body: tableRows,
      startY: 55,
    });

    // Calculate total
    const total = invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const finalY = (doc as any).lastAutoTable.finalY || 70;

    doc.text(`Total: $${total}`, 14, finalY + 10);

    // Open PDF in new tab (View Invoice behavior)
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return (
    <div>
      <button
        onClick={handleViewInvoice}
        style={{
            backgroundColor:"transparent",
          color: "#2563eb",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
          fontWeight: 600,
          whiteSpace:"nowrap"
        
        }}
      > 
        View Invoice
      </button>
    </div>
  );
};

export default ViewInvoicePDF;
