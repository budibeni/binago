import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Replace left panel classes
left_panel_old = 'className="w-full md:w-[350px] lg:w-[420px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col h-full"'
left_panel_new = 'className={cn("w-full md:w-[350px] lg:w-[420px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex-col h-full", selectedContractId ? "hidden md:flex" : "flex")}'
content = content.replace(left_panel_old, left_panel_new)

# Replace right panel classes
right_panel_old = 'className="flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto"'
right_panel_new = 'className={cn("flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto relative", !selectedContractId ? "hidden md:block" : "block")}'
content = content.replace(right_panel_old, right_panel_new)

# Add a back button for mobile in the right panel
right_panel_content_old = '{selectedContract ? ('
right_panel_content_new = """{selectedContract ? (
            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto">
               <button 
                  onClick={() => setSelectedContractId(null)}
                  className="md:hidden flex items-center gap-2 text-sm font-semibold text-primary mb-4"
               >
                  &larr; Kembali ke Daftar
               </button>"""
               
content = content.replace('{selectedContract ? (\n            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto">', right_panel_content_new)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
