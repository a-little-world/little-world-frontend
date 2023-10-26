/* eslint-disable jsx-a11y/media-has-caption */
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Chat from "./chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import "./i18n";
import Link from "./path-prepend";
import {
  getAudioTrack,
  getVideoTrack,
  joinRoom,
  removeActiveTracks,
  toggleLocalTracks,
} from "./twilio-helper";

import "./App.css";
import "./call.css";
import { FetchQuestionsDataAsync, FetchUnArchivedQuestions } from "./features/userData";
import { questionsDuringCall } from "./services/questionsDuringCall";

import {
  Button,
  Card,
} from "@a-little-world/little-world-design-system";
import styled from "styled-components";

const TopicButton = styled.button`
  font-size: 1rem;
  font-weight: normal;
  min-width: fit-content;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: 23px;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  white-space: nowrap;
  border: 2px solid #ef8a21;
  margin: 0px ${({ theme }) => theme.spacing.xxxsmall};
  box-sizing: border-box;
  ${(props) =>
    props.selected &&
    `
    background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
    color: white;
  `}
`;

const SidebarCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
   background: transparent;
  border: none;
  box-shadow: none;
  padding: ${({ theme }) => theme.spacing.xxsmall};

`;

const QuestionCard = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border-radius: 18px;
  margin-top: ${({ theme }) => theme.spacing.xsmall};
  background: #f9fafb;
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${(props) =>
    props.selected &&
    `
    border-color: red;
  `}
`;

const QuestionContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: transparent;
  border: none;
  box-shadow: none;
  @media(min-width: 500px){
  padding: 0px;
}
`;

const QuestionButton = styled(Button)`
  padding: 0px;
  background: transparent;
  color: black;
  padding: ${({ theme }) => theme.spacing.xsmall};
  height: fit-content;
  font-size: 16px;
  font-weight: normal;
`;

const ArchiveButton = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
  padding: 0px ${({ theme }) => theme.spacing.xsmall};

`;

const QuestionCategories = styled.div`
  display: flex;
  align-items: center;
`;

