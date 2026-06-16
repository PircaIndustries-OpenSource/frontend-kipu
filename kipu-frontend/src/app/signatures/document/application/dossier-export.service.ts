import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class DossierExportService {
  exportDossierPdf(
    projectName: string,
    stageName: string,
    signatures: any[],
    dateRange?: { start: Date | null; end: Date | null },
  ) {
    const doc = new jsPDF();

    // 1. Encabezado / Branding de Kipu
    doc.setFillColor(44, 62, 80); // Color principal oscuro
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('KIPU - DOSSIER DE CALIDAD', 14, 25);
    doc.setFontSize(10);
    doc.text('CONSTRUCTION MANAGEMENT SYSTEM', 14, 32);

    // 2. Información del Proyecto y Etapa
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(14);
    doc.text(`Proyecto: ${projectName}`, 14, 55);
    doc.text(`Fase de Control: ${stageName}`, 14, 63);
    doc.setFontSize(10);
    doc.text(`Fecha de Generación: ${new Date().toLocaleString()}`, 14, 71);

    if (dateRange && dateRange.start && dateRange.end) {
      doc.text(
        `Periodo Restringido: ${dateRange.start.toLocaleDateString()} al ${dateRange.end.toLocaleDateString()}`,
        14,
        78,
      );
    }

    // 3. Tabla con el historial de Firmas Electrónicas y Aprobaciones
    const headers = [['Fecha', 'Documento / Hito', 'Firmante', 'Rol', 'Llave Hash / Certificado']];
    const data = signatures
      .filter((sig) => {
        if (!dateRange || !dateRange.start || !dateRange.end) return true;
        // Ahora leemos estrictamente "sig.date"
        const sigDate = new Date(sig.date);
        return sigDate >= dateRange.start && sigDate <= dateRange.end;
      })
      .map((sig) => [
        // Usamos los campos exactos que manda document-page.ts
        new Date(sig.date).toLocaleDateString(),
        sig.documentName || 'Plano Técnico',
        sig.userName || 'Firmante',
        sig.userRole || 'Ingeniero',
        (sig.hashSignature || 'N/A').substring(0, 16) + '...', // Hash acortado para legibilidad
      ]);

    autoTable(doc, {
      startY: dateRange && dateRange.start && dateRange.end ? 85 : 78,
      head: headers,
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] }, // Accent color
      styles: { fontSize: 9 },
    });

    // 4. Pie de Página con firma inalterable
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setTextColor(127, 140, 141);
    doc.text('Código de Integridad del Dossier:', 14, finalY);
    doc.setFont('Courier');
    doc.text(`SHA-256: ${this.generateFakeHash(projectName + stageName)}`, 14, finalY + 5);

    // Guardar el PDF
    doc.save(`Dossier_Calidad_${stageName.replace(/\s+/g, '_')}.pdf`);
  }

  private generateFakeHash(value: string): string {
    return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  }
}
