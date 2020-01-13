import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Preview,
  DefaultWrapper,
  ThumbnailText,
  DeleteContainer,
  Image,
  Time,
  VideoContainer,
  VideoWrapper,
  Video
} from "./style";
import moment from "moment";
import Icon from "../../_core/Icon";

export const CardComponent = ({ support = "", ...props }) => {
  const isAudio = props?.item?.name?.search(
    /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp3|.aac|.wav|.wma)$/i
  );
  const url = props?.item?.url;
  const isMedia = props?.item?.length?.split(",")?.[0];
  const length = isMedia && moment.duration(isMedia);
  const refer = useRef(null);
  const [isPlay, setPlay] = useState(false);
  useEffect(() => {
    if (refer?.current) {
      refer.current.addEventListener("mouseover", () => {
        setPlay(true);
      });
      refer.current.addEventListener("mouseleave", () => {
        setPlay(false);
      });
    }
  }, []);

  const handleObjectItemDragStart = (event, id) => {
    var dragSrcEl = event.target;
    event.dataTransfer.effectAllowed = "move";
    var objectItem = {
      content: id,
      target: "itemType",
      support: support
    };
    event.dataTransfer.setData("text", JSON.stringify(objectItem));
  };

  useEffect(() => {
    return () => {
      if (refer?.current) {
        refer.current.removeEventListener("mouseover", null);
        refer.current.removeEventListener("mouseleave", null);
      }
    };
  }, []);
  return (
    <Card
      draggable="true"
      onDragStart={event => handleObjectItemDragStart(event, props.item.id)}
    >
      <Preview ref={refer}>
        <DefaultWrapper>
          {!isMedia && !isAudio + 1 && <Image src={url} />}
        </DefaultWrapper>
        {isMedia && (
          <>
            {!isPlay && (
              <Time>{`${
                length.hours() ? length.hours()`:` : ""
              } ${length.minutes()}: ${length.seconds()}`}</Time>
            )}

            <VideoContainer>
              <VideoWrapper>
                <Video playing={isPlay} loop={true} url={url} />
              </VideoWrapper>
            </VideoContainer>
          </>
        )}
      </Preview>
      <ThumbnailText>{props.item.name}</ThumbnailText>
      <DeleteContainer onClick={() => props.onRemove(props.item.id)}>
        <Icon color={"#ff5157"} name="delete" />
      </DeleteContainer>
    </Card>
  );
};
