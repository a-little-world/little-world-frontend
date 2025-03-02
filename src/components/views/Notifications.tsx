import {
  ArchiveIcon,
  BellIcon,
  Button,
  ButtonAppearance,
  ButtonVariations,
  ClockDashedIcon,
  ClockIcon,
  Loading,
  Text,
  TextTypes,
  TrashIcon,
} from '@a-little-world/little-world-design-system';
import { LoadingSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Loading/Loading';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import CustomPagination from '../../CustomPagination.jsx';
import {
  NotificationState,
  deleteNotification,
  retrieveNotifications,
  updateNotification,
} from '../../api/notification.ts';
import { updateNotificationUserData } from '../../features/userData';
import PageHeader from '../atoms/PageHeader.tsx';
import {
  BottomContainer,
  CreatedAt,
  Info,
  Items,
  Notification,
  Options,
  Toolbar,
  ToolbarButton,
  UnreadIndicator,
} from './Notifications.styles.tsx';

/* eslint-disable */
function Notifications() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<NotificationState | 'all'>(
    NotificationState.UNREAD,
  );
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading, mutate } = useSWR(
    currentPage <= totalPages
      ? `/api/notifications?page=${currentPage}&includeUnread=${
          filter === 'unread' || filter === 'all'
        }&includeRead=${
          filter === 'read' || filter === 'all'
        }&includeArchived=${filter === 'archived' || filter === 'all'}`
      : null,
    fetcher =>
      retrieveNotifications(
        filter,
        currentPage,
        result => {
          setNotifications(result.results);
          setTotalPages(result.last_page);
          return result;
        },
        onError,
      ),
    { revalidateOnFocus: false, keepPreviousData: true },
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const markRead = id => {
    // TODO
  };

  const onNotificationUpdated = (notification: any) => {
    dispatch(updateNotificationUserData(notification));
  };

  const onError = (error: any) => {
    console.log(error);
  };

  const changeFilter = (state: NotificationState | 'all') => {
    setFilter(state);
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader text={t('notifications.title')} />
      <Toolbar>
        <ToolbarButton
          onClick={() => changeFilter(NotificationState.UNREAD)}
          appearance={ButtonAppearance.Secondary}
          variation={ButtonVariations.Icon}
          $isActive={filter === 'unread'}
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
          onClick={() => changeFilter(NotificationState.READ)}
          appearance={ButtonAppearance.Secondary}
          variation={ButtonVariations.Icon}
          $isActive={filter === 'read'}
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
          onClick={() => changeFilter(NotificationState.ARCHIVED)}
          variation={ButtonVariations.Icon}
          $isActive={filter === 'archived'}
        >
          <ArchiveIcon
            labelId="archive_icon"
            label="archive icon"
            width="16px"
            height="16px"
          />
          {t('notifications.archived')}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => changeFilter('all')}
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
      </Toolbar>

      {isLoading ? (
        <Loading size={LoadingSizes.Medium} />
      ) : (
        <Items>
          {notifications
            ?.filter(({ state }) => filter === 'all' || filter === state)
            ?.map(({ id, state, title, description, created_at }, index) => {
              return (
                <Notification key={id} $state={state} $highlight={!index}>
                  <Info>
                    <Text type={TextTypes.Heading6}>{title}</Text>
                    <Text>{description}</Text>
                  </Info>
                  <BottomContainer>
                    <Options>
                      {state === 'unread' && <UnreadIndicator />}
                      {state !== 'archived' && (
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
                      {state === 'archived' && (
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

                    <CreatedAt $highlight={!index}>
                      <Text>
                        {formatDistance(created_at, new Date(), {
                          addSuffix: true,
                        })}
                      </Text>
                    </CreatedAt>
                  </BottomContainer>
                </Notification>
              );
            })}
        </Items>
      )}
      {!isLoading && totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        ></CustomPagination>
      )}
    </>
  );
}

export default Notifications;
