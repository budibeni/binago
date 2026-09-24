import re

with open("/home/arfian107/Projects/adatrack/admin/src/app/(protected)/users/page.tsx", "r") as f:
    content = f.read()

# Add header
content = re.sub(
    r'<th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:pl-6">Email</th>',
    '<th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:pl-6">Email</th>\n                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tenants</th>',
    content
)

# Add colSpan=6 to loaders
content = re.sub(
    r'colSpan=\{5\}',
    'colSpan={6}',
    content
)

# Add table data
td_replacement = """                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                        {user.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                        {user.tenants && user.tenants.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.tenants.slice(0, 2).map((t: string) => (
                              <span key={t} className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                {t}
                              </span>
                            ))}
                            {user.tenants.length > 2 && (
                              <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                +{user.tenants.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Global only</span>
                        )}
                      </td>"""

content = re.sub(
    r'                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">\n                        \{user\.email\}\n                      </td>',
    td_replacement,
    content
)

with open("/home/arfian107/Projects/adatrack/admin/src/app/(protected)/users/page.tsx", "w") as f:
    f.write(content)

print("SUCCESS")
