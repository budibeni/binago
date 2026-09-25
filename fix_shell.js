const fs = require('fs');
let content = fs.readFileSync('apps/business/src/components/BusinessShellLayout.tsx', 'utf8');

// Remove DUMMY_USER definition
content = content.replace(/const DUMMY_USER: UserProfile = \{\s*id: 'user-001',\s*name: 'Budi Setiawan',\s*email: 'budi@example\.com',\s*role: 'ADMIN',\s*\};\s*/g, '');

// Remove dummy user assignment
content = content.replace("const currentUser = user || DUMMY_USER;", "const currentUser = user;\n\n  React.useEffect(() => {\n    if (!currentUser && !currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {\n      window.location.href = '/login';\n    }\n  }, [currentUser, currentPath]);");

// Clean up duplicate listener in handleThemeChange
content = content.replace(
  /      const handleUnauthorized = \(\) => \{\n        logout\(\)\.then\(\(\) => \{\n          window\.location\.href = '\/login';\n        \}\);\n      \};\n      window\.addEventListener\('auth:unauthorized', handleUnauthorized\);\n\n    return \(\) => window\.removeEventListener\('auth:unauthorized', handleUnauthorized\);\n  \}, \[\]\);/g,
  '  }, []);'
);

// We replaced it three times, so the one in `useEffect` is also removed! We need to add it back to `useEffect`.
content = content.replace(
  /  React\.useEffect\(\(\) => \{([\s\S]*?)  \}, \[\]\);/,
  `  React.useEffect(() => {$1
    const handleUnauthorized = () => {
      logout().then(() => {
        window.location.href = '/login';
      });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);`
);

// If currentUser is null, we shouldn't render the layout (unless auth route)
content = content.replace(
  /  const isAuthRoute = currentPath\.startsWith\('\/login'\) \|\| currentPath\.startsWith\('\/register'\);/,
  "  const isAuthRoute = currentPath.startsWith('/login') || currentPath.startsWith('/register');\n\n  if (!currentUser && !isAuthRoute) return null;"
);

fs.writeFileSync('apps/business/src/components/BusinessShellLayout.tsx', content);
