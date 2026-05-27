import { apiFetch } from './helpers';

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  is_active: boolean;
  available_to: 'all' | 'learner' | 'volunteer';
  chapter_count: number;
}

export const COURSES_ENDPOINT = '/api/courses/';

export const fetchCourses = () => apiFetch<Course[]>(COURSES_ENDPOINT);

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------

export interface ApiQuizStep {
  order: number;
  question: string;
  answers: string[];
  correct_answer: string;
}

export interface ApiCourseChapter {
  chapter_id: string;
  order: number;
  title: string;
  description: string;
  video_url: string;
  video_title: string;
  completed_title: string;
  completed_description: string;
  completed_additional_text: string;
  completed_cta_label: string;
  quiz_steps: ApiQuizStep[];
}

export interface CourseDetail {
  slug: string;
  title: string;
  description: string;
  chapters: ApiCourseChapter[];
}

export const fetchCourseDetail = (slug: string, preview = false) =>
  apiFetch<CourseDetail>(`/api/courses/${slug}/${preview ? '?preview=1' : ''}`);

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export interface CourseProgress {
  course_slug: string;
  started_at: string;
  current_chapter_id: string;
  current_step_index: number;
  completed: boolean;
  completed_at: string | null;
}

export const startCourse = (slug: string) =>
  apiFetch<CourseProgress>(`/api/courses/${slug}/start/`, { method: 'POST' });

export const updateCourseProgress = (
  slug: string,
  data: { current_chapter_id: string; current_step_index: number },
) =>
  apiFetch<CourseProgress>(`/api/courses/${slug}/progress/`, {
    method: 'PATCH',
    body: data,
  });

export const completeCourse = (slug: string) =>
  apiFetch<CourseProgress>(`/api/courses/${slug}/complete/`, {
    method: 'POST',
  });