const Categories = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xxxsmall};
`



function toggleFullscreen(t) {
  const videoContainer = document.querySelector(".video-container");
  const fullScreenTextEl = document.querySelector("label[for=fullscreen-toggle] .text");
  // would be nice to do text in CSS but we need translation support

  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
    fullScreenTextEl.innerHTML = t("vc_fs_btn_exit_fullscreen");
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    fullScreenTextEl.innerHTML = t("vc_fs_btn_enter_fullscreen");
  }
}

const SetSideContext = createContext(() => {});

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  });

  const remainder = seconds % 60;
  const minutes = (seconds - remainder) / 60;

  const two = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div className="call-time">
      <span className="text">
        {two(minutes)}:{two(remainder)}
      </span>
    </div>
  );
}

function ToggleButton({ id, text, alt, onChange, defaultChecked, disabled }) {
  return (
    <>
      <input type="checkbox" id={id} defaultChecked={defaultChecked} onChange={onChange} />
      <label htmlFor={id} className={disabled ? "disabled" : ""}>
        <div className="img" alt={alt} />
        {text && <span className="text">{text}</span>}
      </label>
    </>
  );
}

function VideoControls() {
  const { t } = useTranslation();

  const setSideSelection = useContext(SetSideContext);

  const showChat = () => {
    if (document.fullscreenElement) {
      toggleFullscreen(t);
    }
    setSideSelection("chat");
  };

  const audioMuted = localStorage.getItem("audio muted") === "true";
  const videoMuted = localStorage.getItem("video muted") === "true";

  return (
    <div className="video-controls">
      <ToggleButton
        id="audio-toggle"
        alt="mute/unmute mic"
        defaultChecked={audioMuted}
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <ToggleButton
        id="video-toggle"
        alt="enable/disable webcam"
        defaultChecked={videoMuted}
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
      />
      <ToggleButton
        id="fullscreen-toggle"
        text={t("vc_fs_btn_enter_fullscreen")}
        alt="toggle fullscreen"
        onChange={() => toggleFullscreen(t)}
      />
      <ToggleButton
        id="calendar-toggle"
        text={t("vc_fs_btn_appointment")}
        alt="calendar"
        disabled
      />
      <ToggleButton id="help-toggle" text={t("vc_fs_btn_mistake")} alt="mistake" disabled />
      <button type="button" className="chat-show" onClick={showChat}>
        <div className="img" alt="show chat" />
        <span className="text">{t("vc_fs_btn_chat")}</span>
      </button>
      <Timer />
      <Link to="/" className="end-call">
        <div className="img" alt="end call" />
        <span className="text">{t("vc_fs_btn_end_call")}</span>
      </Link>
    </div>
  );
}

function MobileVideoControlsTop({ selectedOverlay, setOverlay }) {
  const buttons = ["chat", "translate", "questions", "notes"];
  const disabled = ["notes"];

  return (
    <div className="video-controls top">
      {buttons.map((name) => (
        <button
          key={name}
          type="button"
          className={`show-${name}${selectedOverlay === name ? " selected" : ""}${
            disabled.includes(name) ? " disabled" : ""
          }`}
          onClick={() => setOverlay(name)}
        >
          <img alt={`show-${name}`} />
        </button>
      ))}
    </div>
  );
}

function SidebarQuestions() {
  const { t } = useTranslation();
  const questionDataFromApi = useSelector((state) => state.userData?.questions?.data);
  const questionTitleDataFromApi = useSelector((state) => state.userData?.questions?.category);
  const archivedQuestionsFromApi = useSelector((state) => state.userData?.archivedQuestions);

  const selfUserPreferedLang = localStorage.i18nextLng
  const [selectedQuestionId, setQuestionId] = useState(null);

  const topicList = questionTitleDataFromApi?.map((item) => item[selfUserPreferedLang]);
  const [selectedTopic, setTopic] = useState(topicList ? topicList[0] : null);

  const [archived, setArchived] = useState(archivedQuestionsFromApi ? archivedQuestionsFromApi : [])
  const [unarchived, setUnarchived] = useState(questionDataFromApi);

  useEffect(() => {
    // condition for selecting the top item of the category
    if (selectedTopic === 'Archived') {
      if (archived.length !== 0) setQuestionId(archived[0]?.id)
    }
    else {
      const matchingQuestion = unarchived?.find((item) => item?.category_name[selfUserPreferedLang] === selectedTopic);
      if (matchingQuestion?.id) {
        setQuestionId(matchingQuestion?.id)
      }
    }
  }, [selectedTopic, unarchived, archived])


  // function to archive the card and store the card in Archived list
  const archiveQuestion = async (id) => {
    const response = await questionsDuringCall.archiveQuestion(id)
    if (response === 'error') {
      console.log('Internal Server Error')
    }
    else {
      const questionToArchive = unarchived.find((question) => question.id === id);
      if (questionToArchive) {
        setUnarchived(unarchived.filter((question) => question.id !== id));
        setArchived([...archived, questionToArchive]);
      }
    }
  }

  // function to un-archive the card and store the card back to unarchived list
  const unArchiveQuestion = async (id) => {
    const response = await questionsDuringCall.unArchiveQuestion(id)

    if (response === 'error') {
      console.log('Internal Server Error')
    }
    else {
      const questionToUnarchive = archived.find((question) => question.id === id);
      if (questionToUnarchive) {
        setArchived((prevArchived) => prevArchived.filter((question) => question.id !== id));
        setUnarchived((prevData) => [...prevData, questionToUnarchive]);
      }
    }
  }
  const categoriesRef = useRef(null);

  const changeScroll = (direction) => {
    const scrollVelocity = {
      right: 100,
      left: -100,
    };
    if (categoriesRef.current) {
      categoriesRef.current.scrollLeft += scrollVelocity[direction];
    }
  };

  return (
    <SidebarCard>
      <QuestionCategories>
        <button type="button" className="questions-left" onClick={() => changeScroll("left")}>
          <img className="left-scroll-icon" alt="show left" />
        </button>
        <Categories ref={categoriesRef}>
          {topicList?.map((topic) => (
            <TopicButton
              key={topic}
              type="button"
              selected={selectedTopic === topic}
              value={topic}
              onClick={() => setTopic(topic)}
            >
              {topic}
            </TopicButton>
          ))}

          <TopicButton
            key='Archived'
            type="button"
            selected={selectedTopic === 'Archived'}
            value='Archived'
            onClick={() => { setTopic('Archived') }}
          >
            {t("question_category_archived")}
          </TopicButton>

        </Categories>
        <button type="button" className="questions-right" onClick={() => changeScroll("right")}>
          <img className="right-scroll-icon" alt="show right" />
        </button>
      </QuestionCategories>
      <QuestionContentCard>
        {
          unarchived
            ?.filter((question) => question.category_name[selfUserPreferedLang] === selectedTopic)
            ?.map(({ id, content }) => (
              <QuestionCard
                key={id}
                selected={selectedQuestionId === id}
              >
                <QuestionButton
                  type="button"
                  selected={selectedQuestionId === id}
                  onClick={() => setQuestionId(id)}
                >
                  {content[selfUserPreferedLang]}
                </QuestionButton>
                {selectedQuestionId === id && (
                  <ArchiveButton>
                    <button type="button" className="yes" onClick={() => archiveQuestion(id)}>
                      <img className="accept-question-icon" alt="accept question" />
                    </button>
                  </ArchiveButton>
                )}
              </QuestionCard>
            ))}

        {
          selectedTopic == 'Archived' &&
          archived?.map(({ id, content }) => {
            return (
              <QuestionCard
                key={id}
                selected={selectedQuestionId === id}
              >
                <QuestionButton
                  type="button"
                  selected={selectedQuestionId === id}
                  onClick={() => setQuestionId(id)}
                >
                  {content[selfUserPreferedLang]}
                </QuestionButton>

                {selectedQuestionId === id && (
                  <ArchiveButton>
                    <button type="button" className="unarchive" onClick={() => unArchiveQuestion(id)}>
                      <img className="unarchive-question-icon" alt="accept question" />
                    </button>
                  </ArchiveButton>
                )}
              </QuestionCard>
            )
          })
        }


      </QuestionContentCard>
    </SidebarCard>
  );
}

function SidebarNotes() {
  return <div className="notes">notes stuff goes here</div>;
}

function TranslationDropdown({ side, selected, setter }) {
  const { t } = useTranslation();
  const languages = [
    "en",
    "sa",
    "bg",
    "ma",
    "ca",
    "fr",
    "gr",
    "in",
    "it",
    "kr",
    "ir",
    "pl",
    "ru",
    "es",
    "tr",
    "uk",
    "vn",
    "de",
  ];
  return (
    <select
      name={`${side}-language-select`}
      onChange={(e) => setter(e.target.value)}
      value={selected}
    >
      {languages.map((code) => (
        <option key={code} value={code}>
          {t(`lang-${code}`)}
        </option>
      ))}
    </select>
  );
}

function TranslationBox() {
  const { t } = useTranslation();
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("de");
  const [isSwapped, setIsSwapped] = useState(false);

  const [leftText, setLeftText] = useState("");
  const [rigthText, setRightText] = useState("");

  const handleChangeLeft = (event) => {
    setLeftText(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (leftText === "") {
        return;
      }

      fetch(`${BACKEND_URL}/api/user/translate/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          source_lang: fromLang,
          target_lang: toLang,
          text: leftText,
        }).toString(),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          console.error("server error", response.status, response.statusText);
          return false;
        })
        .then(({ trans }) => setRightText(trans))
        .catch((error) => console.error(error));
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [leftText]);

  const swapLang = () => {
    const oldFromLang = fromLang;
    const oldToLang = toLang;
    setFromLang(oldToLang);
    setToLang(oldFromLang);
    const tmpLeftText = leftText;
    setRightText(tmpLeftText);
    setLeftText(rigthText);
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="translation-box">
      <div className="left">
        <TranslationDropdown side="left" selected={fromLang} setter={setFromLang} />
        <textarea
          placeholder={t("vc_translator_type_here")}
          value={leftText}
          onChange={handleChangeLeft}
        />
      </div>
      <button
        type="button"
        className={isSwapped ? "swap-languages swapped" : "swap-languages"}
        onClick={swapLang}
      >
        <img alt="swap languages" />
      </button>
      <div className="right">
        <TranslationDropdown side="right" selected={toLang} setter={setToLang} />
        <textarea placeholder={t("vc_translator_type_here")} readOnly value={rigthText} />
      </div>
    </div>
  );
}

