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
import PageHeader from '../atoms/PageHeader.jsx';
import {
  CreatedAt,
  Info,
  Items,
  Notification,
  Status,
  Toolbar,
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
      <Toolbar className="buttons select-showing">
        <Button onClick={() => setFilter('all')}>
          <BellIcon labelId="bell_icon" label=" all notifications" />
          {t('notifications.filter_all')}
        </Button>
        <Button
          onClick={() => setFilter('unread')}
          appearance={ButtonAppearance.Secondary}
        >
          <ClockIcon labelId="clock_icon" label="unread icon" />
          {t('notifications.filter_unread')}
        </Button>
        <Button onClick={() => setFilter('archive')}>
          <ArchiveIcon labelId="archive_icon" label="archive icon" />
          {t('notifications.archive')}
        </Button>
      </Toolbar>

      <Items>
        {notifications?.map(
          ({ hash, state, type, title, description, created_at }) => {
            return (
              <Notification key={hash} $state={state}>
                <Info>
                  <Text type={TextTypes.Heading5}>{title}</Text>
                  <Text>{description}</Text>
                </Info>
                <Status>
                  {state === 'unread' && (
                    <UnreadIndicator className="unread-indicator" />
                  )}
                  {state !== 'archive' && (
                    <Button
                      variation={ButtonVariations.Control}
                      className="archive-item"
                      onClick={() => archive(hash)}
                    >
                      <ArchiveIcon
                        labelId="archive_icon"
                        label="archive icon"
                        width="12px"
                        height="12px"
                      />
                    </Button>
                  )}
                  <CreatedAt>
                    {formatDistance(created_at, new Date(), {
                      addSuffix: true,
                    })}
                  </CreatedAt>
                </Status>
              </Notification>
            );
          },
        )}
      </Items>
    </>
  );
}

export default Notifications;
