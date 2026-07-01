# ASSIGNO Frontend Architecture & Design Documentation

This document serves as the comprehensive system reference for the ASSIGNO frontend application. It details the technical structure, layout design rules, routing schema, state flows, styling tokens, and component specifications of the project.

---

## 1. Project Structure

The frontend application code is contained within the `AssignoFrontend` directory. Below is the full directory mapping for the `src` folder:

```text
src/
 ├── app/                      # Redux Store configuration and hooks
 │    ├── reduxHooks.js        # Exports typed Redux selector and dispatch wrappers
 │    └── store.js             # Root Redux store registering all app reducers
 ├── assets/                   # Static imagery and visual elements
 │    └── dashboard-preview.png # SaaS preview mockup illustration
 ├── components/               # Modular components and nested blocks
 │    ├── landing/             # Placeholder folder for future landing sub-components
 │    ├── notificationComponents/ # Notification subsystem components
 │    │    ├── NotificationBell.jsx
 │    │    ├── NotificationCard.jsx
 │    │    └── NotificationDropdown.jsx
 │    ├── AddMembers.jsx       # Modal to invite users and assign roles
 │    ├── AssignTask.jsx       # Modal to specify task details and deadlines
 │    ├── CircularProgressBar.jsx # Concentric SVG progress indicator
 │    ├── CustomSelect.jsx     # Reusable custom dropdown panel with click-outside hooks
 │    ├── LeadUpdatePanel.jsx  # Lead workspace selector for review / announcements
 │    ├── MemberCard.jsx       # Team collaborator summary element
 │    ├── MemberUpdatePanel.jsx # Member task submit and history wrapper
 │    ├── NavBar.jsx           # Global header navigation and responsive mobile panel
 │    ├── PasswordInput.jsx    # Textbox wrapping secure show/hide password buttons
 │    ├── ProjectCard.jsx      # Summary dashboard preview card
 │    ├── ProjectStats.jsx     # Four-column stats counter wrapper
 │    ├── RegisterProject.jsx  # Modal to create a new project
 │    ├── ReviewRequest.jsx    # Displays pending submission review cards
 │    ├── ReviewSubmission.jsx # Feedback and status manager for leads
 │    ├── SubmissionHistory.jsx # Pagination list for member submissions
 │    ├── SubmissionHistoryCard.jsx # Brief card representing submitted tasks
 │    ├── SubmissionHistoryDetails.jsx # Detailed log of reviews and notes
 │    ├── ThemeProvider.jsx    # Mounts listener for theme switches
 │    ├── communicationPanel.jsx # Chat/announcements broadcast panel
 │    └── TaskCard.jsx         # Card to render task information and deadline date
 ├── context/                  # Folder placeholder for React context files
 ├── features/                 # Redux Slices, asynchronous thunks, and API helpers
 │    ├── auth/                # Sign-up, login, and localStorage authentication sync
 │    ├── commincations/       # Chat messaging thunks and backend API services
 │    ├── member/              # Fetching and registering team project participants
 │    ├── notifications/       # Polling, fetching, and reading user alerts
 │    ├── project/             # Creating, retrieving, and updating projects
 │    ├── submissions/         # Task submission and lead validation thunks
 │    ├── task/                # Assigning and polling individual task items
 │    └── theme/               # Dark and light mode toggle slices
 ├── layouts/                  # Layout wrappers defining nested routes
 │    ├── AuthLayout.jsx       # Wrapper for login and signup routes
 │    └── MainLayout.jsx       # Core wrapper injecting NavBar and pages
 ├── pages/                    # Route-level page components
 │    ├── Home.jsx             # Placeholder homepage (currently a basic stub)
 │    ├── Login.jsx            # Sign-in form page
 │    ├── SignUp.jsx           # Sign-up form page
 │    ├── Projects.jsx         # Grid view listing all projects
 │    ├── ProjectDashboard.jsx # Core project dashboard interface
 │    └── NotificationPage.jsx # Full-feed notification log
 ├── routes/                   # Routing configuration
 │    ├── AppRoutes.jsx        # Routing list and layouts mapper
 │    └── ProtectedRoute.jsx   # Route guard validating token presence
 ├── services/                 # Common service definitions
 │    └── axiosInstance.js     # Axios client configuration with backend base URL
 ├── styles/                   # Global and component-level CSS sheets
 │    ├── auth.css             # Styles for Login and SignUp pages
 │    ├── customselect.css     # Dropdown element style details
 │    ├── memberCard.css       # Member list tiles styles
 │    ├── navbar.css           # Global header navigation styling
 │    ├── progressbar.css      # Progress indicator and SVG circle animations
 │    ├── projectdashboard.css # Grid configurations and modal styling for dashboards
 │    ├── projects.css         # Styling for project list grid and creation modal
 │    └── updatePanel.css      # Style tokens for workspace tabs, history, and chat
 ├── App.jsx                   # Entry app router mounting component
 ├── global.css                # Global variables, fonts, reset, and scrollbar CSS
 └── main.jsx                  # React DOM bootstrap entry point
```

