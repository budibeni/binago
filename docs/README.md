# ADATRACK - Dokumentasi Project

Folder `/docs` berisi seluruh dokumentasi resmi project ADATRACK.

## Urutan membaca

Untuk Antigravity AI:

```text
/AGENTS.md
â†"
/docs/README.md
â†"
Dokumentasi yang relevan
â†"
/docs/tasks/TASK-XX-*.md
```

`AGENTS.md` adalah instruksi utama untuk perilaku AI.  
File ini adalah indeks dokumentasi project, bukan pengganti `AGENTS.md`.

## Dokumentasi utama

```text
project-overview.md
architecture.md
folder-structure.md
development-rules.md
business-rules.md
design-system.md
ui-guidelines.md
database-design.md
api-standard.md
coding-standard.md
deployment.md
task-roadmap.md
```

## Task

Seluruh Task berada di:

```text
/docs/tasks/
```

Urutan Task:

```text
TASK-01-foundation.md
TASK-02-design-system.md
TASK-03-application-shell.md
TASK-04-home.md
TASK-05-tracking.md
TASK-06-vehicles.md
TASK-07-drivers.md
TASK-08-deliveries.md
TASK-09-maintenance.md
TASK-10-devices.md
TASK-11-geofences.md
TASK-12-reports.md
TASK-13-administration.md
TASK-14-production-readiness.md
```

## Prinsip project saat ini

- Dokumentasi menggunakan Bahasa Indonesia.
- Identifier teknis menggunakan English.
- Label UI default menggunakan Bahasa Indonesia.
- ADATRACK Business dan ADATRACK Personal adalah application terpisah.
- Scope saat ini berfokus pada frontend.
- Data yang digunakan adalah dummy/mock data.
- Jangan membuat production backend, database, API, GPS engine, atau integrasi perangkat nyata pada scope frontend saat ini.
- Gunakan dokumentasi sebagai acuan sebelum mengambil keputusan implementasi.

Untuk aturan kerja Antigravity AI, selalu baca `/AGENTS.md`.
