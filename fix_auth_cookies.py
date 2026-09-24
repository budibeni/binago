import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "r") as f:
    content = f.read()

content = content.replace("secure: process.env.NODE_ENV === 'production',", "secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL?.startsWith('https'),")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "w") as f:
    f.write(content)
