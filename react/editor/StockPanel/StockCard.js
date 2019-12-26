import React, { useEffect, useState, useRef } from "react";
import {
  VideoContent,
  Video,
  StockAsset,
  ContextMenu,
  AddButton
} from "./styles";
import Icon from "../../_core/Icon";
import ReactWaves from "@dschoon/react-waves";

export const StockCard = ({ setModal, url, audio = false }) => {
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
    <StockAsset
      onClick={() =>
        setModal({
          url: url
        })
      }
      audio={audio}
      ref={refer}
    >
      <VideoContent>
        <ContextMenu>
          <AddButton>
            <Icon name="add" color="#665dc3" size={14} />
          </AddButton>
        </ContextMenu>
        {audio ? (
          <ReactWaves
            onClick={() => setModal(true)}
            audioFile={url}
            className={"react-waves"}
            options={{
              barHeight: 1,
              cursorWidth: 0,
              height: 100,
              hideScrollbar: true,
              progressColor: "#4c5aea",
              responsive: true,
              waveColor: "#2a2f61",
              width: "100%"
            }}
            volume={1}
            zoom={1}
            playing={isPlay}
          />
        ) : (
          <Video playing={isPlay} loop={true} url={url} />
        )}
      </VideoContent>
    </StockAsset>
  );
};
