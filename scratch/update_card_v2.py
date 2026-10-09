import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Update getContractStatus to use Monitoring logic
old_status_logic = """  const getContractStatus = (contract: RentalContract) => {
    let overdueCount = 0;
    let returnedCount = 0;
    const items = contract.items || [];
    const now = new Date().getTime();
    
    items.forEach(i => {
       if (i.itemStatus === 'RETURNED') returnedCount++;
       else if (i.endDate && new Date(i.endDate).getTime() < now) overdueCount++;
    });
    
    return { overdueCount, returnedCount, total: items.length };
  };"""

new_status_logic = """  const getContractStatus = (contract: RentalContract) => {
    let safeCount = 0;
    let warningCount = 0;
    let overdueCount = 0;
    let returnedCount = 0;
    
    const items = contract.items || [];
    const now = new Date().getTime();
    
    items.forEach(i => {
       if (i.itemStatus === 'RETURNED') {
         returnedCount++;
         return;
       }
       if (!i.endDate) {
         safeCount++;
         return;
       }
       const diffHours = (new Date(i.endDate).getTime() - now) / (1000 * 60 * 60);
       if (diffHours < 0) overdueCount++;
       else if (diffHours < 24) warningCount++;
       else safeCount++;
    });
    
    // Find latest end date among items for the period display
    let latestEnd = 0;
    items.forEach(i => {
       if (i.endDate) {
          const t = new Date(i.endDate).getTime();
          if (t > latestEnd) latestEnd = t;
       }
    });
    
    return { 
      safeCount, warningCount, overdueCount, returnedCount, total: items.length,
      latestEnd: latestEnd > 0 ? new Date(latestEnd).toISOString() : null
    };
  };"""
content = content.replace(old_status_logic, new_status_logic)

# Replace the Card Content
old_card_pattern = r'<button\s*key=\{contract\.id\}.*?className=\{cn\([\s\S]*?\}\s*>\s*<div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full text-left">.*?</div>\s*</button>'

new_card_content = """<button 
                     key={contract.id}
                     onClick={() => setSelectedContractId(contract.id)}
                     className={cn(
                       "w-full flex flex-col p-4 transition-all text-left border rounded-xl shadow-sm",
                       isSelected 
                         ? "bg-primary/5 border-primary/30" 
                         : "bg-background border-border/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:border-border"
                     )}
                   >
                      <div className="flex flex-col gap-0.5 w-full text-left">
                          <div className="font-bold text-[14px] text-foreground truncate w-full pr-2">
                             {contract.customer?.name} <span className="text-[12px] font-medium text-muted-foreground ml-1">({contract.contractNumber})</span>
                          </div>
                          <div className="text-[12px] text-muted-foreground mt-1">
                             {formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold tracking-wide mt-3">
                             {status.safeCount > 0 && <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Aman ({status.safeCount})</span>}
                             {status.warningCount > 0 && <span className="flex items-center gap-1.5 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                             {status.overdueCount > 0 && <span className="flex items-center gap-1.5 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                             {status.returnedCount > 0 && <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Selesai ({status.returnedCount})</span>}
                          </div>
                      </div>
                   </button>"""

content = re.sub(r'<button\s*key=\{contract\.id\}[\s\S]*?</button>', new_card_content, content, count=1)


with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
