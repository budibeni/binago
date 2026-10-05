import os
import re

rental_dir = 'apps/business/src/features/modules/rental'
app_dir = 'apps/business/src/app/(modules)/rental'

for module in os.listdir(rental_dir):
    mod_path = os.path.join(rental_dir, module)
    if not os.path.isdir(mod_path): continue
    
    # Check if there is a Feature.tsx file
    feature_files = [f for f in os.listdir(mod_path) if f.endswith('Feature.tsx')]
    if not feature_files: continue
    
    print(f"Checking module {module}...")
