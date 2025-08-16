import { mutate } from 'swr';

import useConnectedCallStore from '../stores/connectedCall.ts';
import {
  ACTIVE_CALL_ROOMS_ENDPOINT,
  CHATS_ENDPOINT,
  CHATS_ENDPOINT_SEPERATE,
  MATCHES_ENDPOINT,
  USER_ENDPOINT,
} from './index.ts';

interface MatchesData {
  [category: string]: any[];
}

const sortChats = (chats: any[]) => {
  const sorted = chats.sort((a, b) => {
    if (!a.newest_message?.created) return 1;
    if (!b.newest_message?.created) return -1;
    return (
      new Date(b.newest_message.created).getTime() -
      new Date(a.newest_message.created).getTime()
    );
  });

  return sorted.filter(
    (chat, index, self) => index === self.findIndex(c => c.uuid === chat.uuid),
  );
};

// Helper function to mutate all chat endpoints
const mutateAllChatEndpoints = (updater: (data: any) => any) => {
  mutate(CHATS_ENDPOINT, updater, false);
  mutate(CHATS_ENDPOINT_SEPERATE, updater, false);
};

export function addMatch(category: string, match: any): void {
  mutate(
    MATCHES_ENDPOINT,
    (matchesData: MatchesData | undefined) => {
      if (!matchesData) return matchesData;
      return {
        ...matchesData,
        [category]: [...(matchesData[category] || []), match],
      };
    },
    false,
  );
}

export function updateMatchProfile(partnerId: string, profile: any): void {
  mutate(
    USER_ENDPOINT,
    (userData: any) => {
      if (!userData) return userData;
      return {
        ...userData,
        matches: userData.matches?.map((m: any) =>
          m.id === partnerId ? { ...m, profile } : m,
        ),
      };
    },
    false,
  );
}

export function addMessage(
  message: any,
  chatId: string,
  metaChatObj: any,
  senderIsSelf: boolean = false,
): void {
  // Update messages for the specific chat
  const messagesEndpoint = `/api/messages/${chatId}/?page=1&page_size=20`;
  mutate(
    messagesEndpoint,
    (messagesData: any) => {
      if (!messagesData) return messagesData;
      return {
        ...messagesData,
        results: [message, ...(messagesData.results || [])],
      };
    },
    false,
  );

  // Update all chat endpoints
  mutateAllChatEndpoints((chatsData: any) => {
    if (!chatsData) return chatsData;

    const existingChatIndex = chatsData.results?.findIndex(
      (chat: any) => chat.uuid === chatId,
    );

    if (existingChatIndex !== -1 && existingChatIndex !== undefined) {
      // Update existing chat
      const updatedResults = chatsData.results.map(
        (chat: any, index: number) => {
          if (index === existingChatIndex) {
            return {
              ...chat,
              unread_count:
                senderIsSelf || message.read
                  ? chat.unread_count
                  : (chat.unread_count || 0) + 1,
              newest_message: message,
            };
          }
          return chat;
        },
      );

      return {
        ...chatsData,
        results: sortChats(updatedResults),
      };
    }

    if (metaChatObj) {
      // Add new chat with metadata
      const newChat = {
        ...metaChatObj,
        unread_count: senderIsSelf || message.read ? 0 : 1,
        newest_message: message,
      };

      return {
        ...chatsData,
        results: sortChats([newChat, ...(chatsData.results || [])]),
      };
    }

    return chatsData;
  });
}

export function addActiveCallRoom(callRoom: any): void {
  useConnectedCallStore.getState().resetDisconnectedFrom();
  mutate(
    ACTIVE_CALL_ROOMS_ENDPOINT,
    (activeCallRoomsData: any) => {
      if (!activeCallRoomsData) return activeCallRoomsData;
      return {
        ...activeCallRoomsData,
        results: [
          ...(activeCallRoomsData.results || []).filter(
            (room: any) => room?.uuid !== callRoom?.uuid, // TODO SENTRY ERROR why is room undefined in some cases?
          ),
          callRoom,
        ],
      };
    },
    false,
  );
}

export function blockIncomingCall(userId: string): void {
  mutate(
    ACTIVE_CALL_ROOMS_ENDPOINT,
    (activeCallRoomsData: any) => {
      if (!activeCallRoomsData) return activeCallRoomsData;
      return {
        ...activeCallRoomsData,
        results: (activeCallRoomsData.results || []).filter(
          (room: any) => room?.partner.id !== userId, // TODO SENTRY ERROR room undefined in some cases
        ),
      };
    },
    false,
  );
}

export function markChatMessagesRead(chatId: string, userId: string): void {
  // Update messages for the specific chat
  const messagesEndpoint = `/api/messages/${chatId}/?page=1&page_size=20`;
  mutate(
    messagesEndpoint,
    (messagesData: any) => {
      if (!messagesData) return messagesData;
      return {
        ...messagesData,
        results: (messagesData.results || []).map((message: any) => {
          if (message.sender !== userId) {
            return { ...message, read: true };
          }
          return message;
        }),
      };
    },
    false,
  );

  // Update all chat endpoints to reset unread count
  mutateAllChatEndpoints((chatsData: any) => {
    if (!chatsData) return chatsData;
    return {
      ...chatsData,
      results: (chatsData.results || []).map((chat: any) => {
        if (chat.uuid === chatId) {
          return {
            ...chat,
            unread_count: 0,
          };
        }
        return chat;
      }),
    };
  });
}

export function preMatchingAppointmentBooked(appointment: any): void {
  mutate(
    USER_ENDPOINT,
    (userData: any) => {
      if (!userData) return userData;
      return {
        ...userData,
        preMatchingAppointment: appointment,
      };
    },
    false,
  );
}

export function addPostCallSurvey(postCallSurvey: any): void {
  mutate(
    USER_ENDPOINT,
    (userData: any) => {
      if (!userData) return userData;
      return {
        ...userData,
        postCallSurvey,
      };
    },
    false,
  );
}

export function runWsBridgeMutation(
  action: string,
  payload: { [key: string]: any },
): void {
  switch (action) {
    case 'addMatch': {
      const { category, match } = payload;
      addMatch(category, match);
      break;
    }
    case 'updateMatchProfile': {
      const { partnerId, profile } = payload;
      updateMatchProfile(partnerId, profile);
      break;
    }
    case 'addMessage': {
      const { message, chatId, metaChatObj, senderIsSelf } = payload;
      addMessage(message, chatId, metaChatObj, senderIsSelf);
      break;
    }
    case 'addActiveCallRoom': {
      const { callRoom } = payload;
      addActiveCallRoom(callRoom);
      break;
    }
    case 'blockIncomingCall': {
      const { blockUserId } = payload;
      blockIncomingCall(blockUserId);
      break;
    }
    case 'markChatMessagesRead': {
      const { readChatId, readUserId } = payload;
      markChatMessagesRead(readChatId, readUserId);
      break;
    }
    case 'preMatchingAppointmentBooked': {
      const { appointment } = payload;
      preMatchingAppointmentBooked(appointment);
      break;
    }
    case 'addPostCallSurvey': {
      const { postCallSurvey } = payload;
      addPostCallSurvey(postCallSurvey);
      break;
    }
    default:
      break;
  }
}
