export type ReportType = 'call_quality' | 'partner';

export interface ReportKeywordOption {
  id: string;
  translationKey: string;
  value: string;
}

export const REPORT_TYPE_OPTIONS: ReportKeywordOption[] = [
  {
    id: 'call_quality',
    translationKey: 'report.report_type.call_quality',
    value: 'call_quality',
  },
  {
    id: 'partner',
    translationKey: 'report.report_type.partner',
    value: 'partner',
  },
];

export const CALL_QUALITY_KEYWORDS: ReportKeywordOption[] = [
  {
    id: 'poor_audio',
    translationKey: 'report.keywords.call_quality.poor_audio',
    value: 'poor_audio',
  },
  {
    id: 'video_issues',
    translationKey: 'report.keywords.call_quality.video_issues',
    value: 'video_issues',
  },
  {
    id: 'connection_problems',
    translationKey: 'report.keywords.call_quality.connection_problems',
    value: 'connection_problems',
  },
  {
    id: 'lagging',
    translationKey: 'report.keywords.call_quality.lagging',
    value: 'lagging',
  },
  {
    id: 'frozen_screen',
    translationKey: 'report.keywords.call_quality.frozen_screen',
    value: 'frozen_screen',
  },
  {
    id: 'audio_delay',
    translationKey: 'report.keywords.call_quality.audio_delay',
    value: 'audio_delay',
  },
  {
    id: 'poor_quality',
    translationKey: 'report.keywords.call_quality.poor_quality',
    value: 'poor_quality',
  },
];

export const PARTNER_KEYWORDS: ReportKeywordOption[] = [
  {
    id: 'inappropriate_behavior',
    translationKey: 'report.keywords.partner.inappropriate_behavior',
    value: 'inappropriate_behavior',
  },
  {
    id: 'harassment',
    translationKey: 'report.keywords.partner.harassment',
    value: 'harassment',
  },
  {
    id: 'spam',
    translationKey: 'report.keywords.partner.spam',
    value: 'spam',
  },
  {
    id: 'fake_profile',
    translationKey: 'report.keywords.partner.fake_profile',
    value: 'fake_profile',
  },
  {
    id: 'safety_concern',
    translationKey: 'report.keywords.partner.safety_concern',
    value: 'safety_concern',
  },
  {
    id: 'offensive_language',
    translationKey: 'report.keywords.partner.offensive_language',
    value: 'offensive_language',
  },
  {
    id: 'inappropriate_content',
    translationKey: 'report.keywords.partner.inappropriate_content',
    value: 'inappropriate_content',
  },
];

export const REPORT_KEYWORDS_BY_TYPE: Record<
  ReportType,
  ReportKeywordOption[]
> = {
  call_quality: CALL_QUALITY_KEYWORDS,
  partner: PARTNER_KEYWORDS,
};

