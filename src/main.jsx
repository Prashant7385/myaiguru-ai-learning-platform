import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen,
  CalendarDays, Check, CheckCircle2, ChevronDown, ClipboardCheck, Clock3, FileText,
  GraduationCap, Home, Lightbulb, ListChecks, Menu, MessageCircle, Plus, Search,
  Send, Settings, Sparkles, Target, Users, X, BarChart3, Layers, WandSparkles
} from 'lucide-react';
import './styles.css';

const initialAssignments = [
  { id: 1, batch: 'Batch A', title: 'Assignment 2: AI Fundamentals', submissions: 12, due: 'Today', status: 'Needs review' },
  { id: 2, batch: 'Batch B', title: 'Assignment 2: AI Fundamentals', submissions: 10, due: 'Today', status: 'Needs review' },
  { id: 3, batch: 'Batch C', title: 'Python Basics Exercise', submissions: 9, due: 'Tomorrow', status: 'Needs review' },
  { id: 4, batch: 'Batch D', title: 'Introduction to Machine Learning', submissions: 7, due: 'Tomorrow', status: 'In progress' }
];
const batches = [
  { name: 'Batch A', learners: 30, attendance: 82, submission: 67, progress: 74 },
  { name: 'Batch B', learners: 30, attendance: 76, submission: 60, progress: 68 },
  { name: 'Batch C', learners: 30, attendance: 77, submission: 63, progress: 70 },
  { name: 'Batch D', learners: 30, attendance: 78, submission: 58, progress: 66 }
];
const nav = [
  { label: 'Dashboard', icon: Home }, { label: 'Batches', icon: Users },
  { label: 'Learning Content', icon: BookOpen }, { label: 'Assignments', icon: ClipboardCheck },
  { label: 'Quizzes', icon: Target }, { label: 'Learner Progress', icon: BarChart3 },
  { label: 'Reports', icon: FileText }
];

