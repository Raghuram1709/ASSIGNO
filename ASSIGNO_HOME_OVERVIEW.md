# ASSIGNO Application Overview

## 1. App Purpose and Value Proposition
ASSIGNO is a project management and team collaboration platform designed to streamline project creation, member onboarding, task assignment, progress tracking, and notifications.

This application is built to support small teams and project leads who need a fast, intuitive interface for:
- launching and organizing projects
- inviting collaborators and defining roles
- assigning tasks with deadlines
- tracking project progress at a glance
- staying informed with notifications
- switching between light and dark modes

## 2. Primary Workflow
### 2.1 Authentication and User State
- Users sign up or log in via the `/signup` and `/login` pages.
- After login, the app saves a token to `localStorage` or `sessionStorage`.
- On every app render, `App.jsx` checks for a token and dispatches `fetchCurrentUser(token)` to restore the authenticated session.
- Protected routes require authentication and redirect unauthenticated users to login.

### 2.2 Navigation and Global Layout
- `MainLayout.jsx` wraps the authenticated app, rendering the global `NavBar` and nested page content.
- `AppRoutes.jsx` defines these routes:
  - `/` → `Home` (currently a placeholder landing page)
  - `/projects` → `Projects` page with project list and creation modal
  - `/projects/:projectCode` → `ProjectDashboard` for a specific project
  - `/notifications` → notifications page
- The navbar includes the brand logo, notification bell, theme toggle, and responsive mobile menu.

### 2.3 Projects Page
- `Projects.jsx` fetches the authenticated user's project list using `fetchProjects(token)`.
- Users can open a modal to create a new project with:
  - title
  - description
  - company
  - deadline
- Each `ProjectCard` displays a project summary and links to the dashboard.
- If a project has not yet had members added, the card encourages the lead to add members.

### 2.4 Project Dashboard and Team Workflow
- `ProjectDashboard.jsx` loads detailed project data from `fetchProjectByCode(projectCode, token)`.
- It also fetches members and tasks for the project.
- The dashboard presents:
  - project details: title, company, deadline, lead
  - team progress with `CircularProgressBar`
  - project stats: team members, total tasks, completed tasks, open tasks via `ProjectStats`
  - member cards and task panels
- Lead-specific workflows:
  - add members using `AddMembers.jsx`
  - assign tasks using `AssignTask.jsx`
  - select a member to inspect and assign tasks directly
- Member-specific workflow:
  - see personal assigned tasks under "My Tasks"
  - view tasks filtered by assigned status and role

### 2.5 Member Management
- The add members modal supports multiple entries and role selection.
- Member roles include common team positions such as designer, developer, tester, analyst, and architect.
- Once members are added, they appear in the dashboard list and can be selected by the lead.

### 2.6 Task Assignment and Tracking
- Task assignment is handled through the dashboard using `AssignTask.jsx`.
- Tasks include:
  - title
  - deadline
- Tasks are assigned to a project and a specific team member.
- Dashboard views differentiate between project lead views and member views:
  - leads can assign and view selected member tasks
  - team members see only their own assigned tasks

### 2.7 Notifications
- The navbar notification bell displays unread count.
- Notifications are fetched every 30 seconds when a valid token exists.
- The dropdown shows the latest unread items and allows clicking to navigate to the related project.
- Users can also view the full notifications page.

### 2.8 Theme System
- Theme state is managed with Redux and `ThemeProvider.jsx`.
- The app supports:
  - system preference sync via `prefers-color-scheme`
  - a manual toggle button in the navbar
  - persistent selection stored in `localStorage`
- Dark mode is applied by toggling the `.dark` class on `document.documentElement`.

## 3. Frontend Architecture and Data Flow
### 3.1 Redux and Slices
The application uses Redux Toolkit to manage state for:
- authentication (`authSlice`)
- theme toggling (`themeSlice`)
- projects (`projectSlice`)
- members (`memberSlice`)
- tasks (`taskSlice`)
- notifications (`notificationSlice`)

