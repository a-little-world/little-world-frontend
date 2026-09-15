import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CourseChapter } from '../components/blocks/Course/Course.ts';
import { getCompletedChapterCountForCourseProgress } from './course.ts';

function chapter(id: string, questionCount: number): CourseChapter {
  return {
    id,
    title: id,
    video: { url: `https://example.test/${id}` },
    quizSteps: Array.from({ length: questionCount }, (_, i) => ({
      id: `${id}_q_${i}`,
      question: `${id} question ${i}`,
      required: true,
      options: [
        { id: '0', label: 'a' },
        { id: '1', label: 'b' },
      ],
      correctOptionId: '0',
    })),
  };
}

// The shape that surfaced the bug: a video-only first chapter, then 1 and 2 questions.
const CHAPTERS = [chapter('ch1', 0), chapter('ch2', 1), chapter('ch3', 2)];

describe('getCompletedChapterCountForCourseProgress', () => {
  it('counts nothing before the course is started', () => {
    assert.equal(getCompletedChapterCountForCourseProgress(CHAPTERS, ''), 0);
  });

  it('counts chapters behind the one the learner is on', () => {
    assert.equal(getCompletedChapterCountForCourseProgress(CHAPTERS, 'ch1'), 0);
    assert.equal(getCompletedChapterCountForCourseProgress(CHAPTERS, 'ch2'), 1);
    assert.equal(getCompletedChapterCountForCourseProgress(CHAPTERS, 'ch3'), 2);
  });

  it('counts every chapter once the course is completed', () => {
    // `current_chapter_id` stays on the last chapter after it is finished, so the
    // index alone caps at 2 and leaves the final chapter looking in progress.
    assert.equal(
      getCompletedChapterCountForCourseProgress(CHAPTERS, 'ch3', true),
      CHAPTERS.length,
    );
  });

  it('trusts completion even if the current chapter is unknown or unset', () => {
    assert.equal(
      getCompletedChapterCountForCourseProgress(CHAPTERS, '', true),
      CHAPTERS.length,
    );
    assert.equal(
      getCompletedChapterCountForCourseProgress(CHAPTERS, 'removed', true),
      CHAPTERS.length,
    );
  });

  it('defaults to not-completed so existing callers are unchanged', () => {
    assert.equal(getCompletedChapterCountForCourseProgress(CHAPTERS, 'ch3'), 2);
  });
});
