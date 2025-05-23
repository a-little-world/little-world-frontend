import {
  ArchiveIcon,
  BellIcon,
  Button,
  ButtonAppearance,
  ButtonVariations,
  ClockDashedIcon,
  ClockIcon,
  Loading,
  MessageTypes,
  Separator,
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
import { useDispatch } from 'react-redux';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  NotificationState,
  NotificationStateFilter,
  deleteNotification,
  fetchNotifications,
  updateNotification,
  updateUnreadNotificationCount,
} from '../../api/notification.ts';
import { updateNotificationUserData } from '../../features/userData';
import PageHeader from '../atoms/PageHeader.tsx';
import { TopSection } from '../blocks/ChatCore/Chat.styles.tsx';
import { UnreadIndicator } from '../blocks/ChatCore/ChatsPanel.tsx';
import {
  BottomAlignedPagination,
  BottomContainer,
  CreatedAt,
  Info,
  Items,
  Notification,
  NotificationCard,
  NotificationWrapper,
  Options,
  RelativeDiv,
  Toolbar,
  ToolbarButton,
} from './Notifications.styles.tsx';

const PAGE_SIZE = 5;

function Notifications() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

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

  function onNotificationUpdated(notification: any): void {
    dispatch(updateNotificationUserData(notification));
    updateUnreadNotificationCount();
  }

  function onError(e: any): void {
    console.log(e);
  }

  async function onArchive(id: number) {
    mutate(
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

  function onMarkRead(id: number): void {
    mutate(
      updateNotification(
        id,
        NotificationState.READ,
        onNotificationUpdated,
        onError,
      ),
    );
  }

  function changeFilter(
    state: NotificationStateFilter,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    searchParams.set('filter', state);
    searchParams.set('page', String(1));
    setSearchParams(searchParams);
    e?.currentTarget.scrollIntoView();
  }

  function shouldHighlight(notificationState: NotificationState): boolean {
    return (
      notificationState === NotificationState.UNREAD &&
      filter !== NotificationState.UNREAD &&
      !isLoading
    );
  }

  return (
    <>
      <PageHeader text={t('notifications.title')} />
      <NotificationWrapper>
        <NotificationCard>
          <Toolbar>
            <ToolbarButton
              onClick={e => changeFilter('all', e)}
              variation={ButtonVariations.Icon}
              $isActive={filter === 'all'}
            >
              <BellIcon
                labelId="bell_icon"
                label=" all notifications"
                width="16px"
                height="16px"
              />
              {t('notifications.filter_all')}
            </ToolbarButton>
            <ToolbarButton
              onClick={e => changeFilter(NotificationState.UNREAD, e)}
              appearance={ButtonAppearance.Secondary}
              variation={ButtonVariations.Icon}
              $isActive={filter === NotificationState.UNREAD}
            >
              <ClockIcon
                labelId="clock_icon"
                label="unread icon"
                width="16px"
                height="16px"
              />
              {t('notifications.filter_unread')}
            </ToolbarButton>
            <ToolbarButton
              onClick={e => changeFilter(NotificationState.READ, e)}
              appearance={ButtonAppearance.Secondary}
              variation={ButtonVariations.Icon}
              $isActive={filter === NotificationState.READ}
            >
              <ClockDashedIcon
                labelId="clock_icon"
                label="read icon"
                width="16px"
                height="16px"
              />
              {t('notifications.filter_read')}
            </ToolbarButton>
            <ToolbarButton
              onClick={e => changeFilter(NotificationState.ARCHIVED, e)}
              variation={ButtonVariations.Icon}
              $isActive={filter === NotificationState.ARCHIVED}
            >
              <ArchiveIcon
                labelId="archive_icon"
                label="archive icon"
                width="16px"
                height="16px"
              />
              {t('notifications.archived')}
            </ToolbarButton>
          </Toolbar>

          <Separator spacing={theme.spacing.small} />

          {isLoading && !notifications?.length ? (
            <Loading size={LoadingSizes.Medium} />
          ) : notifications.length === 0 ? (
            <span>{t(`notifications.no_${filter}_text`)}</span>
          ) : (
            <Items>
              <AnimatePresence mode="popLayout">
                {notifications?.map(
                  ({ id, state, title, description, created_at }) => (
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
                  ),
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
              />
            )}
            {error && (
              <StatusMessage
                $type={MessageTypes.Error}
                $visible={!isLoading && error?.message}
              >
                {error?.message}
              </StatusMessage>
            )}
          </RelativeDiv>
        </NotificationCard>
      </NotificationWrapper>
    </>
  );
}

export default Notifications;
