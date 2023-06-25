import React from "react";
import { useTranslation } from "react-i18next";

function NbtSelector({ selection, setSelection, use }) {
  const { t } = useTranslation();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  const nbtTopics = {
    main: ["conversation_partners", "appointments", "community_calls"],
    help: ["videos", "faqs", "contact"],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments"],
    help: ["videos"],
  };
  const disabled = nbtDisabled[use];
  return (
    <div className="selector">
      {topics.map((topic) => (
        <span className={topic} key={topic}>
          <input
            type="radio"
            id={`${topic}-radio`}
            value={topic}
            checked={selection === topic}
            name="sidebar"
            onChange={(e) => setSelection(e.target.value)}
          />
          <label
            htmlFor={`${topic}-radio`}
            className={disabled && disabled.includes(topic) ? "disabled" : ""}
          >
            {t(`nbt_${topic}`)}
          </label>
        </span>
      ))}
    </div>
  );
}

export default NbtSelector;
