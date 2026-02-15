# LinkVault High-Level Architecture

This diagram captures the main components and data flows for LinkVault.

```mermaid
flowchart LR
  U[User / Browser] --> UI[React UI]
  UI <--> AUTH[JWT + localStorage]

  UI -->|HTTP| API[Backend API - Bun + Express]
  API -->|CRUD| DB[MongoDB]

  UI -->|File Upload/Download| STORE[Appwrite Storage]
  UI -->|File Metadata| API
```

## Key Flows (Summary)
1. Auth: UI sends credentials to API, receives JWT, stores in localStorage.
2. Create Paste (Text): UI -> API -> MongoDB (Paste).
3. Create Paste (File): UI -> Appwrite Storage (file) -> API (file metadata) -> MongoDB (File, Paste).
4. View Paste: UI -> API (fetch, validate, protect, count) -> MongoDB; file downloads directly from Appwrite.
5. Dashboard: UI -> API -> MongoDB for user-specific pastes.
6. Delete: UI -> API -> MongoDB; files deleted in Appwrite when linked.
