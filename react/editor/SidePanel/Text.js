import { LibraryGrid, ScrollContainer, TextHeader } from "./style";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { BackgroundCard } from "./BackgroundCard";

const Text = () => {
  return (
    <ScrollContainer>
      <PerfectScrollbar component="div">
        <LibraryGrid>
          <BackgroundCard
            support="text"
            name="Plunging"
            video="https://s3.amazonaws.com/virginia-testing.webrand.com/public/plunging.mp4"
            image="https://s3.amazonaws.com/virginia-testing.webrand.com/public/plunging.jpg"
          />
          <BackgroundCard
            support="text"
            name="Clean"
            video="https://s3.amazonaws.com/virginia-testing.webrand.com/public/clean.mp4"
            image="https://s3.amazonaws.com/virginia-testing.webrand.com/public/clean.jpg"
          />
          <BackgroundCard
            support="text"
            name="Mirror"
            video="https://s3.amazonaws.com/virginia-testing.webrand.com/public/mirror.mp4"
            image="https://s3.amazonaws.com/virginia-testing.webrand.com/public/mirror.jpg"
          />
          <BackgroundCard
            support="text"
            name="Funky"
            video="https://s3.amazonaws.com/virginia-testing.webrand.com/public/funky.mp4"
            image="https://s3.amazonaws.com/virginia-testing.webrand.com/public/funky.jpg"
          />
        </LibraryGrid>
      </PerfectScrollbar>
    </ScrollContainer>
  );
};

Text.prototype = {};

export default Text;