For every folder, here is a brief explanation of its purpose:
* **`app/`**: Holds Redux configuration, store bootstrapping, and typed hooks definitions.
* **`assets/`**: Contains static visual resources, images, and mockup graphics.
* **`components/`**: Features components that form the building blocks of the UI.
* **`context/`**: Reserved for raw React Context modules.
* **`features/`**: Groups core client-side modules by feature domains containing slices, thunks, local storage interactions, and API wrappers.
* **`layouts/`**: Outlines visual wrapper components that define custom routing templates via `<Outlet />`.
* **`pages/`**: Houses full page views mounted directly onto primary routing paths.
* **`routes/`**: Handles application route configurations and authorization security filters.
* **`services/`**: Holds common backend connections and axios client instances.
* **`styles/`**: Centralizes styling templates matching components and layouts.

---

## 2. Routing Architecture

Routing is powered by `react-router-dom` (using `<BrowserRouter>` mounted inside [main.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/main.jsx)).

### Routing Flow and Structure
All routes are declared in [AppRoutes.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/routes/AppRoutes.jsx) as follows:

```jsx
<Routes>
  <Route element={<AuthLayout />}>
    <Route path='/login' element={<Login />} />
    <Route path='/signup' element={<SignUp />} />
  </Route>
  <Route element={<MainLayout />} >
    <Route path="/" element={<Home />} />
    <Route path='/projects' element={
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    } />
    <Route path='/projects/:projectCode' element={
      <ProtectedRoute>
        <ProjectDashboard />
      </ProtectedRoute>
    } />
    <Route path="/notifications" element={
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    } />
  </Route>
</Routes>
```

### Route Guards & Authentication Redirects
- **[ProtectedRoute.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/routes/ProtectedRoute.jsx)**: A wrapper guard that reads `token` from `localStorage` or `sessionStorage`. If the token is missing, it cancels rendering and executes `<Navigate to="/login" replace />`.
- **Public Routes**: `/login` and `/signup` are public but are wrapped in logical check redirects inside their respective components:
  - If `isAuthenticated` is true, [Login.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/pages/Login.jsx) and [SignUp.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/pages/SignUp.jsx) immediately redirect the user to `/projects` or `/` respectively.

### Layout Wrappers
- **[AuthLayout.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/layouts/AuthLayout.jsx)**: Renders a container wrapping nested routing via standard React Router `<Outlet />` without injecting a navbar or background radial glows.
- **[MainLayout.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/layouts/MainLayout.jsx)**: Global layout wrapping core views. Renders the global `<NavBar />` followed by nested views via `<Outlet />`.

### Navigation Mechanisms
- Programmatic transitions are performed using `const navigate = useNavigate();` (e.g. following logout, click actions on ProjectCards, notifications routing).
- Passive navigation uses `<Link>` elements importing from `react-router-dom` (e.g., logo redirects to `/`, navbar sub-links).

---

## 3. Authentication

User session persistence relies on standard JWT authorization.

### State & Storage Mapping
- **State Location**: State is managed in Redux under `state.auth` using `authSlice.js`.
- **Session Restoring**: On app initial mounting, [App.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/App.jsx) checks for a stored JWT token via:
  ```javascript
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  ```
  If present, it dispatches `fetchCurrentUser(token)` to restore the authenticated state.