function App() {
  const [page, setPage] = useState('Dashboard');
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [toast, setToast] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hello! I can help draft lesson plans, create practice quizzes, and summarize learner progress using your course context.' }]);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [contentTopic, setContentTopic] = useState('Introduction to Artificial Intelligence');
  const [generated, setGenerated] = useState(false);
  const [quizCount, setQuizCount] = useState('5');
  const [quizGenerated, setQuizGenerated] = useState(false);

  const showToast = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 2600); };
  const pendingCount = assignments.filter(a => a.status === 'Needs review').length;
  const filteredAssignments = useMemo(() => assignments.filter(a => `${a.batch} ${a.title} ${a.status}`.toLowerCase().includes(search.toLowerCase())), [assignments, search]);
  const sendMessage = (e) => {
    e.preventDefault(); if (!assistantText.trim()) return;
    const prompt = assistantText.trim();
    setMessages(m => [...m, { from: 'user', text: prompt }, { from: 'ai', text: `Here is a suggested starting point for “${prompt}”: align the response with the approved course curriculum, use a beginner-friendly explanation, add one practical example, and ask the trainer to review it before sharing with learners. This is a demonstration response, not a live AI service.` }]);
    setAssistantText('');
  };
  const approveAssignment = () => {
    setAssignments(items => items.map(a => a.id === activeAssignment.id ? { ...a, status: 'Reviewed' } : a));
    setActiveAssignment(null); showToast('Assignment marked as reviewed.');
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={25}/></div><div><b>MYAIGURU</b><span>AI Learning Platform</span></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${page === item.label ? 'active' : ''}`} onClick={() => {setPage(item.label);setMobileNav(false);}}><item.icon size={18}/><span>{item.label}</span>{item.label === 'Assignments' && <em>{pendingCount}</em>}</button>)}</nav>
      <div className="nav-divider"/>
      <button className={`nav-item ai-nav ${page === 'AI Trainer Assistant' ? 'active' : ''}`} onClick={() => {setPage('AI Trainer Assistant');setMobileNav(false);}}><Sparkles size={18}/><span>AI Trainer Assistant</span></button>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => showToast('Settings are part of the prototype roadmap.')}><Settings size={18}/><span>Settings</span></button><div className="sidebar-note"><div className="note-icon"><Lightbulb size={16}/></div><b>Teaching tip</b><p>Use AI suggestions as a starting point. Review content before sharing it with learners.</p></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu/></button><div className="crumb"><span>MYAIGURU</span><b>/</b><strong>{page}</strong></div><div className="top-actions"><button className="icon-btn" onClick={() => showToast('You are all caught up on notifications.')} aria-label="Notifications"><Bell size={19}/><i/></button><div className="profile"><div className="avatar">TR</div><div><b>Trainer</b><span>AI Program</span></div><ChevronDown size={16}/></div></div></header>
      <div className="content">
        {page === 'Dashboard' && <>
          <section className="welcome-row"><div><div className="eyebrow">THURSDAY, PROGRAM OVERVIEW</div><h1>Welcome back, Trainer</h1><p>Here’s your overview for the 4-week Intro to AI program.</p></div><button className="date-select" onClick={() => showToast('Showing the full four-week program overview.')}><CalendarDays size={17}/> 4-week program <ChevronDown size={15}/></button></section>
          <section className="stats-grid">
            <Stat icon={Users} label="Total learners" value="120" foot="Across 4 batches" tone="purple"/>
            <Stat icon={CheckCircle2} label="Attendance rate" value="78%" foot="Proposed target: 90%" trend="+12% target gap" tone="green"/>
            <Stat icon={ClipboardCheck} label="On-time submissions" value="62%" foot="Proposed target: 85%" trend="+23% target gap" tone="blue"/>
            <Stat icon={Clock3} label="Avg. feedback time" value="4 days" foot="Proposed target: ≤ 24 hours" trend="Needs improvement" tone="orange"/>
          </section>
          <section className="dashboard-grid">
            <div className="panel ai-panel"><div className="panel-heading"><div className="heading-icon purple-icon"><Sparkles size={19}/></div><div><h2>AI Trainer Assistant</h2><p>Save time on repetitive teaching tasks.</p></div><span className="demo-tag">DEMO</span></div><div className="ai-tools">
              <Tool icon={FileText} title="Generate lesson plan" onClick={() => {setPage('Learning Content');setGenerated(false);}}/>
              <Tool icon={Target} title="Create quiz" onClick={() => setPage('Quizzes')}/>
              <Tool icon={WandSparkles} title="Suggest assignment" onClick={() => {setPage('Learning Content');setGenerated(false);}}/>
              <Tool icon={ClipboardCheck} title="Review assignment" onClick={() => setPage('Assignments')}/>
              <Tool icon={Activity} title="Learner insights" onClick={() => setPage('Learner Progress')}/>
              <Tool icon={FileText} title="Draft report" onClick={() => setPage('Reports')}/>
            </div></div>
            <div className="panel reviews-panel"><div className="panel-heading"><div className="heading-icon blue-icon"><Layers size={19}/></div><div><h2>Assignment reviews</h2><p>{pendingCount} items need attention</p></div><button className="text-btn" onClick={() => setPage('Assignments')}>View all <ArrowRight size={14}/></button></div><div className="review-list">{assignments.slice(0,3).map(a => <div className="review-row" key={a.id}><div className="file-icon"><FileText size={17}/></div><div className="review-info"><b>{a.batch} · {a.title}</b><span>{a.submissions} submissions · {a.due}</span></div><button className={`status-btn ${a.status === 'Reviewed' ? 'done' : ''}`} onClick={() => setActiveAssignment(a)}>{a.status === 'Reviewed' ? 'Reviewed' : 'Review'}</button></div>)}</div></div>
            <div className="panel insights-panel"><div className="panel-heading"><div className="heading-icon amber-icon"><Lightbulb size={19}/></div><div><h2>AI insights</h2><p>Illustrative recommendations</p></div></div><Insight icon={Users} text="8 learners have missed two or more classes. Consider a supportive follow-up."/><Insight icon={ArrowUpRight} text="Assignment submissions are an opportunity for improvement across batches."/><Insight icon={Target} text="Review the AI Basics topic: some learners may need additional practice."/><button className="primary-btn full" onClick={() => showToast('A sample action plan has been prepared for trainer review.')}><Sparkles size={16}/> Generate action plan</button></div>
            <div className="panel chart-panel"><div className="panel-heading"><div className="heading-icon green-icon"><BarChart3 size={19}/></div><div><h2>Learner engagement</h2><p>Program baseline indicators</p></div></div><div className="chart-legend"><span><i className="dot purple-dot"/> Attendance</span><span><i className="dot blue-dot"/> On-time submissions</span></div><div className="bar-chart"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-bars">{[{w:78,s:62,l:'Current'}].map(d=><div className="bar-group" key={d.l}><div className="bar-pair"><div className="bar purple-bar" style={{height:`${d.w}%`}} title="78% attendance"/><div className="bar blue-bar" style={{height:`${d.s}%`}} title="62% on-time submissions"/></div><span>{d.l}</span></div>)}</div></div><div className="chart-foot"><span>Attendance <b>78%</b></span><span>On-time submission <b>62%</b></span></div></div>
            <div className="panel batch-panel"><div className="panel-heading"><div className="heading-icon purple-icon"><Users size={19}/></div><div><h2>Batch-wise overview</h2><p>Illustrative batch breakdown</p></div><button className="text-btn" onClick={() => setPage('Batches')}>Details <ArrowRight size={14}/></button></div><div className="table-wrap"><table><thead><tr><th>Batch</th><th>Learners</th><th>Attendance</th><th>Submission</th><th>Progress</th></tr></thead><tbody>{batches.map(b=><tr key={b.name}><td><b>{b.name}</b></td><td>{b.learners}</td><td>{b.attendance}%</td><td>{b.submission}%</td><td><div className="progress-cell"><div className="progress-track"><i style={{width:`${b.progress}%`}}/></div><b>{b.progress}%</b></div></td></tr>)}</tbody></table></div></div>
          </section>
          <p className="data-note"><AlertCircle size={13}/> Case-study baseline values are shown where provided. Batch-level breakdowns and AI insights are illustrative prototype data.</p>
        </>}
        {page === 'Batches' && <PageTitle title="Batch management" subtitle="Monitor attendance and learning activity across all four batches."><div className="batch-cards">{batches.map(b=><div className="panel batch-card" key={b.name}><div className="batch-card-top"><span className="batch-avatar">{b.name.slice(-1)}</span><b>{b.name}</b><span className="pill">30 learners</span></div><Metric label="Attendance" value={`${b.attendance}%`}/><Metric label="On-time submissions" value={`${b.submission}%`}/><Metric label="Learning progress" value={`${b.progress}%`}/></div>)}</div></PageTitle>}
        {page === 'Learning Content' && <PageTitle title="Learning content studio" subtitle="Prepare curriculum-aligned learning materials with AI assistance."><div className="panel form-panel"><div className="form-title"><div className="heading-icon purple-icon"><WandSparkles/></div><div><h2>Generate a lesson plan</h2><p>AI-generated content must be reviewed by a trainer before publishing.</p></div></div><label>Lesson topic</label><input value={contentTopic} onChange={e=>setContentTopic(e.target.value)} placeholder="Enter a topic"/><label>Learning level</label><select><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><label>Learning objective</label><textarea defaultValue="Explain the core concepts with practical examples and a short activity." rows="3"/><button className="primary-btn" onClick={()=>setGenerated(true)}><Sparkles size={16}/> Generate draft</button>{generated && <div className="generated-box"><div className="generated-head"><b><CheckCircle2 size={17}/> Draft generated for review</b><span className="pill">AI-assisted</span></div><h3>{contentTopic}</h3><ol><li>Introduction and learning objectives</li><li>Key concepts explained in beginner-friendly language</li><li>Practical real-world example</li><li>Short classroom activity and knowledge check</li></ol><div className="review-warning"><AlertCircle size={16}/> Trainer review required. Verify accuracy and alignment with the approved curriculum before sharing.</div><button className="secondary-btn" onClick={()=>showToast('Draft saved in this prototype session.')}>Save draft</button></div>}</div></PageTitle>}
        {page === 'Assignments' && <PageTitle title="Assignment management" subtitle="Track submissions and review AI-assisted feedback suggestions."><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search assignments or batches" value={search} onChange={e=>setSearch(e.target.value)}/></div><span className="pill">{pendingCount} pending reviews</span></div><div className="panel list-panel">{filteredAssignments.map(a=><div className="assignment-item" key={a.id}><div className="file-icon"><FileText/></div><div className="assignment-main"><b>{a.title}</b><span>{a.batch} · {a.submissions} submissions · Due {a.due}</span></div><span className={`state ${a.status === 'Reviewed' ? 'state-done' : ''}`}>{a.status}</span><button className="secondary-btn" onClick={()=>setActiveAssignment(a)}>{a.status === 'Reviewed' ? 'View' : 'Review'}</button></div>)}{filteredAssignments.length===0 && <div className="empty">No assignments match your search.</div>}</div></PageTitle>}
        {page === 'Quizzes' && <PageTitle title="Quiz builder" subtitle="Create practice questions based on approved course topics."><div className="panel form-panel"><div className="form-title"><div className="heading-icon blue-icon"><Target/></div><div><h2>Create a practice quiz</h2><p>Review generated questions and answers before publishing.</p></div></div><label>Topic</label><input defaultValue="Machine Learning fundamentals"/><label>Number of questions</label><select value={quizCount} onChange={e=>setQuizCount(e.target.value)}><option value="5">5 questions</option><option value="10">10 questions</option><option value="15">15 questions</option></select><label>Question type</label><select><option>Multiple choice</option><option>True or false</option><option>Mixed</option></select><button className="primary-btn" onClick={()=>setQuizGenerated(true)}><Sparkles size={16}/> Generate quiz draft</button>{quizGenerated && <div className="generated-box"><div className="generated-head"><b><CheckCircle2 size={17}/> Sample quiz draft</b><span className="pill">{quizCount} questions requested</span></div><h3>Machine Learning fundamentals</h3><p><b>Sample question:</b> What is the primary purpose of a training dataset in supervised learning?</p><ol type="A"><li>To train a model to learn patterns from examples</li><li>To store the final model predictions</li><li>To replace the testing dataset</li><li>To guarantee perfect accuracy</li></ol><div className="review-warning"><AlertCircle size={16}/> Demonstration content only. Verify every question and answer before publishing.</div></div>}</div></PageTitle>}
        {page === 'Learner Progress' && <PageTitle title="Learner progress" subtitle="Use learning indicators to decide where trainer support may be needed."><div className="stats-grid compact-stats"><Stat icon={Users} label="Learners enrolled" value="120" tone="purple"/><Stat icon={Activity} label="Attendance baseline" value="78%" tone="green"/><Stat icon={ClipboardCheck} label="On-time submission" value="62%" tone="blue"/></div><div className="panel list-panel"><h2>Batch performance indicators</h2>{batches.map(b=><div className="progress-row" key={b.name}><b>{b.name}</b><span>Attendance</span><div className="progress-track"><i style={{width:`${b.attendance}%`}}/></div><strong>{b.attendance}%</strong><span>Submission</span><div className="progress-track blue-track"><i style={{width:`${b.submission}%`}}/></div><strong>{b.submission}%</strong></div>)}</div><div className="review-warning wide-warning"><AlertCircle size={16}/> These batch-level values are illustrative. Do not use them to make real learner decisions.</div></PageTitle>}
        {page === 'Reports' && <PageTitle title="Program reports" subtitle="Prepare a concise summary for trainer and management review."><div className="panel report-panel"><div className="report-header"><div><span className="eyebrow">MYAIGURU · PROGRAM SUMMARY</span><h2>Intro to AI — 4-week program</h2><p>Report preview · Sample case-study data</p></div><div className="report-icon"><FileText size={25}/></div></div><div className="report-metrics"><Metric label="Learners" value="120"/><Metric label="Attendance" value="78%"/><Metric label="On-time submissions" value="62%"/><Metric label="Avg. feedback" value="4 days"/></div><h3>Key observations</h3><ul><li>Attendance and on-time assignment submission are improvement areas.</li><li>Assignment feedback currently averages four days.</li><li>AI support could reduce repetitive preparation and response work, subject to trainer review.</li></ul><div className="review-warning"><AlertCircle size={16}/> Review all figures and narrative before sharing an official report.</div><button className="primary-btn" onClick={()=>showToast('Report preview is ready. Export is not enabled in this prototype.')}>Prepare report preview</button></div></PageTitle>}
        {page === 'AI Trainer Assistant' && <PageTitle title="AI Trainer Assistant" subtitle="A demonstration chat interface for trainer productivity support."><div className="panel chat-panel"><div className="chat-top"><div className="heading-icon purple-icon"><Sparkles/></div><div><b>MYAIGURU Assistant</b><span>Demo mode · Responses are simulated</span></div><span className="online-dot">● Demo</span></div><div className="chat-messages">{messages.map((m,i)=><div className={`message ${m.from}`} key={i}><div className="message-avatar">{m.from==='ai'?<Sparkles size={15}/>: 'TR'}</div><p>{m.text}</p></div>)}</div><div className="suggestions"><button onClick={()=>setAssistantText('Create a beginner lesson plan about neural networks')}>Create a lesson plan</button><button onClick={()=>setAssistantText('Suggest practice activities for Python loops')}>Suggest activities</button><button onClick={()=>setAssistantText('Summarize common learner difficulties in AI basics')}>Summarize learning gaps</button></div><form className="chat-input" onSubmit={sendMessage}><input value={assistantText} onChange={e=>setAssistantText(e.target.value)} placeholder="Ask for a lesson idea, quiz or progress summary..."/><button className="send-btn" aria-label="Send message"><Send size={17}/></button></form><p className="chat-disclaimer">Prototype simulation only. No external AI model is connected. Verify suggestions before using them.</p></div></PageTitle>}
      </div>
      <footer className="footer">MYAIGURU Trainer Assistant <span>·</span> Interactive frontend prototype <span>·</span> AI-assisted, human-governed</footer>
    </main>
    {mobileNav && <button className="scrim" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    {activeAssignment && <div className="modal-backdrop" onClick={()=>setActiveAssignment(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveAssignment(null)}><X size={18}/></button><div className="heading-icon blue-icon"><ClipboardCheck/></div><span className="eyebrow">ASSIGNMENT REVIEW</span><h2>{activeAssignment.title}</h2><p className="muted">{activeAssignment.batch} · {activeAssignment.submissions} submissions · Due {activeAssignment.due}</p><div className="generated-box"><b>AI-assisted review checklist</b><ul><li>Check submission against the trainer-provided rubric.</li><li>Verify technical correctness and completeness.</li><li>Provide specific, constructive improvement suggestions.</li></ul><div className="review-warning"><AlertCircle size={16}/> AI feedback is only a suggestion. The trainer must verify the work and approve final grades.</div></div><div className="modal-actions"><button className="secondary-btn" onClick={()=>setActiveAssignment(null)}>Close</button><button className="primary-btn" onClick={approveAssignment}><Check size={16}/> Mark reviewed</button></div></div></div>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
function Stat({icon:Icon,label,value,foot,trend,tone}) {return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>{trend && <em>{trend}</em>} {foot}</small></div></div>}
function Tool({icon:Icon,title,onClick}) {return <button className="tool-tile" onClick={onClick}><Icon size={22}/><b>{title}</b></button>}
function Insight({icon:Icon,text}) {return <div className="insight-row"><div><Icon size={17}/></div><p>{text}</p></div>}
function Metric({label,value}) {return <div className="metric"><span>{label}</span><b>{value}</b></div>}
function PageTitle({title,subtitle,children}) {return <><section className="welcome-row page-welcome"><div><div className="eyebrow">MYAIGURU WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div></section>{children}</>}

createRoot(document.getElementById('root')).render(<App/>);
