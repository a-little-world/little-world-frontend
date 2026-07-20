import { FC } from 'react';

import { useParams } from 'react-router-dom';

import DynamicCourse from './DynamicCourse';

const CoursePreview: FC = () => {
  const { courseSlug } = useParams();
  return <DynamicCourse slug={courseSlug} preview />;
};

export default CoursePreview;
