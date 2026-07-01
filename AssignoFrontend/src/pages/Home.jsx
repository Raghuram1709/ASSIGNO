import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/reduxHooks';
import dashboardPreview from '../assets/dashboard-preview.png';
import DemoDashboard from '../components/DemoDashboard';
import '../styles/landing/landing.css';

const PlayableSubmissionsCard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Design system foundations', status: 'pending' },
    { id: 2, name: 'API endpoint documentation', status: 'approved' },
    { id: 3, name: 'User onboarding flow', status: 'rejected' },
    { id: 4, name: 'Database schema draft', status: 'pending' },
    { id: 5, name: 'Mobile responsiveness fix', status: 'approved' },
  ]);

  const handleAction = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="ui-card">
      <div className="ui-card-header">Pending Submissions <span className="interactive-badge">Interactive</span></div>
      <div className="ui-card-list">
        {tasks.map(task => (
          <div key={task.id} className="ui-row playable-row">
            <span className="ui-row-left">{task.name}</span>
            <div className="ui-row-actions">
              {task.status === 'pending' && (
                <div className="playable-actions">
                  <button onClick={() => handleAction(task.id, 'approved')} className="play-btn play-approve" title="Approve">✓</button>
                  <button onClick={() => handleAction(task.id, 'rejected')} className="play-btn play-reject" title="Reject">✕</button>
                </div>
              )}
              <span className={`status-pill status-${task.status} status-pill-animated`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const initialFeed = [
  { id: 1, name: 'Homepage wireframes', status: 'approved', label: 'Approved' },
  { id: 2, name: 'Auth module — backend', status: 'pending', label: 'Pending Review' },
  { id: 3, name: 'Dashboard component', status: 'rejected', label: 'Revision Needed' },
  { id: 4, name: 'Database schema v2', status: 'pending', label: 'Pending Review' },
  { id: 5, name: 'API documentation', status: 'approved', label: 'Approved' },
];

const upcomingTasks = [
  'Dark mode implementation',
  'User profile settings',
  'Email notifications',
  'Performance optimization',
  'Mobile navigation menu',
  'Search functionality',
];

const LiveSubmissionsFeed = () => {
  const [tasks, setTasks] = useState(initialFeed);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => {
        const newTasks = [...prev];
        const pendingIndex = newTasks.findIndex(t => t.status === 'pending');
        const shouldApprove = pendingIndex !== -1 && Math.random() > 0.4;
        
        if (shouldApprove) {
          newTasks[pendingIndex] = { ...newTasks[pendingIndex], status: 'approved', label: 'Approved' };
        } else {
          const newTaskName = upcomingTasks[Math.floor(Math.random() * upcomingTasks.length)];
          newTasks.unshift({
            id: Date.now(),
            name: newTaskName,
            status: 'pending',
            label: 'Pending Review'
          });
          if (newTasks.length > 5) newTasks.pop();
        }
        return newTasks;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    approved: tasks.filter(t => t.status === 'approved').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    rejected: tasks.filter(t => t.status === 'rejected').length
  };

  return (
    <div className="feature-visual live-feed">
      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
        <span>Live Submissions</span>
        <span className="live-indicator"><span className="live-dot"></span> Live</span>
      </div>
      <div className="fv-list-container">
        {tasks.map((task) => (
          <div key={task.id} className="fv-row slide-in-top">
            <span className="fv-name">{task.name}</span>
            <span className={`fv-pill fv-${task.status} status-pill-animated`}>{task.label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '22px', color: '#60e090' }}>{stats.approved}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Approved</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '22px', color: '#ffd060' }}>{stats.pending}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Awaiting</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '22px', color: '#ff9080' }}>{stats.rejected}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Revision</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dashboardRef = useRef(null);

  const handleRoleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const ctaTarget = isAuthenticated ? '/projects' : '/login';

  useEffect(() => {
    // 1. Viewport Scroll Reveal with IntersectionObserver
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => {
      // We do not gate hero elements by scroll position; they reveal immediately
      if (!el.closest('#hero')) {
        observer.observe(el);
      }
    });

    // 2. Immediate Hero Reveals
    const heroReveals = document.querySelectorAll('#hero .reveal');
    const timers = Array.from(heroReveals).map((el) => {
      return setTimeout(() => el.classList.add('visible'), 100);
    });

    // 3. Mouse Parallax Tilt on Hero Dashboard Demo
    const handleMouseMove = (e) => {
      const dashboard = dashboardRef.current;
      if (!dashboard) return;
      
      // Calculate mouse position relative to the center of the screen
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      
      // Normalize values between -1 and 1
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      
      // Max tilt of 4 degrees. Tilt towards the mouse (subtle)
      const rotateX = -dy * 4;
      const rotateY = dx * 4;
      
      dashboard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      // Ambient Background Shift is now handled by scroll
    };

    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const blob1 = document.querySelector('.blob-1');
      const blob2 = document.querySelector('.blob-2');
      if (blob1 && blob2) {
        // Blob 1 starts top-left, moves right/down, gets larger in the middle
        const tx1 = Math.sin(scrollPct * Math.PI) * 400;
        const ty1 = scrollPct * 800; 
        
        // Blob 2 starts bottom-right, moves left/up, gets larger in the middle
        const tx2 = -Math.sin(scrollPct * Math.PI) * 400;
        const ty2 = -scrollPct * 800;

        const scale = 1 + Math.sin(scrollPct * Math.PI) * 0.4;

        blob1.style.transform = `translate(${tx1}px, ${ty1}px) scale(${scale})`;
        blob2.style.transform = `translate(${tx2}px, ${ty2}px) scale(${scale})`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
      timers.forEach((t) => clearTimeout(t));
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page-wrapper">
      
      {/* ─── AMBIENT BACKGROUND LAYER ────────────────────────────── */}
      <div className="ambient-background-layer">
        <div className="hero-ambient-blob blob-1"></div>
        <div className="hero-ambient-blob blob-2"></div>
      </div>

      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section id="hero">
        <div className="container">
          <div className="hero-inner">
            {/* Left Column */}
            <div>
              <div className="hero-badge reveal">
                <div className="hero-badge-dot"></div>
                <span className="hero-badge-text">Review-Driven project management</span>
              </div>
              <h1 className="hero-headline reveal reveal-delay-1">
                Work gets<br />approved,<br />not just <em>submitted.</em>
              </h1>
              <p className="hero-body reveal reveal-delay-2">
                ASSIGNO introduces a structured review workflow to project management. Team members submit completed work — project leads review, approve, or request changes — and progress only moves forward when quality is confirmed.
              </p>
              <div className="hero-actions reveal reveal-delay-3">
                <Link to={ctaTarget} className="btn-primary">Create Your First Project</Link>
                <a href="#showcase" className="btn-secondary">View Dashboard</a>
              </div>
            </div>
            {/* Right Column: Interactive Dashboard Demo */}
            <div className="reveal reveal-delay-2" id="browser-wrap">
              <div className="hero-dashboard-demo" ref={dashboardRef}>
                <DemoDashboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW SECTION ────────────────────────────────────── */}
      <section id="workflow">
        <div className="container">
          <div className="section-header reveal">
            <span className="label">How It Works</span>
            <h2 className="section-title">A complete project lifecycle,<br />built for accountability</h2>
            <p className="section-body">Every step from project creation to progress tracking is connected. Nothing advances without deliberate review.</p>
          </div>
          <div className="workflow-steps">
            <div className="workflow-line reveal">
              <div className="workflow-pulse"></div>
            </div>
            <div className="workflow-step reveal reveal-delay-1">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                </svg>
              </div>
              <span className="step-label">Create Project</span>
            </div>
            <div className="workflow-step reveal reveal-delay-2">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="step-label">Invite Members</span>
            </div>
            <div className="workflow-step reveal reveal-delay-3">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <span className="step-label">Assign Tasks</span>
            </div>
            <div className="workflow-step reveal reveal-delay-4">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="step-label">Submit Work</span>
            </div>
            <div className="workflow-step reveal reveal-delay-5">
              <div className="step-icon featured">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="step-label">Review & Approve</span>
              <span className="step-badge">Core</span>
            </div>
            <div className="workflow-step reveal reveal-delay-5">
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <span className="step-label">Track Progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD SHOWCASE SECTION ──────────────────────────── */}
      <section id="showcase">
        <div className="container">
          <div className="section-header reveal">
            <span className="label">The Dashboard</span>
            <h2 className="section-title">Everything your team needs,<br />in one place</h2>
            <p className="section-body">Purpose-built views for every part of your project — without the noise of tools that try to do everything.</p>
          </div>

          {/* Sub-block 1: Project Overview */}
          <div className="showcase-grid" style={{ marginBottom: '80px' }}>
            <div className="showcase-content reveal">
              <span className="label">Project Overview</span>
              <div className="divider divider-left" style={{ marginBottom: '20px' }}></div>
              <h3 className="heading" style={{ fontSize: '26px', letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.25 }}>
                Every project's health at a glance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, marginBottom: '24px' }}>
                See your project details, team progress, open tasks, and completed work — all from a single dashboard panel. No hunting through menus.
              </p>
              <div className="showcase-feature-list">
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                      <path d="M3 11h18" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>Project metadata</strong>
                    <span>Company, deadline, and lead visible immediately.</span>
                  </div>
                </div>
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>Team progress ring</strong>
                    <span>Visual completion percentage aggregated from approved tasks.</span>
                  </div>
                </div>
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <circle cx="12" cy="12" r="7" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>Open vs. completed tasks</strong>
                    <span>Real-time count — only approved work counts as complete.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="mock-dashboard">
                <div className="mock-bar">
                  <div className="mock-bar-dot" style={{ backgroundColor: '#ff5f57' }}></div>
                  <div className="mock-bar-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                  <div className="mock-bar-dot" style={{ backgroundColor: '#28c840' }}></div>
                </div>
                <img
                  className="mock-content-img"
                  src={dashboardPreview}
                  alt="ASSIGNO project overview dashboard"
                />
              </div>
            </div>
          </div>

          {/* Sub-block 2: Submission & Review */}
          <div className="showcase-grid reverse">
            <div className="showcase-content reveal">
              <span className="label">Submission & Review</span>
              <div className="divider divider-left" style={{ marginBottom: '20px' }}></div>
              <h3 className="heading" style={{ fontSize: '26px', letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.25 }}>
                Review work before it counts
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.65, marginBottom: '24px' }}>
                Team members submit their completed tasks directly from their workspace. Project leads receive instant notifications and can approve or reject with context — keeping everyone aligned.
              </p>
              <div className="showcase-feature-list">
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>One-click submission</strong>
                    <span>Members submit work from their task workspace without extra steps.</span>
                  </div>
                </div>
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>Smart notifications</strong>
                    <span>Leads are notified the moment a submission arrives.</span>
                  </div>
                </div>
                <div className="showcase-feature">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="feat-text">
                    <strong>Approve or reject</strong>
                    <span>Leads make a decision; progress updates only on approval.</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Mockup Card */}
            <div className="reveal reveal-delay-2">
              <PlayableSubmissionsCard />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROLE-BASED EXPERIENCE SECTION ─────────────────────── */}
      <section id="roles">
        <div className="container">
          <div className="section-header reveal">
            <span className="label" style={{ color: 'var(--pine-light)' }}>Role-Based Experience</span>
            <h2 className="section-title" style={{ color: '#fff' }}>One platform, two perspectives</h2>
            <p className="section-body">ASSIGNO adapts its dashboard and capabilities to who's using it — giving everyone exactly what they need, nothing more.</p>
          </div>
          <div className="roles-grid">
            {/* Project Lead */}
            <div className="role-card reveal reveal-delay-1" onMouseMove={handleRoleCardMove}>
              <div className="role-title">Project Lead <span className="role-accent">↑</span></div>
              <div className="role-subtitle">Owns the project and drives quality</div>
              <ul className="role-list">
                <li>Create and configure projects</li>
                <li>Invite and manage team members</li>
                <li>Assign tasks to specific members</li>
                <li>Review and approve submitted work</li>
                <li>Reject submissions and request revisions</li>
                <li>Monitor team-wide progress</li>
                <li>Access submission history and audit trail</li>
              </ul>
            </div>
            <div className="role-vs">
              <div className="vs-badge">VS</div>
            </div>
            {/* Team Member */}
            <div className="role-card reveal reveal-delay-2" onMouseMove={handleRoleCardMove}>
              <div className="role-title">Team Member <span className="role-accent">→</span></div>
              <div className="role-subtitle">Focused on execution and delivery</div>
              <ul className="role-list">
                <li>View assigned tasks and deadlines</li>
                <li>See personal progress within the project</li>
                <li>Submit completed work for review</li>
                <li>Track approval status of submissions</li>
                <li>Receive notifications on review decisions</li>
                <li>Access team communication</li>
                <li>View submission history</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE FEATURES SECTION ───────────────────────────────── */}
      <section id="features">
        <div className="container">
          <div className="section-header reveal">
            <span className="label">Core Features</span>
            <h2 className="section-title">Built to remove friction<br />from collaborative work</h2>
          </div>

          {/* Featured: The Review Workflow */}
          <div className="features-featured reveal">
            <div>
              <p className="features-featured-label label" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Signature Feature</p>
              <h3 className="features-featured-title">The Review Workflow</h3>
              <p className="features-featured-body">
                Most task managers mark work complete the moment a checkbox is ticked. ASSIGNO introduces a gate: every submission goes through a deliberate review before it counts toward team progress.
              </p>
              <div className="feature-steps">
                <div className="feature-step">
                  <div className="fstep-num">1</div>
                  <div className="fstep-text"><strong>Member submits</strong>Work is marked as "submitted" and moves out of the member's queue.</div>
                </div>
                <div className="feature-step">
                  <div className="fstep-num">2</div>
                  <div className="fstep-text"><strong>Lead is notified</strong>An instant notification goes to the project lead for review.</div>
                </div>
                <div className="feature-step">
                  <div className="fstep-num">3</div>
                  <div className="fstep-text"><strong>Approve or reject</strong>Lead decides — approval updates progress; rejection returns the task for revision.</div>
                </div>
              </div>
            </div>
            {/* Visual Panel */}
            <LiveSubmissionsFeed />
          </div>

          {/* 6-Card Feature Grid */}
          <div className="features-grid">
            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                </svg>
              </div>
              <div className="feature-card-title">Project Creation</div>
              <div className="feature-card-body">Set up a project with company info, deadlines, and team roles in under a minute.</div>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="feature-card-title">Team Management</div>
              <div className="feature-card-body">Invite members, assign roles, and manage your team from a single panel.</div>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <div className="feature-card-title">Task Assignment</div>
              <div className="feature-card-body">Assign specific tasks to team members with deadlines and clear ownership.</div>
            </div>
            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div className="feature-card-title">Smart Notifications</div>
              <div className="feature-card-body">Leads and members are notified at every meaningful moment — submissions, approvals, rejections.</div>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="feature-card-title">Built-in Communication</div>
              <div className="feature-card-body">Keep project discussions in context — no switching to external chat tools.</div>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <div className="feature-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
                </svg>
              </div>
              <div className="feature-card-title">Dark & Light Mode</div>
              <div className="feature-card-body">Full theme support that follows your preference — built into every view.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY ASSIGNO SECTION ─────────────────────────────────── */}
      <section id="why">
        <div className="container">
          <div className="section-header reveal">
            <span className="label">Why ASSIGNO</span>
            <h2 className="section-title">Task completion isn't the same<br />as quality delivery</h2>
            <p className="section-body">Traditional tools assume that marking a task done means it is done. ASSIGNO challenges that assumption.</p>
          </div>
          <div className="why-compare">
            {/* Without ASSIGNO */}
            <div className="why-col before reveal reveal-delay-1">
              <div className="why-col-title">Without ASSIGNO</div>
              <div className="why-col-sub">How most task managers work</div>
              <ul className="why-list before-list">
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Tasks are marked complete with no review
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Progress is self-reported, not verified
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Quality issues surface late — after the damage is done
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Leads learn about problems from deadlines, not dashboards
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  There's no structured way to request revisions
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  Accountability is informal and hard to trace
                </li>
              </ul>
            </div>
            <div className="why-arrow">
              <div className="why-arrow-inner">→</div>
            </div>
            {/* With ASSIGNO */}
            <div className="why-col after reveal reveal-delay-2">
              <div className="why-col-title">With ASSIGNO</div>
              <div className="why-col-sub">Review-driven collaboration</div>
              <ul className="why-list after-list">
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Every submission is reviewed before it counts
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Progress reflects approved, verified work
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Issues are caught early in the submission flow
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Leads have real-time visibility into team status
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Rejection triggers a structured revision cycle
                </li>
                <li>
                  <span className="why-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                  Every action is logged and traceable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BUILT WITH SECTION ─────────────────────────────────── */}
      <section id="stack">
        <div className="container">
          <div className="section-header reveal">
            <span className="label">Built With</span>
            <h2 className="section-title">A modern, production-grade stack</h2>
            <p className="section-body">ASSIGNO is built on the MERN stack — the same technology behind thousands of production applications worldwide.</p>
          </div>
          <div className="stack-grid">
            <div className="stack-pill reveal reveal-delay-1">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
                </svg>
              </span>
              React
            </div>
            <div className="stack-pill reveal reveal-delay-1">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <rect x="3" y="3" width="18" height="6" rx="1" />
                  <rect x="3" y="11" width="18" height="6" rx="1" />
                  <line x1="7" y1="6" x2="7" y2="6" />
                  <line x1="7" y1="14" x2="7" y2="14" />
                </svg>
              </span>
              Redux Toolkit
            </div>
            <div className="stack-pill reveal reveal-delay-2">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              Node.js
            </div>
            <div className="stack-pill reveal reveal-delay-2">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <rect x="4" y="3" width="16" height="13" rx="2" />
                  <path d="M8 16v3" />
                  <path d="M16 16v3" />
                  <circle cx="8" cy="20" r="1" />
                  <circle cx="16" cy="20" r="1" />
                  <path d="M4 9h16" />
                </svg>
              </span>
              Express
            </div>
            <div className="stack-pill reveal reveal-delay-3">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <path d="M11 20A7 7 0 0 1 4 13a13 13 0 0 1 8-12 13 13 0 0 1 8 12 7 7 0 0 1-7 7H11z" />
                  <path d="M9 13a4 4 0 0 0 5-5" />
                </svg>
              </span>
              MongoDB
            </div>
            <div className="stack-pill reveal reveal-delay-3">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              JWT Auth
            </div>
            <div className="stack-pill reveal reveal-delay-4">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              REST APIs
            </div>
            <div className="stack-pill reveal reveal-delay-4">
              <span className="stack-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20">
                  <rect x="6" y="2" width="12" height="20" rx="2" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
              </span>
              Responsive Design
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ──────────────────────────────────── */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="cta-headline reveal">
              Your team deserves<br />work that's actually <em>done.</em>
            </h2>
            <p className="cta-body reveal reveal-delay-1">
              Start your first ASSIGNO project today. Set up tasks, invite your team, and experience what it feels like when progress means something.
            </p>
            <div className="cta-actions reveal reveal-delay-2">
              <Link to={ctaTarget} className="btn-cta-primary">Create Your First Project</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER SECTION ─────────────────────────────────────── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">ASSIGNO</div>
          <div className="footer-meta">Review-driven project management — Built with the MERN stack</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
