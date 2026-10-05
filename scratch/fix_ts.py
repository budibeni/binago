import re
import os

def fix_size_map(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f: content = f.read()
    if 'lg:' in content and 'icon:' not in content:
        content = re.sub(r'(lg:\s*[\'"].*?[\'"])(,?)', r'\1,\n  icon: ""\2', content)
        with open(filepath, 'w') as f: f.write(content)

fix_size_map('packages/ui/src/Avatar.tsx')
fix_size_map('packages/ui/src/Icon.tsx')
fix_size_map('packages/ui/src/Spinner.tsx')

dt_types = 'packages/ui/src/DataTable/types.ts'
with open(dt_types, 'r') as f: content = f.read()
if 'actionDetail' not in content:
    content = content.replace('// Active Filters', 'actionDetail?: string;\n  // Active Filters')
    with open(dt_types, 'w') as f: f.write(content)
