import React, { useState } from "react";
import { Container, SideBar } from "./styles";
import SideBarItems from "./SideBar";
import { Route } from "react-router-dom";
import Videos from "./Videos";

const StockPanel = () => {
  const [active, setActive] = useState("video");

  const items = [
    {
      name: "Video",
      url: "video",
      icon: "video"
    },
    {
      name: "Audio",
      url: "audio",
      icon: "audio"
    }
  ];
  return (
    <Container>
      <SideBar>
        <SideBarItems setActive={setActive} active={active} items={items} />
      </SideBar>
      <Route exact path="/editor/stock/collections/video" component={Videos} />
    </Container>
  );
};

export default StockPanel;
