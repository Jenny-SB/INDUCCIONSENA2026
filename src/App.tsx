import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { InductionRoadmap } from './components/InductionRoadmap.tsx';
import { IdentityModule } from './components/IdentityModule.tsx';
import { RegulationsModule } from './components/RegulationsModule.tsx';
import { DilemmasSimulator } from './components/DilemmasSimulator.tsx';
import { InteractiveEvaluation } from './components/InteractiveEvaluation.tsx';
import { InstructorDashboard } from './components/InstructorDashboard.tsx';
import { WellnessModule } from './components/WellnessModule.tsx';
import { CertificateModal } from './components/CertificateModal.tsx';
import { ManualModal } from './components/ManualModal.tsx';
import { VideoTutorialModal } from './components/VideoTutorialModal.tsx';
import { PortalAccess } from './components/PortalAccess.tsx';
import { SenaLogo } from './components/SenaLogo.tsx';
import { INITIAL_APPRENTICES_DATA } from './data/senaData.ts';
import { ApprenticeResult, UserRole, AuthUser } from './types.ts';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  googleLogout,
  getAccessToken,
} from './services/googleWorkspaceAuth.ts';
import {
  GoogleSheetConfig,
  getStoredSheetConfig,
  saveStoredSheetConfig,
  createInductionGoogleSheet,
  syncApprenticeRecord,
  syncAllApprentices,
  SyncApprenticeData,
} from './services/googleSheetsService.ts';
import { FileSpreadsheet, CheckCircle, RefreshCw, X, BookOpen, Play } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [userRole, setUserRole] = useState<UserRole>('aprendiz');

  // Google Workspace Drive & Sheets state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleSheetConfig, setGoogleSheetConfig] = useState<GoogleSheetConfig | null>(() =>
    getStoredSheetConfig()
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [sheetsSyncFeedback, setSheetsSyncFeedback] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification((curr) => (curr === message ? null : curr));
    }, 4500);
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sena_theme_mode');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [isThemeBlurring, setIsThemeBlurring] = useState<boolean>(false);

  const [apprentices, setApprentices] = useState<ApprenticeResult[]>(() => {
    try {
      const saved = localStorage.getItem('sena_induction_apprentices');
      return saved ? JSON.parse(saved) : INITIAL_APPRENTICES_DATA;
    } catch {
      return INITIAL_APPRENTICES_DATA;
    }
  });

  const [activeResult, setActiveResult] = useState<ApprenticeResult | null>(() => {
    try {
      const saved = localStorage.getItem('sena_current_apprentice_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedCertificateResult, setSelectedCertificateResult] = useState<ApprenticeResult | null>(null);
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Initialize Firebase Auth listener for Google account persistence
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('sena_theme_mode', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  // Handle Theme Toggle with Smooth Blur Transition
  const handleToggleDarkMode = () => {
    setIsThemeBlurring(true);
    setTimeout(() => {
      setDarkMode((prev) => !prev);
    }, 60);

    setTimeout(() => {
      setIsThemeBlurring(false);
    }, 350);
  };

  // Sync apprentices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sena_induction_apprentices', JSON.stringify(apprentices));
    } catch {
      // storage quota or disabled
    }
  }, [apprentices]);

  useEffect(() => {
    if (activeResult) {
      try {
        localStorage.setItem('sena_current_apprentice_result', JSON.stringify(activeResult));
      } catch {
        // storage quota or disabled
      }
    }
  }, [activeResult]);

  /**
   * Connect to Google Workspace and auto-create or link induction spreadsheet
   */
  const handleConnectGoogle = async () => {
    try {
      setIsSyncingSheets(true);
      setSheetsSyncFeedback('Conectando con Google Drive y Sheets...');
      const authResult = await googleSignIn();
      if (!authResult) return;

      setGoogleUser(authResult.user);
      setGoogleToken(authResult.accessToken);

      // Check if we already have a sheet config, if not create one
      let currentConfig = googleSheetConfig || getStoredSheetConfig();
      if (!currentConfig) {
        setSheetsSyncFeedback('Creando hoja oficial "SENA - Registro de Aprendices e Inducción 2026" en Drive...');
        currentConfig = await createInductionGoogleSheet(authResult.accessToken);
        setGoogleSheetConfig(currentConfig);
      }

      // Initial bulk sync of current apprentices
      if (currentConfig && apprentices.length > 0) {
        setSheetsSyncFeedback(`Sincronizando ${apprentices.length} aprendices en la hoja de cálculo...`);
        const syncItems: SyncApprenticeData[] = apprentices.map((a) => ({
          timestamp: a.completedAt || new Date().toLocaleString('es-CO'),
          documentType: 'CC',
          documentId: a.documentId,
          fullName: a.apprenticeName,
          cohortNumber: a.cohortNumber,
          trainingProgram: a.trainingProgram,
          inductionStatus: a.passed ? 'Completada / Evaluada' : 'En Inducción',
          score: a.score,
          resultStatus: a.passed ? 'APROBADO' : 'NO APROBADO',
          certificateId: a.passed ? `SENA-IND-${a.documentId}-${a.cohortNumber}` : null,
        }));
        await syncAllApprentices(authResult.accessToken, currentConfig.spreadsheetId, syncItems);
        const updatedConfig = getStoredSheetConfig();
        if (updatedConfig) setGoogleSheetConfig(updatedConfig);
      }

      setSheetsSyncFeedback('¡Conectado exitosamente! Hoja sincronizada con Google Drive.');
      showToast('Hoja de cálculo en Google Drive vinculada y sincronizada.');
    } catch (err: any) {
      console.error('Error al conectar Google:', err);
      setSheetsSyncFeedback(`Error al conectar: ${err.message || 'Verifica permisos de popup'}`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  /**
   * Open or create the Google Sheet
   */
  const handleCreateOrOpenSheet = async () => {
    if (!googleToken) {
      await handleConnectGoogle();
      return;
    }

    try {
      setIsSyncingSheets(true);
      if (!googleSheetConfig) {
        setSheetsSyncFeedback('Creando hoja institucional en Google Drive...');
        const newConfig = await createInductionGoogleSheet(googleToken);
        setGoogleSheetConfig(newConfig);
        showToast('Hoja de cálculo creada en Google Drive.');
        window.open(newConfig.spreadsheetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(googleSheetConfig.spreadsheetUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      console.error('Error al abrir o crear hoja:', err);
      setSheetsSyncFeedback(`Error: ${err.message}`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  /**
   * Sync all apprentices currently in state to the Google Sheet
   */
  const handleSyncAllToSheets = async () => {
    const token = googleToken || (await getAccessToken());
    if (!token || !googleSheetConfig) {
      await handleConnectGoogle();
      return;
    }

    try {
      setIsSyncingSheets(true);
      setSheetsSyncFeedback(`Sincronizando ${apprentices.length} aprendices...`);
      const syncItems: SyncApprenticeData[] = apprentices.map((a) => ({
        timestamp: a.completedAt || new Date().toLocaleString('es-CO'),
        documentType: 'CC',
        documentId: a.documentId,
        fullName: a.apprenticeName,
        cohortNumber: a.cohortNumber,
        trainingProgram: a.trainingProgram,
        inductionStatus: a.passed ? 'Completada / Evaluada' : 'En Inducción',
        score: a.score,
        resultStatus: a.passed ? 'APROBADO' : 'NO APROBADO',
        certificateId: a.passed ? `SENA-IND-${a.documentId}-${a.cohortNumber}` : null,
      }));

      const count = await syncAllApprentices(token, googleSheetConfig.spreadsheetId, syncItems);
      const updatedConfig = getStoredSheetConfig();
      if (updatedConfig) setGoogleSheetConfig(updatedConfig);
      setSheetsSyncFeedback(`¡Sincronización completa! ${count} registros actualizados en Google Drive.`);
      showToast(`${count} registros de aprendices sincronizados en Google Drive.`);
    } catch (err: any) {
      console.error('Error en sincronización masiva:', err);
      setSheetsSyncFeedback(`Error al sincronizar: ${err.message}`);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  /**
   * Disconnect Google account session
   */
  const handleDisconnectGoogle = async () => {
    try {
      await googleLogout();
      setGoogleUser(null);
      setGoogleToken(null);
      setSheetsSyncFeedback(null);
      showToast('Sesión de Google Workspace desconectada.');
    } catch (err: any) {
      console.error('Error al desconectar:', err);
    }
  };

  /**
   * Sync apprentice record in background without blocking user
   */
  const syncApprenticeInBackground = useCallback(
    async (data: SyncApprenticeData) => {
      const config = googleSheetConfig || getStoredSheetConfig();
      const token = googleToken || (await getAccessToken());
      if (!config || !token) return;

      try {
        await syncApprenticeRecord(token, config.spreadsheetId, data);
        showToast(`Registro de "${data.fullName}" actualizado en Google Drive`);
      } catch (err) {
        console.warn('Error en sincronización en segundo plano con Google Sheets:', err);
      }
    },
    [googleSheetConfig, googleToken]
  );

  /**
   * Triggered when apprentice completes evaluation
   */
  const handleCompleteEvaluation = (newResult: ApprenticeResult) => {
    setActiveResult(newResult);
    // Also prepend or update in apprentices list
    setApprentices((prev) => {
      const existsIndex = prev.findIndex((a) => a.documentId === newResult.documentId);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newResult;
        return copy;
      }
      return [newResult, ...prev];
    });

    // Auto-sync evaluation completion to Google Sheets in background
    syncApprenticeInBackground({
      timestamp: newResult.completedAt,
      documentType: 'CC',
      documentId: newResult.documentId,
      fullName: newResult.apprenticeName,
      cohortNumber: newResult.cohortNumber,
      trainingProgram: newResult.trainingProgram,
      inductionStatus: 'Completada / Evaluada',
      score: newResult.score,
      resultStatus: newResult.passed ? 'APROBADO' : 'NO APROBADO',
      certificateId: newResult.passed
        ? `SENA-IND-${newResult.documentId}-${newResult.cohortNumber}`
        : null,
    });
  };

  const handleAddApprenticeFromInstructor = (newApprentice: ApprenticeResult) => {
    setApprentices((prev) => [newApprentice, ...prev]);

    // Auto-sync new apprentice added by instructor
    syncApprenticeInBackground({
      timestamp: newApprentice.completedAt,
      documentType: 'CC',
      documentId: newApprentice.documentId,
      fullName: newApprentice.apprenticeName,
      cohortNumber: newApprentice.cohortNumber,
      trainingProgram: newApprentice.trainingProgram,
      inductionStatus: newApprentice.passed ? 'Completada / Evaluada' : 'En Inducción',
      score: newApprentice.score,
      resultStatus: newApprentice.passed ? 'APROBADO' : 'NO APROBADO',
      certificateId: newApprentice.passed
        ? `SENA-IND-${newApprentice.documentId}-${newApprentice.cohortNumber}`
        : null,
    });
  };

  const handleStartQuizQuick = () => {
    setActiveTab('evaluacion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCertificate = (result: ApprenticeResult) => {
    setSelectedCertificateResult(result);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificateResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen w-full overflow-x-clip bg-[#F8FAFC] dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 flex flex-col font-sans theme-blur-transition ${
          isThemeBlurring ? 'theme-blur-active' : ''
        }`}
      >
        <PortalAccess
          onLogin={(user, targetTab) => {
            setCurrentUser(user);
            setUserRole(user.role);
            setIsAuthenticated(true);
            if (targetTab) {
              setActiveTab(targetTab);
            } else {
              setActiveTab(user.role === 'aprendiz' ? 'inicio' : user.role === 'instructor' ? 'instructor' : 'bienestar');
            }

            // If an apprentice signs in / registers, auto-sync their initial status to Google Sheet
            if (user.role === 'aprendiz') {
              syncApprenticeInBackground({
                timestamp: new Date().toLocaleString('es-CO'),
                documentType: 'CC',
                documentId: user.documentId || user.username || '1020849312',
                fullName: user.fullName || 'Aprendiz SENA',
                cohortNumber: user.cohortNumber || '2825491',
                trainingProgram: user.trainingProgram || 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
                inductionStatus: user.isRegistered ? 'Registrado' : 'En Inducción',
                score: null,
                resultStatus: 'En Curso',
                certificateId: null,
              });
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-clip bg-[#F8FAFC] dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 flex flex-col font-sans theme-blur-transition ${
        isThemeBlurring ? 'theme-blur-active' : ''
      }`}
    >
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        onStartQuiz={handleStartQuizQuick}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentUser={currentUser}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentUser(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Hero Banner (visible on Inicio) */}
      {activeTab === 'inicio' && (
        <Hero
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          completedEvaluation={Boolean(activeResult?.passed)}
          score={activeResult?.score}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'inicio' && (
          <InductionRoadmap
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            evaluationCompleted={Boolean(activeResult?.passed)}
            score={activeResult?.score}
            onOpenManual={() => setShowManualModal(true)}
            onOpenVideo={() => setShowVideoModal(true)}
          />
        )}

        {activeTab === 'identidad' && <IdentityModule />}

        {activeTab === 'reglamento' && <RegulationsModule />}

        {activeTab === 'dilemas' && <DilemmasSimulator />}

        {activeTab === 'evaluacion' && (
          <InteractiveEvaluation
            onCompleteEvaluation={handleCompleteEvaluation}
            onOpenCertificate={handleOpenCertificate}
            savedResult={activeResult}
            onGoToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'instructor' && (
          <InstructorDashboard
            apprentices={apprentices}
            onAddApprentice={handleAddApprenticeFromInstructor}
            onViewCertificate={handleOpenCertificate}
            googleSheetConfig={googleSheetConfig}
            isGoogleConnected={Boolean(googleUser && googleToken)}
            googleUserEmail={googleUser?.email}
            isSyncing={isSyncingSheets}
            syncFeedbackMessage={sheetsSyncFeedback}
            onConnectGoogle={handleConnectGoogle}
            onCreateOrOpenSheet={handleCreateOrOpenSheet}
            onSyncAllToSheets={handleSyncAllToSheets}
            onDisconnectGoogle={handleDisconnectGoogle}
          />
        )}

        {activeTab === 'bienestar' && (
          <WellnessModule
            onGoToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Printable Certificate Modal */}
      {selectedCertificateResult && (
        <CertificateModal
          result={selectedCertificateResult}
          onClose={handleCloseCertificate}
        />
      )}

      {/* Interactive User Manual Modal */}
      {showManualModal && (
        <ManualModal onClose={() => setShowManualModal(false)} />
      )}

      {/* Floating Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />

      {/* Floating Real-time Google Drive Sync Toast */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00324D] dark:bg-emerald-950 text-white border border-emerald-500/50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs max-w-sm animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-[#39A900] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 font-medium">{toastNotification}</div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Clean institutional footer without telemetry or fake tickers */}
      <footer className="mt-16 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <SenaLogo className="w-6 h-6 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200">Servicio Nacional de Aprendizaje - SENA · Dirección General</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-1.5 text-[#39A900] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              title="Ver Video Tutorial de la Plataforma"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Video Tutorial</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold hover:underline cursor-pointer"
              title="Abrir Manual de Usuario"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual del Aprendiz</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Línea Gratuita Nacional: 018000 910270</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz (Acuerdo 0009 de 2024)</span>
            <span aria-hidden="true">·</span>
            <span>Bogotá D.C., Colombia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

