import React, { useState } from 'react';
import { ApprenticeResult } from '../types.ts';
import { GoogleSheetConfig } from '../services/googleSheetsService.ts';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Plus,
  Award,
  Filter,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface InstructorDashboardProps {
  apprentices: ApprenticeResult[];
  onAddApprentice: (apprentice: ApprenticeResult) => void;
  onViewCertificate: (apprentice: ApprenticeResult) => void;
  googleSheetConfig?: GoogleSheetConfig | null;
  isGoogleConnected?: boolean;
  googleUserEmail?: string | null;
  isSyncing?: boolean;
  syncFeedbackMessage?: string | null;
  onConnectGoogle?: () => Promise<void>;
  onCreateOrOpenSheet?: () => Promise<void>;
  onSyncAllToSheets?: () => Promise<void>;
  onDisconnectGoogle?: () => Promise<void>;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  apprentices,
  onAddApprentice,
  onViewCertificate,
  googleSheetConfig,
  isGoogleConnected = false,
  googleUserEmail,
  isSyncing = false,
  syncFeedbackMessage,
  onConnectGoogle,
  onCreateOrOpenSheet,
  onSyncAllToSheets,
  onDisconnectGoogle,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Apprentice modal fields
  const [newName, setNewName] = useState<string>('');
  const [newDoc, setNewDoc] = useState<string>('');
  const [newProgram, setNewProgram] = useState<string>('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
  const [newCohort, setNewCohort] = useState<string>('2825491');
  const [newScore, setNewScore] = useState<number>(85);

  const totalEvaluated = apprentices.length;
  const passedCount = apprentices.filter((a) => a.passed).length;
  const failedCount = totalEvaluated - passedCount;
  const passRate = totalEvaluated > 0 ? Math.round((passedCount / totalEvaluated) * 100) : 0;
  const averageScore =
    totalEvaluated > 0
      ? Math.round(apprentices.reduce((acc, curr) => acc + curr.score, 0) / totalEvaluated)
      : 0;

  const filteredApprentices = apprentices.filter((a) => {
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'passed' ? a.passed : !a.passed);
    const matchesSearch =
      a.apprenticeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.documentId.includes(searchQuery) ||
      a.cohortNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Nombre del Aprendiz',
      'Documento',
      'Ficha',
      'Programa',
      'Puntaje',
      'Estado',
      'Fecha',
    ];
    const rows = apprentices.map((a) => [
      `"${a.apprenticeName}"`,
      `"${a.documentId}"`,
      `"${a.cohortNumber}"`,
      `"${a.trainingProgram}"`,
      `${a.score}%`,
      a.passed ? 'APROBADO' : 'REQUIERE REFUERZO',
      `"${a.completedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_induccion_sena_ficha_2825491.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateApprentice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDoc.trim()) return;

    const isPassed = newScore >= 80;
    const newEntry: ApprenticeResult = {
      id: `app-${Date.now()}`,
      apprenticeName: newName,
      documentId: newDoc,
      trainingProgram: newProgram,
      cohortNumber: newCohort,
      regional: 'Distrito Capital',
      centerName: 'Centro de Tecnologías para la Construcción y la Madera',
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: newScore,
      totalQuestions: 10,
      correctAnswersCount: Math.round(newScore / 10),
      passed: isPassed,
      categoryBreakdown: [
        { category: 'Identidad Institucional', score: isPassed ? 3 : 2, total: 3 },
        { category: 'Derechos del Aprendiz', score: isPassed ? 3 : 2, total: 3 },
        { category: 'Deberes del Aprendiz', score: isPassed ? 2 : 1, total: 2 },
        { category: 'Debido Proceso y Medidas', score: isPassed ? 2 : 1, total: 2 },
      ],
      answersGiven: {},
    };

    onAddApprentice(newEntry);
    setNewName('');
    setNewDoc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Module Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[#00324D] dark:text-emerald-400 font-bold">Gestión de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>Coordinación Académica</span>
            <span aria-hidden="true">·</span>
            <span>Seguimiento de Apropiación</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white tracking-tight">
            Panel del Instructor: Control y Apropiación de Ficha
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs sm:text-sm max-w-2xl">
            Monitorea el progreso de la cohorte en tiempo real, verifica aprendices aprobados,
            identifica debilidades conceptuales y exporta las constancias para archivo de matrícula.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Aprendiz</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Exportar Reporte CSV</span>
          </button>
        </div>
      </div>

      {/* Google Drive & Google Sheets Live Sync Card */}
      <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-slate-100 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#39A900] shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#00324D] dark:text-white">
                  Sincronización en Vivo: Google Drive & Google Sheets
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isGoogleConnected && googleSheetConfig
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                  }`}
                >
                  {isGoogleConnected && googleSheetConfig ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Sincronización Activa</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pendiente de Conexión</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Los datos de los aprendices (registro inicial y resultados de la evaluación oficial) se guardan y actualizan automáticamente en una hoja de cálculo alojada en Google Drive.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!isGoogleConnected ? (
              onConnectGoogle && (
                <button
                  onClick={onConnectGoogle}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Conectar Cuenta de Google</span>
                </button>
              )
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {googleSheetConfig ? (
                  <a
                    href={googleSheetConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Abrir Hoja en Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  onCreateOrOpenSheet && (
                    <button
                      onClick={onCreateOrOpenSheet}
                      disabled={isSyncing}
                      className="px-3.5 py-2 bg-[#39A900] hover:bg-[#2e8800] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Crear Hoja en Google Drive</span>
                    </button>
                  )
                )}

                {onSyncAllToSheets && googleSheetConfig && (
                  <button
                    onClick={onSyncAllToSheets}
                    disabled={isSyncing}
                    className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#39A900] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Todo'}</span>
                  </button>
                )}

                {onDisconnectGoogle && (
                  <button
                    onClick={onDisconnectGoogle}
                    className="px-2.5 py-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium cursor-pointer"
                    title="Desconectar cuenta"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Google Sheet Info Banner if connected */}
        {isGoogleConnected && (
          <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <span>
                Cuenta vinculada: <strong className="text-slate-900 dark:text-white">{googleUserEmail || 'Google Workspace'}</strong>
              </span>
              {googleSheetConfig && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Archivo: <strong className="text-[#00324D] dark:text-emerald-400">{googleSheetConfig.title}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Pestaña: <strong>{googleSheetConfig.sheetName}</strong>
                  </span>
                </>
              )}
            </div>

            {googleSheetConfig?.lastSyncedAt && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Última sincronización: {googleSheetConfig.lastSyncedAt}
              </span>
            )}
          </div>
        )}

        {/* Feedback message banner */}
        {syncFeedbackMessage && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>{syncFeedbackMessage}</span>
          </div>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Aprendices Evaluados</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#00324D] dark:text-white tabular-nums">{totalEvaluated}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">Total registrados en cohorte</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Tasa de Aprobación</span>
            <TrendingUp className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl font-bold text-[#39A900] tabular-nums">{passRate}%</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">Umbral mínimo 80%</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>Promedio General</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-[#00324D] dark:text-white tabular-nums">{averageScore}%</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">Escala de 0 a 100</div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>En Plan de Refuerzo</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{failedCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">Requieren reintento</div>
        </div>
      </div>

      {/* Cohort Heatmap: Appropriation by Subject Area */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Diagnóstico Temático de Apropiación en la Ficha
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Identidad y Símbolos</span>
            <div className="text-lg font-bold text-[#39A900] tabular-nums">94% acierto</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Excelente comprensión de misión, himno y escudo.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Derechos del Aprendiz</span>
            <div className="text-lg font-bold text-[#39A900] tabular-nums">88% acierto</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Claridad en tiempos de calificación (8 días) y bienestar.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Deberes y Asistencia</span>
            <div className="text-lg font-bold text-[#00324D] dark:text-sky-400 tabular-nums">82% acierto</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Comprenden los 3 días hábiles para justificar incapacidades.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Debido Proceso y Sanciones</span>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">76% acierto</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Requiere reforzar etapas del Comité y recurso de reposición.</p>
          </div>
        </div>
      </div>

      {/* Apprentices Roster Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aprendiz por nombre, cédula o ficha..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todos ({apprentices.length})
            </button>
            <button
              onClick={() => setStatusFilter('passed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'passed' ? 'bg-[#39A900] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Aprobados ({passedCount})
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'failed' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              En Refuerzo ({failedCount})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Aprendiz</th>
                <th className="py-3 px-3">Documento</th>
                <th className="py-3 px-3">Ficha / Programa</th>
                <th className="py-3 px-3 text-right">Puntaje</th>
                <th className="py-3 px-3">Estado de Apropiación</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApprentices.map((apprentice) => (
                <tr key={apprentice.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {apprentice.apprenticeName}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {apprentice.documentId}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mr-1.5">{apprentice.cohortNumber}</span>
                    <span className="truncate max-w-[180px] inline-block align-bottom">{apprentice.trainingProgram}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums">
                    <span className={apprentice.passed ? 'text-[#39A900]' : 'text-amber-600 dark:text-amber-400'}>
                      {apprentice.score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {apprentice.passed ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                        <span>Aprobado</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Plan de Refuerzo</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {apprentice.passed ? (
                      <button
                        onClick={() => onViewCertificate(apprentice)}
                        className="px-2.5 py-1 text-xs font-medium text-[#00324D] dark:text-emerald-400 hover:text-white dark:hover:text-white hover:bg-[#00324D] dark:hover:bg-emerald-600 border border-[#00324D]/30 dark:border-emerald-600/40 rounded-md transition-colors cursor-pointer"
                      >
                        Ver Certificado
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">Reintento pend.</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApprentices.length === 0 && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No se encontraron registros con los criterios de búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* QUICK ADD APPRENTICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#00324D] dark:text-white">
                Registrar Simulación de Aprendiz
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApprentice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Valentina Morales Gómez"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Número de Documento *</label>
                <input
                  type="text"
                  required
                  value={newDoc}
                  onChange={(e) => setNewDoc(e.target.value)}
                  placeholder="Ej. 1019284752"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ficha de Caracterización</label>
                <input
                  type="text"
                  value={newCohort}
                  onChange={(e) => setNewCohort(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Programa de Formación</label>
                <input
                  type="text"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Puntaje Obtenido: <span className="text-[#39A900] font-mono font-bold">{newScore}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="10"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full accent-[#39A900] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  <span>40% (No Aprobado)</span>
                  <span>80% (Mínimo)</span>
                  <span>100% (Sobresaliente)</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-white bg-[#39A900] hover:bg-[#2e8800] rounded-lg transition-colors font-bold cursor-pointer"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
