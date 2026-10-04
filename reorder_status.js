const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverList.tsx';
let code = fs.readFileSync(path, 'utf8');

const statusCol = `{
      id: 'status',
      accessorKey: 'status',
      header: 'STATUS',
      size: 110,
      cell: ({ row }) => {
        const isCompleted = row.original.status === 'COMPLETED';
        return (
          <div className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold",
            isCompleted 
              ? "bg-success/10 text-success" 
              : "bg-warning/10 text-warning-600 dark:text-warning"
          )}>
            {isCompleted ? 'Selesai' : 'Sebagian'}
          </div>
        );
      }
    },`;

// Remove statusCol from its current position
code = code.replace(statusCol, '');

// The vehicle column definition starts with:
//     {
//       id: 'vehicle',
const vehicleTarget = `{
      id: 'vehicle',`;

// Insert statusCol right before vehicleTarget
code = code.replace(vehicleTarget, statusCol + '\n    ' + vehicleTarget);

fs.writeFileSync(path, code);
console.log('Success');
