export interface Event {
  id: string;
  frequency: string;
  description: string;
  image?: string;
  group_id?: string;
  title: string;
  time: string;
  end_time?: string;
  link: string;
}

export interface CalendarEvent {
  frequency: string;
  description: string;
  durationInMinutes: number;
  title: string;
  endDate?: Date;
  startDate: Date;
  link: string;
}
