import React, { useEffect, useState, useRef } from "react";
import {
  VideoContent,
  Video,
  StockAsset,
  ContextMenu,
  AddButton
} from "./styles";
import Icon from "../../_core/Icon";

export const StockCard = props => {
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

  useEffect(() => {
    return () => {
      if (refer?.current) {
        refer.current.removeEventListener("mouseover", null);
        refer.current.removeEventListener("mouseleave", null);
      }
    };
  }, []);
  return (
    <StockAsset onClick={() => props.setModal(true)} ref={refer}>
      <VideoContent>
        <ContextMenu>
          <AddButton>
            <Icon name="add" color="#665dc3" size={14} />
          </AddButton>
        </ContextMenu>
        <Video playing={isPlay} loop={true} url={props.url} />
      </VideoContent>
    </StockAsset>
  );
};