### 3.2 Thunks and API Layers
Frontend actions are executed through thunks that call API helper modules:
- `authThunk` → `authAPI`
- `projectThunk` → `projectAPI`
- `memberThunk` → `memberAPI`
- `taskThunk` → `taskAPI`
- `notificationThunk` → `notificationAPI`

This provides a clean separation between UI components and network calls.

### 3.3 Backend Routes and Services
The backend exposes these main endpoints:
- `POST /login` → login
- `POST /signup` → sign up
- `GET /me` → current user
- `POST /projects` → create project
- `GET /projects` → get user projects
- `GET /projects/:projectCode` → project details
- `POST /projects/:projectCode/members` → add members
- `GET /projects/:projectCode/members` → get project members
- `GET /projects/:projectCode/tasks` → get project tasks
- `POST /assign` → assign tasks
- `GET /notifications` → get notifications
- `PATCH /notifications/:notificationId/read` → mark one notification read
- `PATCH /notifications/read-all` → mark all notifications read

The backend controllers are thin wrappers around service modules that handle business logic and database interactions.

## 4. Global CSS and Color Palette
ASSIGNO uses a branded palette built around natural deep green and warm accent tones.

### 4.1 Core Colors
- `--milk`: #ECE5E7 — soft off-white background
- `--pine`: #00311F — deep evergreen primary brand color
- `--rust`: #A63B12 — warm secondary accent
- `--copper`: #B65A1B — tertiary accent

### 4.2 Backgrounds
- `--bg-primary`: main page background
- `--bg-secondary`: secondary surfaces
- `--bg-card`: card panels and glass surfaces
- `--glass-bg`: translucent glass overlay backgrounds
- `--glass-border`: translucent border for glass UI

### 4.3 Text Palette
- `--text-primary`: primary heading / body color
- `--text-secondary`: supportive text
- `--text-muted`: muted labels and hints

### 4.4 Accent and Gradient System
- `--accent-primary`: brand accent from `--pine`
- `--accent-secondary`: `--rust`
- `--accent-tertiary`: `--copper`
- `--gradient-primary`: dark green gradient for buttons and hero styling
- `--gradient-rust`: warm rust accent gradient
- `--gradient-hero`: hero background gradient for onboarding or banner sections

### 4.5 Shadows and Motion
- `--shadow-primary`: soft shadow for depth
- `--box-shadow`: subtle card shadow
- transitions are applied globally for background, color, border, and shadow to create a polished UI experience.

### 4.6 Dark Mode Tokens
The dark theme retains the same brand colors but shifts:
- primary background to black and deep green
- cards to dark glass surfaces
- text to bright ivory
- stronger glow accent overlays for atmosphere

## 5. Homepage Content Strategy
### 5.1 Advanced Workflows to Highlight
The ASSIGNO homepage should feel like a premium SaaS experience, not a generic task manager. Highlight the platform's advanced collaboration engine with workflow-specific features:
- **Submission and Review Workflow**
  - Members submit completed work directly inside each project.
  - Leads review submission requests, approve or reject with feedback.
  - Approved work updates project progress automatically.
  - Review requests and approval activity are surfaced in the dashboard preview.
- **Built-in Communication**
  - Project-wide announcements and updates keep the whole team aligned.
  - Member-specific messages let teams communicate inside the workspace.
  - Communication is tied directly to projects and tasks, so context is always maintained.
- **Smart Notifications**
  - Alerts for task assignments and deadline changes.
  - Updates on submission reviews and approval status.
  - Team activity and member onboarding alerts.
  - Project communication alerts for announcements and feedback.
- **Role-Based Experience**
  - Dedicated Lead dashboard with assignment, review, and team management controls.
  - Dedicated Member workflow for personal tasks, submissions, and updates.
  - Different actions appear based on responsibilities and permissions.
- **Dashboard Preview**
  - The hero section should look like a polished SaaS product dashboard preview.
  - Include visuals for project statistics, task management, team members, progress tracking, notifications, and review requests.
  - Emphasize real dashboards instead of generic cards.

