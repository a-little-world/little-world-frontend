import { createSelector, createSlice } from '@reduxjs/toolkit';
import { isEmpty, uniqBy } from 'lodash';

import { questionsDuringCall } from '../services/questionsDuringCall';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    incomingCalls: [],
  },
  reducers: {
    initialise: (state, action) => {
      // TODO: this should NEVER be called twice will overwrite the full state
      console.log('PAYLOAD', action.payload, { state, action });

      state.communityEvents = action.payload?.communityEvents;
      state.user = {
        ...action.payload?.user,
        hasMatch: !!action.payload?.matches?.confirmed?.totalItems,
      };
      state.notifications = action.payload?.notifications;
      state.matches = action.payload?.matches;
      state.chats = {};
      state.messages = {};
      state.apiOptions = action.payload?.apiOptions;
      state.formOptions = action.payload?.apiOptions.profile;
      state.incomingCalls = action.payload?.incomingCalls || []; // [{ userId: user.hash }] or []
      state.callSetup = action.payload?.callSetup || null; // { userId: user.hash } or null
      state.activeCall = action.payload?.activeCall || null; // { userId: user.hash, tracks: {} } or null
    },
    reset: (state, action) => {
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    updateProfile: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state.user.profile[key] = action.payload[key];
      });
    },
    updateEmail: (state, action) => {
      if (state.user) {
        state.user.email = action.payload;
      } else {
        state.user = { email: action.payload };
      }
    },
    updateSearchState: (state, action) => {
      state.user.isSearching = action.payload;
    },
    initCallSetup: (state, action) => {
      state.callSetup = action.payload;
      state.incomingCalls = state.incomingCalls.filter(
        call => call.userId !== action.payload?.userId,
      );
    },
    cancelCallSetup: (state, action) => {
      state.callSetup = null;
    },
    initActiveCall: (state, action) => {
      const { userId, tracks } = action.payload;
      state.activeCall = { userId, tracks };
    },
    stopActiveCall: (state, action) => {
      state.activeCall = null;
    },
    addMatch: (state, action) => {
      const { category, match } = action.payload;
      state.matches[category].items.push(match);
    },
    addIncomingCall: (state, action) => {
      const { userId } = action.payload;
      state.incomingCalls.push({ userId });
    },
    removeMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id } = match;
      state.matches[category] = state.matches[category].items.filter(
        m => m.id !== id,
      );
    },
    updateMatch: (state, action) => {
      const { category, match } = action.payload;
      const { id, ...rest } = match;
      const matchIndex = state.matches[category].findIndex(m => m.id === id);
      if (matchIndex !== -1)
        state.matches[category][matchIndex] = {
          ...state.matches[category][matchIndex],
          ...rest,
        };
    },
    updateMatchProfile: (state, action) => {
      const { partnerId, profile } = action.payload;
      Object.keys(state.matches).forEach(category => {
        const matchIndex = state.matches[category].items.findIndex(
          m => m.partner.id === partnerId,
        );
        if (matchIndex !== -1)
          state.matches[category].items[matchIndex].partner = {
            ...state.matches[category].items[matchIndex].partner,
            ...profile,
          };
      });
    },
    changeMatchCategory: (state, action) => {
      const { category, match, newCategory } = action.payload;
      const matchToMove = state.matches[category].items.find(
        m => m.id === match.id,
      );
      state.matches[newCategory].items.push(matchToMove);
      state.matches[category].items = state.matches[category].items.filter(
        m => m.id !== match.id,
      );
    },
    blockIncomingCall: (state, action) => {
      const { userId } = action.payload;
      state.incomingCalls = state.incomingCalls.filter(
        call => call.userId !== userId,
      );
    },
    updateConfirmedData: (state, action) => {
      state.matches.confirmed = action.payload;
    },
    getQuestions: (state, { payload }) => {
      state.questions = payload;
    },
    updateMessages: (state, { payload }) => {
      const { chatId, items } = payload;
      state.messages = { ...state.messages, [chatId]: items };
    },
    addMessage: (state, action) => {
      const { message, chatId, senderIsSelf = false } = action.payload;
      if (chatId) {
        const newMessages = state.messages[chatId]?.results
          ? [message, ...state.messages[chatId].results]
          : [message];
        state.messages[chatId].results = newMessages;
      }
      const newChats = state.chats.results?.map(chat => {
        if (chat.uuid === chatId) {
          return {
            ...chat,
            unread_count: senderIsSelf
              ? chat.unread_count
              : chat.unread_count + 1,
            newest_message: message,
          };
        }
        return chat;
      });

      state.chats = {
        ...state.chats,
        results: sortChats(newChats),
      };
    },
    markChatMessagesRead: (state, action) => {
      const { chatId, userId, actorIsSelf = false } = action.payload;
      if (chatId in state.messages) {
        state.messages[chatId].results = state.messages[chatId]?.results.map(
          message => {
            if (message.sender !== userId) {
              return { ...message, read: true };
            }
            return message;
          },
        );
      }
      const newChats = state.chats.results?.map(chat => {
        if (chat.uuid === chatId) {
          return {
            ...chat,
            unread_count: 0,
          };
        }
        return chat;
      });

      state.chats = {
        ...state.chats,
        results: sortChats(newChats),
      };
    },
    preMatchingAppointmentBooked: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          preMatchingAppointment: action.payload,
        },
      };
    },
    switchQuestionCategory: (state, { payload }) => {
      const { card, archived } = payload;

      if (archived) {
        state.questions.cards[card.category] = state.questions.cards[
          card.category
        ].filter(c => c.uuid !== card.uuid);

        state.questions.cards['archived'].push(card);
      } else {
        state.questions.cards['archived'] = state.questions.cards[
          'archived'
        ].filter(c => c.uuid !== card.uuid);

        state.questions.cards[card.category].push(card);
      }
    },
    insertChat: (state, { payload }) => {
      const chatResults = isEmpty(state.chats)
        ? [payload]
        : [payload, ...state.chats.results];
      state.chats.results = sortChats(chatResults);
    },
    updateChats: (state, { payload }) => {
      const { results, ...rest } = payload;
      state.chats = { results: sortChats(results), ...rest };
    },
  },
});

