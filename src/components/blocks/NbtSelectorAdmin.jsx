import React from "react";
import { useTranslation } from "react-i18next";

function NbtSelectorAdmin({ selection, setSelection, use, adminInfos }) {
  const { t } = useTranslation();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  const pagesMatches = [...Array(adminInfos.num_pages).keys()].map((x) => x + 1);
  const defaultSelectors = {
    main: ["conversation_partners", "appointments", "community_calls"],
    help: ["videos", "faqs", "contact"],
  };

  const nbtTopics = {
    main: [...defaultSelectors[use], ...pagesMatches],
    help: ["videos", "faqs", "contact"],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments"],
    help: ["videos"],
  };
  const disabled = nbtDisabled[use];

  const updateSelection = (e) => {
    const v = e.target.value;
    if (defaultSelectors[use].includes(v)) {
      setSelection(v);
    } else {
      // Then reload the page with ?page=x
      const url = window.location.href;
      const parser = new URL(url || window.location);
      parser.searchParams.set("page", v);
      window.location = parser.href;
    }
  };

  return (
    <div className="selector">
      {topics.map((topic) => (
        <span className={topic} key={topic}>
          <input
            type="radio"
            id={`${topic}-radio`}
            value={topic}
            checked={selection === topic || `${adminInfos.page}-radio` === `${topic}-radio`}
            name="sidebar"
            onChange={(e) => updateSelection(e)}
          />
          <label htmlFor={`${topic}-radio`} className={disabled.includes(topic) ? "disabled" : ""}>
            {defaultSelectors[use].includes(topic) ? t(`nbt_${topic}`) : topic}
          </label>
        </span>
      ))}
    </div>
  );
}

export default NbtSelectorAdmin;
