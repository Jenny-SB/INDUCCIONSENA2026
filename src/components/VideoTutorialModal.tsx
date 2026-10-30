import React, { useEffect, useRef } from 'react';
import { X, Play, Film, Sparkles, Volume2, Maximize, RotateCcw } from 'lucide-react';
import { SenaLogo } from './SenaLogo.tsx';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pause video when modal is closed
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Ventana flotante de Video Tutorial"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0b1320] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col relative max-h-[95vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#39A900] flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#00324D] dark:text-white leading-tight">
                  Video Tutorial: Manual del Aprendiz SENA
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#39A900]/15 text-[#39A900] border border-[#39A900]/30">
                  Oficial
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guía Oficial de Uso del Portal Interactivo de Inducción (Acuerdo 0009 de 2024)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar video tutorial (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black w-full flex items-center justify-center overflow-hidden aspect-video max-h-[62vh]">
          <video
            ref={videoRef}
            src="/assets/aistudio/2026__11_51_a.m._6ce3b108.mp4"
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Tu navegador no soporta la reproducción de video HTML5.
          </video>
        </div>

        {/* Modal Footer / Navigation Guide */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0b1320] border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <SenaLogo className="w-4 h-4 shrink-0" />
              <span className="font-semibold">Módulos explicados en el video:</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Usa los controles de la barra inferior para pausar, avanzar o pantalla completa.
            </span>
          </div>

          {/* Quick topic tags from the video */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              1. Acceso y Registro
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              2. Identidad y Símbolos
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              3. Reglamento (Acuerdo 0009)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              4. Simulador de Dilemas
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              5. Evaluación y Certificado
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              6. Bienestar al Aprendiz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
