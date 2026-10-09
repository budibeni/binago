with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace('hideLayoutToggle={true}\n        toolbar=', 'toolbar=')
content = content.replace('onProcessReturn={handleProcessReturn}\n          />', 'onProcessReturn={handleProcessReturn}\n            activeTab={activeTab}\n          />')

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
