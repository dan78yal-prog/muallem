
import { ClassGroup, DayOfWeek, ScheduleSlot } from './types';

// Simple robust ID generator for local use
const generateId = () => {
  return 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'c1',
    name: 'الصف الأول - أ',
    students: [
      { id: 's1', name: 'أحمد محمد', notes: '', attendance: {}, participationScore: 8 },
      { id: 's2', name: 'خالد علي', notes: 'يحتاج متابعة في القراءة', attendance: {}, participationScore: 6 },
      { id: 's3', name: 'سارة عبدالله', notes: 'ممتازة', attendance: {}, participationScore: 10 },
    ],
  },
  {
    id: 'c2',
    name: 'الصف الثاني - ب',
    students: [
      { id: 's4', name: 'فهد عمر', notes: '', attendance: {}, participationScore: 7 },
      { id: 's5', name: 'نورة سعيد', notes: '', attendance: {}, participationScore: 9 },
    ],
  },
];

export const INITIAL_SCHEDULE: ScheduleSlot[] = [];

// Populate empty schedule (7 Periods)
const days = [DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY];

days.forEach((day) => {
  for (let i = 1; i <= 7; i++) {
    INITIAL_SCHEDULE.push({
      id: generateId(),
      day: day,
      period: i,
      className: '',
    });
  }
});
