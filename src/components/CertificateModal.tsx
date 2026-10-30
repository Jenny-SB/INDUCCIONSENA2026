import React from 'react';
import { ApprenticeResult } from '../types.ts';
import { SenaLogo } from './SenaLogo.tsx';
import { Award, Printer, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  result: ApprenticeResult;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const certificateCode = `SENA-IND-${result.cohortNumber}-${result.documentId.slice(-4)}-${new Date().getFullYear()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative print:border-none print:shadow-none print:max-w-none">
        {/* Modal actions (hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[#39A900] font-bold">Certificado Oficial de Inducción</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{certificateCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CERTIFICATE PRINTABLE CANVAS */}
        <div className="border-8 border-double border-[#00324D] p-6 sm:p-10 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-white text-center space-y-6 relative overflow-hidden">
          {/* Subtle institutional background watermark emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <SenaLogo className="w-80 h-80" />
          </div>

          {/* Header Institutional Bar */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-16 h-16 flex items-center justify-center">
              <SenaLogo className="w-14 h-14 drop-shadow-sm" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-sm font-extrabold tracking-widest text-[#00324D] uppercase">
                Servicio Nacional de Aprendizaje - SENA
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Dirección de Formación Profesional · Bienestar al Aprendiz
              </p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Otorga la presente
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] tracking-tight">
              CONSTANCIA DE APROPIACIÓN E INDUCCIÓN
            </h1>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Por haber participado satisfactoriamente y superado la evaluación de apropiación sobre
              Identidad Institucional, Derechos, Deberes y Reglamento del Aprendiz (Acuerdo 0009 de 2024) a:
            </p>
          </div>

          {/* Apprentice Name Highlight */}
          <div className="py-2 border-y border-slate-200 max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#39A900] tracking-tight">
              {result.apprenticeName}
            </h3>
            <p className="text-xs font-mono text-slate-600">
              Identificación: {result.documentId} · Ficha No. {result.cohortNumber}
            </p>
          </div>

          {/* Program & Center details */}
          <div className="space-y-1 text-xs text-slate-700 max-w-lg mx-auto">
            <p>
              <strong>Programa: </strong>{result.trainingProgram}
            </p>
            <p>
              <strong>Regional: </strong>{result.regional} · <strong>Centro: </strong>{result.centerName}
            </p>
            <p className="text-slate-500 text-[11px] pt-1">
              Puntaje de Apropiación: <strong className="text-[#39A900]">{result.score}%</strong> (Calificación Aprobatoria)
            </p>
          </div>

          {/* Signatures & Security Verification Bar */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200 text-left">
            {/* Signature 1 */}
            <div className="space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-sm text-[#00324D]">Jorge A. Restrepo C.</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-800">
                Subdirección de Centro
              </div>
              <div className="text-[10px] text-slate-500">SENA Centro de Formación</div>
            </div>

            {/* QR / Digital Stamp */}
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="w-16 h-16 p-1 bg-white border border-slate-300 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-slate-900 rounded-xs">
                  <div className="bg-white col-span-2 row-span-2"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white col-span-2"></div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Verificación Digital QR</span>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-sm text-[#00324D]">Mariana Zuluaga V.</span>
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-bold text-slate-800">
                Coordinación Académica
              </div>
              <div className="text-[10px] text-slate-500">Gestión de Inducción</div>
            </div>
          </div>

          {/* Folio & Date footer */}
          <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Expedición: {result.completedAt}</span>
            <span>Folio: {certificateCode}</span>
          </div>
        </div>

        {/* Modal Close CTA */}
        <div className="flex justify-end pt-2 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
