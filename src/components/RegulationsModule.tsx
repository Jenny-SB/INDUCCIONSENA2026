import React, { useState } from 'react';
import {
  RIGHTS_AND_DUTIES,
  DUE_PROCESS_STEPS,
  FORMATIVE_MEASURES,
  REGULATION_DEFINITIONS,
  PERMANENCE_TOPICS,
  FAULT_CLASSIFICATIONS,
} from '../data/senaData.ts';
import { RightOrDuty, RegulationDefinition, PermanenceTopic, FaultClassification } from '../types.ts';
import {
  Shield,
  BookOpen,
  Scale,
  Search,
  CheckCircle,
  FileText,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  Info,
  UserCheck,
  Award,
} from 'lucide-react';

export const RegulationsModule: React.FC = () => {
  // Main Section Tab: Definiciones (Cap. I), Derechos y Deberes (Cap. II-III), Permanencia y Certificación (Cap. IV), Faltas y Medidas (Cap. V)
  const [activeSection, setActiveSection] = useState<'definiciones' | 'derechos_deberes' | 'permanencia' | 'faltas_sanciones'>('definiciones');

  // Sub-filters for Definiciones (Cap. I)
  const [definitionSearch, setDefinitionSearch] = useState<string>('');
  const [definitionCategory, setDefinitionCategory] = useState<string>('todos');

  // Sub-filters for Derechos, Deberes y Prohibiciones (Cap. II-III)
  const [filterType, setFilterType] = useState<'todos' | 'derecho' | 'deber' | 'prohibicion'>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<RightOrDuty | null>(null);

  // Sub-filters for Permanencia y Certificación (Cap. IV)
  const [activeStage, setActiveStage] = useState<string>('todos');

  // Sub-filters for Faltas y Sanciones (Cap. V)
  const [faultTypeFilter, setFaultTypeFilter] = useState<'todos' | 'academica' | 'disciplinaria'>('todos');
  const [faultGravityFilter, setFaultGravityFilter] = useState<'todos' | 'leve' | 'grave' | 'gravisima'>('todos');
  const [faultsView, setFaultsView] = useState<'faltas' | 'medidas' | 'debido_proceso'>('faltas');

  // Filtered lists
  const filteredDefinitions = REGULATION_DEFINITIONS.filter((def) => {
    const matchesCat = definitionCategory === 'todos' || def.category === definitionCategory;
    const matchesSearch =
      def.term.toLowerCase().includes(definitionSearch.toLowerCase()) ||
      def.fullDefinition.toLowerCase().includes(definitionSearch.toLowerCase()) ||
      def.keyRule.toLowerCase().includes(definitionSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredItems = RIGHTS_AND_DUTIES.filter((item) => {
    const matchesType = filterType === 'todos' || item.type === filterType;
    const matchesCat = categoryFilter === 'todos' || item.category === categoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.articleRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  const filteredPermanence = PERMANENCE_TOPICS.filter((topic) => {
    return activeStage === 'todos' || topic.stage === activeStage;
  });

  const filteredFaults = FAULT_CLASSIFICATIONS.filter((fault) => {
    const matchesType = faultTypeFilter === 'todos' || fault.type === faultTypeFilter;
    const matchesGravity = faultGravityFilter === 'todos' || fault.gravity === faultGravityFilter;
    return matchesType && matchesGravity;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-[#39A900] font-bold">Módulo 2</span>
          <span aria-hidden="true">·</span>
          <span>Marco Normativo Oficial</span>
          <span aria-hidden="true">·</span>
          <span>Acuerdo 0009 de 2024 (Reglamento Vigente)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white tracking-tight">
          Reglamento del Aprendiz SENA: Marco Normativo Integral
        </h2>

        <div className="mt-2 space-y-2">
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-xs sm:text-sm leading-relaxed">
            Estructurado conforme al <strong>Acuerdo 0009 de 2024</strong> del Consejo Directivo Nacional, normativa que moderniza y unifica las reglas institucionales derogando el anterior Acuerdo 007 de 2012. Explora las definiciones clave, tus derechos y deberes, las normas de permanencia y certificación, y el régimen de faltas y medidas formativas.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold">
              Acuerdo 0009 de 2024 (Vigente)
            </span>
            <span className="text-slate-400">·</span>
            <span>Unificación de Normativa · Enfoque Diferencial · Entornos Virtuales Zajuna</span>
          </div>
        </div>

        {/* 4 Pillars Section Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveSection('definiciones')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'definiciones'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Definiciones (Cap. I)</span>
          </button>

          <button
            onClick={() => setActiveSection('derechos_deberes')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'derechos_deberes'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Derechos y Deberes (Cap. II-III)</span>
          </button>

          <button
            onClick={() => setActiveSection('permanencia')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'permanencia'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ingreso, Permanencia y Grados (Cap. IV)</span>
          </button>

          <button
            onClick={() => setActiveSection('faltas_sanciones')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === 'faltas_sanciones'
                ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Faltas, Medidas y Debido Proceso (Cap. V)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PILLAR 1: DEFINICIONES OFICIALES (CAPÍTULO I) */}
      {/* ============================================================== */}
      {activeSection === 'definiciones' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={definitionSearch}
                onChange={(e) => setDefinitionSearch(e.target.value)}
                placeholder="Buscar término o definición (ej. Aprendiz, RAP, Zajuna, Etapa Lectiva)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setDefinitionCategory('todos')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  definitionCategory === 'todos'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todas ({REGULATION_DEFINITIONS.length})
              </button>
              <button
                onClick={() => setDefinitionCategory('formativo')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  definitionCategory === 'formativo'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Formativo
              </button>
              <button
                onClick={() => setDefinitionCategory('modalidad')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  definitionCategory === 'modalidad'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Modalidades & LMS
              </button>
              <button
                onClick={() => setDefinitionCategory('gestion')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  definitionCategory === 'gestion'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Evaluación & RAP
              </button>
              <button
                onClick={() => setDefinitionCategory('inclusion')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  definitionCategory === 'inclusion'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Inclusión
              </button>
            </div>
          </div>

          {/* Definitions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDefinitions.map((def) => (
              <div
                key={def.id}
                className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {def.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Capítulo I</span>
                  </div>
                  <h3 className="text-base font-bold text-[#00324D] dark:text-white leading-snug">
                    {def.term}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {def.fullDefinition}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/50 p-2.5 rounded-lg flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                  <span className="leading-tight">{def.keyRule}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredDefinitions.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No se encontraron términos con el criterio de búsqueda especificado.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* PILLAR 2: DERECHOS, DEBERES Y PROHIBICIONES (CAPÍTULOS II Y III) */}
      {/* ============================================================== */}
      {activeSection === 'derechos_deberes' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por palabra clave, artículo, derecho o deber..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
              />
            </div>

            {/* Segmented type buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setFilterType('todos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterType === 'todos'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos ({RIGHTS_AND_DUTIES.length})
              </button>
              <button
                onClick={() => setFilterType('derecho')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterType === 'derecho'
                    ? 'bg-[#39A900] text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Derechos (Cap. II)
              </button>
              <button
                onClick={() => setFilterType('deber')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterType === 'deber'
                    ? 'bg-[#00324D] text-white dark:bg-emerald-600 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Deberes (Cap. III)
              </button>
              <button
                onClick={() => setFilterType('prohibicion')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterType === 'prohibicion'
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Prohibiciones
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isDerecho = item.type === 'derecho';
              const isDeber = item.type === 'deber';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isDerecho
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400'
                            : isDeber
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-[#00324D] dark:text-sky-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 capitalize">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-[10px] truncate max-w-[190px]">{item.articleRef}</span>
                    <span className="text-[#39A900] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ver caso <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PILLAR 3: INGRESO, PERMANENCIA Y CERTIFICACIÓN (CAPÍTULO IV) */}
      {/* ============================================================== */}
      {activeSection === 'permanencia' && (
        <div className="space-y-6">
          {/* Quick Stage Filter bar */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveStage('todos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'todos'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todos los Procesos ({PERMANENCE_TOPICS.length})
            </button>
            <button
              onClick={() => setActiveStage('ingreso')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'ingreso'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              1. Ingreso y Matrícula
            </button>
            <button
              onClick={() => setActiveStage('novedades')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'novedades'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              2. Novedades (Traslado/Aplazamiento)
            </button>
            <button
              onClick={() => setActiveStage('desercion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'desercion'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              3. Causales de Deserción
            </button>
            <button
              onClick={() => setActiveStage('productiva')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'productiva'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              4. Etapa Productiva
            </button>
            <button
              onClick={() => setActiveStage('certificacion')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeStage === 'certificacion'
                  ? 'bg-[#39A900] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              5. Certificación & Grados
            </button>
          </div>

          {/* Cards for Permanence */}
          <div className="space-y-4">
            {filteredPermanence.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                        {item.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Capítulo IV · Sección {idx + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00324D] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.bulletPoints.map((point, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>

                {item.deadlinesOrRules && (
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Regla y Plazo Clave: </strong>
                      <span>{item.deadlinesOrRules}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PILLAR 4: FALTAS, MEDIDAS FORMATIVAS Y SANCIONES (CAPÍTULO V) */}
      {/* ============================================================== */}
      {activeSection === 'faltas_sanciones' && (
        <div className="space-y-6">
          {/* Subview Selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setFaultsView('faltas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                faultsView === 'faltas'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1. Clasificación de Faltas (Leves, Graves, Gravísimas)
            </button>
            <button
              onClick={() => setFaultsView('medidas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                faultsView === 'medidas'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2. Medidas Formativas vs Sanciones
            </button>
            <button
              onClick={() => setFaultsView('debido_proceso')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                faultsView === 'debido_proceso'
                  ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3. Ruta del Debido Proceso y Comité
            </button>
          </div>

          {/* VIEW A: FALTAS */}
          {faultsView === 'faltas' && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Tipo:</span>
                  <button
                    onClick={() => setFaultTypeFilter('todos')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultTypeFilter === 'todos' ? 'bg-[#00324D] text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFaultTypeFilter('academica')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultTypeFilter === 'academica' ? 'bg-[#00324D] text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Académicas
                  </button>
                  <button
                    onClick={() => setFaultTypeFilter('disciplinaria')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultTypeFilter === 'disciplinaria' ? 'bg-[#00324D] text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Disciplinarias
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Gravedad:</span>
                  <button
                    onClick={() => setFaultGravityFilter('todos')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultGravityFilter === 'todos' ? 'bg-slate-800 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFaultGravityFilter('leve')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultGravityFilter === 'leve' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Leve
                  </button>
                  <button
                    onClick={() => setFaultGravityFilter('grave')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultGravityFilter === 'grave' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Grave
                  </button>
                  <button
                    onClick={() => setFaultGravityFilter('gravisima')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer ${
                      faultGravityFilter === 'gravisima' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    Gravísima
                  </button>
                </div>
              </div>

              {/* Grid of Faults */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFaults.map((fault) => (
                  <div
                    key={fault.id}
                    className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Falta {fault.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          fault.gravity === 'leve'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                            : fault.gravity === 'grave'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                        }`}
                      >
                        {fault.gravity}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{fault.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{fault.description}</p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Ejemplos típicos:</span>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
                        {fault.examples.map((ex, idx) => (
                          <li key={idx}>{ex}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <strong className="text-slate-700 dark:text-slate-300">Consecuencia legal: </strong>
                      <span className="text-[#00324D] dark:text-emerald-400 font-medium">{fault.consequence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW B: MEDIDAS FORMATIVAS VS SANCIONES */}
          {faultsView === 'medidas' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-[#00324D] dark:text-white">Escala Oficial de Medidas Formativas y Sanciones</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  El SENA prioriza la pedagogía y la autorregulación voluntaria antes de aplicar medidas sancionatorias disciplinarias.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FORMATIVE_MEASURES.map((measure, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-[#39A900]">{measure.level}</span>
                        <span className="font-mono text-[11px]">Nivel {idx + 1}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#00324D] dark:text-white">{measure.name}</h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                        Aplicable en: {measure.scope}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {measure.detail}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Requiere registro formal en la carpeta del aprendiz</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW C: RUTA DEL DEBIDO PROCESO Y COMITÉ */}
          {faultsView === 'debido_proceso' && (
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-[#00324D] dark:text-white">
                  Ruta del Debido Proceso y Comité de Evaluación
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  En el SENA ningún aprendiz es sancionado sin ser escuchado previamente y sin que se garanticen
                  sus derechos constitucionales de contradicción, presunción de inocencia y representación por su vocero electo.
                </p>
              </div>

              {/* Stepper */}
              <div className="relative border-l-2 border-emerald-200 dark:border-emerald-800 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 my-6">
                {DUE_PROCESS_STEPS.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-[#39A900] text-[#39A900] font-bold text-xs flex items-center justify-center shadow-xs">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
                <Scale className="w-5 h-5 text-[#00324D] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block mb-0.5">Recurso de Reposición (Art. 35):</strong>
                  El aprendiz notificado formalmente de un acto administrativo sancionatorio cuenta con un término de cinco (5) días hábiles para radicar ante el Subdirector de Centro el recurso de reposición con las pruebas o argumentos de defensa respectivos.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR A RIGHT/DUTY/PROHIBITION */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-[#39A900] capitalize">{selectedItem.type}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{selectedItem.category}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#00324D] dark:text-white">{selectedItem.title}</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Definición Normativa (Acuerdo 0009 de 2024):</strong>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {selectedItem.description}
                </p>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Caso Práctico en Ambientes SENA:</strong>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  {selectedItem.practicalExample}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Referencia: {selectedItem.articleRef}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#00324D] hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
