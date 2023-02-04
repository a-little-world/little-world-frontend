import React from "react";
import _ from 'lodash'
import style from "./style.module.css";
import Table from "./table";
import { useSelector } from "react-redux";
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

const AppointmentsLayout = ({setClose,id} ) => {
  const user = useSelector((state) => state.userData.raw);
  let selectedUser = user.matches.find(el=>el.user.hash===id)
    console.log("🚀 ~ file: layout.jsx:66 ~ AppointmentsLayout ~ selectedUser", selectedUser)
    let data =selectedUser&& findOverlap(Object.entries(user.profile.availability),Object.entries(selectedUser.profile.availability))
   let data1 = selectedUser&&findDifference(Object.entries(user.profile.availability),Object.entries(selectedUser.profile.availability))
 
  return (
    <div class={style["flex-grid"]}>
      <div class={`${style["col"]} ${style["title"]}`}>
     
        <label>Termin vorschlagen</label>
        <button  className={style["close-button"]} onClick={()=>setClose(false)}>&times;</button>
      </div>
      <div class={`${style["col"]} ${style["sub-title"]}`}>
      
        <label>Wahle deine Termine unten aus und sende deine Vorshlage </label>
      </div>
      <div class={style["col"]}>
        <div class={style["container"]}>
          <div className={style['image-container']}>
          <img src={selectedUser&&selectedUser.profile.image} alt="selected user" srcset="" />
          </div>
          <label>{selectedUser&&selectedUser.profile.first_name} einen Termin vorschlagen</label>
        </div>
      </div>
      <div class={style["col"]}><Table data={data} view={true}/></div>
      <div class={style["col"]}><Table data={data1} view={true}/></div>
      <div class={style["btn-container"]}>
        <button className={style["send-button"]}>Abbrechen</button>
        <button className={style["cancle-button"]}>Vorschlag senden</button>
      </div>
    </div>
  );
};

export default AppointmentsLayout;
