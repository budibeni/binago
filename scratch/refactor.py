import os
import re

# These files still have local definitions that shadow the imported ones.
# We need to remove the local definitions (function body), since the import now does the job.

targets = [
    ('apps/business/src/features/modules/rental/bookings/components/BookingView.tsx', ['formatCurrency', 'formatDate']),
    ('apps/business/src/features/modules/rental/bookings/components/BookingForm.tsx', ['formatCurrency']),
    ('apps/business/src/features/modules/rental/bookings/components/BookingList.tsx', ['formatDate']),
    ('apps/business/src/features/modules/rental/contracts/utils/printDataProvider.ts', ['formatCurrency', 'formatDate']),
    ('apps/business/src/features/modules/rental/contracts/components/ContractForm.bak.tsx', ['formatCurrency', 'formatDate']),
    ('apps/business/src/features/modules/rental/contracts/components/ContractView.tsx', ['formatCurrency', 'formatDate']),
    ('apps/business/src/features/modules/rental/contracts/components/ContractForm.tsx', ['formatCurrency', 'formatDate']),
    ('apps/business/src/features/modules/rental/handover/components/HandoverView.tsx', ['formatDate', 'formatDateTime']),
    ('apps/business/src/features/modules/rental/handover/components/HandoverList.tsx', ['formatTime']),
    ('apps/business/src/features/modules/rental/pricing-category/components/PricingCategoryDetailDrawer.tsx', ['formatCurrency']),
    ('apps/business/src/features/modules/rental/vehicles/components/RentalVehicleView.tsx', ['formatCurrency']),
    ('apps/business/src/features/modules/rental/vehicles/components/RentalVehicleTable.tsx', ['formatCurrency']),
    ('apps/business/src/features/modules/rental/returns/components/ReturnView.tsx', ['formatDate', 'formatDateTime']),
    ('apps/business/src/features/modules/transport/departures/DeparturesFeature.tsx', ['formatTime']),
    ('apps/business/src/features/modules/transport/departures/components/DepartureDetailDrawer.tsx', ['formatDate']),
    # Tracking ones use a different internal format so we skip them
]

def remove_local_fn(content, fn_name):
    # Pattern 1: const fnName = (arg: type) => { ... }; (multi-line)
    # Pattern 2: const fnName = (arg: type) => fnName(arg); (one-liner)
    # We'll do a brace-matching approach for multi-line
    # First try simple one-liners:
    content = re.sub(rf'const {fn_name} = \([^)]*\) => {fn_name}\([^)]*\);\s*\n', '', content)
    
    # Multi-line arrow function: find "const fnName = (...) => {" and remove until matching "}"
    pattern = rf'const {fn_name} = \([^)]*\) => \{{'
    match = re.search(pattern, content)
    if match:
        start = match.start()
        # Find the closing brace
        brace_count = 0
        i = match.end() - 1  # Start at opening brace
        while i < len(content):
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end = i + 1
                    # Eat trailing ; and \n
                    while end < len(content) and content[end] in ';\n ':
                        if content[end] == '\n':
                            end += 1
                            break
                        end += 1
                    content = content[:start] + content[end:]
                    break
            i += 1
    return content

for path, fns in targets:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for fn in fns:
        content = remove_local_fn(content, fn)
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned: {path}")
    else:
        print(f"No change: {path}")
