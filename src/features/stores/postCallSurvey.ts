import { create } from 'zustand';

interface PostCallSurveyData {
  review_id?: number;
  live_session_id?: string;
  rating?: number;
  review?: string;
}

interface PostCallSurveyState {
  postCallSurvey: PostCallSurveyData | null;
  addPostCallSurvey: (data: PostCallSurveyData) => void;
  updatePostCallSurvey: (data: Partial<PostCallSurveyData>) => void;
  removePostCallSurvey: () => void;
}

const usePostCallSurveyStore = create<PostCallSurveyState>(set => ({
  postCallSurvey: null,
  addPostCallSurvey: data => set({ postCallSurvey: data }),
  updatePostCallSurvey: data =>
    set(state => ({
      postCallSurvey: state.postCallSurvey ?
        { ...state.postCallSurvey, ...data } :
        data,
    })),
  removePostCallSurvey: () => set({ postCallSurvey: null }),
}));

export default usePostCallSurveyStore;
