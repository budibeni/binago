import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/vehicles/VehiclesFeature.tsx", "r") as f:
    content = f.read()

# Add isAddOpen state
content = content.replace("const [editVehicle, setEditVehicle] = React.useState<Vehicle | null>(null);", "const [editVehicle, setEditVehicle] = React.useState<Vehicle | null>(null);\n  const [isAddOpen, setIsAddOpen] = React.useState(false);")

# Add handleAdd function
content = content.replace("const handleEdit = React.useCallback((vehicle: Vehicle) => {", "const handleAdd = React.useCallback(() => {\n    setIsAddOpen(true);\n  }, []);\n\n  const handleEdit = React.useCallback((vehicle: Vehicle) => {")

# Pass onAdd to VehicleTable
content = content.replace("onViewDetail={handleViewDetail}", "onAdd={handleAdd}\n          onViewDetail={handleViewDetail}")

# Render VehicleForm for add mode
content = content.replace("{!!editVehicle && (", "{(!!editVehicle || isAddOpen) && (")
content = content.replace("vehicle={editVehicle}", "vehicle={editVehicle || null}")
content = content.replace("open={!!editVehicle}", "open={!!editVehicle || isAddOpen}")
content = content.replace("setEditVehicle(null);\n            }", "setEditVehicle(null);\n              setIsAddOpen(false);\n            }")

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/features/core/vehicles/VehiclesFeature.tsx", "w") as f:
    f.write(content)
