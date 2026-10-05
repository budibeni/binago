import os
import re

TABLES = [
    "apps/business/src/features/core/drivers/components/DriverTable.tsx",
    "apps/business/src/features/core/access/card/components/CardTable.tsx",
    "apps/business/src/features/core/access/personel/components/PersonelTable.tsx",
    "apps/business/src/features/core/access/log/components/LogTable.tsx",
    "apps/business/src/features/core/groups/components/GroupTable.tsx",
    "apps/business/src/features/core/tracking/components/speed/SpeedTable.tsx",
    "apps/business/src/features/core/tracking/components/playback/PlaybackTable.tsx",
    "apps/business/src/features/core/tracking/components/live/LiveTable.tsx",
    "apps/business/src/features/core/tracking/components/heatmap/HeatmapTable.tsx",
    "apps/business/src/features/core/tracking/components/parking/ParkingTable.tsx",
    "apps/business/src/features/core/tracking/components/mileage/MileageTable.tsx",
    "apps/business/src/features/core/vehicles/components/VehicleTable.tsx",
    "apps/business/src/features/modules/rental/pricing-category/components/PricingCategoryTable.tsx",
    "apps/business/src/features/modules/rental/vehicles/components/RentalVehicleTable.tsx"
]

def remove_actions_column(content):
    # This is a bit tricky with regex, we need to match { id: 'actions', ... },
    pattern = r"\{\s*id:\s*['\"]actions['\"],\s*header:.*?cell:\s*\(\{\s*row\s*\}\)\s*=>\s*\{.*?return\s*\(.*?<\/Button>\s*\);\s*\},\s*\},?"
    # A safer approach is to find "id: 'actions'" and balance the braces.
    lines = content.split('\n')
    in_actions = False
    brace_count = 0
    new_lines = []
    
    for i, line in enumerate(lines):
        if not in_actions:
            if "id: 'actions'" in line or 'id: "actions"' in line:
                # Need to look back to find the opening brace
                # usually it's `    {` on the line before
                if new_lines and new_lines[-1].strip() == '{':
                    new_lines.pop()
                in_actions = True
                brace_count = 1
            else:
                new_lines.append(line)
        else:
            brace_count += line.count('{')
            brace_count -= line.count('}')
            if brace_count <= 0:
                in_actions = False
                # Skip trailing comma
                if i + 1 < len(lines) and lines[i+1].strip() == ',':
                    pass # handled by skipping or next iteration? Actually, just keep going
                continue
                
    return '\n'.join(new_lines)


def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, not found.")
        return
        
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    
    # 1. Remove actions column
    content = remove_actions_column(content)

    # 2. Update buildColumns signature
    # Find `function buildColumns(` and remove onViewDetail, onEdit, onDelete
    content = re.sub(r'onViewDetail:?\s*\([^)]*\)\s*=>\s*void,?', '', content)
    content = re.sub(r'onEdit:?\s*\([^)]*\)\s*=>\s*void,?', '', content)
    content = re.sub(r'onDelete:?\s*\([^)]*\)\s*=>\s*void,?', '', content)
    
    # Clean up empty lines in signature
    content = re.sub(r'\n\s*\n(\s*\):)', r'\n\1', content)

    # 3. Update buildColumns call
    content = re.sub(r'buildColumns\([^)]*\)', lambda m: re.sub(r',\s*(onViewDetail|onEdit|onDelete)', '', m.group(0)), content)

    # 4. Update <DataTable ...> to include onRowActionClick
    if '<DataTable' in content and 'onRowActionClick=' not in content:
        # Check if the component receives onViewDetail
        if 'onViewDetail,' in content or 'onViewDetail:' in content:
            content = content.replace('<DataTable', '<DataTable\n        onRowActionClick={onViewDetail}')
            
    # 5. Strip styling from cells (optional, let's keep it simple first)
    
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

for path in TABLES:
    process_file(path)

