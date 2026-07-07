import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import type { SavedOrder } from "./store";
import { BRAND } from "./config";

function makeBarcodeDataUrl(text: string): string {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    displayValue: true,
    fontSize: 14,
    height: 60,
    margin: 8,
  });
  return canvas.toDataURL("image/png");
}

export function downloadReceipt(order: SavedOrder) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 48;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(BRAND.name, 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(BRAND.tagline, 40, y + 16);
  doc.setTextColor(0);

  doc.setFontSize(11);
  doc.text("PAYMENT RECEIPT", w - 40, y, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(new Date(order.createdAt).toLocaleString(), w - 40, y + 14, { align: "right" });
  doc.setTextColor(0);

  y += 48;
  doc.setDrawColor(230);
  doc.line(40, y, w - 40, y);
  y += 24;

  // Order meta
  doc.setFontSize(10);
  const metaLeft = [
    ["Order ID", order.orderId],
    ["Payment ID", order.razorpayPaymentId ?? "—"],
    ["Razorpay Order", order.razorpayOrderId ?? "—"],
    ["Status", order.status.toUpperCase()],
  ];
  metaLeft.forEach(([k, v], i) => {
    doc.setTextColor(120);
    doc.text(k, 40, y + i * 16);
    doc.setTextColor(0);
    doc.text(String(v), 150, y + i * 16);
  });

  const c = order.customer;
  const metaRight = [
    ["Billed to", c.name],
    ["Email", c.email],
    ["Phone", c.phone],
    ["Address", `${c.address1}${c.address2 ? ", " + c.address2 : ""}, ${c.city}, ${c.state} ${c.pincode}`],
  ];
  metaRight.forEach(([k, v], i) => {
    doc.setTextColor(120);
    doc.text(k, w / 2 + 10, y + i * 16);
    doc.setTextColor(0);
    const lines = doc.splitTextToSize(String(v), w / 2 - 60);
    doc.text(lines, w / 2 + 80, y + i * 16);
  });

  y += 4 * 16 + 24;
  doc.setDrawColor(230);
  doc.line(40, y, w - 40, y);
  y += 20;

  // Items header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Item", 40, y);
  doc.text("Qty", w - 200, y, { align: "right" });
  doc.text("Price", w - 120, y, { align: "right" });
  doc.text("Amount", w - 40, y, { align: "right" });
  y += 12;
  doc.setDrawColor(200);
  doc.line(40, y, w - 40, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  order.items.forEach((it) => {
    doc.text(`${it.name} (${it.tierLabel})`, 40, y);
    doc.text(String(it.qty), w - 200, y, { align: "right" });
    doc.text(`Rs. ${it.unitPrice.toLocaleString("en-IN")}`, w - 120, y, { align: "right" });
    doc.text(`Rs. ${(it.unitPrice * it.qty).toLocaleString("en-IN")}`, w - 40, y, { align: "right" });
    y += 18;
  });

  y += 6;
  doc.setDrawColor(230);
  doc.line(w / 2, y, w - 40, y);
  y += 16;

  doc.setTextColor(120);
  doc.text("Subtotal", w - 120, y, { align: "right" });
  doc.setTextColor(0);
  doc.text(`Rs. ${order.subtotal.toLocaleString("en-IN")}`, w - 40, y, { align: "right" });
  y += 14;
  doc.setTextColor(120);
  doc.text("Shipping", w - 120, y, { align: "right" });
  doc.setTextColor(0);
  doc.text(order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`, w - 40, y, { align: "right" });
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total Paid", w - 120, y, { align: "right" });
  doc.text(`Rs. ${order.total.toLocaleString("en-IN")}`, w - 40, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  y += 40;
  // Barcode
  try {
    const barcode = makeBarcodeDataUrl(order.orderId);
    doc.addImage(barcode, "PNG", 40, y, 220, 60);
  } catch (e) {
    console.error(e);
  }

  // Signature
  const sy = y + 30;
  doc.setDrawColor(0);
  doc.line(w - 200, sy, w - 40, sy);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Authorised Signatory", w - 120, sy + 14, { align: "center" });
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(BRAND.name, w - 120, sy - 6, { align: "center" });
  doc.setFont("helvetica", "normal");

  y += 100;
  doc.setDrawColor(230);
  doc.line(40, y, w - 40, y);
  y += 18;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Thank you for shopping with ${BRAND.name}. This is a computer-generated receipt.`,
    w / 2,
    y,
    { align: "center" },
  );
  doc.text(`Support: ${BRAND.email} · ${BRAND.phone}`, w / 2, y + 12, { align: "center" });

  doc.save(`siliqa-receipt-${order.orderId}.pdf`);
}
