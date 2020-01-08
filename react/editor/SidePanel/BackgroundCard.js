import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  Preview,
  DefaultWrapper,
  VideoContainer,
  VideoWrapper,
  Video,
  ThumbnailText,
  Image
} from "./style";

export const BackgroundCard = ({
  name,
  color = "false",
  image,
  video = false
}) => {
  const refer = useRef(null);
  const [isShow, setShow] = useState(null);

  useEffect(() => {
    if (video && refer?.current) {
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
      if (video && refer?.current) {
        refer.current.removeEventListener("mouseover", null);
        refer.current.removeEventListener("mouseleave", null);
      }
    };
  }, []);

  const handleObjectItemDragStart = (event, id) => {
    var dragSrcEl = event.target;
    event.dataTransfer.effectAllowed = "move";
    var objectItem = {
      content: id,
      target: "itemType",
      support: "text"
    };
    event.dataTransfer.setData("text", JSON.stringify(objectItem));
  };

  return (
    <Card
      draggable="true"
      onDragStart={event => handleObjectItemDragStart(event, name?.toLowerCase())}
    >
      <Preview ref={refer}>
        <DefaultWrapper color={color}>
          {image && <Image src={image} />}
        </DefaultWrapper>
        {video && isShow && (
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
                url={video}
              />
            </VideoWrapper>
          </VideoContainer>
        )}
      </Preview>
      <ThumbnailText>{name}</ThumbnailText>
    </Card>
  );
};
