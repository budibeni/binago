with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()
    
# Find <ReturnTable and insert activeTab={activeTab} if it's not there
import re

if 'activeTab={activeTab}' not in content:
    content = content.replace("onProcessReturn={handleProcessReturn}\n          />", "onProcessReturn={handleProcessReturn}\n            activeTab={activeTab}\n          />")
    
if 'activeTab={activeTab}' not in content:
    content = content.replace("onProcessReturn={handleProcessReturn}", "onProcessReturn={handleProcessReturn} activeTab={activeTab}")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