- **Token Storage**: Persisted in browser storage by `saveAuthToStorage(token, rememberMe)` called during the login thunk. If `rememberMe` is true, it is stored in `localStorage` for persistent sessions; otherwise, it is saved in `sessionStorage` (ends when the tab is closed).

### Auth State Structure Example
The `state.auth` slice maintains this structure:
```javascript
{
  user: {
    id: "654c29bf7a23c21a4f0012bc",  // Mongo ObjectId representation of the user
    name: "Jane Doe",
    email: "janedoe@example.com"
  },
  loading: false,
  error: null,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  isAuthenticated: true,
  message: "Login successful"
}
```

### Action Workflow
- **Login Flow**: User submits form on `/login` -> calls `loginUser` thunk -> dispatches `authStart()` -> executes `POST /api/auth/login` -> on success: triggers `saveAuthToStorage` and dispatches `authSuccess()` -> routes to `/projects`.
- **Logout Flow**: User clicks logout in navbar/mobile menu -> dispatches `logoutSuccess()` -> clears browser storage via `clearAuthStorage()` -> sets `user` to `null` and `isAuthenticated` to `false` -> redirects to `/login`.

---

## 4. Navbar Documentation

The navigation bar manages the application identity, theme toggles, alert notifications, and layout responsiveness.

### Component Details
- **Component File**: [NavBar.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/NavBar.jsx)
- **Style File**: [navbar.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/navbar.css)
- **Dependencies**: Imports `Sling` from `hamburger-react`, icons from `react-icons/md`, and hooks from Redux.
- **State**:
  - `isOpen` (boolean): Controls whether the mobile menu is open.
  - `showNotifications` (boolean): Toggles the notification list dropdown.

### Layout Implementations
- **Desktop Layout**: The header elements are aligned in a single bar (`.navbar-container` is `display: flex; justify-content: space-between`). Brand logo sits on the left. The right side features a bell button (displaying the badge count), a theme toggler, and a hamburger icon.
- **Responsive Hamburger Menu**: The menu is hidden on desktop by default in normal layouts, but navbar-right keeps it visible globally in this codebase.
- **Mobile Dropdown Overlay**: When `isOpen` is toggled to true, `.mobile-menu` renders absolute (`top: 100px`, `right: 30px`). This dropdown contains navigational Links (Projects, Profile) and the session Logout button.

### Notification Integration
- **[NotificationBell.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/notificationComponents/NotificationBell.jsx)**: Listens to the `state.notification` Redux state. Filters array for `!notification.isRead` to compute `unreadCount`. If `unreadCount > 0`, it overlays a red badge count over a bell icon (`FaBell`).
- **[NotificationDropdown.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/notificationComponents/NotificationDropdown.jsx)**: Renders absolute under the bell icon. Lists up to 3 most recent unread notifications sorted by date. Clicking a notification dispatches `readNotification()` thunk, closes the menu, and routes the user to `/projects/:projectCode`.

---

## 5. Theme System

Theme management relies on class-toggling on the document document root element, powered by Redux.

### Implementation Details
- **Theme Provider**: [ThemeProvider.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/ThemeProvider.jsx)
- **Theme Context**: Redux store slice `state.theme` managing `{ mode: "light" | "dark" }`.
- **System Preference listener**: Checks system configuration using `window.matchMedia("(prefers-color-scheme: dark)")` on mount if no local storage key exists, and attaches a listener to change themes dynamically.
- **Switching Logic**: Clicking the navbar toggle button dispatches `toggleTheme()`, swapping values between `"light"` and `"dark"`, and writing to `localStorage.setItem("theme", mode)`.
- **DOM Integration**:
  ```javascript
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  ```

### Color Variables Listing
These CSS custom properties are defined in [global.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/global.css):

