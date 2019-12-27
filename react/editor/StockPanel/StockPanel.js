import React, { useState } from "react";
import { Container, SideBar } from "./styles";
import SideBarItems from "./SideBar";
import { Route } from "react-router-dom";
import Videos from "./Videos";
import Audio from "./Audio";
import VideosCollection from "./VideosCollection";
import AudioCollection from "./AudioCollection";

const StockPanel = () => {
  const [active, setActive] = useState("video");

  const items = [
    {
      name: "Video",
      url: "/editor/stock/collections/video",
      icon: "video"
    },
    {
      name: "Audio",
      url: "/editor/stock/collections/audio",
      icon: "audio"
    }
  ];
  return (
    <Container>
      <SideBar>
        <SideBarItems setActive={setActive} active={active} items={items} />
      </SideBar>
      <Route exact path="/editor/stock/collections/video" component={Videos} />
      <Route exact path="/editor/stock/collections/audio" component={Audio} />
      <Route
        exact
        path="/editor/stock/collections/video/:key"
        component={VideosCollection}
      />
       <Route
        exact
        path="/editor/stock/collections/audio/:key"
        component={AudioCollection}
      />
    </Container>
  );
};

export default StockPanel;
