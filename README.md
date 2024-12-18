I had an issue with getting vite to work with docker so there will be an extra step unfortunatley

Follow these commands to stand up project

- docker compose build --no-cache
- docker compose up
- cd frontend
- npm install
- npm run dev

You should see data get imported to postgres by Prisma.

Go to http://localhost:5173/

Please click around in the UI and try it out!
