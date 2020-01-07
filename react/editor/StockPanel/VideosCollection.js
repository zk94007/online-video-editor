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
import StockCard from "./StockCard";
import { VideoDetailsDialog } from "../../_core/Dialog";
import PerfectScroller from "react-perfect-scrollbar";
import Videos from "./Videos";

const VideosCollection = props => {
  const [search, setSearch] = useState("");
  const asset = [
    {
      name: "Attractive young blonde woman",
      url:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/stryb_v3913895.mp4"
    },
    {
      name: "Performance - speaker female teaching at internati..",
      url:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/stryb_v4020131.mp4"
    }
  ];
  const [isModal, setModal] = useState(false);
  const [data, setData] = useState(null);
  const keyword = props.searchBar ? props.search : search;
  return (
    <VideosContainer>
      {!props.searchBar && (
        <SearchBar>
          <Icon style={{ margin: "0 18px" }} color="#665dc3" name="search" />
          <SearchInput
            onChange={e => setSearch(e.target.value)}
            value={search}
            placeholder="Search video.."
          />
        </SearchBar>
      )}
      <VideoDetailsDialog
        data={data}
        setError={props.setError}
        getNetworkRequest={props.getNetworkRequest}
        closeModal={() => setModal(false)}
        open={isModal}
        setLoading={props.setLoading}
        resources={props.resources}
      />
      {!props.searchBar && (
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
      )}

      <MainContainer>
        <PerfectScroller component="div">
          <VideoResult>
            {asset
              .filter(
                val =>
                  val.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
              )
              .map((val, key) => {
                const isAdded = Object.keys(props.resources).filter(data =>
                  val?.url?.includes(props.resources?.[data]?.name)
                );
                return (
                  <StockCard
                    setError={props.setError}
                    setLoading={props.setLoading}
                    getNetworkRequest={props.getNetworkRequest}
                    setModal={data => {
                      setData(data);
                      setModal(true);
                    }}
                    isAdded={!!isAdded.length}
                    url={val.url}
                    key={key}
                  />
                );
              })}
          </VideoResult>
        </PerfectScroller>
      </MainContainer>
    </VideosContainer>
  );
};

export default VideosCollection;
