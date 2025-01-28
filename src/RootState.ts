export interface UserData {
  supportUrl: string;
  communityEvents: any[];
  user: any;
  notifications: any;
  matches: any;
  matchRejected: boolean;
  chats: any;
  messages: any;
  apiOptions: any;
  formOptions: any;
  activeCallRooms: any;
  callSetup: any;
  activeCall: any;
  postCallSurvey: any;
}

export interface RootState {
  userData: UserData;
}
