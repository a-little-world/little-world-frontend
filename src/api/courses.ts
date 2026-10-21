import { apiFetch } from './helpers';
import { ApiError } from './types';

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
  image?: string | null;
  chapters: ApiCourseChapter[];
}

export const getCourseEndpoint = (slug: string) => `/api/courses/${slug}/`;

export const fetchCourseDetail = (slug: string) =>
  apiFetch<CourseDetail>(getCourseEndpoint(slug));

/** Staff preview of draft/inactive courses (requires matching permission on the API). */
export const fetchCoursePreview = (slug: string) =>
  apiFetch<CourseDetail>(`/api/courses/preview/${slug}/`);

export const SELF_ONBOARDING_COURSE_ENDPOINT = '/api/self-onboarding/course/';

export const fetchSelfOnboardingCourse = () =>
  apiFetch<CourseDetail>(SELF_ONBOARDING_COURSE_ENDPOINT);

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
  chapter_count: number;
  completed_chapter_count: number;
  progress_fraction: number;
}

export const getCourseProgressEndpoint = (slug: string) =>
  `/api/courses/${slug}/progress/`;

export const fetchCourseProgress = async (
  slug: string,
): Promise<CourseProgress | null> => {
  try {
    return await apiFetch<CourseProgress>(getCourseProgressEndpoint(slug));
  } catch (error) {
    if ((error as ApiError).status === 404) {
      return null;
    }
    throw error;
  }
};

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
