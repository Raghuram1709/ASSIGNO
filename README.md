# ASSIGNO

ASSIGNO is a robust, full-stack collaborative project management and task assignment platform. Designed to help teams effortlessly create projects, assign roles, distribute tasks, and track progress all from an intuitive, Glassmorphism-styled workspace.

Live Deployment: [https://assigno-three.vercel.app/](https://assigno-three.vercel.app/)

---

## Features

- **Role-Based Workspaces**: Distinguish between Projects You Lead and Projects You Contribute To.
- **Dynamic Task Management**: Create tasks, assign deadlines, set priority levels, and manage review cycles.
- **Interactive Dashboards**: Real-time project statistics and beautiful cascading UI animations.
- **Task Submissions**: Dedicated flows for team members to submit work and leads to approve or reject them.
- **Notifications**: Integrated, date-grouped notification system keeping you updated on project activity.
- **Premium UI**: Crafted with a custom "Glass Canvas" aesthetic featuring smooth micro-animations.

---

## Technology Stack

**Frontend**
- React 19 (via Vite)
- Redux Toolkit (State Management)
- React Router (Navigation)
- Vanilla CSS with CSS Variables for theming
- Lucide React (Icons)

**Backend**
- Node.js & Express 5
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) & bcrypt (Authentication)
- Cloudinary & Multer (Asset storage)

---

## Project Structure

ASSIGNO is set up as a monolithic workspace containing both the frontend and backend applications:

```text
ASSIGNO/
├── AssignoFrontend/       # React 19 Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux Toolkit slices and thunks
│   │   ├── pages/         # Full page routing components
│   │   └── styles/        # Global and specific CSS files
│   └── package.json
│
├── assignoBackend/        # Node.js Express server
│   ├── src/
│   │   ├── controllers/   # Route request handlers
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routes/        # Express API endpoints
│   │   └── middleware/    # Auth and error handling
│   └── package.json
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or Atlas connection string)
- **Git**

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Raghuram1709/ASSIGNO.git
cd ASSIGNO
```

**2. Setup the Backend**
```bash
cd assignoBackend
npm install
```
Create a `.env` file in the `assignoBackend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
Start the backend server:
```bash
npm run dev
```

**3. Setup the Frontend**
Open a new terminal window:
```bash
cd AssignoFrontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

**4. View the App**
Open your browser and navigate to `http://localhost:5173`.

---

## Security & Environment Notes
Ensure that you **never** commit your `.env` files. The root `.gitignore` is already configured to prevent this. 

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
