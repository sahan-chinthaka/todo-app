# Todo App

A modern todo application built with Next.js, MongoDB, and Firebase Authentication.

## Features

- User authentication with Firebase
- Create and manage todos
- Date-based organization
- Responsive design with Tailwind CSS
- Modern UI components with Radix UI
- Form validation with Zod and React Hook Form

## Tech Stack

- **Framework:** Next.js 15
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Package Manager:** pnpm

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Usage

- Access http://localhost:3000 to view your todos.
- Use the “Add Todo” form to create items.
- Filter tasks by clicking the “Today” or “Tomorrow” tabs.

## Deployment

For production builds:

```bash
pnpm build
pnpm start
```

Deploy on any Node.js-capable service or use a platform like Vercel.
