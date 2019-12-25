import React, { useRef, useState, useEffect } from "react";
import {
  SearchBar,
  VideosContainer,
  SearchInput,
  VideosHeader,
  VideosBackContainer,
  MainContainer,
  VideoResult
} from "./styles";
import Icon from "../../_core/Icon";
import { StockCard } from "./StockCard";
import { VideoDetailsDialog } from "../../_core/Dialog";

const VideosCollection = props => {
  const asset = [
    {
      url:
        "https://public-stock-data.clipchamp.com/raw-data/stock-previews/stryb_v3913895.mp4"
    },
    {
      url:
        "https://public-stock-data.clipchamp.com/raw-data/stock-previews/stryb_v4020131.mp4"
    }
  ];
  const [isModal, setModal] = useState(false);
  return (
    <VideosContainer>
      <SearchBar>
        <Icon style={{ margin: "0 18px" }} color="#665dc3" name="search" />
        <SearchInput placeholder="Search video.." />
      </SearchBar>
      <VideoDetailsDialog open={isModal} />
      <VideosHeader>
        <VideosBackContainer onClick={() => props.history.goBack()}>
          <Icon
            name="arrowLeft"
            style={{ marginRight: 6, transform: "rotate(90deg)" }}
          />
          <span>Back to collections</span>
        </VideosBackContainer>
        <h2
          style={{
            fontSize: "1.625rem",
            fontWeight: 600,
            textAlign: "center",
            color: "#fff",
            flex: 1,
            textTransform: "capitalize"
          }}
        >
          {props?.match?.params?.key?.replace(/-/gi, " ")}
        </h2>
      </VideosHeader>
      <MainContainer>
        <VideoResult>
          {asset.map((val, key) => {
            return <StockCard setModal={() => setModal(true)} url={val.url} key={key} />;
          })}
        </VideoResult>
      </MainContainer>
    </VideosContainer>
  );
};

export default VideosCollection;
