export interface UserData {
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
}

export interface RootState {
  userData: UserData;
}
