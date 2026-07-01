import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Plus,
  Send,
  UserRoundCheck,
} from "lucide-react";

import "../styles/landing/demoDashboard.css";

const members = [
  {
    name: "Maya",
    role: "frontend",
    progress: 68,
    active: true,
  },
  {
    name: "Arjun",
    role: "qa analyst",
    progress: 42,
  },
];

const tasks = [
  {
    title: "Review login flow",
    date: "4 Jul",
    status: "pending",
  },
  {
    title: "Polish stats cards",
    date: "6 Jul",
    status: "active",
  },
];

const updates = [
  
];

const ProgressRing = ({ value, small = false }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={small ? "demo-ring demo-ring-small" : "demo-ring"}
      aria-label={`${value}% progress`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="demo-ring-track" cx="50" cy="50" r={radius} />
        <circle
          className="demo-ring-value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span>{value}%</span>
    </div>
  );
};

const DemoDashboard = () => {
  return (
    <div className="demo-dashboard" aria-label="ASSIGNO demo dashboard preview">
      <main className="demo-grid">
        <section className="demo-card demo-project demo-hover-zone">
          <p className="demo-kicker">Project</p>
          <h3>OrbitDesk</h3>
          <dl>
            <div>
              <dt>Company</dt>
              <dd>Northstar Labs</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>18 Aug 2026</dd>
            </div>
            <div>
              <dt>Lead</dt>
              <dd>Rahul</dd>
            </div>
          </dl>
          <span className="demo-hint">Project health snapshot</span>
        </section>

        <section className="demo-card demo-progress-card demo-hover-zone">
          <ProgressRing value={68} />
          <strong>Team Progress</strong>
        </section>

        <section className="demo-stats demo-hover-zone">
          <article>
            <strong>2</strong>
            <span>Team Members</span>
          </article>
          <article>
            <strong>18</strong>
            <span>Total Tasks</span>
          </article>
          <article className="is-approved">
            <strong>12</strong>
            <span>Approved Tasks</span>
          </article>
          <article className="is-open">
            <strong>6</strong>
            <span>Open Tasks</span>
          </article>
        </section>

        <section className="demo-panel demo-members demo-hover-zone">
          <div className="demo-section-head">
            <h4>Members</h4>
            <button type="button">
              <Plus size={14} />
              Add Member
            </button>
          </div>
          <div className="demo-list">
            {members.map((member) => (
              <article
                className={member.active ? "demo-member is-active" : "demo-member"}
                key={member.name}
              >
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
                <ProgressRing value={member.progress} small />
              </article>
            ))}
          </div>
        </section>

        <section className="demo-panel demo-tasks demo-hover-zone">
          <div className="demo-section-head">
            <h4>Maya's Tasks</h4>
            <button type="button">
              <Plus size={14} />
              Add Task
            </button>
          </div>
          <div className="demo-list">
            {tasks.map((task) => (
              <article className="demo-task" key={task.title}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.status === "active" ? "In review" : "Assigned"}</span>
                </div>
                <time>
                  <Clock3 size={13} />
                  {task.date}
                </time>
              </article>
            ))}
          </div>
        </section>

        <section className="demo-panel demo-workspace demo-hover-zone">
          <div className="demo-section-head workspace">
            <div className="headings">
              <h4>Workspace</h4>
              <span>Updates & History</span>
            </div>
            <div className="demo-tabs">
              <button type="button">Reviews</button>
              <button type="button">Communication</button>
            </div>
          </div>

          <article className="demo-review-card">
            <div className="demo-review-title">
              <UserRoundCheck size={16} />
              <strong>Pending Reviews</strong>
            </div>
            <h5>Login flow polish</h5>
            <p>Submitted by Maya on 30 Jun 2026</p>
            <button type="button" className="review">
              Review
            </button>
          </article>

          <div className="demo-activity">
            {updates.map((update) => (
              <span key={update}>
                <MessageSquareText size={13} />
                {update}
              </span>
            ))}
          </div>

          <div className="demo-message">
            <span>Ask for revision notes...</span>
            <Send size={14} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DemoDashboard;
