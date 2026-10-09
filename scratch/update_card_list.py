import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

# Update container for the list (remove p-3, gap-1.5, add divide-y)
old_list_container = """        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Car className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data kontrak</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">"""

new_list_container = """        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-background">
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Car className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data kontrak</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/60">"""

content = content.replace(old_list_container, new_list_container)

# Update the button styling
old_button = """                   <button 
                     key={contract.id}
                     onClick={() => setSelectedContractId(contract.id)}
                     className={cn(
                       "w-full flex flex-col py-2.5 px-3 transition-all text-left border rounded-lg shadow-sm",
                       isSelected 
                         ? "bg-primary/5 border-primary/30" 
                         : "bg-background border-border/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:border-border"
                     )}
                   >"""

new_button = """                   <button 
                     key={contract.id}
                     onClick={() => setSelectedContractId(contract.id)}
                     className={cn(
                       "w-full flex flex-col py-3 px-4 transition-all text-left outline-none",
                       isSelected 
                         ? "bg-neutral-100 dark:bg-neutral-800" 
                         : "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                     )}
                   >"""

content = content.replace(old_button, new_button)

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
