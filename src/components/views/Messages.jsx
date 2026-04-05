import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import { fetchChats } from '../../api/chat';
import { CHATS_ENDPOINT_SEPERATE } from '../../features/swr/index';
import useIniniteScroll from '../../hooks/useInfiniteScroll';
import { MESSAGES_ROUTE, getAppRoute } from '../../router/routes';
import PageHeader from '../atoms/PageHeader';
import ChatWithUserInfo from '../blocks/ChatCore/ChatWithUserInfo';
import ChatsPanel from '../blocks/ChatCore/ChatsPanel';
import { ChatDashboard } from './Messages.styles';

/** Stable empty list so we do not create a new [] every render while SWR is loading. */
const EMPTY_CHAT_LIST = [];

const Messages = () => {
  const { chatId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectChat = selectedChatId => {
    navigate(getAppRoute(`chat/${selectedChatId}`));
  };

  const { data: chats, mutate: mutateChats } = useSWR(CHATS_ENDPOINT_SEPERATE, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: newItems => {
      mutateChats(
        prev => {
          // Filter out duplicates by UUID
          const existingUuids = new Set(
            prev?.results?.map(chat => chat.uuid) || [],
          );
          const newResults = newItems.results.filter(
            chat => !existingUuids.has(chat.uuid),
          );

          return {
            ...prev,
            results: [...(prev?.results || []), ...newResults],
            page: newItems.page,
            pages_total: newItems.pages_total || 1,
          };
        },
        {
          revalidate: false,
        },
      );
    },
    currentPage: chats?.page ?? 0,
    totalPages: chats?.pages_total || 1,
    items: chats?.results ?? EMPTY_CHAT_LIST,
  });

  const handleOnChatBackBtn = () => {
    navigate(getAppRoute(MESSAGES_ROUTE));
  };

  const chatResults = chats?.results ?? EMPTY_CHAT_LIST;

  return (
    <>
      <PageHeader text={t('chat.header')} />
      <ChatDashboard>
        <ChatsPanel
          chats={chatResults}
          selectChat={selectChat}
          selectedChat={chatId}
          scrollRef={scrollRef}
        />
        <ChatWithUserInfo
          chatId={chatId}
          onBackButton={handleOnChatBackBtn}
          partner={chatResults.find(item => item?.uuid === chatId)?.partner}
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
