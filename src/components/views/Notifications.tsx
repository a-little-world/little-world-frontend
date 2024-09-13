import {
  ArchiveIcon,
  BellIcon,
  Button,
  ButtonAppearance,
  ButtonVariations,
  ClockIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import '../../notifications.css';
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

function Notifications() {
  const { t } = useTranslation();
  const notifications = useSelector(state => {
    const notificationsSortedByDate = [
      ...state?.userData?.notifications?.unread.items,
      ...state?.userData?.notifications?.read?.items,
      ...state?.userData?.notifications?.archived?.items,
    ]?.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return notificationsSortedByDate;
  });
  const [filter, setFilter] = useState('all');

  // const dispatch = useDispatch();

  console.log({ notifications });
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const groupedNotifs = {
  //   day: [],
  //   week: [],
  //   older: [],
  // };

  // const visibleNotifs = notifications.filter(({ state }) => {
  //   return (
  //     state === visibleNotifType ||
  //     (visibleNotifType === 'all' && ['read', 'unread'].includes(state))
  //   );
  // });
  // visibleNotifs.forEach(notif => {
  //   const secondsOld = secondsAgo(notif.created_at);
  //   if (secondsOld < 60 * 60 * 24) {
  //     groupedNotifs.day.push(notif);
  //   } else if (secondsOld < 60 * 60 * 24 * 7) {
  //     groupedNotifs.week.push(notif);
  //   } else {
  //     groupedNotifs.older.push(notif);
  //   }
  // });

  const loadMore = page => {};

  const archive = id => {
    // TODO
  };
  const markRead = id => {
    // TODO
  };
  return (
    <>
      <PageHeader text={t('notifications.title')} />
      <Toolbar>
        <ToolbarButton
          onClick={() => setFilter('all')}
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
          onClick={() => setFilter('unread')}
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
          onClick={() => setFilter('archive')}
          variation={ButtonVariations.Icon}
          $isActive={filter === 'archive'}
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

      <Items>
        {notifications?.map(
          ({ hash, state, title, description, created_at }, index) => {
            if (filter !== 'all' && filter !== state) return null;
            return (
              <Notification key={hash} $state={state} $highlight={!index}>
                <Info>
                  <Text type={TextTypes.Heading6}>{title}</Text>
                  <Text>{description}</Text>
                </Info>
                <BottomContainer>
                  <Options>
                    {state === 'unread' && <UnreadIndicator />}
                    {state !== 'archive' && (
                      <Button
                        variation={ButtonVariations.Icon}
                        onClick={() => archive(hash)}
                      >
                        <ArchiveIcon
                          labelId="archive_icon"
                          label="archive icon"
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
          },
        )}
      </Items>
    </>
  );
}

export default Notifications;
