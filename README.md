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
    bun i
    bun run dev
  ```
- Run Frontend Server
  ```bash
    cd ..
    bun i
    bun run dev
  ```

## v) Setup The .env.local File
- For Backend create a .env.local file in `backend` folder with the given environment variable
```bash
  JWT_SECRET =
  DATABASE_URL =
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

## 🎯 Tell Me You Face Any Problem During The Development & Production Into My Email From This [Profile](https://github.com/psykat1116) Or Tell Me In Issue Section. Tell Me You Want To Suggest Any Update. 