| Property | Light Theme Value | Dark Theme Value |
| :--- | :--- | :--- |
| `--milk` | `#ECE5E7` | `#ECE5E7` |
| `--pine` | `#00311F` | `#00311F` |
| `--rust` | `#A63B12` | `#A63B12` |
| `--copper` | `#B65A1B` | `#B65A1B` |
| `--bg-primary` | `var(--milk)` | `#000000` |
| `--bg-secondary` | `#F6F1F2` | `#041D15` |
| `--bg-card` | `#FFFFFF` | `#08261C` |
| `--text-primary` | `var(--pine)` | `#ECE5E7` |
| `--text-secondary` | `#315347` | `#BFD0C8` |
| `--text-muted` | `#6F7D77` | `#7F9990` |
| `--border-color` | `rgba(0, 49, 31, 0.12)` | `rgba(255, 255, 255, 0.08)` |
| `--accent-primary` | `var(--pine)` | `#0D5B42` |
| `--accent-secondary` | `var(--rust)` | `var(--rust)` |
| `--accent-tertiary` | `var(--copper)` | `var(--copper)` |
| `--glass-bg` | `rgba(255, 255, 255, 0.55)` | `rgba(255, 255, 255, 0.03)` |
| `--glass-border` | `rgba(255, 255, 255, 0.18)` | `rgba(255, 255, 255, 0.06)` |
| `--bg-glow-rust` | `rgba(166, 59, 18, 0.12)` | `rgba(166, 59, 18, 0.18)` |
| `--bg-glow-pine` | `rgba(0, 49, 31, 0.18)` | `rgba(15, 91, 67, 0.22)` |
| `--btns` | `var(--copper)` | `var(--milk)` |
| `--btn-text` | `var(--milk)` | `var(--pine)` |

---

## 6. Global Styling

Global styles are centralized in [global.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/global.css) and applied across all views.

- **Typography**: Uses `"Inter", sans-serif` globally on `body`. Headings like logo use `'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`.
- **Radial Ambient Glows**: Body has a multi-gradient background to simulate glowing ambient backlights:
  ```css
  background:
    radial-gradient(circle at top left, var(--bg-glow-rust), transparent 25%),
    radial-gradient(circle at bottom right, var(--bg-glow-pine), transparent 30%),
    var(--gradient-hero);
  background-attachment: fixed;
  ```
- **Custom Scrollbar**:
  - Track: `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border-radius: 999px;`
  - Thumb: `background: var(--text-primary); border-radius: 999px;`
  - Hover: Thumb transitions into a gradient: `linear-gradient(180deg, var(--rust), var(--pine))` with active glow shadows.
- **Glassmorphism**: Built by combining `background: var(--glass-bg)`, `border: 1px solid var(--glass-border)`, and `backdrop-filter: blur(...)` across cards, headers, and modal panels.
- **Shadow scale**:
  - `--shadow-soft`: Small shadows for buttons.
  - `--shadow-primary`: Large floating depth shadows.
  - `--inner-shadow`: Deep recessed gradients.
  - `--shadow-combined`: Combines primary elevation with inner shadows.
- **Responsive Grid Breakpoints**:
  - Desktop: `1024px` to `1400px`
  - Tablet: `768px` to `1024px`
  - Mobile: Under `768px`

---

## 7. Dashboard Architecture

The dashboard is the central hub for team task coordination.

### Component Structure
```text
ProjectDashboard/
 ├── Details Header            # Displays project title, company, deadline, and lead
 ├── CircularProgressBar       # Renders radial SVG team project progress circle
 ├── ProjectStats              # Horizontal panel listing numeric metadata cards
 ├── Members Section
 │    └── MemberCard           # Team members list (excluding project lead)
 │         └── CircularProgressBar (mini member progress variant)
 ├── Tasks Section
 │    └── TaskCard             # Cards rendering task lists (dependent on role)
 ├── Modal Overlays
 │    ├── AddMembers           # Invite multiple members and choose roles
 │    └── AssignTask           # Form to create tasks for selected members
 └── Workspace (Update Panel)
      ├── LeadUpdatePanel      # Project lead workspace
      │    ├── ReviewRequest   # List of pending task submissions
      │    │    └── ReviewSubmission # Details panel to approve / reject submissions
      │    └── CommunicationPanel # Chat broadcaster targeting the team or individuals
      └── MemberUpdatePanel    # Member workspace
           ├── TaskSubmission  # File uploader and note form to submit tasks
           └── SubmissionHistory # Paginated log of member submissions
                ├── SubmissionHistoryCard
                └── SubmissionHistoryDetails
```

