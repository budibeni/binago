with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

import re

# Remove the invalid tabs prop and activeTab from PanelShell
content = re.sub(r'tabs={\[\s*{.*?\]}', '', content, flags=re.DOTALL)
content = content.replace('activeTab={activeTab}', '')
content = content.replace('hideLayoutToggle={true}', 'hideLayoutToggle={true}\n        toolbar={\n          <div className="flex gap-6 border-b border-border/50">\n            <button\n              onClick={() => setActiveTab(\'PENDING\')}\n              className={`pb-2.5 text-sm font-semibold transition-colors ${activeTab === \'PENDING\' ? \'text-foreground border-b-2 border-primary\' : \'text-muted-foreground hover:text-foreground\'}`}\n            >\n              Menunggu Pengembalian\n            </button>\n            <button\n              onClick={() => setActiveTab(\'COMPLETED\')}\n              className={`pb-2.5 text-sm font-semibold transition-colors ${activeTab === \'COMPLETED\' ? \'text-foreground border-b-2 border-primary\' : \'text-muted-foreground hover:text-foreground\'}`}\n            >\n              Riwayat\n            </button>\n          </div>\n        }')


with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
