import moment from "moment/moment";
import React, { useEffect, useState } from "react";

import style from "./style.module.css";

function getNextDate(weekday, timeSlot) {
  const weekdays = ["su", "mo", "tu", "we", "th", "fr", "sa"];
  const targetWeekday = weekdays.indexOf(weekday);
  const [startHour, endHour] = timeSlot.split("_").map(Number);

  const currentDate = new Date();
  const currentWeekday = currentDate.getDay();
  const daysToAdd = (targetWeekday - currentWeekday + 7) % 7 || 7;

  const targetDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  targetDate.setHours(startHour, 0, 0, 0);

  return moment(targetDate).format("DD MMM YYYY");
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
  const dates = {};
  const times = {};

  const handleSelect = (index) => {
    setSelect();
    setDate(dates[index] + " um " + times[index]);
    setSelectedIndex(selectedIndex === index ? -1 : index);
  };

  useEffect(() => {
    if (!inSelect) setSelectedIndex(-1);
  }, [inSelect]);

  if (view) {
    return (
      <div className={style["container"]}>
        <p>{header}</p>
        <table>
          {data.map((row, index) => {
            dates[index] = getNextDate(row[0], row[1][0]);
            times[index] = (Number(row[1][0].split("_")[0]) % 24) + ":00";

            return (
              <tr
                className={selectedIndex === index ? style["selected"] : ""}
                onClick={() => handleSelect(index)}
              >
                <td>{row[0] + ", " + dates[index]}</td>
                <td>{times[index]}</td>
                <td style={{ color: "#F39325", display: "flex", justifyContent: "space-between" }}>
                  Auswahl
                  <button
                    className={
                      selectedIndex === index
                        ? style["close-button"]
                        : style["close-button"] + " " + style["unselect-button"]
                    }
                    onClick={() => handleSelect(index)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
};

export default Table;
