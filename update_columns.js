const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverList.tsx';
let code = fs.readFileSync(path, 'utf8');

const newFunc = `function buildColumns(
  onViewDetail: (h: RentalHandover) => void,
  onViewMap: (h: RentalHandover) => void
): DataTableColumnDef<HandoverGroup>[] {
  return [
    {
      id: 'detail',
      header: '',
      size: 40,
      enableHiding: false,
      meta: { exportable: false, fixedWidth: true },
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetail(row.original.items[0])}
          title="Detail Serah Terima" 
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Eye className="w-3.5 h-3.5" /> 
        </Button>
      ),
    },
    {
      id: 'handoverInfo',
      accessorKey: 'id',
      header: 'ID HANDOVER',
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[12px] truncate">{row.original.id}</span>
          <span className="text-[12px] text-muted-foreground truncate">{row.original.contract?.contractNumber || row.original.contractId}</span>
        </div>
      ),
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: 'CUSTOMER',
      size: 190,
      cell: ({ row }) => {
        const cust = row.original.customer;
        if (!cust) return <span className="text-muted-foreground text-[12px]">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[12px] text-foreground truncate">{cust.name}</span>
            <span className="text-[12px] text-muted-foreground truncate capitalize">{cust.type?.toLowerCase() || '-'}</span>
          </div>
        );
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicleId',
      header: 'KENDARAAN',
      size: 200,
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1.5 min-w-0 py-1">
            {row.original.items.map((item, idx) => {
              const cv = item.vehicle?.coreVehicle;
              if (!cv) return null;
              return (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium shadow-sm",
                    "bg-muted/50 border-border text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  )}
                  onClick={() => onViewMap(item)}
                  title="Klik untuk melihat histori tracking map"
                >
                  <Car className="w-3 h-3" />
                  <span className="font-semibold">{cv.plateNumber}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      id: 'contractDate',
      accessorKey: 'contract.contractDate',
      header: 'TANGGAL KONTRAK',
      size: 150,
      cell: ({ row }) => {
        const cDate = row.original.contract?.contractDate;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[12px] text-foreground">{formatShortDate(cDate)}</span>
          </div>
        );
      }
    },
    {
      id: 'date',
      accessorKey: 'handoverAt',
      header: 'TGL DIPERBAHARUI / SERAH TERIMA',
      size: 230,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[12px] text-foreground">{formatShortDate(row.original.handoverAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.handoverAt)}</span>
        </div>
      ),
    },
    {
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
    }
  ];
}`;

const startIndex = code.indexOf('function buildColumns(');
const endIndex = code.indexOf('export function HandoverList');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newFunc + '\n\n' + code.substring(endIndex);
  fs.writeFileSync(path, code);
  console.log("Success");
} else {
  console.log("Failed to find bounds");
}
