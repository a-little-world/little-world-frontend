// Report type constants
export const REPORT_TYPE_UNMATCH = 'unmatch' as const;
export const REPORT_TYPE_PARTNER = 'report_partner' as const;
export const REPORT_TYPE_CALL_QUALITY = 'call_quality' as const;
export const REPORT_TYPE_USER = 'report_user' as const;

export type ReportType =
  | typeof REPORT_TYPE_UNMATCH
  | typeof REPORT_TYPE_PARTNER
  | typeof REPORT_TYPE_CALL_QUALITY
  | typeof REPORT_TYPE_USER;

export interface ReportKeywordOption {
  id: string;
  translationKey: string;
  value: string;
}

export const REPORT_TYPE_OPTIONS: ReportKeywordOption[] = [
  {
    id: REPORT_TYPE_CALL_QUALITY,
    translationKey: 'report.call_quality.label',
    value: REPORT_TYPE_CALL_QUALITY,
  },
  {
    id: REPORT_TYPE_USER,
    translationKey: 'report.user.label',
    value: REPORT_TYPE_USER,
  },
];

export const CALL_QUALITY_KEYWORDS: ReportKeywordOption[] = [
  {
    id: 'poor_audio',
    translationKey: 'report.call_quality.poor_audio',
    value: 'poor_audio',
  },
  {
    id: 'video_issues',
    translationKey: 'report.call_quality.video_issues',
    value: 'video_issues',
  },
  {
    id: 'connection_problems',
    translationKey: 'report.call_quality.connection_problems',
    value: 'connection_problems',
  },
  {
    id: 'lagging',
    translationKey: 'report.call_quality.lagging',
    value: 'lagging',
  },
  {
    id: 'frozen_screen',
    translationKey: 'report.call_quality.frozen_screen',
    value: 'frozen_screen',
  },
  {
    id: 'audio_delay',
    translationKey: 'report.call_quality.audio_delay',
    value: 'audio_delay',
  },
  {
    id: 'poor_quality',
    translationKey: 'report.call_quality.poor_quality',
    value: 'poor_quality',
  },
];

export const USER_KEYWORDS: ReportKeywordOption[] = [
  {
    id: 'inappropriate_behavior',
    translationKey: 'report.user.inappropriate_behavior',
    value: 'inappropriate_behavior',
  },
  {
    id: 'harassment',
    translationKey: 'report.user.harassment',
    value: 'harassment',
  },
  {
    id: 'spam',
    translationKey: 'report.user.spam',
    value: 'spam',
  },
  {
    id: 'fake_profile',
    translationKey: 'report.user.fake_profile',
    value: 'fake_profile',
  },
  {
    id: 'safety_concern',
    translationKey: 'report.user.safety_concern',
    value: 'safety_concern',
  },
  {
    id: 'offensive_language',
    translationKey: 'report.user.offensive_language',
    value: 'offensive_language',
  },
  {
    id: 'inappropriate_content',
    translationKey: 'report.user.inappropriate_content',
    value: 'inappropriate_content',
  },
];

export const REPORT_KEYWORDS_BY_TYPE: Partial<
  Record<ReportType, ReportKeywordOption[]>
> = {
  [REPORT_TYPE_CALL_QUALITY]: CALL_QUALITY_KEYWORDS,
  [REPORT_TYPE_USER]: USER_KEYWORDS,
  [REPORT_TYPE_PARTNER]: USER_KEYWORDS,
  // unmatch doesn't have keywords
};