### Role-Based Conditional Views
The dashboard checks permissions via `isLead = (user.id === selectedProject.createdBy._id)`:
1. **Lead Role**: Can add members, assign tasks to a selected member, review submissions (approve or reject with comment), and publish communication alerts.
2. **Member Role**: Can view their own assigned tasks under "My Tasks", launch the task submission modal (uploading files/links), and review submission history logs.

---

## 8. Dashboard Design System

The visual design is structured around consistent layout cards, custom progress indicators, and status indicators.

- **Grid System**: `.project-dashboard-container` uses `display: grid; grid-template-columns: 1fr;` collapsing to single column on mobile, and expands to three columns (`grid-template-columns: 1fr 1fr 1fr;`) on screens larger than `768px`.
- **Card Panels**: Elevated panels use `background-color: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; box-shadow: var(--shadow-primary);`.
- **Concentric SVG Progress Ring**:
  - The progress meter uses an SVG circle with `strokeDasharray` and `strokeDashoffset` dynamically calculated based on progress percentage.
  - Sizing is responsive: `width: clamp(90px, 20vw, 120px)`.
- **Status Icons**: Used inside task lists to denote progress:
  - Completed: `MdCheckCircle` (green, size 24)
  - In Progress: `MdPending` (orange, size 24)
  - Assigned/Pending: `MdRadioButtonUnchecked` (gray, size 24)
- **Modal overlays**: Overlay wrappers use `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); z-index: 9999;` to keep overlay forms readable.

---

## 9. Reusable Components

Below is the detail of reusable elements defined in the project:

### [CustomSelect.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/CustomSelect.jsx)
- **Purpose**: Custom dropdown select component. Features a click-outside handler to close the dropdown when clicking elsewhere.
- **Props**:
  - `options` (array): List of items to select from.
  - `value` (any): The selected option.
  - `onChange` (function): Triggered when an option is selected.
  - `placeholder` (string): Text shown when no option is selected.
  - `labelKey` (string, default "title"): Key used as label if options are objects.
  - `variant` (string): Styling variation suffix.
- **Where Used**: `AddMembers.jsx`, `TaskSubmission.jsx`, `communicationPanel.jsx`.

### [PasswordInput.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/PasswordInput.jsx)
- **Purpose**: Input field for passwords. Extends standard input elements with a show/hide toggle icon.
- **Props**:
  - `value` (string): Input value.
  - `onChange` (function): Input change listener.
  - `placeholder` (string, default "Enter password").
  - `name` / `id` (string, default "password").
- **Where Used**: `Login.jsx`, `SignUp.jsx`.

### [CircularProgressBar.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/CircularProgressBar.jsx)
- **Purpose**: SVG progress ring with a numerical text indicator centered inside.
- **Props**:
  - `percentage` (number): Target progress value.
  - `strokeWidth` (number, default 16).
  - `variant` (string): Adds modifier classes (e.g. `"member"`).
- **Where Used**: `ProjectDashboard.jsx`, `MemberCard.jsx`.

### [ProjectCard.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/ProjectCard.jsx)
- **Purpose**: Summarizes project metadata. Uses inline styles to render a bottom progress bar using CSS custom variables:
  ```html
  style={{
    "--progress": `${project.progress}%`,
    "--progress-color": project.progress < 30 ? "#ff0000" : project.progress < 70 ? "#f59e0b" : "#00ff04"
  }}
  ```
- **Props**: `project` (object).
- **Where Used**: `Projects.jsx`.

### [MemberCard.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/MemberCard.jsx)
- **Purpose**: Layout block for team members, displaying name, role, and progress ring.
- **Props**: `member` (object), `onClick` (function).
- **Where Used**: `ProjectDashboard.jsx`.

### [TaskCard.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/TaskCard.jsx)
- **Purpose**: Displays a task with its title, status icon, and localized deadline date (`en-IN` format).
- **Props**: `task` (object).
- **Where Used**: `ProjectDashboard.jsx`.

