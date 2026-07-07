# Notice Board Application

A production-quality CRUD application built with Next.js 15, TailwindCSS, TypeScript, Prisma, and MySQL.

## Features

- **Full CRUD**: Create, Read, Update, Delete notices end-to-end
- **Server-Side Rendering**: First page load is instant via `getServerSideProps` — no loading spinners
- **Load More Pagination**: Fetches notices in batches of 10 for scalability
- **Urgent-first Ordering**: Done at the database level via Prisma `orderBy`, not client-side sorting
- **Server-Side Validation**: All input validation runs inside API routes, not the browser
- **Delete Confirmation**: A modal dialog prevents accidental deletion
- **Responsive Design**: Fully responsive card layout for desktop and mobile
- **Dark Mode**: Automatic system-level dark mode support
- **Axios**: All client-side HTTP requests use Axios for clean error handling

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 15 (Pages Router)        |
| Language       | TypeScript                        |
| Styling        | TailwindCSS v4                    |
| Database ORM   | Prisma                            |
| Database       | TiDB Cloud (MySQL-compatible)     |
| HTTP Client    | Axios                             |
| Hosting        | Vercel (Hobby tier)               |

---

## How to run the project locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd notice-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up a hosted database**
   - Go to [TiDB Cloud](https://tidbcloud.com/) and create a free **Serverless** cluster.
   - Click **Connect** on your cluster, choose the **Prisma** driver, and copy the connection string.
   - Create a `.env` file from the example:
     ```bash
     cp .env.example .env
     ```
   - Paste the connection string into `DATABASE_URL` in `.env`. Make sure it ends with `?sslaccept=strict`.

4. **Push the schema to the database and generate the Prisma Client**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## Deployment to Vercel

1. Push the code to a **public** GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings.
4. Set the **Build Command** to:
   ```
   npx prisma generate && next build
   ```
5. Deploy.

---

## One thing I would improve with more time

With more time I would add **image upload support via cloud storage** (e.g. Cloudinary or S3). The schema already has an optional `image` field, but a real implementation would need a file-upload API route, cloud storage integration, and image optimisation — which was outside the scope of the initial build. I would also add Zod-based schema validation shared between the client and server for type-safe, DRY validation.

---

## Where and how AI was used

AI (Google Gemini) was used extensively during development:

1. **Scaffolding**: Generated the Next.js Pages Router project structure and installed all dependencies (Prisma, TailwindCSS, Axios, Lucide React).
2. **Database layer**: Wrote the Prisma schema with the correct enums (`Category`, `Priority`) and the `Notice` model, plus the singleton client pattern.
3. **API routes**: Generated server-side API routes (`pages/api/notices/`) with proper HTTP methods, input validation, pagination (`skip`/`take`), and Urgent-first `orderBy`.
4. **UI components**: Built all React components (`NoticeCard`, `NoticeForm`, `DeleteModal`, `Layout`) with responsive Tailwind styling, animations, and dark-mode support.
5. **Performance**: Migrated to `getServerSideProps` for instant SSR, added "Load More" pagination, and switched all client requests to Axios.
6. **Refinement**: Reviewed the assignment rubric line-by-line to ensure compliance with Pages Router, server-side validation, database-level ordering, and the required README sections.
