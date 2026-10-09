import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { Card } from '@workspace/ui';", "import { Card, DataTableSearch } from '@workspace/ui';")

old_search = """          <div className="relative mb-3 mt-1 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari no kontrak, nopol, pelanggan..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>"""

new_search = """          <div className="mb-3 mt-1">
            <DataTableSearch 
              value={search}
              onChange={setSearch}
              placeholder="Cari kontrak, pelanggan..."
              className="max-w-full"
            />
          </div>"""

content = content.replace(old_search, new_search)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
