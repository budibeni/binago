import re

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

# We need to change the inline rendering logic
inline_fix = """  if (inline) {
    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (errorMsg) return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4 shadow-sm p-8 text-center">
        <p className="text-danger font-bold mb-2">Gagal Memproses</p>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
      </div>
    );
    if (!contract) return null;
    return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4 shadow-sm">
        <ReturnForm
          contract={contract}
          itemsToReturn={itemsToReturn}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          layout="default"
        />
      </div>
    );
  }"""

content = re.sub(r'  if \(inline\) \{.*?\n    \);\n  \}', inline_fix, content, flags=re.DOTALL)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
