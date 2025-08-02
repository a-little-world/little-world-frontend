import {
  ArchiveIcon,
  Button,
  ButtonVariations,
  Loading,
  StatusTypes,
  StatusMessage,
  Text,
  TextTypes,
  TickIcon,
  TrashIcon,
} from '@a-little-world/little-world-design-system';
import { LoadingSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Loading/Loading';
import { formatDistance } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import useSWR from 'swr';

import {
  NotificationState,
  NotificationStateFilter,
  deleteNotification,
  fetchNotifications,
  updateNotification,
} from '../../api/notification';
import {
  NOTIFICATIONS_ENDPOINT,
  UNREAD_NOTIFICATIONS_ENDPOINT,
} from '../../features/swr/index';
import PageHeader from '../atoms/PageHeader';
import Toolbar from '../atoms/Toolbar';
import UnreadIndicator from '../atoms/UnreadIndicator';
import { TopSection } from '../blocks/ChatCore/Chat.styles';
import {
  BottomAlignedPagination,
  BottomContainer,
  CreatedAt,
  Info,
  Items,
  Notification,
  Options,
  RelativeDiv,
} from './Notifications.styles';

const PAGE_SIZE = 5;

/* eslint-disable */
function Notifications() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const onPageChange = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };
  const currentPage =
    Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;

  const filter: NotificationStateFilter =
    (searchParams.get('filter') as NotificationStateFilter) ||
    NotificationState.UNREAD;

  const { data, error, isLoading, mutate } = useSWR(
    `/api/notifications?page_size=${PAGE_SIZE}&${createSearchParams(
      searchParams,
    )}`,
    fetchNotifications,
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const totalPages = data?.last_page ?? 1;
  const notifications = data?.results ?? [];

  async function onArchive(id: number) {
    const update = await mutate(
      updateNotification(
        id,
        NotificationState.ARCHIVED,
        onNotificationUpdated,
        onError,
      ),
    );
  }

  async function onDeleteNotification(id: number) {
    mutate(deleteNotification(id, () => {}, onError));
  }

  const onMarkRead = (id: number) => {
    mutate(
      updateNotification(
        id,
        NotificationState.READ,
        onNotificationUpdated,
        onError,
      ),
    );
  };

  const onNotificationUpdated = (notification: any) => {
    mutate(NOTIFICATIONS_ENDPOINT);
    mutate(UNREAD_NOTIFICATIONS_ENDPOINT);
  };

  const onError = (error: any) => {
    console.log(error);
  };

  const changeFilter = (state: NotificationStateFilter) => {
    searchParams.set('filter', state);
    searchParams.set('page', String(1));
    setSearchParams(searchParams);
  };

  const shouldHighlight = (notificationState: NotificationState) =>
    notificationState === NotificationState.UNREAD &&
    filter !== NotificationState.UNREAD &&
    !isLoading;

  return (
    <>
      <PageHeader text={t('notifications.title')} />
      <Toolbar filter={filter} onChangeFilter={changeFilter} />

      {isLoading && !notifications?.length ? (
        <Loading size={LoadingSizes.Medium} />
      ) : (
        <Items>
          <AnimatePresence mode="popLayout">
            {notifications?.map(
              ({ id, state, title, description, created_at }) => {
                return (
                  <motion.li layout key={`${id}-${filter}`}>
                    <Notification
                      $state={state}
                      $highlight={shouldHighlight(state)}
                    >
                      <Info>
                        <TopSection>
                          <Text type={TextTypes.Heading6}>{title}</Text>
                          {shouldHighlight(state) && <UnreadIndicator />}
                        </TopSection>

                        <Text>{description}</Text>
                      </Info>
                      <BottomContainer>
                        <Options>
                          {state === NotificationState.UNREAD && (
                            <Button
                              variation={ButtonVariations.Icon}
                              onClick={() => onMarkRead(id)}
                            >
                              <TickIcon
                                labelId="tick_icon"
                                label="tick icon"
                                width="16"
                                height="16"
                              />
                            </Button>
                          )}
                          {state !== NotificationState.ARCHIVED && (
                            <Button
                              variation={ButtonVariations.Icon}
                              onClick={() => onArchive(id)}
                            >
                              <ArchiveIcon
                                labelId="archive_icon"
                                label="archive icon"
                                width="16"
                                height="16"
                              />
                            </Button>
                          )}
                          {state === NotificationState.ARCHIVED && (
                            <Button
                              variation={ButtonVariations.Icon}
                              onClick={() => onDeleteNotification(id)}
                            >
                              <TrashIcon
                                labelId="delete_icon"
                                label="delete icon"
                                width="16"
                                height="16"
                              />
                            </Button>
                          )}
                        </Options>

                        <CreatedAt $highlight={shouldHighlight(state)}>
                          <Text>
                            {formatDistance(created_at, new Date(), {
                              addSuffix: true,
                            })}
                          </Text>
                        </CreatedAt>
                      </BottomContainer>
                    </Notification>
                  </motion.li>
                );
              },
            )}
          </AnimatePresence>
        </Items>
      )}
      <RelativeDiv>
        {totalPages > 1 && (
          <BottomAlignedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          ></BottomAlignedPagination>
        )}
        {error && (
          <StatusMessage
            $type={StatusTypes.Error}
            $visible={!isLoading && error?.message}
          >
            {error?.message}
          </StatusMessage>
        )}
      </RelativeDiv>
    </>
  );
}

export default Notifications;
