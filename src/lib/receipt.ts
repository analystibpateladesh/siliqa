import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import type { SavedOrder } from "./store";
import { BRAND } from "./config";
import logoImg from "@/assets/welded_logo.png";
import signatureImg from "@/assets/sign.jpeg";

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

// Loads an imported image asset and returns a PNG data URL + its aspect ratio,
// so it can be dropped into the PDF at the right size via doc.addImage().
function loadImageAsDataUrl(src: string): Promise<{ dataUrl: string; ratio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0);
      resolve({ dataUrl: canvas.toDataURL("image/png"), ratio: img.naturalWidth / img.naturalHeight });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function downloadReceipt(order: SavedOrder) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 48;

  // Preload logo & signature — if either fails (missing file, network), we
  // just fall back to text so the receipt still generates.
  const [logoResult, signatureResult] = await Promise.allSettled([
    loadImageAsDataUrl(logoImg),
    loadImageAsDataUrl(signatureImg),
  ]);

  // Header
  const logoH = 62;
  if (logoResult.status === "fulfilled") {
    const { dataUrl, ratio } = logoResult.value;
    const logoW = logoH * ratio;
    doc.addImage(dataUrl, "PNG", 40, y - 26, logoW, logoH);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(BRAND.name, 40, y);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("PAYMENT RECEIPT", w - 40, y, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(new Date(order.createdAt).toLocaleString(), w - 40, y + 14, { align: "right" });
  doc.setFont("helvetica", "normal");
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
    doc.text(String(v), 118, y + i * 16);
  });

  const c = order.customer;
  const metaRight = [
    ["Billed to", c.name],
    ["Email", c.email],
    ["Phone", c.phone],
    ["Address", `${c.address1}${c.address2 ? ", " + c.address2 : ""}, ${c.city}, ${c.state} ${c.pincode}`],
  ];
  const rightLabelX = w / 2 + 10;
  const rightValueX = w / 2 + 68;
  const rightValueMaxWidth = w - 40 - rightValueX; // keep text inside the right margin
  let ry = y;
  metaRight.forEach(([k, v]) => {
    doc.setTextColor(120);
    doc.text(k, rightLabelX, ry);
    doc.setTextColor(0);
    const lines = doc.splitTextToSize(String(v), rightValueMaxWidth);
    doc.text(lines, rightValueX, ry);
    ry += lines.length * 13 + 4;
  });

  y += Math.max(metaLeft.length * 16, ry - y) + 24;
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
  doc.setTextColor(0);
  if (signatureResult.status === "fulfilled") {
    const { dataUrl, ratio } = signatureResult.value;
    const sigH = 46;
    const sigW = sigH * ratio;
    doc.addImage(dataUrl, "PNG", w - 120 - sigW / 2, sy - sigH - 4, sigW, sigH);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text(BRAND.name, w - 120, sy - 6, { align: "center" });
    doc.setFont("helvetica", "normal");
  }

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

  doc.save(`welded-receipt-${order.orderId}.pdf`);
}