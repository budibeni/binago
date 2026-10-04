const fs = require('fs');

const listPath = './apps/business/src/features/modules/rental/handover/components/HandoverList.tsx';
const viewPath = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';

function fixFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(
    'isCompleted \n              ? "bg-success/10 text-success" \n              : "bg-warning/10 text-warning-600 dark:text-warning"',
    'isCompleted \n              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" \n              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"'
  );
  code = code.replace(
    'isCompleted ? "bg-success/10 text-success" : "bg-warning/10 text-warning-600 dark:text-warning"',
    'isCompleted ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"'
  );
  fs.writeFileSync(filePath, code);
}

fixFile(listPath);
fixFile(viewPath);
console.log('Success');
