/** Lobby item from api/random_calls/upcoming (has at least start_time, end_time for Schedule). */
export interface UpcomingLobbyItem {
  uuid: string;
  name: string;
  start_time: string;
  end_time: string;
  frequency: string;
  recurrence_group: string | null;
  status: boolean;
  active_users_count: number;
}
