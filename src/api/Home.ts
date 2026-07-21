import { ApiURL } from "../api/ApiConf";


// ─── Types ─────────────────────────────────────────────────────────────────
export interface Profile {
  id: number;
  fullName: string;
  image?: string;
  email?: string;
  userName: string;
}

export interface StudentCourse {
  courseID: number;
  title: string;
  image?: string;
  feesPerMonth: number;
  startDate: string;
  endDate?: string;
  isPaid?: boolean;
  totalContents: number;
}

export interface StudentStats {
  enrolledCourses: number;
  paidSubscriptions: number;
  activeSubscriptions: number;
}

export interface StudentHomeDto {
  profile: Profile;
  courses: StudentCourse[];
  stats: StudentStats;
}

export interface TeacherCourse {
  courseID: number;
  title: string;
  image?: string;
  feesPerMonth: number;
  permission: string;
  totalContents: number;
  totalStudents: number;
}

export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  totalContent: number;
}

export interface TeacherHomeDto {
  profile: Profile;
  courses: TeacherCourse[];
  stats: TeacherStats;
}



// ─── API calls ─────────────────────────────────────────────────────────────
export type HomeDto =
  | { role: 1; data: StudentHomeDto }
  | { role: 2; data: TeacherHomeDto }
 ;

export async function fetchHome(): Promise<HomeDto> {
  const res = await fetch(`${ApiURL}Home`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load home data");

  return res.json();
}
