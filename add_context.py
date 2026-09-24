import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/components/BusinessShellLayout.tsx", "r") as f:
    content = f.read()

content = content.replace("export const BusinessLocaleContext = React.createContext<Locale>('id');", "export const BusinessLocaleContext = React.createContext<Locale>('id');\nexport const BusinessUserContext = React.createContext<UserInfo | undefined>(undefined);\n\nexport function useBusinessUser() {\n  return React.useContext(BusinessUserContext);\n}")

content = content.replace("<BusinessLocaleContext.Provider value={locale}>", "<BusinessUserContext.Provider value={currentUser}>\n        <BusinessLocaleContext.Provider value={locale}>")
content = content.replace("</BusinessLocaleContext.Provider>", "</BusinessLocaleContext.Provider>\n        </BusinessUserContext.Provider>")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/components/BusinessShellLayout.tsx", "w") as f:
    f.write(content)