### 5.2 Recommended User-facing Sections
A strong homepage should explain the app in a concise, confident way:
1. Hero statement: `Run projects with built-in review, communication, and role-based intelligence.`
2. Core benefits:
   - `Create new projects instantly with deadline planning`
   - `Secure authentication and role-based access control`
   - `Role-specific dashboards for Leads and Members`
   - `Submit work, review requests, and track approvals`
   - `Stay updated with smart project notifications`
   - `Communicate clearly inside each project`
3. Primary workflow callouts:
   - `Create a new project`
   - `Invite team members, assign roles, and onboard collaborators`
   - `Assign tasks and receive submission requests`
   - `Review work, give feedback, and update progress`
4. Feature highlights:
   - premium, project-driven dashboard experience
   - submission & review workflow
   - communication inside projects
   - role-based lead and member experiences
   - smart notifications for every update
   - authenticated and authorized access control
   - theme switching and polished visuals

### 5.3 Suggested Homepage Messaging
Use a premium hero block with supporting copy:
- Headline: `ASSIGNO — Project workflows designed for modern teams and review-driven delivery.`
- Subheading: `Build projects, assign work, submit results, review outcomes, and keep teams aligned from a single dashboard.`
- Feature bullets:
  - `Professional project creation with deadlines and context`
  - `Submission and review workflow with feedback loops`
  - `Built-in project communication and announcements`
  - `Smart notifications for assignments, reviews, and team updates`
  - `Dedicated lead and member experiences`
  - `Dark/light mode with premium visual polish`

### 5.4 Visual and UX Recommendations
- Use the `--gradient-hero` background on the homepage to create an upscale first impression.
- Show a professional dashboard preview in the hero section with real use cases:
  - project statistics overview
  - task management panels
  - team members list
  - progress tracking gauge
  - notification alert preview
  - review requests section
- Present feature groups in glass-like card panels using `--glass-bg`.
- Use a strong call to action such as `View Dashboard`, `Start a Project`, or `See Your Team Workflow`.
- Position the homepage as the entry point to a collaborative, review-centric project platform instead of a basic to-do list.

## 6. App Strengths and User Impression
ASSIGNO communicates confidence through:
- a clean desktop-first design system
- rich interactive dashboards and modal experiences
- smart theming and polished transitions
- strong backend support for project, task, member, and notification workflows

### 6.1 Why this app feels valuable
- It reduces onboarding friction by grouping essential project actions into one dashboard.
- It gives team leads clear control over tasks and members.
- It helps everyone stay aligned with status cards and notifications.
- It supports a modern interface with glassmorphism and gradient accents.

## 7. Implementation Notes for Homepage Content
Since the current `Home.jsx` page is a placeholder, this markdown can be used to replace its contents with a proper landing experience.

### Recommended structural homepage blocks
- Hero section with headline, description, and CTA
- Feature cards summarizing project management, members, tasks, progress, notifications
- Workflow steps with icons or visuals
- Theme toggle highlight and mobile/navigation preview
- Team benefit statement and call to action

---

### Suggested homepage copy example
> ASSIGNO is your workspace for creating projects, coordinating team members, and assigning deadlines with confidence.
>
> Create projects instantly, invite collaborators, assign tasks, and monitor progress in a single dashboard. Stay focused with onboarding, notifications, and a calm dark/light interface designed for high-performing teams.

## 8. Existing pages to extend
The current app already includes the following page components that can be surfaced on the homepage:
- `AssignoFrontend/src/pages/Home.jsx`
- `AssignoFrontend/src/pages/Projects.jsx`
- `AssignoFrontend/src/pages/ProjectDashboard.jsx`
- `AssignoFrontend/src/pages/NotificationPage.jsx`
- `AssignoFrontend/src/components/NavBar.jsx`
- `AssignoFrontend/src/components/RegisterProject.jsx`
- `AssignoFrontend/src/components/AddMembers.jsx`
- `AssignoFrontend/src/components/AssignTask.jsx`

Use these components to reinforce the product story on the homepage and make onboarding feel natural.
