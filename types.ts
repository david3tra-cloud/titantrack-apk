
export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed?: boolean;
  restTime?: string; // Prescribed rest time for this set
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
}

export interface Recommendation {
  title: string;
  description: string;
  category: 'strength' | 'recovery' | 'nutrition' | 'technique';
}

export interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
}

export enum View {
  DASHBOARD = 'dashboard',
  LOG = 'log',
  PROGRESS = 'progress',
  RECS = 'recommendations',
  ROUTINES = 'routines',
  WEIGHT = 'weight',
  EXERCISES = 'exercises'
}
