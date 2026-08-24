import * as fs from 'fs';

const filePath = 'd:/03. DEVELOPMENT/03. AJB/GPS/binago/packages/ui/src/shell/Sidebar.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ChevronDown import
content = content.replace(/ChevronRight, X } from 'lucide-react';/, "ChevronRight, ChevronDown, X } from 'lucide-react';");

// 2. Add state and logic
const stateLogic = 
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('adatrack-sidebar-sections');
      if (stored) {
        setOpenSections(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, []);

  React.useEffect(() => {
    setOpenSections(prev => {
      let changed = false;
      const next = { ...prev };
      
      navigation.forEach(group => {
        if (group.id === 'main') return;
        const groupId = group.id || '';
        if (!groupId) return;
        
        const hasActive = group.items.some(
          item => currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
        );
        if (hasActive && !next[groupId]) {
          next[groupId] = true;
          changed = true;
        }
      });
      
      if (changed) {
        try {
          localStorage.setItem('adatrack-sidebar-sections', JSON.stringify(next));
        } catch(e) {}
        return next;
      }
      return prev;
    });
  }, [currentPath, navigation]);

  const toggleSection = (groupId: string) => {
    if (!groupId || groupId === 'main') return;
    setOpenSections(prev => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        localStorage.setItem('adatrack-sidebar-sections', JSON.stringify(next));
      } catch(e) {}
      return next;
    });
  };

  // Handle keyboard Escape to close mobile drawer
;
content = content.replace(/\/\/ Handle keyboard Escape to close mobile drawer/, stateLogic.trim());

// 3. Update the nav render block
const navRegex = /<nav[^>]*>[\s\S]*?<\/nav>/;
const newNavBlock = 
      <nav
        className="flex-1 min-h-0 overflow-y-auto py-3 px-2.5 space-y-3"
        aria-label="Navigasi utama"
      >
        {navigation.map((group, idx) => {
          const isMain = group.id === 'main';
          const groupId = group.id || idx.toString();
          const isOpen = isMain || !!openSections[groupId];

          return (
            <div key={groupId} className="space-y-0.5">
              {group.title && !collapsed && (
                <div
                  className={cn(
                    "flex items-center justify-between px-2.5 pb-1 pt-0.5 select-none",
                    !isMain && "cursor-pointer group/section"
                  )}
                  onClick={() => {
                    if (!isMain) toggleSection(groupId);
                  }}
                >
                  <div
                    className={cn(
                      "text-[10.5px] font-semibold uppercase tracking-widest",
                      !isMain ? "text-foreground-muted group-hover/section:text-foreground transition-colors duration-200" : "text-foreground-muted"
                    )}
                  >
                    {group.title}
                  </div>
                  {!isMain && (
                    <div className="text-foreground-muted group-hover/section:text-foreground transition-colors duration-200">
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                  )}
                </div>
              )}
              {isOpen && (
                <div className={cn("space-y-0.5", !isMain && !collapsed && "mt-1")}>
                  {renderNavItems(group.items)}
                </div>
              )}
            </div>
          );
        })}
      </nav>
;
content = content.replace(navRegex, newNavBlock.trim());

fs.writeFileSync(filePath, content, 'utf8');
console.log('Sidebar.tsx updated!');
