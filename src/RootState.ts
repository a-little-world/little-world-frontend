export interface UserData {
  supportUrl: string;
  communityEvents: any[];
  user: any;
  notifications: any;
  matches: any;
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
