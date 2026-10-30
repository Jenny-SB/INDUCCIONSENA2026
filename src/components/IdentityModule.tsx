import React, { useState } from 'react';
import { SENA_INSTITUTIONAL_INFO, SENA_SYMBOLS, SENA_VALUES, SENA_HYMN_STANZAS } from '../data/senaData.ts';
import { playSenaAnthemMelody, stopSenaAnthemMelody } from '../utils/audioHymn.ts';
import { SenaLogo } from './SenaLogo.tsx';
import { Shield, Flag, User, Music, Play, Square, Volume2, CheckCircle2, Sparkles, Compass } from 'lucide-react';

export const IdentityModule: React.FC = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('escudo');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [anthemProgress, setAnthemProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'simbolos' | 'mision_vision' | 'valores' | 'himno'>('simbolos');

  const selectedSymbol = SENA_SYMBOLS.find((s) => s.id === selectedSymbolId) || SENA_SYMBOLS[0];

  const handleToggleAnthem = () => {
    if (isPlayingAnthem) {
      stopSenaAnthemMelody();
      setIsPlayingAnthem(false);
      setAnthemProgress(0);
    } else {
      setIsPlayingAnthem(true);
      playSenaAnthemMelody(
        (progress) => setAnthemProgress(progress),
        () => {
          setIsPlayingAnthem(false);
          setAnthemProgress(100);
        }
      );
    }
  };

  return (
    <div className="space-y-10">
      {/* Module Title Section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[#39A900] font-semibold">Módulo 1</span>
          <span aria-hidden="true">·</span>
          <span>Cultura Organizacional</span>
          <span aria-hidden="true">·</span>
          <span>Identidad SENA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white tracking-tight">
          Identidad, Misión y Símbolos Institucionales
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprender el ADN del SENA te conecta con más de 65 años de historia transformando las vidas de millones de colombianos.
          Explora nuestros símbolos patrios, los valores de convivencia y el sentido de pertenencia que te acompañará para siempre.
        </p>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('simbolos')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'simbolos'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Símbolos Oficiales
          </button>
          <button
            onClick={() => setActiveTab('mision_vision')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'mision_vision'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Misión, Visión e Historia
          </button>
          <button
            onClick={() => setActiveTab('valores')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'valores'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Valores y Principios
          </button>
          <button
            onClick={() => setActiveTab('himno')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'himno'
                ? 'bg-[#39A900] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Himno SENA (Interactivo)
          </button>
        </div>
      </div>

      {/* TAB 1: SÍMBOLOS OFICIALES */}
      {activeTab === 'simbolos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left selector */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Selecciona un Símbolo para Analizar
            </h3>
            {SENA_SYMBOLS.map((symbol) => {
              const isSelected = symbol.id === selectedSymbolId;
              return (
                <button
                  key={symbol.id}
                  onClick={() => setSelectedSymbolId(symbol.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-[#39A900] ring-1 ring-[#39A900]'
                      : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#39A900] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {symbol.iconType === 'shield' && <Shield className="w-5 h-5" />}
                      {symbol.iconType === 'flag' && <Flag className="w-5 h-5" />}
                      {symbol.iconType === 'logo' && <SenaLogo fill={isSelected ? '#ffffff' : '#39a900'} className="w-5 h-5" />}
                      {symbol.iconType === 'music' && <Music className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{symbol.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{symbol.shortDesc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right deep analysis panel */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-[#39A900] uppercase tracking-wider">
                  Inspección Detallada
                </span>
                <h3 className="text-xl font-bold text-[#00324D] dark:text-white">{selectedSymbol.name}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100/60 text-[#39A900] flex items-center justify-center">
                {selectedSymbol.iconType === 'shield' && <Shield className="w-6 h-6" />}
                {selectedSymbol.iconType === 'flag' && <Flag className="w-6 h-6" />}
                {selectedSymbol.iconType === 'logo' && <SenaLogo className="w-7 h-7" />}
                {selectedSymbol.iconType === 'music' && <Music className="w-6 h-6" />}
              </div>
            </div>

            {/* Visual representation */}
            <div className="my-6 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              {selectedSymbol.id === 'escudo' && (
                <div className="space-y-4 max-w-sm">
                  {/* Clean SVG rendition of the SENA shield components */}
                  <div className="w-28 h-28 mx-auto relative flex items-center justify-center bg-white rounded-full p-2 border-2 border-[#39A900] shadow-sm">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#00324D]">
                      {/* Cogwheel (industrial) */}
                      <path d="M50 20 L53 26 L60 26 L62 32 L68 35 L67 42 L72 47 L69 53 L72 59 L67 64 L68 71 L62 74 L60 80 L53 80 L50 86 L47 80 L40 80 L38 74 L32 71 L33 64 L28 59 L31 53 L28 47 L33 42 L32 35 L38 32 L40 26 L47 26 Z" fill="#39A900" opacity="0.9" />
                      {/* Caduceus / wings (commerce/services) */}
                      <circle cx="50" cy="50" r="14" fill="#ffffff" />
                      <circle cx="50" cy="50" r="8" fill="#00324D" />
                      {/* Coffee/Wheat sprig representation */}
                      <path d="M35 85 Q50 78 65 85" stroke="#39A900" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Sectores: Agropecuario · Industrial manufacturero · Servicios y Comercio
                  </div>
                </div>
              )}

              {selectedSymbol.id === 'bandera' && (
                <div className="space-y-3 w-full max-w-sm">
                  <div className="w-full h-36 bg-white border border-slate-300 rounded-lg shadow-sm relative flex items-center justify-center p-4">
                    <div className="flex items-center justify-center">
                      <SenaLogo className="w-16 h-16" />
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-medium">
                      Proporción Oficial 2:3
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Fondo blanco: Pureza, paz y serenidad en los ambientes de aprendizaje con el logo oficial central
                  </div>
                </div>
              )}

              {selectedSymbol.id === 'logosimbolo' && (
                <div className="space-y-3 max-w-sm">
                  <div className="w-28 h-28 mx-auto bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                    <SenaLogo className="w-20 h-20" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Logotipo oficial del SENA: Aprendiz caminando hacia adelante con visión de futuro y vocación de servicio
                  </div>
                </div>
              )}

              {selectedSymbol.id === 'himno' && (
                <div className="space-y-4 max-w-sm w-full">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left">
                    <div className="text-xs font-bold text-emerald-900 uppercase">Coro Emblemático</div>
                    <p className="text-sm font-serif italic text-emerald-950 mt-1">
                      "Estudiantes del SENA adelante, por Colombia luchad con amor; con el ánimo noble y constante, sembraremos la patria mejor."
                    </p>
                    <div className="text-[11px] text-emerald-800 mt-2 font-medium">
                      Letra: Jesús Briceño S. · Música: Daniel Marlez
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('himno')}
                    className="w-full py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Abrir Reproductor Interactivo</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {selectedSymbol.fullDesc}
            </p>

            <div className="mt-5 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Aspectos Clave para la Apropiación:
              </h4>
              <ul className="space-y-2">
                {selectedSymbol.details.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MISIÓN, VISIÓN E HISTORIA */}
      {activeTab === 'mision_vision' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Misión */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#39A900] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#00324D] dark:text-white">Nuestra Misión</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {SENA_INSTITUTIONAL_INFO.mission}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Mandato Constitucional · Ley 119 de 1994
              </div>
            </div>

            {/* Visión */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#00324D] dark:text-sky-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#00324D] dark:text-white">Nuestra Visión</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {SENA_INSTITUTIONAL_INFO.vision}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Proyección Estratégica Nacional
              </div>
            </div>
          </div>

          {/* Campus photo and historical foundation */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto">
              <img
                src="/src/assets/images/sena_campus_aerial_1793115111665.jpg"
                alt="Campus Moderno del SENA en Colombia"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center space-y-4">
              <div className="text-xs font-semibold text-[#39A900] uppercase tracking-wider">
                Orígenes y Trascendencia
              </div>
              <h3 className="text-2xl font-bold text-[#00324D] dark:text-white">
                Fundado en 1957 por Rodolfo Martínez Tono
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                El SENA nació fruto de la iniciativa tripartita entre trabajadores, empresarios y el gobierno nacional
                bajo el Decreto Ley 118 de 1957. Su objetivo permanente es capacitar de forma gratuita a la clase obrera
                y técnica con rigor pedagógico y valores cívicos.
              </p>

              <div className="pt-3 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">33 Regionales</span>
                  <span className="text-slate-500 dark:text-slate-400">Presencia en todos los departamentos</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Formación Dual</span>
                  <span className="text-slate-500 dark:text-slate-400">Etapa lectiva y etapa en empresa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VALORES Y PRINCIPIOS */}
      {activeTab === 'valores' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-[#00324D] dark:text-white">Decálogo de Valores y Convivencia SENA</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Como aprendiz, tus actitudes moldean la cultura de paz, respeto y profesionalismo en cada ambiente de aprendizaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SENA_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-[#39A900] dark:hover:border-[#39A900] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#39A900]">0{idx + 1}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">Valor Institucional</span>
                  </div>
                  <h4 className="text-base font-bold text-[#00324D] dark:text-white mt-2">{val.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{val.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Comportamiento Esperado:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{val.behavior}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HIMNO SENA INTERACTIVO */}
      {activeTab === 'himno' && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-[#39A900] uppercase tracking-wider">
              Símbolo Cívico Musical
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white">
              Himno Institucional del SENA
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              Canto marcial que infunde orgullo, compromiso patriótico y disciplina en cada jornada formativa.
            </p>
          </div>

          {/* Interactive Player Deck */}
          <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleAnthem}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-sm cursor-pointer ${
                  isPlayingAnthem ? 'bg-red-600 text-white' : 'bg-[#39A900] text-white'
                }`}
                title={isPlayingAnthem ? 'Detener melodía' : 'Reproducir melodía marcial'}
              >
                {isPlayingAnthem ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {isPlayingAnthem ? 'Reproduciendo Melodía Marcial SENA' : 'Melodía de la Fanfarria del SENA'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Sintetizador Web Audio API · Marcha institucional</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full sm:w-48 space-y-1">
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#39A900] transition-all duration-300 rounded-full"
                  style={{ width: `${anthemProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-right text-slate-400 font-mono tabular-nums">
                {anthemProgress}% completado
              </div>
            </div>
          </div>

          {/* Lyrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {SENA_HYMN_STANZAS.map((stanza, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border transition-all ${
                  stanza.type === 'CORO'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase ${
                      stanza.type === 'CORO' ? 'text-[#39A900]' : 'text-[#00324D] dark:text-emerald-400'
                    }`}
                  >
                    {stanza.type}
                  </span>
                  <span className="text-[11px] text-slate-400">Estrofa {idx + 1}</span>
                </div>
                <div className="space-y-1.5 font-serif text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                  {stanza.lines.map((line, lIdx) => (
                    <p key={lIdx} className={stanza.type === 'CORO' ? 'font-semibold text-emerald-950 dark:text-emerald-200' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