function MobileDrawer({ content, setOverlay }) {
  const location = useLocation();
  const { userPk } = location.state || {};

  return (
    <div className={`call-drawer-container ${content}`}>
      <div className="call-drawer">
        <button className="arrow-down" type="button" onClick={() => setOverlay(null)}>
          <img alt="hide drawer" />
        </button>
        <div className="drawer-content">
          {content === "chat" && <Chat userPk={userPk} />}
          {content === "translate" && <TranslationBox />}
          {content === "questions" && <SidebarQuestions />}
          {content === "notes" && <SidebarNotes />}
        </div>
      </div>
    </div>
  );
}

function VideoFrame({ video, audio }) {
  const [selectedOverlay, setOverlay] = useState(null);

  return (
    <div className="video-border">
      <div className="video-container">
        <MobileVideoControlsTop selectedOverlay={selectedOverlay} setOverlay={setOverlay} />
        <div
          id="foreign-container"
          className={selectedOverlay ? "video-frame blur" : "video-frame"}
          alt="video"
        />
        <div className="local-video-container inset">
          <video ref={video} />
          <audio ref={audio} />
        </div>
        <VideoControls />
        <MobileDrawer content={selectedOverlay} setOverlay={setOverlay} />
      </div>
    </div>
  );
}

function Sidebar({ sideSelection }) {
  const { t } = useTranslation();
  const location = useLocation();

  const { userPk } = location.state || {};
  const sidebarTopics = ["chat", "questions", "notes"];
  const setSideSelection = useContext(SetSideContext);
  const handleChange = (e) => setSideSelection(e.target.value);
  const disabled = ["notes"];

  return (
    <div className="call-sidebar">
      <div className="sidebar-selector">
        {sidebarTopics.map((topic) => (
          <span key={topic}>
            <input
              type="radio"
              id={`${topic}-radio`}
              value={topic}
              checked={sideSelection === topic}
              name="sidebar"
              onChange={handleChange}
            />
            <label
              htmlFor={`${topic}-radio`}
              className={disabled.includes(topic) ? "disabled" : ""}
            >
              {t(`vc_btn_${topic}`)}
            </label>
          </span>
        ))}
      </div>
      <div className="sidebar-content">
        {sideSelection === "chat" && <Chat userPk={userPk} />}
        {sideSelection === "questions" && <SidebarQuestions />}
        {sideSelection === "notes" && <SidebarNotes />}
      </div>
    </div>
  );
}

