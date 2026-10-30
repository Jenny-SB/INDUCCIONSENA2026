import React from 'react';
import { SenaLogo } from './SenaLogo.tsx';
import { Moon, Sun, Award, Compass, BookOpen, Shield, HelpCircle, Users, HeartPulse, LogOut } from 'lucide-react';
import { UserRole, AuthUser } from '../types.ts';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onStartQuiz: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onStartQuiz,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onLogout,
}) => {
  const navButtons = [
    { id: 'inicio', label: 'Ruta', icon: Compass },
    { id: 'identidad', label: 'Identidad', icon: BookOpen },
    { id: 'reglamento', label: 'Reglamento', icon: Shield },
    { id: 'dilemas', label: 'Dilemas', icon: HelpCircle },
    { id: 'evaluacion', label: 'Evaluación', icon: Award, isHighlight: true },
    { id: 'bienestar', label: 'Bienestar', icon: HeartPulse },
    { id: 'instructor', label: 'Instructor', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-[#0b1320]/98 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* DESKTOP & TABLET VIEW: Single-line pristine horizontal bar (visible md+) */}
        <div className="hidden md:flex items-center justify-between gap-2 lg:gap-4 py-2.5">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
            title="Ir a inicio de Inducción SENA"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <SenaLogo className="w-7 h-7 drop-shadow-xs" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-extrabold tracking-tight text-[#00324D] dark:text-white whitespace-nowrap group-hover:text-[#39A900] dark:group-hover:text-[#39A900] transition-colors block">
                Inducción SENA
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-semibold">
                Servicio Nacional de Aprendizaje
              </span>
            </div>
          </button>

          {/* Zone 2: All Navigation Buttons in ONE Single View */}
          <nav className="flex items-center gap-0.5 lg:gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 shrink-0">
            {navButtons.map((btn) => {
              const isActive = activeTab === btn.id;
              const Icon = btn.icon;

              if (btn.isHighlight) {
                return (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setActiveTab('evaluacion');
                      onStartQuiz();
                    }}
                    className={`whitespace-nowrap px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-[#39A900] text-white ring-2 ring-[#39A900]/40'
                        : 'bg-[#39A900] text-white hover:bg-[#2e8800]'
                    }`}
                    title="Presentar Evaluación Oficial de Apropiación"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>Evaluación</span>
                  </button>
                );
              }

              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActiveTab(btn.id);
                    if (btn.id === 'bienestar' && userRole !== 'bienestar') {
                      setUserRole('bienestar');
                    } else if (btn.id === 'instructor' && userRole !== 'instructor') {
                      setUserRole('instructor');
                    }
                  }}
                  className={`whitespace-nowrap px-2 lg:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-[#00324D] dark:text-white shadow-xs font-bold border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#39A900]' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls (3-Role Switcher + Theme Toggle) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compact 3-Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setUserRole('aprendiz');
                  if (activeTab === 'instructor' || activeTab === 'bienestar') setActiveTab('inicio');
                }}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                  userRole === 'aprendiz'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Rol: Aprendiz SENA en proceso de inducción"
              >
                Aprendiz
              </button>
              <button
                onClick={() => {
                  setUserRole('instructor');
                  setActiveTab('instructor');
                }}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                  userRole === 'instructor'
                    ? 'bg-[#00324D] text-white shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Rol: Instructor de Formación / Gestión de Ficha"
              >
                Instructor
              </button>
              <button
                onClick={() => {
                  setUserRole('bienestar');
                  setActiveTab('bienestar');
                }}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                  userRole === 'bienestar'
                    ? 'bg-[#39A900] text-white shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Rol: Coordinación de Bienestar al Aprendiz / Acompañamiento y Apoyos"
              >
                Bienestar
              </button>
            </div>

            {/* Dark / Light Mode Toggle Button with Blur effect */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-1.5 rounded-lg text-slate-600 dark:text-amber-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 rotate-0 transition-transform duration-300" />
              )}
            </button>

            {/* Logout / Exit to Portal Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión y volver al Portal de Acceso"
                className="p-1.5 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold shrink-0 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Salir</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE VIEW (< md): All controls and buttons visible directly in ONE single unified view without hamburger menu */}
        <div className="md:hidden py-2 space-y-2">
          {/* Top Line: Brand + 3-Role Switcher + Theme */}
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={() => setActiveTab('inicio')}
              className="flex items-center gap-1.5 text-left focus:outline-none cursor-pointer shrink-0"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <SenaLogo className="w-5 h-5 drop-shadow-xs" />
              </div>
              <span className="text-xs font-bold tracking-tight text-[#00324D] dark:text-white whitespace-nowrap">
                Inducción SENA
              </span>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              {/* 3-Role Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setUserRole('aprendiz');
                    if (activeTab === 'instructor' || activeTab === 'bienestar') setActiveTab('inicio');
                  }}
                  className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    userRole === 'aprendiz'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Aprendiz
                </button>
                <button
                  onClick={() => {
                    setUserRole('instructor');
                    setActiveTab('instructor');
                  }}
                  className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    userRole === 'instructor'
                      ? 'bg-[#00324D] text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Instructor
                </button>
                <button
                  onClick={() => {
                    setUserRole('bienestar');
                    setActiveTab('bienestar');
                  }}
                  className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                    userRole === 'bienestar'
                      ? 'bg-[#39A900] text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Bienestar
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={onToggleDarkMode}
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                className="p-1 rounded-lg text-slate-600 dark:text-amber-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              </button>

              {/* Mobile Logout */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Salir al portal"
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Line: All Navigation Buttons in one single smooth horizontal view */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            {navButtons.map((btn) => {
              const isActive = activeTab === btn.id;
              const Icon = btn.icon;

              if (btn.isHighlight) {
                return (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setActiveTab('evaluacion');
                      onStartQuiz();
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#39A900] text-white ring-1 ring-[#39A900]'
                        : 'bg-[#39A900] text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>Evaluación</span>
                  </button>
                );
              }

              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActiveTab(btn.id);
                    if (btn.id === 'bienestar' && userRole !== 'bienestar') {
                      setUserRole('bienestar');
                    } else if (btn.id === 'instructor' && userRole !== 'instructor') {
                      setUserRole('instructor');
                    }
                  }}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#00324D] text-white dark:bg-emerald-600 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3 text-slate-400" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
