import re

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("interface ReturnCreateFeatureProps {", "interface ReturnCreateFeatureProps {\n  inline?: boolean;")
content = content.replace("}: ReturnCreateFeatureProps) {", ", inline = false }: ReturnCreateFeatureProps) {")

content = content.replace("if (!open || !contractId) return;", "if ((!open && !inline) || !contractId) return;")

# Replace the render part
render_part = """  if (!contract) return null;

  if (inline) {
    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4">
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
    <Dialog open={open} onOpenChange={onOpenChange}>"""

content = re.sub(r'if \(!contract\) return null;\n\n  return \(\n    <Dialog open=\{open\} onOpenChange=\{onOpenChange\}>', render_part, content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)
