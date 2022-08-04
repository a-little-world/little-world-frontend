import classNames from "classnames";
import React, { useState } from "react";
import { format } from "timeago.js";
import Avatar from "react-nice-avatar";

function ChatItem(props) {
  const [onHoverTool, setOnHoverTool] = useState(false);
  const statusColorType = props.statusColorType;

  const handleOnMouseEnter = () => {
    setOnHoverTool(true);
  };

  const handleOnMouseLeave = () => {
    setOnHoverTool(false);
  };

  const handleOnClick = (e) => {
    e.preventDefault();

    if (onHoverTool === true) return;

    props.onClick();
  };

  let avatar = null;
  if (typeof props.avatar === 'string' || props.avatar instanceof String){
    avatar = <img className="profile-image" alt="user" src={props.avatar} />;
  }else{
    avatar = <Avatar className="profile-avatar-chat" {...props.avatar} />
  }


  return (
    <div
      key={props.id}
      className={classNames("rce-container-citem", props.className)}
      onClick={handleOnClick}
      onContextMenu={props.onContextMenu}
    >
      <div
        className={classNames("rce-citem", {
          selected: statusColorType === "encircle",
        })}
      >
        <div
          className={classNames("rce-citem-avatar", {
            "rce-citem-status-encircle": statusColorType === "encircle",
          })}
        >
          {avatar}
        </div>
        <div className="rce-citem-body">
          <div className="rce-citem-body--top">
            <div className="rce-citem-body--top-title">{props.title}</div>
            <div className="rce-citem-body--top-time">
              {props.date && !isNaN(props.date) && (props.dateString || format(props.date))}
            </div>
          </div>

          <div className="rce-citem-body--bottom">
            <div className="rce-citem-body--bottom-title">{props.subtitle}</div>
            <div
              className="rce-citem-body--bottom-tools"
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              {props.showVideoCall && (
                <div className="rce-citem-body--bottom-tools-item" onClick={props.onClickVideoCall}>
                  {/* videocall */}
                </div>
              )}
            </div>
            <div className="rce-citem-body--bottom-tools-item-hidden-hover" />
            <div className="rce-citem-body--bottom-status">
              {props.unread > 0 && <span>{props.unread}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ChatItem.defaultProps = {
  id: "",
  onClick: null,
  avatar: "",
  avatarFlexible: false,
  alt: "",
  title: "",
  subtitle: "",
  date: new Date(),
  unread: 0,
  statusColor: null,
  statusColorType: "badge",
  statusText: null,
  dateString: null,
  lazyLoadingImage: undefined,
  onAvatarError: () => void 0,
  showMute: null,
  showVideoCall: null,
};

export default ChatItem;
