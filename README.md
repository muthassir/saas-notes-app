Multi-Tenant Notes App - Documentation
A MERN-stack application that supports multi-tenant notes with role-based access and subscription plans (Free/Pro). Admins can upgrade tenants to unlock Pro features.
Features

- Multi-tenant architecture (each company has its own notes).
- Role-based access: Admin and Member.
- Free vs Pro plan:
  * Free tenants are limited in features.
  * Admins can upgrade to Pro.
- JWT authentication (login & register).
- CRUD operations for notes.

Tech Stack

- Frontend: React, TailwindCSS, Axios
- Backend: Node.js, Express.js, MongoDB, JWT
- Database: MongoDB Atlas / Local MongoDB

Project Structure

backend/      → Node.js + Express API
frontend/     → React app

Setup Instructions
1. Clone Repo
git clone <repo-url>
cd project-folder
2. Backend Setup
cd backend
npm install
Create a .env file in backend/:

PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/notesapp
JWT_SECRET=supersecretkey

Start the backend:

npm start
3. Frontend Setup
cd frontend
npm install
Update frontend/src/api/api.js if deploying:
const API_URL = "http://localhost:3001"; // change when deployed
Run frontend:

npm run dev
Seeding Data
You can pre-load tenants and users with a seed script.
Run:

cd backend
node seed.js
Seeded Data
Tenants:
- Acme → Free Plan
- Globex → Pro Plan
Users (all users use password: password)
Email	Role	Tenant
admin@acme.test	Admin	Acme
user@acme.test	Member	Acme
admin@globex.test	Admin	Globex
user@globex.test	Member	Globex
Login Example

- Admin (Acme): admin@acme.test / password
- User (Globex): user@globex.test / password

Deployment
Frontend (Vercel)
Backend (Render)
