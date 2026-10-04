const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverList.tsx';
let code = fs.readFileSync(path, 'utf8');

const dateCol = `{
      id: 'date',
      accessorKey: 'handoverAt',
      header: 'TGL SERAH TERIMA',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[12px] text-foreground">{formatShortDate(row.original.handoverAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.handoverAt)}</span>
        </div>
      ),
    },`;

// Remove dateCol from its current position
code = code.replace(dateCol, '');
// Clean up any trailing spaces or double commas if they exist
code = code.replace(/,\s*,/g, ',');

// Insert before status
const statusTarget = `{
      id: 'status',`;
code = code.replace(statusTarget, dateCol + '\n    ' + statusTarget);

fs.writeFileSync(path, code);
console.log('Success');
