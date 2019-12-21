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
import Icon from "../components/Icon";
import moment from "moment";

export const CardComponent = props => {
  const isAudio = props?.item?.name?.search(
    /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp3|.aac|.wav|.wma)$/i
  );

  const url =
    isAudio + 1
      ? "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3"
      : "https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4";
  const isMedia = props?.item?.length?.split(",")?.[0];
  const length = isMedia && moment.duration(isMedia);
  const refer = useRef(null);
  const [isShow, setShow] = useState(null);
  useEffect(() => {
    if (refer?.current) {
      refer.current.addEventListener("mouseover", () => {
        setShow(true);
      });
      refer.current.addEventListener("mouseleave", () => {
        setShow(false);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (refer?.current) {
        refer.current.removeEventListener("mouseover", null);
        refer.current.removeEventListener("mouseleave", null);
      }
    };
  }, []);
  return (
    <Card>
      <Preview ref={refer}>
        <DefaultWrapper>{/* <Image src={image} /> */}</DefaultWrapper>
        {isMedia && (
          <>
            <Time>{`${
              length.hours() ? length.hours()`:` : ""
            } ${length.minutes()}: ${length.seconds()}`}</Time>
            {isShow && (
              <VideoContainer>
                <VideoWrapper>
                  <Video
                    config={{
                      file: {
                        attributes: {
                          autoPlay: true
                        }
                      }
                    }}
                    playing={true}
                    loop={true}
                    url={url}
                  />
                </VideoWrapper>
              </VideoContainer>
            )}
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
