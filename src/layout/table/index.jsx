import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";

function findNextDate(weekday, time) {
  let date = new Date();
  let currentWeekday = date.getDay();
  let currentTime = date.getHours() + date.getMinutes() / 60;

  let diffDays = (weekday - currentWeekday + 7) % 7;
  let diffTime = (time - currentTime + 24) % 24;

  if (diffTime < 0) {
    diffDays += 1;
  }

  let newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + diffDays,
    time,
    0,
    0
  );

  let formattedDate = moment(newDate).format('DD MMM YYYY');
  return formattedDate;
}

const getDayNumber = (day) => {
  switch (day) {
    case "fr":
      return 1;
    case "sa":
      return 2;
    case "su":
      return 3;
    case "mo":
      return 4;
    case "tu":
      return 5;
    case "we":
      return 6;
    case "th":
      return 7;
    default:
      break;
  }
};

const Table = ({ view, data, setDate, header, inSelect, setSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dates = {}
  const times = {}

  const handleSelect = (index) => {
    setSelect();
    setDate(dates[index] + " um " + times[index]);
    setSelectedIndex(selectedIndex === index ? -1 : index);
  };

  useEffect(() => {
    if(!inSelect)
      setSelectedIndex(-1);
  }, [inSelect])

  if (view) {
    return (
      <div className={style["container"]}>
        <p>{header}</p>
        <table>
          {data.map((row, index) => {
            dates[index] = findNextDate(getDayNumber(row[0]), Number(row[1][0].split("_")[0]) / 60)
            times[index] = Number(row[1][0].split("_")[0])%24+":00" 
            console.log("DDD", dates[index])
            return (<tr
              className={selectedIndex === index ? style["selected"] : ""}
              onClick={() => handleSelect(index)}
            >
              <td>
                {row[0] +
                  ", " +
                  dates[index]}
              </td>
              <td>{times[index]}</td>
              <td style={{ color: "#F39325", display: "flex", justifyContent: "space-between" }}>
                Auswahl  
                
                  <button className={ selectedIndex===index?style["close-button"]:style["close-button"]+" "+style["unselect-button"] }   onClick={() => handleSelect(index)}>
                    ✕
                  </button>
                
                
              </td>
            </tr>
          )})}
        </table>
      </div>
    );
  }
};

export default Table;
