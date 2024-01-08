import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import style from './style.module.css';
import Table from './table';

function findOverlap(array1, array2) {
  let overlap = [];

  _.forEach(array1, ([day, times1]) => {
    let correspondingTimes2 = _.find(array2, ([d, times2]) => d === day)[1];
    let commonTimes = _.intersection(times1, correspondingTimes2);

    if (commonTimes.length > 0) {
      overlap.push([day, commonTimes]);
    }
  });

  return overlap;
}

function findDifference(array1, array2) {
  let difference = [];

  _.forEach(array2, ([day, times2]) => {
    let correspondingTimes1 = _.find(array1, ([d, times1]) => d === day)[1];
    let uniqueTimes = _.difference(times2, correspondingTimes1);

    if (uniqueTimes.length > 0) {
      difference.push([day, uniqueTimes]);
    }
  });
  return difference;
}

const AppointmentsLayout = ({ setClose, id }) => {
  const { t } = useTranslation();
  const [dateSelection, setDateSelection] = React.useState('');
  const [tableSelection, setTableSelection] = React.useState('first');
  const matches = useSelector(state => state.userData.matches);
  const user = useSelector(state => state.userData.user);
  console.log({ user, matches });
  let selectedUser = matches.find(el => el.user.hash === id);

  let data =
    selectedUser &&
    findOverlap(
      Object.entries(user.profile.availability),
      Object.entries(selectedUser.profile.availability),
    );
  let data1 =
    selectedUser &&
    findDifference(
      Object.entries(user.profile.availability),
      Object.entries(selectedUser.profile.availability),
    );

  return (
    <div class={style['flex-grid']}>
      <div class={`${style['col']} ${style['title']}`}>
        <label>{t('chat_appointment_title')}</label>
        <button
          className={style['close-button']}
          onClick={() => setClose(false)}
        >
          &times;
        </button>
      </div>
      <div class={`${style['col']} ${style['sub-title']}`}>
        <label>{t('chat_suggest_appointment_description')}</label>
      </div>
      <div class={style['col']}>
        <div class={style['container']}>
          <div className={style['image-container']}>
            <img
              src={selectedUser && selectedUser.profile.image}
              alt="selected user"
              srcset=""
            />
          </div>
          <label>{`${selectedUser && selectedUser.profile.first_name}${t(
            'chat_appointment_send',
          )}`}</label>
        </div>
      </div>
      <div class={style['col']}>
        <Table
          data={data}
          inSelect={tableSelection === 'first'}
          setSelect={() => {
            setTableSelection('first');
          }}
          view={true}
          setDate={setDateSelection}
          header={t('chat_appointment_message_overlap_header', {
            userName: selectedUser.profile.first_name,
          })}
        />
      </div>
      <div class={style['col']}>
        <Table
          data={data1}
          inSelect={tableSelection === 'second'}
          setSelect={() => {
            setTableSelection('second');
          }}
          view={true}
          setDate={setDateSelection}
          header={t('chat_appointment_message_non_overlap_header', {
            userName: selectedUser.profile.first_name,
          })}
        />
      </div>
      <div class={style['btn-container']}>
        <button
          className={style['send-button']}
          onClick={() => {
            setClose(true);
          }}
        >
          {t('chat_appointment_abbort')}
        </button>
        <button
          className={style['cancle-button']}
          onClick={() => {
            if (dateSelection !== '') {
              const value = t(
                tableSelection === 'first'
                  ? 'chat_appointment_message_overlap'
                  : 'chat_appointment_message_non_overlap',
                {
                  userName: selectedUser.profile.first_name,
                  date: dateSelection,
                },
              );
              document.getElementById(
                'test-input',
              ).firstChild.firstChild.value = value;
              setClose(true);
            }
          }}
        >
          {t('chat_auggest_appointment_message')}
        </button>
      </div>
    </div>
  );
};

export default AppointmentsLayout;
