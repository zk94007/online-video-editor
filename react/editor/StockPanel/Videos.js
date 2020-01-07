import React, { useState } from "react";
import {
  SearchBar,
  VideosContainer,
  SearchInput,
  VideosListContainer,
  CollectionContainer,
  CollectionGrid,
  CollectionBackdropCard,
  PanelOne,
  PanelTwo,
  PanelThree,
  CollectionContent,
  CollectionImage,
  CollectionDetails
} from "./styles";
import Icon from "../../_core/Icon";
import { withRouter } from "react-router-dom";
import PerfectScroller from "react-perfect-scrollbar";
import VideoCollection from "./VideosCollection";

const Videos = ({
  history,
  resources,
  setError,
  setLoading,
  getNetworkRequest
}) => {
  const [search, setSearch] = useState("");

  const collections = [
    {
      name: "Free Forever",
      image:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/free-forever.jpg"
    },
    {
      name: "Born to be Wild",
      image:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/born-to-be-wild.jpg"
    },
    {
      name: "Celebrate the World",
      image:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/celebrate-the-world.jpg"
    },
    {
      name: "Celestial Footage",
      image:
        "https://s3.amazonaws.com/virginia-testing.webrand.com/public/celestial-footage.jpg"
    }
  ];
  return (
    <VideosContainer>
      <SearchBar>
        <Icon style={{ margin: "0 18px" }} color="#665dc3" name="search" />
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search video.."
        />
      </SearchBar>
      {!!search ? (
        <VideoCollection
          resources={resources}
          setError={setError}
          getNetworkRequest={getNetworkRequest}
          setLoading={setLoading}
          searchBar={true}
          search={search}
        />
      ) : (
        <VideosListContainer>
          <PerfectScroller component="div">
            <CollectionContainer>
              <CollectionGrid>
                {collections.map((val, key) => {
                  return (
                    <CollectionBackdropCard
                      onClick={() =>
                        history.push(
                          `/editor/stock/collections/video/${val.name
                            .toLowerCase()
                            .replace(/ /gi, "-", "-")}`
                        )
                      }
                      key={key}
                    >
                      <PanelOne />
                      <PanelTwo />
                      <PanelThree />
                      <CollectionContent>
                        <CollectionImage src={val.image} />
                        <CollectionDetails>
                          <h2>{val.name}</h2>
                        </CollectionDetails>
                      </CollectionContent>
                    </CollectionBackdropCard>
                  );
                })}
              </CollectionGrid>
            </CollectionContainer>
          </PerfectScroller>
        </VideosListContainer>
      )}
    </VideosContainer>
  );
};

export default withRouter(Videos);
