import React from 'react';
import { ArrowRight, BookOpen, Award, CheckCircle, Shield, Users, HeartPulse } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: string) => void;
  completedEvaluation: boolean;
  score?: number;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, completedEvaluation, score }) => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0b1320] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Context & Direct Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed clean metadata kicker */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="text-[#39A900] font-semibold">Inducción Integral</span>
              <span aria-hidden="true">·</span>
              <span>Vigencia 2026</span>
              <span aria-hidden="true">·</span>
              <span>Reglamento del Aprendiz</span>
              <span aria-hidden="true">·</span>
              <span>Acuerdo 0009 de 2024 (Vigente)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#00324D] dark:text-white tracking-tight text-balance leading-tight">
              Bienvenido al SENA: Transforma tu Futuro con Conocimiento
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              La inducción es tu puerta de entrada a la institución más querida por los colombianos. 
              Conoce tus <strong>derechos fundamentales</strong>, tus <strong>deberes formativos</strong>, 
              los beneficios de <strong>Bienestar al Aprendiz</strong> (Apoyos FIC y Regular) y certifica tu 
              apropiación mediante la evaluación interactiva oficial.
            </p>

            {/* Status card if already evaluated */}
            {completedEvaluation && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">¡Evaluación de Apropiación Completada!</h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Puntaje obtenido: <span className="font-bold">{score}%</span> · Tu constancia digital está lista para descarga.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('evaluacion')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
                >
                  Ver Certificado
                </button>
              </div>
            )}

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('identidad')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#39A900] hover:bg-[#2f8800] rounded-xl transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
              >
                <span>Explorar Identidad SENA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('reglamento')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#00324D] dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-transparent dark:border-slate-700"
              >
                <Shield className="w-4 h-4 text-[#39A900]" />
                <span>Derechos y Deberes</span>
              </button>

              <button
                onClick={() => onNavigate('bienestar')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-emerald-200 dark:border-emerald-800"
              >
                <HeartPulse className="w-4 h-4 text-[#39A900]" />
                <span>Bienestar y Apoyos</span>
              </button>

              <button
                onClick={() => onNavigate('evaluacion')}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Evaluación Interactiva</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#39A900]" />
                <span>Reglamento Actualizado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#39A900]" />
                <span>Casos Reales Situacionales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#39A900]" />
                <span>Certificado Digital Inmediato</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-[4/3] bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/sena_induction_ceremony_1793115112822.jpg"
                alt="Auditorio de Inducción de Aprendices SENA"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                  Comunidad SENA
                </span>
                <p className="text-base font-bold leading-tight mt-1">
                  Semana de Inducción: El inicio de tu proyecto de vida profesional
                </p>
                <p className="text-xs text-slate-200 mt-1">
                  Formación técnica, humana y científica con enfoque en la innovación y el trabajo digno.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-[#00324D] dark:text-emerald-400 tabular-nums">33</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Regionales en todo el país</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-[#39A900] tabular-nums">118</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Centros de Formación Integral</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-[#00324D] dark:text-emerald-400 tabular-nums">100%</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Educación Pública y Gratuita</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-[#39A900] tabular-nums">Acuerdo 0009</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Nuevo Reglamento Vigente (2024)</div>
          </div>
        </div>
      </div>
    </section>
  );
};
