import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  VideoContent,
  Video,
  StockAsset,
  ContextMenu,
  AddButton
} from "./styles";
import Icon from "../../_core/Icon";
import ReactWaves from "@dschoon/react-waves";
import axios from "axios";
import { server } from "../../../config";
import { withRouter } from "react-router-dom";

const StockCard = ({ setModal, url, audio = false, history, setError }) => {
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
  const addToLibrary = useCallback(e => {
    e.stopPropagation();
    const projectId = localStorage.getItem("id");
    const requestUrl = `${server.apiUrl}/project/${projectId}/import`;
    axios
      .post(
        requestUrl,
        JSON.stringify({
          url: url,
          projectID: projectId
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(data => {
        if (typeof data.err !== "undefined") {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => setError(error.message));
  });
  return (
    <StockAsset
      onClick={e => {
        setModal({
          url: url
        });
      }}
      audio={audio}
      ref={refer}
    >
      <VideoContent>
        <ContextMenu>
          <AddButton onClick={addToLibrary}>
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

export default withRouter(StockCard);
