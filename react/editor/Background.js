import { LibraryGrid, ScrollContainer } from "./style";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { BackgroundCard } from "./BackgroundCard";

const Background = () => {
  const colors = [
    {
      name: "black",
      color: "#000000"
    },
    {
      name: "white",
      color: "#ffffff"
    },
    {
      name: "Solid Color",
      color: "rgb(102, 93, 195)"
    }
  ];
  return (
    <ScrollContainer>
      <PerfectScrollbar component="div">
        <LibraryGrid>
          {colors.map(val => {
            return <BackgroundCard name={val.name} color={val.color} />;
          })}
        </LibraryGrid>
      </PerfectScrollbar>
    </ScrollContainer>
  );
};

Background.prototype = {};

export default Background;
