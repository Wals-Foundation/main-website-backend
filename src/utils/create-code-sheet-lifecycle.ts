import { syncCodeToSheet } from './sync-code-to-sheet';

type LifecycleEvent = {
  params?: {
    data?: {
      code?: string | null;
    };
    where?: Record<string, unknown>;
  };
  result?: {
    code?: string | null;
  };
  state?: {
    previousCode?: string | null;
  };
};

type LifecycleConfig = {
  uid: string;
  label: string;
  sourceField: string;
  resource?: string;
};

async function getPreviousValue(uid: string, sourceField: string, event: LifecycleEvent) {
  const where = event.params?.where;

  if (!where) {
    return null;
  }

  const existingRecord = await strapi.db.query(uid).findOne({ where });

  return (existingRecord?.[sourceField] as string | null | undefined) ?? null;
}

export function createCodeSheetLifecycle({ uid, label, sourceField, resource }: LifecycleConfig) {
  const syncResource = resource ?? label;

  return {
    async beforeUpdate(event: LifecycleEvent) {
      const previousValue = await getPreviousValue(uid, sourceField, event);

      event.state = event.state || {};
      event.state.previousCode = previousValue;
    },

    async afterCreate(event: LifecycleEvent) {
      const value = event.params?.data?.[sourceField as keyof NonNullable<LifecycleEvent['params']>['data']]
        ?? event.result?.[sourceField as keyof NonNullable<LifecycleEvent['result']>]
        ?? null;

      try {
        const result = await syncCodeToSheet({ code: value, resource: syncResource });

        if (result.action !== 'skipped') {
          strapi.log.info(`[${label}] synced ${sourceField} to Google Sheet (${result.action})`);
        }
      } catch (error) {
        strapi.log.error(`[${label}] failed to sync ${sourceField} to Google Sheet`, error);
      }
    },

    async afterUpdate(event: LifecycleEvent) {
      const value = event.result?.[sourceField as keyof NonNullable<LifecycleEvent['result']>]
        ?? event.params?.data?.[sourceField as keyof NonNullable<LifecycleEvent['params']>['data']]
        ?? null;
      const previousCode = event.state?.previousCode ?? null;

      if (!value) {
        return;
      }

      try {
        const result = await syncCodeToSheet({ code: value, previousCode, resource: syncResource });

        if (result.action !== 'skipped') {
          strapi.log.info(`[${label}] synced ${sourceField} to Google Sheet (${result.action})`);
        }
      } catch (error) {
        strapi.log.error(`[${label}] failed to sync ${sourceField} to Google Sheet`, error);
      }
    },
  };
}
