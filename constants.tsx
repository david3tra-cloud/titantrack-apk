
import React from 'react';

export const EXERCISE_CATEGORIES = [
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Core',
  'Cardio'
];

export const INITIAL_EXERCISES = [
  'Press de Banca',
  'Sentadillas',
  'Peso Muerto',
  'Press Militar',
  'Dominadas',
  'Remo con Barra',
  'Curl de Bíceps',
  'Extensiones de Tríceps',
  'Zancadas'
];

export interface ExerciseDetail {
  name: string;
  category: string;
  description: string;
  drawing: React.ReactNode; 
}

export const EXERCISE_DATABASE: ExerciseDetail[] = [
  {
    name: 'Press de Banca',
    category: 'Pecho',
    description: 'Ejercicio compuesto que trabaja pectorales, tríceps y deltoides anterior. Enfoque en el empuje explosivo.',
    drawing: (
      <>
        <path d="M 15 75 L 85 75 M 30 75 L 30 90 M 70 75 L 70 90" stroke="#334155" strokeWidth="3" fill="none" />
        <circle cx="25" cy="70" r="5" fill="#00f2ff" />
        <path d="M 30 70 L 75 70 M 75 70 L 85 85" stroke="#00f2ff" strokeWidth="4" fill="none" />
        <path d="M 50 40 L 50 65" stroke="#ff00f7" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M 20 55 L 80 55" stroke="#f8fafc" strokeWidth="3" />
        <rect x="15" y="48" width="6" height="14" rx="1" fill="#ff00f7" />
        <rect x="79" y="48" width="6" height="14" rx="1" fill="#ff00f7" />
      </>
    )
  },
  {
    name: 'Sentadillas',
    category: 'Piernas',
    description: 'Máximo reclutamiento de fibras. Mantén la tensión constante en cuádriceps y glúteos.',
    drawing: (
      <>
        <circle cx="50" cy="25" r="5" fill="#00f2ff" />
        <path d="M 50 30 L 50 55 L 35 70 L 50 85" stroke="#00f2ff" strokeWidth="4" fill="none" />
        <path d="M 25 35 L 75 35" stroke="#f8fafc" strokeWidth="3" />
        <rect x="20" y="28" width="6" height="14" rx="1" fill="#ff00f7" />
        <rect x="74" y="28" width="6" height="14" rx="1" fill="#ff00f7" />
        <path d="M 75 60 L 75 80" stroke="#ff00f7" strokeWidth="2" strokeDasharray="4 2" />
      </>
    )
  },
  {
    name: 'Peso Muerto',
    category: 'Espalda',
    description: 'Poder absoluto de tracción. Ideal para desarrollar una espalda densa y piernas fuertes.',
    drawing: (
      <>
        <path d="M 10 90 L 90 90" stroke="#334155" strokeWidth="2" />
        <circle cx="65" cy="40" r="5" fill="#00f2ff" />
        <path d="M 60 42 L 40 60 L 45 88" stroke="#00f2ff" strokeWidth="4" fill="none" />
        <path d="M 10 85 L 50 85" stroke="#f8fafc" strokeWidth="3" />
        <circle cx="15" cy="85" r="7" fill="#ff00f7" />
        <circle cx="45" cy="85" r="7" fill="#ff00f7" />
        <path d="M 25 75 L 25 55" stroke="#ff00f7" strokeWidth="2" />
      </>
    )
  },
  {
    name: 'Press Militar',
    category: 'Hombros',
    description: 'Construye hombros 3D. Controla el descenso y empuja con fuerza hacia el cielo.',
    drawing: (
      <>
        <circle cx="50" cy="45" r="5" fill="#00f2ff" />
        <path d="M 50 50 L 50 75 L 40 95 M 50 75 L 60 95" stroke="#00f2ff" strokeWidth="4" fill="none" />
        <path d="M 20 20 L 80 20" stroke="#f8fafc" strokeWidth="3" />
        <rect x="14" y="13" width="6" height="14" rx="1" fill="#ff00f7" />
        <rect x="80" y="13" width="6" height="14" rx="1" fill="#ff00f7" />
        <path d="M 50 35 L 50 15" stroke="#ff00f7" strokeWidth="2" strokeDasharray="3 2" />
      </>
    )
  }
];