---

## 10. Existing Animations

Transitions and animations are defined across pages to improve the user experience.

- **Concentric Ring Progress Animation**: When the page loads, `CircularProgressBar` increments the percentage count sequentially inside a `setInterval` timer (runs every 20ms until it reaches the project progress value).
- **Slide Up Fade**: Cards slide up and fade in on load. Defined via `@keyframes slideUp`:
  - `0%`: `opacity: 0; transform: translateY(20px)`
  - `75%`: `opacity: 1; transform: translateY(-10px)`
  - `100%`: `transform: translateY(0)`
- **Modal overlays scaling popUp**: Modals zoom in on open and zoom out on close. Defined via `@keyframes popUp`:
  - `0%`: `opacity: 0; transform: scale(0.9) translateY(20px);`
  - `75%`: `transform: scale(1.05);`
  - `100%`: `opacity: 1; transform: scale(1) translateY(0);`
- **Modal overlay closing popOut**:
  - `0%`: `opacity: 1; transform: scale(1) translateY(0);`
  - `25%`: `transform: scale(1.05);`
  - `100%`: `opacity: 0; transform: scale(0.5) translateY(50px);`
- **Dropdown Slide Down**: Dropdown lists slide down on toggle. Defined via `@keyframes slideDown`:
  - `from`: `opacity: 0; transform: translateY(-10px);`
  - `to`: `opacity: 1; transform: translateY(0);`
- **Mobile Menu Slide In**: Mobile dropdown menu slides in from the right. Defined via `@keyframes slideIn`:
  - `from`: `opacity: 0; transform: translateX(120px);`
  - `to`: `opacity: 1; transform: translateX(0);`
- **Shimmer Hover Effects**: Primary buttons feature a diagonal sheen that sweeps across the button on hover:
  ```css
  .auth-btn::before {
    content: ""; position: absolute; top: 0; left: -120%; width: 100%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    transition: all 0.7s ease;
  }
  .auth-btn:hover::before { left: 120%; }
  ```

---

## 11. Assets

- **Folder Path**: `src/assets/`
- **Existing Asset files**:
  - `dashboard-preview.png`: Mockup dashboard screenshot used as visual reference.
- **SVG Icon Strategy**:
  - Utilizes components from `react-icons` (includes packages like `react-icons/md`, `react-icons/fa`, `react-icons/fa6`, `react-icons/gi`, and `react-icons/io`).
  - Raw SVGs are not embedded directly in source files; instead, they are imported and rendered as React components.

---

## 12. CSS Architecture

Style sheets are written in plain CSS without preprocessors, CSS modules, or CSS-in-JS libraries.

- **Global styling declarations**: Saved in [global.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/global.css) and imported in the main entry point [main.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/main.jsx) to ensure styles cascade correctly.
- **Component styling imports**: Stylesheets are scoped to their respective features and imported directly inside the JSX component files (e.g. `import "../styles/navbar.css"`).
- **Naming Conventions**: Styles rely on kebab-case classes (e.g. `.project-dashboard-container`, `.register-project-btn`, `.modal-overlay`).

---

## 13. Responsive Strategy

Responsive design is handled with CSS media queries and CSS grid layouts.

- **Grid Sizing**: Sizing values use `clamp()` and `min()` functions alongside layout variables (e.g., `.circular-progress-container` is `width: clamp(90px, 20vw, 120px)`).
- **Column Spacing Shifts**:
  - Projects grid: shifts from 4 columns (`> 1400px`), to 3 columns (`<= 1400px`), to 2 columns (`<= 1024px`), to 1 column (`<= 768px`).
  - Dashboard container: shifts from 3 columns (`>= 768px`) to a single column (`< 768px`).
- **Navbar collapse**: The header collapses on mobile screens. Navigation links are moved inside an absolute floating mobile menu.

---

## 14. Existing Utilities

- **Redux hooks**:
  - Custom selector wrappers defined in `reduxHooks.js`:
    ```javascript
    export const useAppDispatch = useDispatch;
    export const useAppSelector = useSelector;
    ```
