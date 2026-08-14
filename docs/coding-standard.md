# ADATRACK â€” Coding Standard

## 1. Language

Source code menggunakan TypeScript dan English.

## 2. Type Safety

Hindari `any` jika tidak diperlukan.

Gunakan type yang jelas.

## 3. Components

Component harus memiliki API yang jelas dan tidak memiliki business logic jika bersifat generic.

## 4. Naming

```text
PascalCase â†’ component/type
camelCase â†’ variable/function
UPPER_SNAKE_CASE â†’ constant tertentu jika sesuai kebutuhan
kebab-case â†’ file/route yang memang mengikuti convention
```

## 5. Styling

Gunakan Tailwind CSS.

## 6. State

Jangan membuat global state tanpa kebutuhan.

## 7. Error

Jangan menelan error tanpa alasan.

## 8. Maintainability

Utamakan code yang mudah dibaca dibanding abstraction yang terlalu kompleks.
