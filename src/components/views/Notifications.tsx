import {
  ArchiveIcon,
  BellIcon,
  Button,
  ButtonAppearance,
  ClockIcon,
  TrashIcon,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import '../../notifications.css';
import PageHeader from '../atoms/PageHeader.jsx';
import { Toolbar } from './Notifications.styles.tsx';

function timeToStr(seconds: number, t: TFunction) {
  if (seconds < 60) {
    return t('notif_time_ago::now');
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return t('notif_time_ago::minutes', { n: minutes });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t('notif_time_ago::hours', { n: hours });
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return t('notif_time_ago::days', { n: days });
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return t('notif_time_ago::months', { n: months });
  }
  const years = Math.floor(months / 12);
  return t('notif_time_ago::years', { n: years });
}

const secondsAgo = (start: number) => {
  const end = Math.floor(Date.now() / 1000); // trim to seconds
  const seconds = end - start;
  return seconds;
};

function Notifications() {
  const { t } = useTranslation();
  const [visibleNotifType, setVisibleNotifType] = useState('all');
  const notifications = useSelector(state => state.userData.notifications);

  const dispatch = useDispatch();
  //   const [notifications, setNotifications] = useState([]);
  //   const data = useSelector(state => state.userData.notifications);
  const status = useSelector(state => state.userData.status);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const groupedNotifs = {
    day: [],
    week: [],
    older: [],
  };

  const visibleNotifs = notifications.filter(({ state }) => {
    return (
      state === visibleNotifType ||
      (visibleNotifType === 'all' && ['read', 'unread'].includes(state))
    );
  });
  visibleNotifs.forEach(notif => {
    const secondsOld = secondsAgo(notif.created_at);
    if (secondsOld < 60 * 60 * 24) {
      groupedNotifs.day.push(notif);
    } else if (secondsOld < 60 * 60 * 24 * 7) {
      groupedNotifs.week.push(notif);
    } else {
      groupedNotifs.older.push(notif);
    }
  });

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
        <Button onClick={() => setVisibleNotifType('all')}>
          <BellIcon />
          {t('notifications.filter_all')}
        </Button>
        <Button
          onClick={() => setVisibleNotifType('unread')}
          appearance={ButtonAppearance.Secondary}
        >
          <ClockIcon />
          {t('notifications.filter_unread')}
        </Button>
        <Button onClick={() => setVisibleNotifType('archive')}>
          <ArchiveIcon />
          {t('notifications.archive')}
        </Button>
        {/* <button
          type="button"
          className={visibleNotifType === 'all' ? 'all selected' : 'all'}
          onClick={() => setVisibleNotifType('all')}
        >
          <img alt="" />
          {t('nm_filter_all')}
        </button>
        <button
          type="button"
          className={
            visibleNotifType === 'unread' ? 'unread selected' : 'unread'
          }
        >
          <img alt="" />
          {t('nm_filter_unread')}
        </button>
        <button
          type="button"
          className={
            visibleNotifType === 'archive' ? 'archive selected' : 'archive'
          }
          onClick={() => setVisibleNotifType('archive')}
        >
          <img alt="" />
          {t('nm_filter_archive')}
        </button> */}
      </Toolbar>

      <div className="content panel">
        {Object.entries(groupedNotifs).map(([name, notifs]) => {
          if (notifs.length === 0) {
            return false;
          }
          return (
            <>
              <div className="notification-age">{name}</div>
              {groupedNotifs[name].map(
                ({ hash, state, type, title, dateString, created_at }) => {
                  const extraProps =
                    state === 'unread'
                      ? {
                          onClick: () => markRead(hash),
                          onKeyPress: () => markRead(hash),
                          role: 'button',
                          tabIndex: 0,
                        }
                      : {};

                  return (
                    <div
                      key={hash}
                      className={`notification-item ${state}`}
                      {...extraProps}
                    >
                      <img className={type.replace(' ', '-')} alt={type} />
                      <div className="info">
                        <div className="notification-headline">{title}</div>
                        <div className="notification-time">{dateString}</div>
                      </div>
                      <div className="status">
                        {state === 'unread' && (
                          <div className="unread-indicator" />
                        )}
                        {state !== 'archive' && (
                          <button
                            type="button"
                            className="archive-item"
                            onClick={() => archive(hash)}
                          >
                            <img alt="archive item" />
                          </button>
                        )}
                        <div className="time-ago">
                          {timeToStr(secondsAgo(Date.parse(created_at)), t)}
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </>
          );
        })}
        {visibleNotifs.length !== 0 && (
          <button
            type="button"
            className={`load-more ${!hasMore ? 'disabled' : ''} `}
            onClick={() => loadMore(page + 1)}
          >
            Load More
          </button>
        )}
        {visibleNotifs.length === 0 && <div>no notifications</div>}
      </div>
    </>
  );
}

export default Notifications;
