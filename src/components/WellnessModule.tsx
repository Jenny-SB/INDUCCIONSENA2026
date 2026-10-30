import React, { useState } from 'react';
import {
  WELLNESS_DIMENSIONS,
  WELLNESS_APPRENTICE_CASES,
  WELLNESS_WORKSHOPS,
  WELLNESS_SUPPORT_CALLS,
} from '../data/senaData.ts';
import { WellnessApprenticeCase, WellnessDimension } from '../types.ts';
import {
  HeartPulse,
  Smile,
  HandCoins,
  Megaphone,
  UsersRound,
  Trophy,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Calendar,
  FileText,
  PlusCircle,
  HelpCircle,
  Phone,
  Mail,
  Shield,
  ArrowRight,
  TrendingUp,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface WellnessModuleProps {
  onGoToTab?: (tab: string) => void;
}

export const WellnessModule: React.FC<WellnessModuleProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'caracterizacion' | 'apoyos' | 'dimensiones' | 'talleres'>('caracterizacion');
  
  // Cases State
  const [cases, setCases] = useState<WellnessApprenticeCase[]>(WELLNESS_APPRENTICE_CASES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('todos');
  const [filterPriority, setFilterPriority] = useState<string>('todos');
  
  // Selected Case Modal
  const [selectedCase, setSelectedCase] = useState<WellnessApprenticeCase | null>(null);
  const [newNote, setNewNote] = useState<string>('');
  
  // New Case Registration Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCaseForm, setNewCaseForm] = useState({
    name: '',
    docId: '',
    program: 'Tecnólogo en ADSO',
    cohort: '2825491',
    stratum: 1,
    priority: 'ninguna' as WellnessApprenticeCase['priorityCategory'],
    priorityLabel: 'Población General',
    requestedSupport: 'apoyo_regular' as WellnessApprenticeCase['requestedSupport'],
    requestedSupportLabel: 'Apoyo de Sostenimiento Regular',
    riskStatus: 'medio' as WellnessApprenticeCase['riskStatus'],
    riskReason: '',
    psychosocialIntervention: '',
    attendancePct: 100,
  });

  // Dimension Details Modal
  const [selectedDimension, setSelectedDimension] = useState<WellnessDimension | null>(null);

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.apprenticeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.documentId.includes(searchQuery) ||
      c.cohort.includes(searchQuery) ||
      c.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'todos' || c.riskStatus === filterRisk;
    const matchesPriority = filterPriority === 'todos' || c.priorityCategory === filterPriority;
    return matchesSearch && matchesRisk && matchesPriority;
  });

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseForm.name || !newCaseForm.docId) return;

    const newEntry: WellnessApprenticeCase = {
      id: `w-case-${Date.now()}`,
      apprenticeName: newCaseForm.name,
      documentId: newCaseForm.docId,
      program: newCaseForm.program,
      cohort: newCaseForm.cohort,
      stratum: Number(newCaseForm.stratum),
      priorityCategory: newCaseForm.priority,
      priorityLabel: newCaseForm.priorityLabel,
      requestedSupport: newCaseForm.requestedSupport,
      requestedSupportLabel: newCaseForm.requestedSupportLabel,
      riskStatus: newCaseForm.riskStatus,
      riskReason: newCaseForm.riskReason || 'Registro inicial durante semana de inducción.',
      psychosocialIntervention: newCaseForm.psychosocialIntervention || 'Atención inicial por equipo de Bienestar al Aprendiz.',
      attendanceInductionPct: Number(newCaseForm.attendancePct),
      status: 'en_seguimiento',
    };

    setCases([newEntry, ...cases]);
    setShowAddModal(false);
    setNewCaseForm({
      name: '',
      docId: '',
      program: 'Tecnólogo en ADSO',
      cohort: '2825491',
      stratum: 1,
      priority: 'ninguna',
      priorityLabel: 'Población General',
      requestedSupport: 'apoyo_regular',
      requestedSupportLabel: 'Apoyo de Sostenimiento Regular',
      riskStatus: 'medio',
      riskReason: '',
      psychosocialIntervention: '',
      attendancePct: 100,
    });
  };

  const handleAddInterventionNote = () => {
    if (!selectedCase || !newNote.trim()) return;
    const updatedNote = `${selectedCase.psychosocialIntervention} | [${new Date().toLocaleDateString('es-CO')}]: ${newNote.trim()}`;
    const updatedCase = {
      ...selectedCase,
      psychosocialIntervention: updatedNote,
      status: 'en_seguimiento' as const,
    };

    setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updatedCase : c)));
    setSelectedCase(updatedCase);
    setNewNote('');
  };

  const handleResolveCase = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: 'atendido' as const } : c))
    );
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, status: 'atendido' });
    }
  };

  const getDimensionIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-amber-500" />;
      case 'HandCoins':
        return <HandCoins className="w-5 h-5 text-emerald-500" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-blue-500" />;
      case 'UsersRound':
        return <UsersRound className="w-5 h-5 text-purple-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-orange-500" />;
      default:
        return <HeartPulse className="w-5 h-5 text-[#39A900]" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Bienestar al Aprendiz Institutional Header */}
      <div className="bg-gradient-to-r from-[#00324D] via-[#024968] to-[#00324D] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-700/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-emerald-300 rounded-full text-xs font-semibold tracking-wide uppercase">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rol Institucional: Coordinación de Bienestar al Aprendiz</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Plan Nacional Integral de Bienestar en Inducción
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Gestión estratégica del acompañamiento socioeconómico, prevención de la deserción escolar, asignación de apoyos de sostenimiento (FIC y Regular) y garantía del enfoque diferencial bajo el <strong>Acuerdo 0009 de 2024</strong>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Alerta Temprana</span>
            </button>
            <div className="text-[11px] text-slate-300 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <span>Fichas en Inducción Activa: <strong>8 Cohortes (156 aprendices)</strong></span>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Caracterizados</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">100%</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">156 de 156 en inducción</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Alertas de Deserción</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
              {cases.filter((c) => c.riskStatus === 'alto').length} Casos Críticos
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">Ruta de retención activa</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Solicitudes de Apoyo</span>
              <HandCoins className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">48 Aprendices</div>
            <div className="text-[11px] text-blue-200 mt-0.5">FIC, Regular y Bonos</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Talleres de Bienestar</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">94% Cobertura</div>
            <div className="text-[11px] text-purple-200 mt-0.5">4 talleres en agenda</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Bienestar Management */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('caracterizacion')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'caracterizacion'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Caracterización y Alertas Tempranas</span>
          <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {cases.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('apoyos')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'apoyos'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HandCoins className="w-4 h-4" />
          <span>Convocatorias y Apoyos de Sostenimiento</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dimensiones')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'dimensiones'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Dimensiones del Plan de Bienestar (6)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('talleres')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'talleres'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Talleres de Inducción de Bienestar</span>
        </button>
      </div>

      {/* SUBTAB 1: CARACTERIZACIÓN Y ALERTAS TEMPRANAS */}
      {activeSubTab === 'caracterizacion' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por aprendiz, cédula o ficha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Riesgo:</span>
              </div>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
              >
                <option value="todos">Todos los niveles</option>
                <option value="alto">Riesgo Alto (Deserción)</option>
                <option value="medio">Riesgo Medio</option>
                <option value="bajo">Riesgo Bajo</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-2">
                <span>Población:</span>
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
              >
                <option value="todos">Todas las poblaciones</option>
                <option value="victima_conflicto">Víctima Conflicto (RUV)</option>
                <option value="discapacidad">Discapacidad / Ajuste</option>
                <option value="madre_cabeza_hogar">Madre Cabeza de Hogar</option>
                <option value="indigena_afro">Comunidades Étnicas</option>
                <option value="vulnerabilidad_extrema">Vulnerabilidad Extrema</option>
              </select>
            </div>
          </div>

          {/* Cases List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((c) => {
              const isHighRisk = c.riskStatus === 'alto';
              const isMediumRisk = c.riskStatus === 'medio';

              return (
                <div
                  key={c.id}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                    isHighRisk
                      ? 'border-amber-400/70 dark:border-amber-500/50 hover:border-amber-500'
                      : isMediumRisk
                      ? 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {c.apprenticeName}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          CC/TI {c.documentId} · Ficha {c.cohort} · Estrato {c.stratum}
                        </p>
                      </div>

                      {/* Risk Badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                          isHighRisk
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300'
                            : isMediumRisk
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                        }`}
                      >
                        {isHighRisk && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {isMediumRisk && <Clock className="w-3 h-3 text-blue-600" />}
                        {c.riskStatus === 'bajo' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        <span>Riesgo {c.riskStatus}</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Programa: <span className="text-slate-900 dark:text-white font-semibold">{c.program}</span>
                    </div>

                    {/* Population & Support Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {c.priorityLabel}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {c.requestedSupportLabel}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Asistencia Inducción: {c.attendanceInductionPct}%
                      </span>
                    </div>

                    {/* Risk Reason */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Diagnóstico Socioeconómico en Inducción:
                      </div>
                      <p className="leading-snug">{c.riskReason}</p>
                    </div>

                    {/* Psychosocial action */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 border-l-2 border-[#39A900] pl-2.5 py-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white">Acción de Bienestar: </span>
                      {c.psychosocialIntervention}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-medium ${
                        c.status === 'atendido'
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {c.status === 'atendido' ? '✓ Caso Mitigado / Atendido' : '● Seguimiento en Curso'}
                    </span>

                    <button
                      onClick={() => setSelectedCase(c)}
                      className="px-3 py-1.5 bg-[#00324D] dark:bg-slate-800 hover:bg-[#002233] dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Gestionar Caso</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCases.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs">
              No se encontraron registros de aprendices con los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CONVOCATORIAS Y APOYOS DE SOSTENIMIENTO */}
      {activeSubTab === 'apoyos' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4 sm:p-5 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-start gap-3">
              <HandCoins className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#00324D] dark:text-emerald-300">
                  Ruta Institucional de Apoyos de Sostenimiento en Inducción
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Durante la semana de inducción, la Coordinación de Bienestar al Aprendiz socializa los requisitos de postulación a los subsidios normativos (Decreto 4690/2005 y resoluciones reglamentarias vigentes). Todo aprendiz de estratos 1 y 2 sin contrato de aprendizaje tiene derecho a postularse.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {WELLNESS_SUPPORT_CALLS.map((call) => (
              <div
                key={call.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300">
                      {call.status}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {call.deadline}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {call.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Marco Legal: <strong>{call.basis}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-[#00324D] dark:text-emerald-400 block mb-0.5">
                      Monto del Estímulo Económico:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{call.amount}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                      Población Objetivo:
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {call.target}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      Criterios de Priorización y Requisitos:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {call.criteria.map((cr, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                          <span>{cr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Radicación en Plataforma Zajuna / SOFIA Plus</span>
                  <button
                    onClick={() => {
                      alert(`Convocatoria ${call.title}: Enlace de radicación institucional abierto para fichas de inducción activa.`);
                    }}
                    className="px-3 py-1.5 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Ver Formulario Oficial
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Support Categories Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HandCoins className="w-4 h-4 text-emerald-500" />
                <span>Bono de Alimentación</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                Acceso diario al casino del centro o bono nutricional para aprendices de jornada extendida en condición de vulnerabilidad alimentaria.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Monitorías de Formación</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                Estímulo económico del 50% de SMMLV para aprendices de alto desempeño que apoyen ambientes de aprendizaje, laboratorios o biblioteca.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-500" />
                <span>Póliza Estudiantil de Accidentes</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                Cobertura 100% gratuita para todo aprendiz matriculado durante desplazamientos y prácticas formativas en talleres y empresas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DIMENSIONES DEL PLAN DE BIENESTAR */}
      {activeSubTab === 'dimensiones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WELLNESS_DIMENSIONS.map((dim) => (
              <div
                key={dim.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getDimensionIcon(dim.iconName)}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {dim.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {dim.shortDesc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block text-[10px] uppercase tracking-wider mb-0.5">
                      Objetivo en Semana de Inducción:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-snug">
                      {dim.inductionObjective}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Servicios y Beneficios Clave:
                    </span>
                    <ul className="space-y-1">
                      {dim.servicesOffered.slice(0, 3).map((s, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] shrink-0" />
                          <span className="truncate">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{dim.coordinatorContact}</span>
                  </div>

                  <button
                    onClick={() => setSelectedDimension(dim)}
                    className="text-xs font-bold text-[#39A900] hover:text-[#2e8800] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Detalles</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: TALLERES DE INDUCCIÓN DE BIENESTAR */}
      {activeSubTab === 'talleres' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Cronograma de Talleres Obligatorios de Bienestar en Inducción
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Control de ejecución y cobertura de los talleres dictados por el equipo interdisciplinario de Bienestar al Aprendiz.
            </p>

            <div className="space-y-3">
              {WELLNESS_WORKSHOPS.map((w) => {
                const pct = Math.round((w.attendedCohorts / w.totalCohorts) * 100);

                return (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            {w.deliveryDate}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Duración: {w.durationHours} horas
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {w.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {w.objective}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            w.status === 'completado'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : w.status === 'en_curso'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {w.status === 'completado' ? 'Completado' : w.status === 'en_curso' ? 'En Ejecución' : 'Programado'}
                        </span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Facilitador: {w.speaker}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar of Cohorts */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Fichas Capacitadas: {w.attendedCohorts} de {w.totalCohorts}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#39A900] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Gestionar Caso de Aprendiz */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#39A900]">
                  Ficha de Acompañamiento Psicosocial
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedCase.apprenticeName}
                </h3>
                <p className="text-xs text-slate-500">
                  Documento: {selectedCase.documentId} · Ficha: {selectedCase.cohort} ({selectedCase.program})
                </p>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl">
                <div>
                  <span className="text-slate-500 text-[10px] block">Población Prioritaria:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCase.priorityLabel}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Apoyo Solicitado:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCase.requestedSupportLabel}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Estrato:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Estrato {selectedCase.stratum}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Asistencia a Inducción:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCase.attendanceInductionPct}%</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Motivo de Alerta Socioeconómica / Académica:
                </span>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200">
                  {selectedCase.riskReason}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Historial de Intervención y Seguimiento de Bienestar:
                </span>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedCase.psychosocialIntervention}
                </div>
              </div>

              {/* Add Note Form */}
              <div className="pt-2">
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Registrar Nueva Nota Psicosocial / Compromiso:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Se concertó entrega de bono de transporte de emergencia..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                  />
                  <button
                    onClick={handleAddInterventionNote}
                    disabled={!newNote.trim()}
                    className="px-3 py-2 bg-[#39A900] hover:bg-[#2e8800] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleResolveCase(selectedCase.id)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Marcar Caso Atendido / Mitigado</span>
              </button>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Nueva Alerta Temprana */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Registrar Alerta Temprana en Inducción
                </h3>
                <p className="text-xs text-slate-500">
                  Detección oportuna de riesgo de deserción o necesidad de apoyo socioeconómico.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCase} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre Completo del Aprendiz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Gómez Herrera"
                  value={newCaseForm.name}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 1024567890"
                    value={newCaseForm.docId}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, docId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Número de Ficha
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 2825491"
                    value={newCaseForm.cohort}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, cohort: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nivel de Riesgo
                  </label>
                  <select
                    value={newCaseForm.riskStatus}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, riskStatus: e.target.value as any })}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="alto">Alto (Riesgo Deserción)</option>
                    <option value="medio">Medio</option>
                    <option value="bajo">Bajo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estrato Socioeconómico
                  </label>
                  <select
                    value={newCaseForm.stratum}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, stratum: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={1}>Estrato 1</option>
                    <option value={2}>Estrato 2</option>
                    <option value={3}>Estrato 3</option>
                    <option value={4}>Estrato 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Población / Enfoque Diferencial
                </label>
                <select
                  value={newCaseForm.priority}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    let label = 'Población General';
                    if (val === 'victima_conflicto') label = 'Víctima Conflicto (RUV)';
                    if (val === 'discapacidad') label = 'Persona con Discapacidad';
                    if (val === 'madre_cabeza_hogar') label = 'Madre Cabeza de Hogar';
                    if (val === 'indigena_afro') label = 'Comunidad Étnica';
                    if (val === 'vulnerabilidad_extrema') label = 'Vulnerabilidad Extrema';
                    setNewCaseForm({ ...newCaseForm, priority: val, priorityLabel: label });
                  }}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ninguna">Población General</option>
                  <option value="victima_conflicto">Víctima del Conflicto Armado (RUV)</option>
                  <option value="discapacidad">Persona en Condición de Discapacidad</option>
                  <option value="madre_cabeza_hogar">Madre Cabeza de Hogar</option>
                  <option value="indigena_afro">Comunidad Indígena / Afrodescendiente</option>
                  <option value="vulnerabilidad_extrema">Vulnerabilidad Económica Extrema</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Motivo de la Alerta en Inducción *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ej: Dificultad económica grave para transporte diario o riesgo psicosocial..."
                  value={newCaseForm.riskReason}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, riskReason: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Acción Inicial de Bienestar
                </label>
                <input
                  type="text"
                  placeholder="Ej: Entrevista de orientación y postulación a bono de transporte..."
                  value={newCaseForm.psychosocialIntervention}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, psychosocialIntervention: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Registrar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Detalles de Dimensión Estratégica */}
      {selectedDimension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {getDimensionIcon(selectedDimension.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedDimension.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Plan Nacional Integral de Bienestar al Aprendiz
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDimension(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                {selectedDimension.longDesc}
              </p>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                  Rol en la Semana de Inducción:
                </span>
                <p className="text-slate-700 dark:text-slate-200">
                  {selectedDimension.inductionObjective}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1.5">
                  Portafolio de Servicios Disponibles para el Aprendiz:
                </span>
                <ul className="space-y-1.5">
                  {selectedDimension.servicesOffered.map((serv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                      <span>{serv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Canal de Contacto:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDimension.coordinatorContact}</span>
                </div>
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDimension(null)}
                className="px-4 py-2 bg-[#00324D] dark:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
