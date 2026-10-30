import React, { useState } from 'react';
import { SenaLogo } from './SenaLogo.tsx';
import { VideoTutorialModal } from './VideoTutorialModal.tsx';
import { AuthUser, UserRole } from '../types.ts';
import {
  ArrowRight,
  CheckCircle,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Info,
  X,
  UserPlus,
  LogIn,
  Play,
} from 'lucide-react';

interface PortalAccessProps {
  onLogin: (user: AuthUser, targetTab?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const PortalAccess: React.FC<PortalAccessProps> = ({
  onLogin,
  darkMode,
  onToggleDarkMode,
}) => {
  // Modal state
  const [modalRole, setModalRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Form fields
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [cohort, setCohort] = useState<string>('2825491');
  const [program, setProgram] = useState<string>('Tecnólogo en ADSO');
  const [docType, setDocType] = useState<string>('CC');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleOpenAuth = (role: UserRole) => {
    setModalRole(role);
    setAuthMode('login');
    setErrorMsg('');
    setShowPassword(false);

    // Pre-populate demo user depending on role for seamless testing
    if (role === 'aprendiz') {
      setUsername('1020849312');
      setPassword('aprendiz2026');
      setFullName('Laura Camila Rodríguez Parra');
      setCohort('2825491');
      setProgram('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
    } else if (role === 'instructor') {
      setUsername('instructor.adso@sena.edu.co');
      setPassword('instructor2026');
      setFullName('Ing. Carlos Arturo Méndez Gómez');
      setCohort('2825491');
      setProgram('Coordinación Académica TIC');
    } else {
      setUsername('bienestar.aprendiz@sena.edu.co');
      setPassword('bienestar2026');
      setFullName('Dra. Marcela Rincón');
      setCohort('Todas las cohortes');
      setProgram('Equipo Interdisciplinario de Bienestar');
    }
  };

  const handleCloseModal = () => {
    setModalRole(null);
    setErrorMsg('');
  };

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Por favor completa el usuario y la contraseña.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo para el registro.');
      return;
    }

    const role = modalRole || 'aprendiz';
    const computedName = fullName.trim() || (role === 'aprendiz' ? 'Aprendiz SENA' : role === 'instructor' ? 'Instructor SENA' : 'Bienestar SENA');

    const authUser: AuthUser = {
      username: username.trim(),
      fullName: computedName,
      role: role,
      documentId: username.trim(),
      cohortNumber: cohort,
      trainingProgram: program,
      isRegistered: authMode === 'register',
    };

    // Routing targets:
    // Aprendiz goes directly to the Induction Roadmap ('inicio')
    // Instructor goes directly to the Instructor Dashboard ('instructor')
    // Bienestar goes directly to the Bienestar Module ('bienestar')
    const targetTab = role === 'aprendiz' ? 'inicio' : role === 'instructor' ? 'instructor' : 'bienestar';
    onLogin(authUser, targetTab);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F8FAFC] via-white to-slate-100 dark:from-[#070d17] dark:via-[#0b1320] dark:to-[#070d17] text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors">
      {/* Top Institutional Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b1320]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <SenaLogo className="w-8 h-8 drop-shadow-xs" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-extrabold tracking-tight text-[#00324D] dark:text-white block">
                SENA · Portal de Inducción
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-semibold">
                Servicio Nacional de Aprendizaje · República de Colombia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Reglamento Vigente: Acuerdo 0009 de 2024
            </span>

            {/* Video Tutorial Header Button */}
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Ver Video Tutorial de la Plataforma"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Video Tutorial</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-xl text-slate-600 dark:text-amber-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Dual Entry Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400 rounded-full text-xs font-bold tracking-wide uppercase border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Oficial de Inducción SENA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00324D] dark:text-white tracking-tight leading-tight">
            Portal de Inducción y Apropiación Institucional
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Selecciona tu perfil de acceso para ingresar al proceso de inducción.
          </p>
        </div>

        {/* TWO PRIMARY ACCESS CARDS: ONLY THE BUTTON IN EACH BOX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto w-full">
          {/* CUADRO 1: ÚNICAMENTE EL BOTÓN DE INGRESAR COMO APRENDIZ */}
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/30 hover:border-[#39A900] rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex items-center justify-center">
            <button
              onClick={() => handleOpenAuth('aprendiz')}
              className="w-full py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg text-white bg-[#39A900] hover:bg-[#2e8800] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <LogIn className="w-5 h-5" />
              <span>Ingresar como Aprendiz</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CUADRO 2: ÚNICAMENTE EL BOTÓN DE INGRESAR COMO INSTRUCTOR */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-[#00324D] dark:hover:border-sky-600 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex items-center justify-center">
            <button
              onClick={() => handleOpenAuth('instructor')}
              className="w-full py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg text-white bg-[#00324D] hover:bg-[#002233] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <LogIn className="w-5 h-5" />
              <span>Ingresar como Instructor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* BOTÓN VIDEO TUTORIAL */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 hover:border-[#39A900] text-slate-800 dark:text-slate-100 hover:text-[#39A900] dark:hover:text-emerald-400 font-extrabold text-sm sm:text-base shadow-md hover:shadow-xl transition-all group cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-[#39A900] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </span>
            <span>Video Tutorial</span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Ver Guía Rápida
            </span>
          </button>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <SenaLogo className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Servicio Nacional de Aprendizaje - SENA · Dirección General
            </span>
          </div>
          <div className="text-[11px] flex flex-wrap items-center justify-center gap-3">
            <span>Reglamento del Aprendiz: Acuerdo 0009 de 2024</span>
            <span aria-hidden="true">·</span>
            <span>Línea Gratuita: 018000 910270</span>
            <span aria-hidden="true">·</span>
            <span>Colombia</span>
          </div>
        </div>
      </footer>

      {/* MODAL: LOGIN / REGISTRO CON USUARIO Y CONTRASEÑA */}
      {modalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative space-y-5 max-h-[95vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {modalRole === 'aprendiz' && 'Portal de Aprendices · Inducción'}
                {modalRole === 'instructor' && 'Portal de Instructores · Gestión'}
                {modalRole === 'bienestar' && 'Portal de Bienestar · Apoyos'}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Registro de Nuevo Usuario'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {modalRole === 'aprendiz'
                  ? 'Ingresa tu usuario y contraseña para acceder a la Ruta de Inducción.'
                  : modalRole === 'instructor'
                  ? 'Ingresa tus credenciales docentes para acceder al panel de fichas.'
                  : 'Ingresa con tus credenciales para acceder al tablero de bienestar.'}
              </p>
            </div>

            {/* Toggle Login vs Register */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingreso</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarme</span>
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitAuth} className="space-y-4 text-xs">
              {/* Extra registration fields */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Ej: Laura Camila Rodríguez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PEP">Permiso Especial (PEP/PPT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Número de Ficha
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 2825491"
                        value={cohort}
                        onChange={(e) => setCohort(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Programa de Formación
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                    />
                  </div>
                </>
              )}

              {/* Usuario Field */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Usuario / Documento de Identidad *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={modalRole === 'aprendiz' ? 'Ej: 1020849312' : 'Ej: nombre.apellido@sena.edu.co'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Identificador de usuario registrado en SOFIA Plus / Zajuna.
                </span>
              </div>

              {/* Contraseña Field */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contraseña de Acceso *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Preset helper button */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">¿Deseas probar con datos de prueba?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (modalRole === 'aprendiz') {
                      setUsername('1020849312');
                      setPassword('aprendiz2026');
                      setFullName('Laura Camila Rodríguez Parra');
                    } else if (modalRole === 'instructor') {
                      setUsername('instructor.adso@sena.edu.co');
                      setPassword('instructor2026');
                      setFullName('Ing. Carlos Arturo Méndez Gómez');
                    } else {
                      setUsername('bienestar.aprendiz@sena.edu.co');
                      setPassword('bienestar2026');
                      setFullName('Dra. Marcela Rincón');
                    }
                  }}
                  className="font-bold text-[#39A900] hover:underline cursor-pointer"
                >
                  Rellenar Demo
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  modalRole === 'aprendiz'
                    ? 'bg-[#39A900] hover:bg-[#2e8800]'
                    : modalRole === 'instructor'
                    ? 'bg-[#00324D] hover:bg-[#002233]'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {authMode === 'login'
                    ? modalRole === 'aprendiz'
                      ? 'Ingresar a la Ruta de Inducción'
                      : modalRole === 'instructor'
                      ? 'Ingresar al Panel de Instructor'
                      : 'Ingresar a Bienestar'
                    : 'Completar Registro e Ingresar'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ventana Flotante de Video Tutorial */}
      <VideoTutorialModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
};