- **Local Storage helpers**:
  - Helper functions in `authLocalStore.js` to manage session tokens:
    - `loadAuthToStorage()`: Checks for session tokens on mount.
    - `saveAuthToStorage(token, rememberMe)`: Persists session tokens.
    - `clearAuthStorage()`: Clears storage on logout.
- **API Axios Client**:
  - Core instance in `axiosInstance.js` set up with a base URL of `http://localhost:5000/api`.

---

## 15. Landing Page Integration Notes

The following layout choices are recommended when implementing the new Landing Page:

- **Landing Component Path**: Create the page under `src/pages/LandingPage.jsx`.
- **Style File Path**: Create the styles under `src/styles/landing/landing.css`.
- **Demo Dashboard Reference**: Place any preview images or components inside `src/assets/` and reference them using relative paths.
- **Routes setup**: Replace the placeholder `Home` route in `AppRoutes.jsx` with the new `LandingPage` component:
  ```jsx
  <Route path="/" element={<LandingPage />} />
  ```
- **Reusable styling rules**: Use the existing design variables from `global.css` (such as `--gradient-hero` and `--glass-bg`) to maintain visual consistency.

---

## 16. Design Tokens

The following design tokens are configured globally in `global.css` for consistent styling:

### 1. Palette Variables
- `--milk`: `#ECE5E7`
- `--pine`: `#00311F`
- `--rust`: `#A63B12`
- `--copper`: `#B65A1B`

### 2. Radial Glow Accents
- `--bg-glow-rust` (Light Mode): `rgba(166, 59, 18, 0.12)`
- `--bg-glow-rust` (Dark Mode): `rgba(166, 59, 18, 0.18)`
- `--bg-glow-pine` (Light Mode): `rgba(0, 49, 31, 0.18)`
- `--bg-glow-pine` (Dark Mode): `rgba(15, 91, 67, 0.22)`

### 3. Surface Gradients
- `--gradient-primary` (Light Mode): `linear-gradient(135deg, #00311F 0%, #0B4B35 100%)`
- `--gradient-primary` (Dark Mode): `linear-gradient(135deg, #000000 0%, #00150D 30%, #00311F 100%)`
- `--gradient-rust`: `linear-gradient(135deg, #8E2D0D 0%, #B65A1B 100%)` (Light) / `linear-gradient(135deg, #632108 0%, #A63B12 100%)` (Dark)
- `--gradient-hero`: `linear-gradient(135deg, #ECE5E7 0%, #d8e4df 40%, #00311F 100%)` (Light) / `linear-gradient(135deg, #000000 0%, #00150D 20%, #00311F 70%, #0F5B43 100%)` (Dark)

### 4. Shadow Scales
- `--shadow-soft` (Light): `0 1px 2px rgba(0, 49, 31, 0.05), 0 6px 12px rgba(0, 49, 31, 0.06), 0 0 0 1px rgba(0, 49, 31, 0.05)`
- `--shadow-soft` (Dark): `0 2px 4px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.03)`
- `--shadow-primary` (Light): `0 2px 4px rgba(0, 49, 31, 0.06), 0 12px 28px rgba(0, 49, 31, 0.08), ...`
- `--shadow-primary` (Dark): `0 4px 8px rgba(0, 0, 0, 0.45), 0 20px 40px rgba(0, 0, 0, 0.50), ...`
- `--inner-shadow` (Light): `inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -2px 8px rgba(0, 49, 31, 0.08), ...`
- `--inner-shadow` (Dark): `inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -10px 18px rgba(0, 0, 0, 0.45), ...`
- `--shadow-combined`: Combines primary elevation with inner shadows.

### 5. Layout Sizing
- Spacing: Configured using `rem` units (e.g. `0.5rem`, `1rem`, `1.2rem`, `2rem`).
- Border Radius:
  - Auth elements card: `28px`
  - Register project modal overlay: `12px`
  - Project Cards and general items: `8px`
  - Circular buttons and icons: `50%` or `999px`

---

## 17. Component Dependency Map

Below is the component hierarchy and routing path structure:

