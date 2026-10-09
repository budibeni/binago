with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

import re

# Remove 'if (!open) return null;' if it conflicts with inline
content = content.replace("if (!open) return null;", "if (!open && !inline) return null;")

# Re-write the render part to handle inline vs dialog
render_logic = """  if (!contract) return null;

  if (inline) {
    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4 shadow-sm">
        {errorMsg && <div className="p-4 bg-danger/10 text-danger text-sm font-semibold">{errorMsg}</div>}
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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="h-full max-h-[100vh] w-full max-w-[1200px] ml-auto p-0 flex flex-col rounded-none sm:rounded-l-2xl after:hidden border-l border-border/50 bg-background/95 backdrop-blur-sm" hideCloseButton>"""

# Find the start of the return statement
content = re.sub(r'  return \(\n    <Dialog open=\{open\} onOpenChange=\{onOpenChange\}.*?>', render_logic, content, flags=re.DOTALL)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
