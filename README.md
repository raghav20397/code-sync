# CodeSync 

**CodeSync** is a real-time collaborative code editor built with T3. It allows multiple users to edit code simultaneously in the same room, seeing each other's cursors and changes instantly—just like Google Docs for code.

## Features

- **Real-time Collaboration:** Powered by **Liveblocks** and **Yjs** for sub-millisecond latency.
- **Multiplayer Cursors:** See exactly where other users are typing.
- **Authentication:** Secure login via **Clerk** (Google, GitHub, Email).
- **Room Management:** Create, Join, Rename, and Delete coding rooms.
- **Language Support:** Switch between TypeScript, Python, Java, Go, and more.
- **Modern UI:** Built with **Tailwind CSS**.
- **Type Safety:** Full end-to-end type safety with **tRPC**.
- **Coming Soon..:** Support for running the code with **Piston API**.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [tRPC](https://trpc.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Auth:** [Clerk](https://clerk.com/)
- **Real-time:** [Liveblocks](https://liveblocks.io/) & [Yjs](https://yjs.dev/)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code core)
