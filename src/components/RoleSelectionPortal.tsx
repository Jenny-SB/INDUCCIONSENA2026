import React, { useState } from 'react';
import { SenaLogo } from './SenaLogo.tsx';
import { UserRole } from '../types.ts';
import {
  GraduationCap,
  Users,
  HeartPulse,
  ArrowRight,
  Shield,
  BookOpen,
  Award,
  BarChart3,
  CheckCircle,
  Sparkles,
  HelpCircle,
  FileCheck,
  Moon,
  Sun,
  UserCheck,
} from 'lucide-react';

interface RoleSelectionPortalProps {
  onSelectRole: (role: UserRole, apprenticeData?: { name: string; docId: string; program: string; cohort: string }) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const RoleSelectionPortal: React.FC<RoleSelectionPortalProps> = ({
  onSelectRole,
  darkMode,
  onToggleDarkMode,
}) => {
  // Pre-configured apprentice sample profiles for quick testing
  const sampleApprentices = [
    {
      name: 'Laura Camila Rodríguez Parra',
      docId: '1020849312',
      program: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      cohort: '2825491',
    },
    {
      name: 'Brayan Estiven Quintero Vega',
      docId: '1098450123',
      program: 'Técnico en Construcciones Livianas',
      cohort: '2901182',
    },
  ];

  const sampleInstructors = [
    {
      name: 'Ing. Carlos Julio Mendoza',
      docId: '79845210',
      roleTitle: 'Instructor Líder de Ficha 2825491',
      center: 'Centro de Tecnologías para la Construcción y la Madera',
    },
    {
      name: 'Dra. María Patricia Vargas',
      docId: '52890142',
      roleTitle: 'Instructora Técnica y Evaluadora de Competencias',
      center: 'Centro de Electricidad, Electrónica y Telecomunicaciones',
    },
  ];

  const [selectedApprenticeIndex, setSelectedApprenticeIndex] = useState<number>(0);
  const [selectedInstructorIndex, setSelectedInstructorIndex] = useState<number>(0);

  const handleApprenticeLogin = () => {
    const app = sampleApprentices[selectedApprenticeIndex];
    onSelectRole('aprendiz', app);
  };

  const handleInstructorLogin = () => {
    onSelectRole('instructor');
  };

  const handleBienestarLogin = () => {
    onSelectRole('bienestar');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 dark:from-[#070d18] dark:via-[#0b1320] dark:to-[#091a1a] text-slate-800 dark:text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Top Bar with Logo & Theme Toggle */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <SenaLogo className="w-9 h-9 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-[#00324D] dark:text-white block leading-tight">
              SENA · Servicio Nacional de Aprendizaje
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dirección General · Sistema Integral de Inducción
            </span>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-xl text-slate-600 dark:text-amber-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8 space-y-8">
        {/* Hero Title & Context */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#00324D] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Reglamento del Aprendiz · Acuerdo 0009 de 2024 Vigente</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00324D] dark:text-white tracking-tight">
            Portal de Acceso a la Inducción SENA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Bienvenido al entorno interactivo de apropiación de la identidad institucional, derechos, deberes y evaluación de conocimientos. <strong>Selecciona tu rol institucional</strong> para comenzar.
          </p>
        </div>

        {/* The Two Main Role Selection Boxes: APRENDIZ vs INSTRUCTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ========================================================= */}
          {/* CUADRO 1: INGRESO CON ROL DE APRENDIZ                      */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/80 dark:border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#39A900]/15 via-emerald-500/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-3">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Rol Oficial</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Formación Titulada
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#39A900] to-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors">
                    Ingreso como Aprendiz
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                    Vive tu proceso de inducción integral, apropia el nuevo reglamento y certifica tus competencias.
                  </p>
                </div>
              </div>

              {/* Learning Roadmap Modules List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                  Contenidos y Actividades Disponibles:
                </span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <span><strong>Identidad SENA:</strong> Símbolos, himno, escudo, bandera y valores.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <span><strong>Reglamento (Acuerdo 0009/2024):</strong> Derechos, deberes y debido proceso.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <span><strong>Simulador de Dilemas:</strong> Casos éticos y formativos de la vida cotidiana.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <span><strong>Evaluación Oficial:</strong> Examen de 10 preguntas y <strong>Diploma Digital</strong> descargable.</span>
                  </li>
                </ul>
              </div>

              {/* Apprentice Profile Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Perfil de Aprendiz en Inducción:
                </label>
                <select
                  value={selectedApprenticeIndex}
                  onChange={(e) => setSelectedApprenticeIndex(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  {sampleApprentices.map((app, idx) => (
                    <option key={app.docId} value={idx}>
                      {app.name} (Ficha {app.cohort})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Programa: <strong className="text-slate-800 dark:text-slate-200">{sampleApprentices[selectedApprenticeIndex].program}</strong>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleApprenticeLogin}
                className="w-full py-3.5 px-6 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-2xl text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <span>Ingresar como Aprendiz</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CUADRO 2: INGRESO CON ROL DE INSTRUCTOR                   */}
          {/* ========================================================= */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#00324D]/80 dark:border-sky-500/50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#00324D]/15 via-sky-500/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-3">
                <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-[#00324D] dark:text-sky-300 rounded-full text-xs font-bold uppercase tracking-wider border border-sky-300 dark:border-sky-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00324D] dark:text-sky-400" />
                  <span>Rol Oficial</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Gestión Pedagógica
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00324D] to-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Users className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#00324D] dark:group-hover:text-sky-400 transition-colors">
                    Ingreso como Instructor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                    Monitorea el avance de tus fichas, audita evaluaciones y gestiona el cumplimiento de la inducción.
                  </p>
                </div>
              </div>

              {/* Instructor Capabilities List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                  Herramientas y Capacidades del Panel:
                </span>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#00324D] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Métricas de Cohorte:</strong> Tasa de aprobación, promedio global y pendientes.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#00324D] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Registro y Carga de Aprendices:</strong> Auditoría de respuestas y notas.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#00324D] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Verificación de Diplomas:</strong> Inspección oficial de constancias emitidas.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#00324D] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Debido Proceso:</strong> Guía de medidas pedagógicas y comités evaluadores.</span>
                  </li>
                </ul>
              </div>

              {/* Instructor Profile Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Perfil de Instructor / Centro:
                </label>
                <select
                  value={selectedInstructorIndex}
                  onChange={(e) => setSelectedInstructorIndex(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00324D]"
                >
                  {sampleInstructors.map((ins, idx) => (
                    <option key={ins.docId} value={idx}>
                      {ins.name} ({ins.center.substring(0, 30)}...)
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cargo: <strong className="text-slate-800 dark:text-slate-200">{sampleInstructors[selectedInstructorIndex].roleTitle}</strong>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleInstructorLogin}
                className="w-full py-3.5 px-6 bg-[#00324D] hover:bg-[#002233] text-white rounded-2xl text-sm font-extrabold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <span>Ingresar como Instructor</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Third Institutional Role Option: Bienestar al Aprendiz */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ¿Perteneces al Equipo de Bienestar al Aprendiz?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accede a la gestión de apoyos de sostenimiento (FIC y Regular), alertas tempranas de deserción y talleres de inducción.
              </p>
            </div>
          </div>

          <button
            onClick={handleBienestarLogin}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Ingresar como Bienestar</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <span>Servicio Nacional de Aprendizaje - SENA · Dirección de Formación Profesional</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Línea Gratuita Nacional: 018000 910270</span>
          <span>·</span>
          <span>Reglamento Vigente (Acuerdo 0009 de 2024)</span>
        </div>
      </footer>
    </div>
  );
};
