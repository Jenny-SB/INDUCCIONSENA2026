export interface SyncApprenticeData {
  timestamp?: string;
  documentType?: string;
  documentId: string;
  fullName: string;
  cohortNumber: string;
  trainingProgram: string;
  inductionStatus: 'En Inducción' | 'Completada / Evaluada' | 'Registrado';
  score?: number | null;
  resultStatus?: 'APROBADO' | 'NO APROBADO' | 'En Curso';
  certificateId?: string | null;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheetName: string;
  lastSyncedAt?: string;
  syncedRowsCount?: number;
}

const DEFAULT_TITLE = 'SENA - Registro de Aprendices e Inducción 2026';
const SHEET_NAME = 'Aprendices Inducción';
const STORAGE_KEY = 'sena_google_sheets_config';

/**
 * Retrieve saved sheet config from storage
 */
export const getStoredSheetConfig = (): GoogleSheetConfig | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Save sheet config to storage
 */
export const saveStoredSheetConfig = (config: GoogleSheetConfig | null) => {
  try {
    if (config) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

/**
 * Create a new styled Google Sheet in Google Drive
 */
export const createInductionGoogleSheet = async (
  accessToken: string,
  customTitle = DEFAULT_TITLE
): Promise<GoogleSheetConfig> => {
  // 1. Create Spreadsheet container with specific sheet tab
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: customTitle,
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error al crear la hoja en Google Drive: ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl =
    sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Set Header Row with Official SENA Columns
  const headers = [
    'Fecha y Hora',
    'Tipo Doc.',
    'Número Documento',
    'Nombre Completo del Aprendiz',
    'Ficha de Caracterización',
    'Programa de Formación',
    'Estado de Inducción',
    'Puntaje Obtenido (%)',
    'Resultado Oficial',
    'ID de Registro / Certificado',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      SHEET_NAME
    )}!A1:J1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    }
  );

  // 3. Format Header Row with SENA Green (#39A900), bold white text and centered alignment
  try {
    const sheetId = sheetData.sheets?.[0]?.properties?.sheetId || 0;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2235, // #39A900
                    green: 0.6627,
                    blue: 0.0,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    bold: true,
                    fontSize: 10,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers.length,
              },
            },
          },
        ],
      }),
    });
  } catch (formatErr) {
    console.warn('Formato visual secundario de cabecera omitido:', formatErr);
  }

  const config: GoogleSheetConfig = {
    spreadsheetId,
    spreadsheetUrl,
    title: customTitle,
    sheetName: SHEET_NAME,
    lastSyncedAt: new Date().toLocaleString('es-CO'),
    syncedRowsCount: 0,
  };

  saveStoredSheetConfig(config);
  return config;
};

/**
 * Sync a single apprentice record (insert or update by document number)
 */
export const syncApprenticeRecord = async (
  accessToken: string,
  spreadsheetId: string,
  apprentice: SyncApprenticeData
): Promise<boolean> => {
  const timestamp = apprentice.timestamp || new Date().toLocaleString('es-CO');
  const scoreText =
    apprentice.score !== undefined && apprentice.score !== null
      ? `${apprentice.score}%`
      : 'Pendiente';
  const resultText =
    apprentice.resultStatus ||
    (apprentice.score !== undefined && apprentice.score !== null
      ? apprentice.score >= 80
        ? 'APROBADO'
        : 'NO APROBADO'
      : 'En Curso');
  const certText = apprentice.certificateId || 'Pendiente Evaluación';

  const rowValues = [
    timestamp,
    apprentice.documentType || 'CC',
    apprentice.documentId,
    apprentice.fullName,
    apprentice.cohortNumber,
    apprentice.trainingProgram,
    apprentice.inductionStatus,
    scoreText,
    resultText,
    certText,
  ];

  // 1. Fetch current data to check if documentId already exists in sheet
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      SHEET_NAME
    )}!A:C`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let existingRowIndex = -1;
  if (readRes.ok) {
    const data = await readRes.json();
    const rows: string[][] = data.values || [];
    // Row 0 is header. Search in Column C (index 2: documentId)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i] && rows[i][2] === apprentice.documentId) {
        existingRowIndex = i + 1; // 1-indexed for Sheets API range
        break;
      }
    }
  }

  if (existingRowIndex > 0) {
    // 2. Update existing row
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        SHEET_NAME
      )}!A${existingRowIndex}:J${existingRowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );
    return updateRes.ok;
  } else {
    // 3. Append new row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        SHEET_NAME
      )}!A:J:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );
    return appendRes.ok;
  }
};

/**
 * Bulk sync all registered apprentices in one batch
 */
export const syncAllApprentices = async (
  accessToken: string,
  spreadsheetId: string,
  apprentices: SyncApprenticeData[]
): Promise<number> => {
  let successCount = 0;
  for (const app of apprentices) {
    try {
      const ok = await syncApprenticeRecord(accessToken, spreadsheetId, app);
      if (ok) successCount++;
    } catch (err) {
      console.warn(`Error al sincronizar aprendiz ${app.documentId}:`, err);
    }
  }

  // Update stored last synced timestamp
  const currentConfig = getStoredSheetConfig();
  if (currentConfig && currentConfig.spreadsheetId === spreadsheetId) {
    currentConfig.lastSyncedAt = new Date().toLocaleString('es-CO');
    currentConfig.syncedRowsCount = successCount;
    saveStoredSheetConfig(currentConfig);
  }

  return successCount;
};
