import { createCodeSheetLifecycle } from '../../../../utils/create-code-sheet-lifecycle';

export default createCodeSheetLifecycle({
  uid: 'api::currency.currency',
  label: 'currency',
  sourceField: 'code',
  resource: 'currencies',
});
