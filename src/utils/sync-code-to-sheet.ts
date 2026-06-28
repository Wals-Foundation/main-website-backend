import { google, sheets_v4 } from 'googleapis';

type AppsScriptConfig = {
  webAppUrl: string;
  secretToken: string;
};

type SyncCodeOptions = {
  code?: string | null;
  previousCode?: string | null;
  resource?: string | null;
};

type SyncResult = {
  action: 'appended' | 'updated' | 'skipped';
  row?: number;
};

type SheetsConfig = {
  spreadsheetId: string;
  serviceAccount: {
    client_email: string;
    private_key: string;
  };
};

const sheetsScope = 'https://www.googleapis.com/auth/spreadsheets';

let sheetsClientPromise: Promise<sheets_v4.Sheets> | null = null;

function quoteSheetName(tabName: string) {
  if (/^[A-Za-z0-9_]+$/.test(tabName)) {
    return tabName;
  }

  return `'${tabName.replace(/'/g, "''")}'`;
}

function getSheetsConfig(): SheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const rawServiceAccount = process.env.GCP_SERVICE_ACCOUNT;

  if (!spreadsheetId || !rawServiceAccount) {
    return null;
  }

  const serviceAccount = JSON.parse(rawServiceAccount);

  if (!serviceAccount?.client_email || !serviceAccount?.private_key) {
    return null;
  }

  return {
    spreadsheetId,
    serviceAccount: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
    },
  };
}

function getAppsScriptConfig(): AppsScriptConfig | null {
  const syncConfig = strapi?.config?.get?.('sync.googleAppsScript') as
    | { webAppUrl?: string; secretToken?: string }
    | undefined;
  const webAppUrl = syncConfig?.webAppUrl?.trim() || process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL?.trim();
  const secretToken = syncConfig?.secretToken?.trim() || process.env.GOOGLE_APPS_SCRIPT_WEB_APP_TOKEN?.trim();

  if (!webAppUrl || !secretToken) {
    return null;
  }

  return { webAppUrl, secretToken };
}

async function pingGoogleAppsScript(resource?: string | null): Promise<void> {
  const config = getAppsScriptConfig();

  if (!config) {
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const body: Record<string, unknown> = { token: config.secretToken };

    if (resource) {
      body.resource = resource;
    }

    const response = await fetch(config.webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    strapi.log.info(`Google ping body: ${JSON.stringify(body)} & response is ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const bodyText = await response.text().catch(() => null);
      throw new Error(`Google Apps Script ping failed with ${response.status}${bodyText ? `: ${bodyText}` : ''}`);
    }

    strapi.log.info('Google Apps Script ping completed successfully');
  } catch (error) {
    strapi.log.error('Google Apps Script ping failed', error);
  } finally {
    clearTimeout(timeout);
  }
}

async function getSheetsClient() {
  if (!sheetsClientPromise) {
    sheetsClientPromise = (async () => {
      const config = getSheetsConfig();

      if (!config) {
        throw new Error('Google Sheets configuration is missing');
      }

      const auth = new google.auth.JWT({
        email: config.serviceAccount.client_email,
        key: config.serviceAccount.private_key,
        scopes: [sheetsScope],
      });

      await auth.authorize();

      return google.sheets({ version: 'v4', auth });
    })();
  }

  return sheetsClientPromise;
}

async function findRowByCode(
  client: sheets_v4.Sheets,
  spreadsheetId: string,
  tabName: string,
  code: string
) {
  const response = await client.spreadsheets.values.get({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!A:A`,
  });

  const rows = response.data.values || [];

  for (let index = 0; index < rows.length; index += 1) {
    const value = rows[index]?.[0];

    if (String(value ?? '').trim() === code) {
      return index + 1;
    }
  }

  return null;
}

async function appendCode(
  client: sheets_v4.Sheets,
  spreadsheetId: string,
  tabName: string,
  code: string
) {
  const response = await client.spreadsheets.values.append({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[code]],
    },
  });

  const updatedRange = response.data.updates?.updatedRange;
  const row = updatedRange ? Number(updatedRange.match(/!(?:A)?(\d+)/)?.[1] ?? NaN) : NaN;

  return Number.isFinite(row) ? row : undefined;
}

async function updateCode(
  client: sheets_v4.Sheets,
  spreadsheetId: string,
  tabName: string,
  row: number,
  code: string
) {
  await client.spreadsheets.values.update({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!A${row}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[code]],
    },
  });
}

export async function syncCodeToSheet(options: SyncCodeOptions): Promise<SyncResult> {
  const code = options.code?.trim();
  const previousCode = options.previousCode?.trim();
  const resource = options.resource?.trim() ?? null;

  if (!code) {
    return { action: 'skipped' };
  }

  const config = getSheetsConfig();

  if (!config) {
    throw new Error('Google Sheets configuration is missing');
  }

  const client = await getSheetsClient();
  const tabName = resource === 'currencies' ? 'currencies' : 'functional_categories';

  if (previousCode && previousCode !== code) {
    const previousRow = await findRowByCode(client, config.spreadsheetId, tabName, previousCode);

    if (previousRow) {
      await updateCode(client, config.spreadsheetId, tabName, previousRow, code);
      await pingGoogleAppsScript(resource ?? undefined);
      return { action: 'updated', row: previousRow };
    }
  }

  const existingRow = await findRowByCode(client, config.spreadsheetId, tabName, code);

  if (existingRow) {
    if (previousCode && previousCode !== code) {
      await updateCode(client, config.spreadsheetId, tabName, existingRow, code);
      await pingGoogleAppsScript(resource ?? undefined);
      return { action: 'updated', row: existingRow };
    }

    return { action: 'skipped', row: existingRow };
  }

const appendedRow = await appendCode(client, config.spreadsheetId, tabName, code);

  await pingGoogleAppsScript(resource ?? undefined);

  return { action: 'appended', row: appendedRow };
}
