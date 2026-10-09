# Fix ReturnsFeature.tsx
with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("Button, InputText", "Button")
content = content.replace("formatDateTime, formatIDR", "formatDateTime")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)

# Fix ReturnView.tsx
with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'r') as f:
    content = f.read()

content = content.replace("from './ReturnList'", "from './ReturnTable'")
content = content.replace("c.items.reduce((sum, item)", "c.items.reduce((sum: number, item: any)")
content = content.replace("c.items.map(item =>", "c.items.map((item: any) =>")
content = content.replace("c.items.find(i =>", "c.items.find((i: any) =>")
content = content.replace("c.items.some(i =>", "c.items.some((i: any) =>")
content = content.replace("c.items.filter(i =>", "c.items.filter((i: any) =>")
content = content.replace("map((item, idx)", "map((item: any, idx: number)")

with open('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', 'w') as f:
    f.write(content)