export const {
  addMatch,
  addMessage,
  insertChat,
  blockIncomingCall,
  cancelCallSetup,
  changeMatchCategory,
  getQuestions,
  getUnarchivedQuestions,
  initActiveCall,
  initCallSetup,
  initialise,
  markChatMessagesRead,
  removeMatch,
  stopActiveCall,
  switchQuestionCategory,
  updateChats,
  updateConfirmedData,
  updateEmail,
  updateMatch,
  updateMatchProfile,
  updateMessages,
  updateProfile,
  updateSearchState,
  updateUser,
} = userDataSlice.actions;

export const sortChats = chats => {
  const sorted = chats.sort((a, b) => {
    // by newest_message.created in ascending order if unread_count is equal
    if (!a.newest_message?.created) return 1;
    if (!b.newest_message?.created) return -1;
    return (
      new Date(b.newest_message.created) - new Date(a.newest_message.created)
    );
  });

  return uniqBy(sorted, 'uuid');
};

export const selectMatchByPartnerId = (matches, partnerId) => {
  for (const category in matches) {
    const match = matches[category].items.find(m => m.partner.id === partnerId);
    if (match) return match;
  }
  return null;
};

export const getMatchByPartnerId = (matches, partnerId) => {
  const allMatches = [...matches.support.items, ...matches.confirmed.items];

  const partner = allMatches.find(match => match?.partner?.id === partnerId);
  return partner;
};

export const getMessagesByChatId = (messages, chatId) => {
  return messages?.[chatId] || [];
};

export const getChatByChatId = (chats, chatId) => {
  return chats.results?.find(chat => chat.uuid === chatId);
};

export const selectMatchesDisplay = createSelector(
  [state => state.userData.matches],
  ({ confirmed, support }) =>
    confirmed.currentPage === 1
      ? [...support.items, ...confirmed.items]
      : [...confirmed.items],
);

export const FetchQuestionsDataAsync = () => async dispatch => {
  const result = await questionsDuringCall.getQuestions();
  dispatch(getQuestions(result));
};

export const postArchieveQuestion =
  (card, archive = true) =>
  async dispatch => {
    const result = await questionsDuringCall.archieveQuestion(
      card?.uuid,
      archive,
    );
    dispatch(
      switchQuestionCategory({
        card,
        archived: archive,
      }),
    );
  };

export default userDataSlice.reducer;
