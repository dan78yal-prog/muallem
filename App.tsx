
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ClassManager } from './components/ClassManager';
import { StudentTracker } from './components/StudentTracker';
import { TaskManager } from './components/TaskManager';
import { ReportsDashboard } from './components/ReportsDashboard';
import { SettingsView } from './components/SettingsView';
import { ViewMode, ScheduleSlot, ClassGroup, Student, Task, ThemeColor, AppSettings, AppNotification } from './types';
import { INITIAL_CLASSES, INITIAL_SCHEDULE } from './constants';
import { Moon, Sun, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function App() {
  // Load data from LocalStorage or use defaults
  const [currentView, setCurrentView] = useState<ViewMode>('schedule');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      themeColor: 'emerald',
      teacherName: 'المعلم الذكي',
      schoolName: 'مدرستي المتميزة'
    };
  });
  
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    const saved = localStorage.getItem('schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });
  
  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'تحضير درس الرياضيات ليوم الأحد', completed: false, priority: 'high' }
    ];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => localStorage.setItem('appSettings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('schedule', JSON.stringify(schedule)), [schedule]);
  useEffect(() => localStorage.setItem('classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const themeClasses: Record<ThemeColor, string> = {
    emerald: 'theme-emerald',
    blue: 'theme-blue',
    purple: 'theme-purple',
    orange: 'theme-orange',
    rose: 'theme-rose'
  };

  const handleUpdateSchedule = (updatedSlot: ScheduleSlot) => {
    setSchedule(prev => prev.map(slot => 
        (slot.day === updatedSlot.day && slot.period === updatedSlot.period) 
        ? updatedSlot 
        : slot
    ));
    addNotification('تم تحديث الجدول بنجاح');
  };

  const handleAddClass = (name: string) => {
    const newClass: ClassGroup = {
        id: 'cls_' + Date.now(),
        name,
        students: []
    };
    setClasses([...classes, newClass]);
    addNotification(`تمت إضافة فصل ${name}`);
  };

  const handleDeleteClass = (id: string) => {
      const cls = classes.find(c => c.id === id);
      setClasses(classes.filter(c => c.id !== id));
      addNotification(`تم حذف فصل ${cls?.name || ''}`, 'info');
  };

  const handleAddStudent = (classId: string, name: string) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: [...c.students, {
                      id: 'std_' + Date.now() + Math.random().toString(36).substring(7),
                      name,
                      notes: '',
                      attendance: {},
                      participationScore: 10
                  }]
              };
          }
          return c;
      }));
      addNotification(`تمت إضافة الطالب ${name}`);
  };

  const handleImportStudents = (classId: string, names: string[]) => {
    setClasses(classes.map(c => {
        if (c.id === classId) {
            const newStudents: Student[] = names.map((name, i) => ({
                id: 'std_imp_' + Date.now() + i,
                name,
                notes: '',
                attendance: {},
                participationScore: 10
            }));
            return {
                ...c,
                students: [...c.students, ...newStudents]
            };
        }
        return c;
    }));
    addNotification(`تم استيراد ${names.length} طالب بنجاح`);
  };

  const handleDeleteStudent = (classId: string, studentId: string) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: c.students.filter(s => s.id !== studentId)
              };
          }
          return c;
      }));
      addNotification('تم حذف الطالب', 'info');
  };

  const handleUpdateStudent = (classId: string, updatedStudent: Student) => {
      setClasses(classes.map(c => {
          if (c.id === classId) {
              return {
                  ...c,
                  students: c.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
              };
          }
          return c;
      }));
  };

  const handleAddTask = (text: string, priority: 'high' | 'medium' | 'low', date?: string) => {
      const newTask: Task = {
          id: 'tsk_' + Date.now(),
          text,
          completed: false,
          priority,
          dueDate: date
      };
      setTasks([...tasks, newTask]);
      addNotification('تمت إضافة المهمة');
  };

  const handleToggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
      addNotification('تمت إزالة المهمة', 'info');
  };

  return (
    <div className={`flex h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden flex-col lg:flex-row transition-colors duration-300 ${themeClasses[settings.themeColor]}`}>
      
      {/* Notifications - Safe area aware */}
      <div className="fixed top-safe left-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none mt-4 md:mt-0">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-left-full duration-300 ${
            n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/90 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100' :
            n.type === 'error' ? 'bg-red-50 dark:bg-red-900/90 border-red-100 dark:border-red-800 text-red-800 dark:text-red-100' :
            'bg-blue-50 dark:bg-blue-900/90 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-100'
          }`}>
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {n.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-bold flex-1">{n.message}</p>
            <button onClick={() => removeNotification(n.id)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>
        ))}
      </div>

      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 h-full overflow-hidden relative flex flex-col pt-safe">
        {/* Banner with Safe Area Header */}
        <div className="h-24 md:h-48 relative w-full shrink-0 overflow-hidden group">
            <img 
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070&auto=format&fit=crop" 
                alt="Banner" 
                className="w-full h-full object-cover object-center opacity-90 dark:opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
            
            {/* Desktop Theme Toggle */}
            <div className="absolute top-4 left-4 hidden lg:block">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md text-slate-800 dark:text-white shadow-lg transition-all hover:scale-105 border border-white/20"
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="text-sm font-bold">{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
                </button>
            </div>

            {/* Title Section (Visible on Mobile inside Banner area) */}
            <div className="absolute bottom-10 right-4 lg:hidden">
                 <h1 className="text-2xl font-black text-slate-800 dark:text-white drop-shadow-md">
                   {currentView === 'schedule' && 'الجدول الدراسي'}
                   {currentView === 'tracker' && 'متابعة الطلاب'}
                   {currentView === 'classes' && 'إدارة الفصول'}
                   {currentView === 'tasks' && 'المهام اليومية'}
                   {currentView === 'reports' && 'التقارير'}
                   {currentView === 'settings' && 'الإعدادات'}
                 </h1>
            </div>
        </div>

        <div className="flex-1 container mx-auto max-w-7xl lg:p-0 animate-in fade-in duration-500 slide-in-from-bottom-2 overflow-hidden flex flex-col -mt-8 relative z-10">
            <div className="flex-1 h-full overflow-hidden">
                 {currentView === 'schedule' && (
                    <WeeklyPlanner 
                        schedule={schedule} 
                        classes={classes}
                        updateSchedule={handleUpdateSchedule} 
                        notify={addNotification}
                    />
                )}
                {currentView === 'classes' && (
                    <ClassManager 
                        classes={classes}
                        addClass={handleAddClass}
                        deleteClass={handleDeleteClass}
                        addStudent={handleAddStudent}
                        importStudents={handleImportStudents}
                        deleteStudent={handleDeleteStudent}
                    />
                )}
                {currentView === 'tracker' && (
                    <StudentTracker 
                        classes={classes}
                        updateStudent={handleUpdateStudent}
                        notify={addNotification}
                    />
                )}
                {currentView === 'tasks' && (
                    <TaskManager 
                        tasks={tasks}
                        addTask={handleAddTask}
                        toggleTask={handleToggleTask}
                        deleteTask={handleDeleteTask}
                    />
                )}
                {currentView === 'reports' && (
                    <ReportsDashboard 
                        classes={classes}
                        schedule={schedule}
                    />
                )}
                {currentView === 'settings' && (
                    <SettingsView 
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
            </div>
        </div>
      </main>

      {/* Mobile Dark Mode Toggle - Floating */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
           <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
      </div>
    </div>
  );
}

export default App;
