import React, { useEffect, useRef, useState, useCallback } from "react";

const Play = ({ data, play = false, pause = false }) => {
  const video = useRef(null);
  const [value, setValue] = useState(null);
  useEffect(() => {
    if (value && play && !pause) {
      value.play();
    }
  }, [play, pause]);
  useEffect(() => {
    if (value && pause && !play) {
      value.pause();
    }
  }, [play, pause]);
  const callVideo = () => {
    if (data?.url) {
      const canvas = video?.current;
      const type = data?.mimeType?.split("/")?.[0];
      let videoCtx = new window.VideoContext(canvas);
      if (type === "video") {
        let videoNode2 = videoCtx.video(data?.url);
        videoNode2.connect(videoCtx.destination);
        videoNode2.start(0);
        if (play) {
          videoCtx.play();
        } else {
          setValue(videoCtx);
        }
      } else {
        let imageNode = videoCtx.image(data?.url);
        imageNode.connect(videoCtx.destination);
        imageNode.start(0);
        imageNode.start(4);
        videoCtx.play();
      }
    }
  };

  useEffect(() => {
    callVideo();
  }, []);

  useEffect(() => {
    callVideo();
  }, [data]);

  return (
    <canvas
      style={{ width: 380, height: 200 }}
      ref={video}
      id="video"
      width={380}
      height={200}
    />
  );
};

export default Play;
