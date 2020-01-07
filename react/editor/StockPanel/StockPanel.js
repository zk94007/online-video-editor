import React, { useState, useEffect } from "react";
import { Container, SideBar } from "./styles";
import SideBarItems from "./SideBar";
import { Route } from "react-router-dom";
import Videos from "./Videos";
import Audio from "./Audio";
import VideosCollection from "./VideosCollection";
import AudioCollection from "./AudioCollection";
import { FetchErrorDialog, LoadingDialog } from "../../_core/Dialog";
import { getResources } from "../../utils";

const StockPanel = () => {
  const [active, setActive] = useState("video");
  const [fetchError, setError] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNetworkRequest = () => {
    getResources(setError)
      .then(resources => setResources(resources))
      .catch(err => alert("Error"));
  };
  useEffect(() => {
    getNetworkRequest();
  }, []);

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
      {!!fetchError && (
        <FetchErrorDialog msg={fetchError} onClose={() => setError(false)} />
      )}
      {!!loading && <LoadingDialog />}
      <Route
        exact
        path="/editor/stock/collections/video"
        component={props => (
          <Videos
            resources={resources}
            setError={setError}
            getNetworkRequest={getNetworkRequest}
            setLoading={setLoading}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/editor/stock/collections/audio"
        component={props => (
          <Audio
            resources={resources}
            setError={setError}
            getNetworkRequest={getNetworkRequest}
            setLoading={setLoading}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/editor/stock/collections/video/:key"
        component={props => (
          <VideosCollection
            resources={resources}
            setError={setError}
            getNetworkRequest={getNetworkRequest}
            setLoading={setLoading}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/editor/stock/collections/audio/:key"
        component={props => (
          <AudioCollection
            resources={resources}
            setError={setError}
            getNetworkRequest={getNetworkRequest}
            setLoading={setLoading}
            {...props}
          />
        )}
      />
    </Container>
  );
};

export default StockPanel;
