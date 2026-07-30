import { useState } from 'react';
import { Plus, Check, Clock, Circle, FolderOpen, Sparkles, FileSpreadsheet, Eye, ChevronLeft, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGovStore } from '../../context/GovContext';
import { Modal } from '../../../../../shared/ui/Modal';

export function ProjectsPlanning() {
  const { state, addProject, updateProjectProgress, showToast } = useGovStore();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1');

  // Modals
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);

  // Form states for Add Project
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDept, setNewProjectDept] = useState('Urban Planning');
  const [newProjectBudget, setNewProjectBudget] = useState('');

  // Form states for Update Progress
  const [progressValue, setProgressValue] = useState(0);

  const overviewCards = [
    { title: 'Active Projects', value: state.projects.filter(p => p.status !== 'Completed').length.toString() },
    { title: 'Completed', value: state.projects.filter(p => p.status === 'Completed').length.toString() },
    { title: 'Planning', value: state.projects.filter(p => p.status === 'Planning').length.toString() },
    { title: 'Delayed', value: '0' },
    { title: 'Budget Used', value: '₹12.4 / 18C' },
    { title: 'Expected AQI Gain', value: '+8%' },
  ];

  const activeProjects = state.projects;
  const selectedProject = activeProjects.find(p => p.id === selectedProjectId) || activeProjects[0];

  const handleAddProject = () => {
    if (!newProjectName || !newProjectBudget) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    
    const newId = Math.random().toString(36).substr(2, 9);
    addProject({
      id: newId,
      name: newProjectName,
      department: newProjectDept,
      status: 'Planning',
      progress: 0,
      budget: `₹${newProjectBudget} Cr`,
      startDate: 'TBD',
      targetCompletion: 'TBD',
      objectives: ['Project initialization'],
      impact: { aqiImprovement: 'TBD', population: 'TBD', targetAreas: 'TBD' },
      milestones: [],
      stages: [
        { name: 'Planning', status: 'in_progress' },
        { name: 'Procurement', status: 'pending' },
        { name: 'Execution', status: 'pending' },
        { name: 'Monitoring', status: 'pending' },
        { name: 'Completed', status: 'pending' },
      ],
      summary: 'Newly created project. Pending detailed planning.'
    });

    showToast('Project created successfully', 'success');
    setIsAddProjectOpen(false);
    setSelectedProjectId(newId);
    
    // reset form
    setNewProjectName('');
    setNewProjectBudget('');
  };

  const openUpdateProgress = () => {
    setProgressValue(selectedProject.progress);
    setIsUpdateProgressOpen(true);
  };

  const handleUpdateProgress = () => {
    updateProjectProgress(selectedProject.id, progressValue);
    showToast(`Progress updated to ${progressValue}%`, 'success');
    setIsUpdateProgressOpen(false);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6 overflow-hidden h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <Link to="/government" className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-gov-text-muted)] hover:text-[var(--color-gov-brand)] uppercase tracking-wider mb-2 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Executive Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-gov-text-primary)]">Projects & Planning</h1>
          <p className="text-[13px] text-[var(--color-gov-text-secondary)] mt-1">Monitor ongoing environmental initiatives and their expected impact.</p>
        </div>
        <button 
          onClick={() => setIsAddProjectOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white rounded-lg font-bold text-[13px] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
        {overviewCards.map((card, i) => (
          <div key={i} className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl p-4 shadow-sm flex flex-col">
            <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-2">{card.title}</span>
            <span className="text-2xl font-black text-[var(--color-gov-text-primary)]">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid (Master-Detail) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0 shrink-0">
        
        {/* Left Column (Master - xl:col-span-7) */}
        <div className="xl:col-span-7 bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-[var(--color-gov-border)] bg-[var(--color-gov-surface)]">
            <h2 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Active Projects</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--color-gov-surface)] border-b border-[var(--color-gov-border)] z-10">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider w-32">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-gov-border)] bg-[var(--color-gov-card)]">
                {activeProjects.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedProjectId(row.id)}
                    className={`cursor-pointer transition-colors ${selectedProjectId === row.id ? 'bg-[var(--color-gov-brand-surface)]' : 'hover:bg-[var(--color-gov-surface)]'}`}
                  >
                    <td className="px-4 py-4 relative">
                      {selectedProjectId === row.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-gov-brand)]"></div>
                      )}
                      <span className={`text-[13px] font-bold ${selectedProjectId === row.id ? 'text-[var(--color-gov-brand)]' : 'text-[var(--color-gov-text-primary)]'}`}>
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[var(--color-gov-text-secondary)]">{row.department}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${
                        row.progress === 100 || row.status === 'Completed' ? 'bg-[var(--color-gov-success)]/10 text-[var(--color-gov-success)]' :
                        row.status === 'In Progress' ? 'bg-[var(--color-gov-brand)]/10 text-[var(--color-gov-brand)]' :
                        row.status === 'Planning' ? 'bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] text-[var(--color-gov-text-secondary)]' :
                        'bg-[var(--color-gov-critical)]/10 text-[var(--color-gov-critical)]'
                      }`}>
                        {row.progress === 100 ? 'Completed' : row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-gov-border)] overflow-hidden">
                          <div className={`h-full rounded-full ${
                            row.progress === 100 ? 'bg-[var(--color-gov-success)]' : 'bg-[var(--color-gov-brand)]'
                          }`} style={{ width: `${row.progress}%` }}></div>
                        </div>
                        <span className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] w-6">{row.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (Detail - xl:col-span-5) */}
        <div className="xl:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1 pb-1">
          
          {selectedProject ? (
            <>
              {/* Project Details */}
              <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-5 shrink-0 flex flex-col gap-4 relative">
                
                <button 
                  onClick={openUpdateProgress}
                  className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] hover:bg-[var(--color-gov-brand-surface)] hover:text-[var(--color-gov-brand)] hover:border-[var(--color-gov-brand)]/50 rounded-lg text-[11px] font-bold text-[var(--color-gov-text-secondary)] transition-all"
                >
                  <Percent className="w-3.5 h-3.5" /> Update Progress
                </button>

                <div>
                  <h2 className="text-2xl font-black text-[var(--color-gov-text-primary)] leading-tight pr-32">{selectedProject.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                      selectedProject.progress === 100 || selectedProject.status === 'Completed' ? 'bg-[var(--color-gov-success)]/10 text-[var(--color-gov-success)]' :
                      selectedProject.status === 'In Progress' ? 'bg-[var(--color-gov-brand)]/10 text-[var(--color-gov-brand)]' :
                      'bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] text-[var(--color-gov-text-secondary)]'
                    }`}>
                      {selectedProject.progress === 100 ? 'Completed' : selectedProject.status}
                    </span>
                    <span className="text-[14px] font-bold text-[var(--color-gov-text-secondary)]">• {selectedProject.department}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[12px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Timeline</span>
                    <span className="text-[15px] font-bold text-[var(--color-gov-text-primary)]">{selectedProject.startDate} — {selectedProject.targetCompletion}</span>
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-1">Budget</span>
                    <span className="text-[15px] font-bold text-[var(--color-gov-text-primary)]">{selectedProject.budget}</span>
                  </div>
                </div>

                {/* Current Progress Tracker */}
                <div className="pt-2">
                  <span className="text-[12px] font-bold text-[var(--color-gov-text-muted)] uppercase tracking-wider block mb-3">Current Progress</span>
                  {selectedProject.stages ? (
                    <div className="flex items-center justify-between gap-1 w-full overflow-hidden">
                      {selectedProject.stages.map((stage, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                          {/* Line behind circles */}
                          {i !== (selectedProject.stages?.length ?? 5) - 1 && (
                            <div className="absolute top-3 left-1/2 w-full h-px bg-[var(--color-gov-border)] -z-10"></div>
                          )}
                          
                          {/* Circle icon */}
                          <div className="bg-[var(--color-gov-card)]">
                            {selectedProject.progress === 100 || stage.status === 'completed' ? (
                              <div className="w-6 h-6 rounded-full bg-[var(--color-gov-success)] flex items-center justify-center shadow-sm">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : stage.status === 'in_progress' ? (
                              <div className="w-6 h-6 rounded-full bg-[var(--color-gov-brand-surface)] border-2 border-[var(--color-gov-brand)] flex items-center justify-center shadow-sm">
                                <Clock className="w-3.5 h-3.5 text-[var(--color-gov-brand)]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] flex items-center justify-center">
                                <Circle className="w-2.5 h-2.5 text-[var(--color-gov-border)] fill-current" />
                              </div>
                            )}
                          </div>
                          
                          <span className={`text-[11px] font-bold text-center ${(selectedProject.progress === 100 || stage.status !== 'pending') ? 'text-[var(--color-gov-text-primary)]' : 'text-[var(--color-gov-text-muted)]'}`}>
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 h-3 rounded-full bg-[var(--color-gov-border)] overflow-hidden">
                        <div className={`h-full rounded-full ${
                          selectedProject.progress === 100 ? 'bg-[var(--color-gov-success)]' : 'bg-[var(--color-gov-brand)]'
                        }`} style={{ width: `${selectedProject.progress}%` }}></div>
                      </div>
                      <span className="text-[14px] font-black text-[var(--color-gov-text-primary)]">{selectedProject.progress}%</span>
                    </div>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                {/* Expected Impact */}
                <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-4 flex flex-col justify-center">
                  <h3 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-4">Expected Impact</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[var(--color-gov-text-secondary)]">AQI Improvement</span>
                      <span className="text-[14px] font-bold text-[var(--color-gov-success)]">{selectedProject.impact?.aqiImprovement}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[var(--color-gov-text-secondary)]">Population</span>
                      <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{selectedProject.impact?.population}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[var(--color-gov-text-secondary)]">Target Areas</span>
                      <span className="text-[14px] font-bold text-[var(--color-gov-text-primary)]">{selectedProject.impact?.targetAreas}</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Milestones */}
                <div className="bg-[var(--color-gov-card)] border border-[var(--color-gov-border)] rounded-xl shadow-sm p-4 flex flex-col min-h-[160px]">
                  <h3 className="text-[13px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider mb-3 shrink-0">Milestones</h3>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-3">
                      {selectedProject.milestones?.length ? selectedProject.milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-[12px] font-bold text-[var(--color-gov-text-muted)] w-12 shrink-0">{m.date}</span>
                          <span className={`text-[13px] leading-snug ${m.completed ? 'text-[var(--color-gov-text-secondary)] line-through' : 'text-[var(--color-gov-text-primary)] font-bold'}`}>
                            {m.milestone}
                          </span>
                        </div>
                      )) : (
                        <span className="text-[12px] text-[var(--color-gov-text-muted)] italic">No milestones defined yet.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Project Summary */}
              <div className="bg-gradient-to-br from-[var(--color-gov-brand-surface)] to-[var(--color-gov-surface)] border border-[var(--color-gov-brand)]/30 rounded-xl p-5 shadow-sm shrink-0 mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-gov-brand)]" />
                  <h2 className="text-[13px] font-bold text-[var(--color-gov-brand)] uppercase tracking-wider">AI Summary</h2>
                </div>
                <div className="text-[14px] text-[var(--color-gov-text-primary)] leading-relaxed">
                  {selectedProject.summary}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-xl shadow-sm flex flex-col items-center justify-center flex-1 min-h-0 text-[var(--color-gov-text-muted)]">
              <FolderOpen className="w-12 h-12 mb-4" />
              <p className="text-[14px] font-medium">Select a project to view details</p>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} title="New Project">
        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Project Name</label>
            <input 
              type="text" 
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="e.g. Smart City Park"
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Department</label>
            <select 
              value={newProjectDept}
              onChange={e => setNewProjectDept(e.target.value)}
              className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg px-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none cursor-pointer"
            >
              <option>Urban Planning</option>
              <option>Environment</option>
              <option>Pollution Board</option>
              <option>Health</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[var(--color-gov-text-secondary)] uppercase tracking-wider">Budget Allocation (Cr)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[var(--color-gov-text-muted)]">₹</span>
              <input 
                type="number" 
                value={newProjectBudget}
                onChange={e => setNewProjectBudget(e.target.value)}
                placeholder="2.5"
                className="w-full bg-[var(--color-gov-surface)] border border-[var(--color-gov-border)] rounded-lg pl-8 pr-3 py-2 text-[14px] text-[var(--color-gov-text-primary)] focus:border-[var(--color-gov-brand)] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={handleAddProject} className="px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white font-bold rounded-lg text-[13px] transition-colors">
              Create Project
            </button>
          </div>

        </div>
      </Modal>

      <Modal isOpen={isUpdateProgressOpen} onClose={() => setIsUpdateProgressOpen(false)} title="Update Project Progress">
        <div className="flex flex-col gap-6">
          <div className="text-[13px] text-[var(--color-gov-text-secondary)]">
            Adjust the progress for <strong>{selectedProject?.name}</strong>. Current progress is {selectedProject?.progress}%.
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[16px] font-black text-[var(--color-gov-text-primary)]">
              <span>{progressValue}%</span>
              {progressValue === 100 && <span className="text-[12px] font-bold text-[var(--color-gov-success)] uppercase">Completed</span>}
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              className="w-full accent-[var(--color-gov-brand)] h-2 bg-[var(--color-gov-surface)] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end mt-2">
            <button onClick={handleUpdateProgress} className="px-4 py-2 bg-[var(--color-gov-brand)] hover:bg-[var(--color-gov-brand-hover)] text-white font-bold rounded-lg text-[13px] transition-colors">
              Save Progress
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
