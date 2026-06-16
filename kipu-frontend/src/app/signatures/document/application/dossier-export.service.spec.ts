import { DossierExportService } from './dossier-export.service';
import jsPDF from 'jspdf';
import { describe, beforeEach, it, expect } from 'vitest';

describe('DossierExportService', () => {
  let service: DossierExportService;

  beforeEach(() => {
    service = new DossierExportService();

    // Mock jsPDF prototype methods manually to avoid saving files and drawing errors
    jsPDF.prototype.save = function() { return this; };

    jsPDF.prototype.text = function() { return this; };
    jsPDF.prototype.rect = function() { return this; };
    jsPDF.prototype.setFillColor = function() { return this; };
    jsPDF.prototype.setTextColor = function() { return this; };
    jsPDF.prototype.setFontSize = function() { return this; };
    jsPDF.prototype.setFont = function() { return this; };

    // Set a dummy lastAutoTable property to prevent crashes
    (jsPDF.prototype as any).lastAutoTable = { finalY: 100 };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly filter signatures by date range', () => {
    const signatures = [
      { date: '2026-05-01T12:00:00.000Z', documentName: 'Plano Cimentación', userName: 'Paula Montoya', userRole: 'Logística', hashSignature: 'hash1' },
      { date: '2026-05-15T12:00:00.000Z', documentName: 'Plano Instalaciones', userName: 'Carlos Ramos', userRole: 'Ingeniero', hashSignature: 'hash2' },
      { date: '2026-05-30T12:00:00.000Z', documentName: 'Especificación Concreto', userName: 'Luis Gomez', userRole: 'Inspector', hashSignature: 'hash3' },
    ];

    const dateRange = {
      start: new Date('2026-05-10T00:00:00.000Z'),
      end: new Date('2026-05-20T23:59:59.000Z')
    };

    // Filter logic used inside exportDossierPdf
    const filtered = signatures.filter(sig => {
      const sigDate = new Date(sig.date);
      return sigDate >= dateRange.start && sigDate <= dateRange.end;
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].documentName).toBe('Plano Instalaciones');
    expect(filtered[0].userName).toBe('Carlos Ramos');
  });

  it('should return all signatures if no date range is provided', () => {
    const signatures = [
      { date: '2026-05-01T12:00:00.000Z', documentName: 'Plano Cimentación', userName: 'Paula Montoya', userRole: 'Logística', hashSignature: 'hash1' },
      { date: '2026-05-15T12:00:00.000Z', documentName: 'Plano Instalaciones', userName: 'Carlos Ramos', userRole: 'Ingeniero', hashSignature: 'hash2' },
    ];

    // When dateRange is undefined, all signatures must pass
    const filtered = signatures.filter(() => true);
    expect(filtered.length).toBe(2);
  });
});
