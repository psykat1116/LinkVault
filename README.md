## 🎯 LinkVault provides a lightweight, secure pastebin alternative for developers to store and share text and code snippets instantly. It is made using [ReactJS](https://react.dev), [Tailwind CSS](https://tailwindcss.com) For Frontend, [Node JS](https://nodejs.org), [Express JS](https://expressjs.com) as Backend, [Typescript](https://typescriptlang.org) for type safety, [Appwrite](https://appwrite.io/) For Storing Files, [JWT](https://jwt.io/) for Authentication, [MongoDB](https://mongodb.com/) as our Database, [Mongoose](https://mongoosejs.com) as ORM, [bun](https://bun.com/) as Package Manager.

## i) Folder Structure
```bash
LinkVault/
│
├── README.md              # Project overview, setup, usage
├── .gitignore             # Files to ignore in git
│
├── backend/                  # Backend Code
│   ├── db/                   # MongoDB Connection
│   ├── controller/           # Router Controller
│   ├── router/               # Router Details
│   ├── schema/               # Database Schema
│   ├── jobs/                 # Background Jobs (cleanup)
│   ├── lib/                  # Shared Server-side Clients (Appwrite)
│   ├── type.ts               # Type Declarations
│   ├── .env.local            # All Backend environment Variable
│   ├── README.md             # Backend overview
│   ├── .gitignore            # Files to ignore in git
│   └── index.ts              # Root Backend File
│
├── src/                      # Source code
│   ├── components/           # All Components
│   ├── lib/                  # All Necessary Functions
│   ├── index.css             # Root CSS Functions
│   └── main.tsx              # Root Frontend File
│
├── data.ts                   # All Constant Data
│
├── .env.local                # All Frontend environment Variable
│
└── types.ts                  # All Types
```

## ii) Getting Started
First, Clone The Repo The Repository
```bash
git clone https://github.com/psykat1116/LinkVault.git
```

## iii) Install bun
It is recommended to use [bun](https://bun.com/) as it is lot more faster than npm. `you can still use npm if you don't want to install bun`
```bash
  curl -fsSL https://bun.sh/install | bash
```

## iv) Start The Server
- Start Backend Server
  ```bash
    cd LinkVault
    cd backend
    bun i // or use npm i
    bun run dev // or use npm run dev
  ```
- Run Frontend Server
  ```bash
    cd ..
    bun i // or use npm i
    bun run dev // or use npm run dev
  ```

## v) Setup The .env.local File
- For Backend create a .env.local file in `backend` folder with the given environment variable
```bash
  JWT_SECRET =
  DATABASE_URL =
  APPWRITE_ENDPOINT =
  APPWRITE_PROJECT_ID =
  APPWRITE_API_KEY =
```
- For Frontend create a .env.local file the root folder with the given environment variable
```bash
  VITE_APPWRITE_API_KEY = 
  VITE_APPWRITE_BUCKET_ID = 
  VITE_APPWRITE_PROJECT_ID = 
  VITE_APPWRITE_PROJECT_ENDPOINT = 
```

## vi) Setup MongoDB
Log In to the [MongoDB](https://mongodb.com/) and create a free cluster. Then from `connect` -> `compass` option you can get the url. but don't forgot the name of your database at end.
```bash
  DATABASE_URL = mongodb+srv://<user>:<password>@<cluster-url>/<dbname>
```

## vii) Setup Appwrite Storage
- Login Into The [Appwrite](https://appwrite.io/) Create a new project. From there you will get two enviromental variable.
```bash
  VITE_APPWRITE_PROJECT_ID = 
  VITE_APPWRITE_PROJECT_ENDPOINT = 
```

- Create a new API Key and select the `Storage` in the `Scope` section. After creation you will get another environmental variable.
```bash
  VITE_APPWRITE_API_KEY = 
```

- Finally create a new `bucket` in the `Storage` section and you will get the final environmental variable.
```bash
  VITE_APPWRITE_BUCKET_ID = 
```

- Then go to the newly created bucket settings and in the `Permissions Section` and add new `Any` role and check all operations(Create, Update, Read, Delete). Optionally you can change the `Maximum File Size` as 10MB for futher safety.

## Design Decisions
1. React + Vite for fast local development and a lightweight frontend build pipeline.
2. Bun runtime and package manager to keep install and dev cycles fast.
3. Express + Mongoose for a simple, familiar REST API and MongoDB modeling.
4. Appwrite Storage for file blobs, with the backend storing only file metadata.
5. JWT-based auth with client-side storage to keep the API stateless.
6. MongoDB TTL index (`expires: 0`) on `Paste.expiresAt` for automatic cleanup of expired text pastes — safe because paste documents carry no Appwrite blob.
7. The `File` schema intentionally has **no** MongoDB TTL index. Letting MongoDB auto-delete File documents would bypass the Appwrite deletion call and leave orphaned blobs. The background cleanup job is the sole owner of the File lifecycle.
8. Server-side Appwrite client (`node-appwrite`) so the backend can delete blobs directly on paste expiry, download-limit hit, or manual delete — the frontend is no longer responsible for cleanup.
9. Background cleanup job runs every 60 seconds to purge expired File records: it calls `storage.deleteFile` first, then removes the MongoDB document. If Appwrite is unreachable the MongoDB record is preserved so the next cycle can retry; a 404 response means the blob is already gone and the record is cleaned up immediately.

## Assumptions and Limitations
1. File storage permissions are configured in Appwrite to allow the required operations.
2. Authentication tokens are stored in `localStorage`, which is convenient but not as secure as HttpOnly cookies.
3. The backend API is configured for `http://localhost:5173` CORS by default.
4. Expiration and view/download limits are enforced server-side on read. The backend attempts to delete the Appwrite blob first; if that succeeds (or returns 404), the File document is removed from MongoDB. If Appwrite is unreachable, the File document is kept for the cleanup job to retry — the paste is still deleted and a 410 is returned to the caller.
5. The server-side Appwrite API key (`APPWRITE_API_KEY`) must have Storage delete scope — without it the cleanup job and all server-side file deletions will fail to remove blobs.
6. The cleanup job polls every 60 seconds; files can linger in Appwrite for up to 60 seconds after their `expiresAt` timestamp.
7. **Existing deployments:** if the server was ever run before this change, a TTL index named `expiresAt_1` may already exist on the `files` collection in MongoDB Atlas. Drop it manually to prevent MongoDB from bypassing the cleanup job: `db.files.dropIndex("expiresAt_1")`.
---