```text
App.jsx (dispatches fetchCurrentUser)
 └── AppRoutes
      ├── AuthLayout (Route element wrapper)
      │    ├── Login
      │    │    └── PasswordInput
      │    └── SignUp
      │         └── PasswordInput
      └── MainLayout (Route element wrapper)
           ├── NavBar
           │    ├── NotificationBell
           │    │    └── FaBell (react-icons)
           │    ├── NotificationDropdown
           │    │    └── fetchNotifications (thunk)
           │    └── Hamburger (hamburger-react)
           ├── Home (Landing page placeholder component)
           ├── NotificationsPage
           │    └── NotificationCard
           ├── Projects (Protected)
           │    ├── ProjectCard
           │    │    └── deleteProject (thunk)
           │    └── RegisterProject
           │         └── createProject (thunk)
           └── ProjectDashboard (Protected)
                ├── CircularProgressBar
                ├── ProjectStats
                ├── MemberCard
                │    └── CircularProgressBar
                ├── TaskCard
                ├── AddMembers (modal)
                │    └── CustomSelect
                ├── AssignTask (modal)
                └── UpdatePanel Container
                     ├── LeadUpdatePanel
                     │    ├── ReviewRequests
                     │    │    └── ReviewSubmission
                     │    └── CommunicationPanel
                     │         └── CustomSelect
                     └── MemberUpdatePanel
                          ├── TaskSubmission
                          │    └── CustomSelect
                          └── SubmissionHistory
                               ├── SubmissionHistoryCard
                               └── SubmissionHistoryDetails
```

---

## 18. File References

Below is the detailed list of key files and dependencies across components:

### 1. NavBar Component
- **Component File**: [NavBar.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/NavBar.jsx)
- **Style File**: [navbar.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/navbar.css)
- **Dependencies**: `hamburger-react`, `react-icons/md`, `NotificationBell`, `NotificationDropdown`.
- **Children**: `NotificationBell`, `NotificationDropdown`.
- **Parent**: `MainLayout`.

### 2. ProjectDashboard Page
- **Component File**: [ProjectDashboard.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/pages/ProjectDashboard.jsx)
- **Style File**: [projectdashboard.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/projectdashboard.css)
- **Dependencies**: `CircularProgressBar`, `AddMembers`, `MemberCard`, `ProjectStats`, `TaskSubmission`, `TaskCard`, `AssignTask`, `MemberUpdatePanel`, `LeadUpdatePanel`.
- **Children**: `CircularProgressBar`, `ProjectStats`, `MemberCard`, `TaskCard`, `AddMembers`, `AssignTask`, `LeadUpdatePanel`, `MemberUpdatePanel`.
- **Parent**: `AppRoutes` (nested in `MainLayout`).

### 3. CustomSelect Component
- **Component File**: [CustomSelect.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/CustomSelect.jsx)
- **Style File**: [customselect.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/customselect.css)
- **Dependencies**: `react-icons/io`.
- **Parent**: `AddMembers`, `TaskSubmission`, `CommunicationPanel`.

### 4. Projects Page
- **Component File**: [Projects.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/pages/Projects.jsx)
- **Style File**: [projects.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/projects.css)
- **Dependencies**: `RegisterProject`, `ProjectCard`.
- **Children**: `RegisterProject`, `ProjectCard`.
- **Parent**: `AppRoutes` (nested in `MainLayout`).

### 5. TaskSubmission Component
- **Component File**: [TaskSubmission.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/TaskSubmission.jsx)
- **Style File**: [TaskSubmission.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/styles/TaskSubmission.css)
- **Dependencies**: `react-icons/gi`, `react-icons/md`, `CustomSelect`.
- **Children**: `CustomSelect`.
- **Parent**: `MemberUpdatePanel`.

### 6. ThemeProvider Component
- **Component File**: [ThemeProvider.jsx](file:///c:/projects/ASSIGNO/AssignoFrontend/src/components/ThemeProvider.jsx)
- **Style File**: [global.css](file:///c:/projects/ASSIGNO/AssignoFrontend/src/global.css) (applies root configurations).
- **Dependencies**: Redux hooks and custom theme slice actions.
- **Parent**: `main.jsx` (bootstrapping node wrapper).