function CallScreen() {
  const [sideSelection, setSideSelection] = useState("chat");
  const selfPk = useSelector((state) => state.userData.self.userPk);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userPk, tracks } = location.state || {};
  const videoRef = useRef();
  const audioRef = useRef();

  /* remove the video stream from call-setup otherwise it can hang around after
   * returing to main page, causing webcam lights to remain on.
   */
  removeActiveTracks();

  useEffect(() => {
    dispatch(FetchQuestionsDataAsync())
    dispatch(FetchUnArchivedQuestions())
  }, []);

  useEffect(() => {
    if (!userPk) {
      navigate(`${BACKEND_PATH}/`);
    }
    const { videoId, audioId } = tracks || {};
    if (!(videoId && audioId)) {
      console.error("videoId audioId", videoId, audioId);
    }
    const videoMuted = localStorage.getItem("video muted") === "true";
    const audioMuted = localStorage.getItem("audio muted") === "true";
    getVideoTrack(videoId, videoMuted).then((track) => {
      track.attach(videoRef.current);
    });
    getAudioTrack(audioId, audioMuted).then((track) => {
      track.attach(audioRef.current);
    });
    joinRoom(selfPk, userPk);
  }, [userPk, tracks]);

  document.body.style.overflow = ""; // unset after call overlay

  return (
    <div className="call-screen">
      <SetSideContext.Provider value={setSideSelection}>
        <div className="call-and-text">
          <VideoFrame video={videoRef} audio={audioRef} />
          <TranslationBox />
        </div>
        <Sidebar sideSelection={sideSelection} />
      </SetSideContext.Provider>
    </div>
  );
}

export default CallScreen;
