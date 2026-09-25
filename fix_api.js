const fs = require('fs');

let apiContent = fs.readFileSync('packages/utils/src/api.ts', 'utf8');

// Replace getToken function logic to just return null since we use proxy
apiContent = apiContent.replace(
  /private getToken\(\): string \| null \{[\s\S]*?return null;\n  \}/,
  'private getToken(): string | null {\n    return null; // Token handled by HttpOnly cookie and Middleware proxy\n  }'
);

// Replace fetch URL to use /api/proxy
// Instead of replacing all, let's just replace the constructor or request method
apiContent = apiContent.replace(
  /let url = `\$\{this\.baseURL\}\$\{endpoint\}`;/,
  `let url = \`\${this.baseURL}\${endpoint}\`;
    
    // Proxy client-side requests through Next.js middleware
    if (typeof window !== 'undefined') {
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        url = \`/api/proxy\${urlObj.pathname}\`;
      } else {
        url = \`/api/proxy\${endpoint.startsWith('/') ? endpoint : '/' + endpoint}\`;
      }
    }`
);

fs.writeFileSync('packages/utils/src/api.ts', apiContent);
