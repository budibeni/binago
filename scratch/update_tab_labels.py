import re

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'r') as f:
    content = f.read()

content = content.replace("Menunggu Pengembalian", "Aktif")
content = content.replace("Riwayat\n            </button>", "Selesai\n            </button>")

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
