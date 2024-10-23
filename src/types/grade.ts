export interface Grade {
  id: string;
  name: string;
  value: number;
  weight: number;
  subject: string;
  date: string;
}

export interface GradeStats {
  average: number;
  highest: number;
  lowest: number;
  count: number;
}