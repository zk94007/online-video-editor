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
            video="https://public-stock-data.clipchamp.com/raw-data/content/previews/cc_m9426fdfd.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m9426fdfd.jpg"
          />
          <BackgroundCard
            name="Clean"
            video="https://public-stock-data.clipchamp.com/raw-data/content/previews/cc_m1306e99c.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m1306e99c.jpg"
          />
          <BackgroundCard
            name="Mirror"
            video="https://public-stock-data.clipchamp.com/raw-data/content/previews/cc_mb050aee.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_mb050aee.jpg"
          />
          <BackgroundCard
            name="Funky"
            video="https://public-stock-data.clipchamp.com/raw-data/content/previews/cc_m806cfa9.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_m806cfa9.jpg"
          />
          <BackgroundCard
            name="Plunging (Right)"
            video="https://public-stock-data.clipchamp.com/raw-data/content/previews/cc_md6338793.mp4"
            image="https://public-stock-data.clipchamp.com/raw-data/content/thumbs/cc_md6338793.jpg"
          />
        </LibraryGrid>
      </PerfectScrollbar>
    </ScrollContainer>
  );
};

Text.prototype = {};

export default Text;
