# Todo App

A modern todo application built with Next.js, MongoDB, and Firebase Authentication.

## Features

- User authentication with Firebase
- Create and manage todos
- Date-based organization
- Responsive design with Tailwind CSS
- Modern UI components with shadcn/ui
- Form validation with Zod and React Hook Form

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Package Manager:** pnpm


## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root directory with the following structure:
   ```properties
   # MongoDB
   MONGO_DB="your_mongodb_connection_string"

   # Firebase Client
   NEXT_PUBLIC_API_KEY="your_api_key"
   NEXT_PUBLIC_AUTH_DOMAIN="your_auth_domain"
   NEXT_PUBLIC_PROJECT_ID="your_project_id"
   NEXT_PUBLIC_STORAGE_BUCKET="your_storage_bucket"
   NEXT_PUBLIC_MESSAGING_SENDER_ID="your_sender_id"
   NEXT_PUBLIC_APP_ID="your_app_id"
   NEXT_PUBLIC_MEASUREMENT_ID="your_measurement_id"

   # Firebase Admin
   FIREBASE_ADMIN_API_KEY="your_private_key"
   FIREBASE_ADMIN_CLIENT_EMAIL="your_client_email"
   ```
4. Start the development server:
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
