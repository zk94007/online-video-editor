import { LibraryGrid, ScrollContainer, TextHeader } from "./style";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { BackgroundCard } from "./BackgroundCard";

const Text = () => {
  return (
    <ScrollContainer>
      <PerfectScrollbar component="div">
        <TextHeader>Intro/Outros</TextHeader>
        <LibraryGrid>
          <BackgroundCard
            name="Plunging"
            video="http://54.173.175.102/assets/video/plunging.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m9426fdfd.jpg"
          />
          <BackgroundCard
            name="Clean"
            video="http://54.173.175.102/assets/video/clean.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m1306e99c.jpg"
          />
          <BackgroundCard
            name="Mirror"
            video="http://54.173.175.102/assets/video/mirror.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_mb050aee.jpg"
          />
          <BackgroundCard
            name="Funky"
            video="http://54.173.175.102/assets/video/funky.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m806cfa9.jpg"
          />
        </LibraryGrid>
      </PerfectScrollbar>
    </ScrollContainer>
  );
};

Text.prototype = {};

export default Text;
