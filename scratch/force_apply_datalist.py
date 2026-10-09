import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# 1. Imports
if "DataList" not in content:
    content = content.replace(
        "import { Card } from '@adatrack/ui';",
        "import { Card, DataTableSearch, DataList, DataListHeader, DataListContent, DataListItem, DataListPagination } from '@adatrack/ui';"
    )
    # Actually wait, let's just make sure it's exported from @adatrack/ui
    content = content.replace("import { Card } from '@adatrack/ui';", "import { Card, DataTableSearch, DataList, DataListHeader, DataListContent, DataListItem, DataListPagination } from '@adatrack/ui';")

# Ensure it's there if they imported Button, DataTable
content = content.replace(
    "import { Button, DataTable } from '@adatrack/ui';",
    "import { Button, DataTable, DataTableSearch, DataList, DataListHeader, DataListContent, DataListItem, DataListPagination } from '@adatrack/ui';"
)


# 2. Pagination State
if "pageSize = 15" not in content:
    content = content.replace(
        "  const [search, setSearch] = useState('');",
        "  const [search, setSearch] = useState('');\n  const [pageIndex, setPageIndex] = useState(0);\n  const pageSize = 15;\n\n  useEffect(() => {\n    setPageIndex(0);\n  }, [search, activeTab]);"
    )

# 3. Logic calculation
if "const totalRows =" not in content:
    content = content.replace(
        "    });\n  }, [data, search, activeTab]);",
        "    });\n  }, [data, search, activeTab]);\n\n  const totalRows = filteredList.length;\n  const pageCount = Math.ceil(totalRows / pageSize);\n  const canPrevPage = pageIndex > 0;\n  const canNextPage = pageIndex < pageCount - 1;\n  const currentList = filteredList.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);"
    )
    content = content.replace(
        "const found = filteredList.find(c => c.id === selectedContractId)",
        "const found = currentList.find(c => c.id === selectedContractId)"
    )

# 4. Replace Left Panel
new_panel = """      {/* LEFT PANEL: Master List (30%) */}
      <DataList className={cn(selectedContractId ? "hidden md:flex" : "flex")}>
        <DataListHeader>
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg w-full">
            <button 
              onClick={() => { setActiveTab('PENDING'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'PENDING' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Aktif
            </button>
            <button 
              onClick={() => { setActiveTab('COMPLETED'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'COMPLETED' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Selesai
            </button>
          </div>
          <DataTableSearch 
            value={search}
            onChange={setSearch}
            placeholder="Cari kontrak, pelanggan..."
            className="max-w-full"
          />
        </DataListHeader>

        <DataListContent>
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Car className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data kontrak</p>
            </div>
          ) : (
            currentList.map(contract => {
              const isSelected = selectedContractId === contract.id;
              const status = getContractStatus(contract);

              return (
                <DataListItem 
                  key={contract.id}
                  isSelected={isSelected}
                  onClick={() => setSelectedContractId(contract.id)}
                >
                  <div className="flex flex-col w-full text-left">
                    {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                    <div className="flex justify-between items-center w-full mb-0.5">
                      <div className="text-[10px] font-normal text-muted-foreground truncate max-w-[50%]">
                        {contract.contractNumber}
                      </div>
                      <div className="flex items-center flex-wrap gap-1 justify-end text-[10px] font-medium tracking-wide shrink-0 max-w-[50%]">
                         {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                         {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                         {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                         {activeTab === 'COMPLETED' && <span className="flex items-center gap-1 text-neutral-500"><CheckCircle2 className="w-3 h-3 text-neutral-400" /> Selesai</span>}
                      </div>
                    </div>
                    
                    {/* Baris 2: Periode */}
                    <div className="flex items-center gap-1 text-[10px] font-normal text-muted-foreground">
                      <CalendarRange className="w-3 h-3 text-neutral-400" />
                      <span className="truncate">{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                    </div>

                    {/* Baris 3: Customer */}
                    <div className="flex items-center gap-1 text-[12px] font-medium text-foreground w-full mt-1.5">
                      {contract.customerSnapshot?.type?.toLowerCase().includes('perusahaan') || contract.customerSnapshot?.type?.toLowerCase().includes('b2b') || contract.customerSnapshot?.type?.toLowerCase().includes('company') ? (
                         <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                      ) : (
                         <User className="w-3 h-3 text-neutral-400 shrink-0" />
                      )}
                      <span className="truncate w-full">{contract.customerSnapshot?.name || 'Pelanggan'}</span>
                    </div>
                  </div>
                </DataListItem>
              );
            })
          )}
        </DataListContent>

        <DataListPagination 
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={totalRows}
          onNextPage={() => setPageIndex(p => p + 1)}
          onPrevPage={() => setPageIndex(p => p - 1)}
          canNextPage={canNextPage}
          canPrevPage={canPrevPage}
        />
      </DataList>"""

# Find by regex
pattern = r'\{\/\*\s*LEFT PANEL: Master List \(30\%\)\s*\*\/\}.*?\{\/\*\s*RIGHT PANEL: Detail View \(70\%\)\s*\*\/\}'
match = re.search(pattern, content, re.DOTALL)

if match:
    content = content[:match.start()] + new_panel + '\n\n      {/* RIGHT PANEL: Detail View (70%) */}' + content[match.end():]
else:
    print("Failed to replace using regex")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
