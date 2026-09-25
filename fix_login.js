const fs = require('fs');

let pageContent = fs.readFileSync('apps/business/src/app/(auth)/login/page.tsx', 'utf8');
pageContent = pageContent.replace('setEmail(result.email);', 'setEmail(formData.get("email") as string);');
pageContent = pageContent.replace('setPassword(result.password);', 'setPassword(formData.get("password") as string);');
fs.writeFileSync('apps/business/src/app/(auth)/login/page.tsx', pageContent);

let authContent = fs.readFileSync('apps/business/src/app/actions/auth.ts', 'utf8');
authContent = authContent.replace('email, \n        password \n      };', '      };\n');
authContent = authContent.replace('httpOnly: false, // Must be readable by client api.ts to send in Authorization header', 'httpOnly: true,');
authContent = authContent.replace("secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL?.startsWith('https'),", "secure: process.env.NODE_ENV === 'production',");
fs.writeFileSync('apps/business/src/app/actions/auth.ts', authContent);

// And also fix personal app auth action
let personalAuth = fs.readFileSync('apps/personal/src/app/actions/auth.ts', 'utf8');
personalAuth = personalAuth.replace('httpOnly: false', 'httpOnly: true');
personalAuth = personalAuth.replace("secure: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL?.startsWith('https')", "secure: process.env.NODE_ENV === 'production'");
fs.writeFileSync('apps/personal/src/app/actions/auth.ts', personalAuth);

