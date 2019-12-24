import React from "react";
import {
  SearchBar,
  VideosContainer,
  SearchInput,
  VideosListContainer,
  CollectionContainer,
  CollectionHeader,
  CollectionHeaderTitle,
  CollectionHeaderSeeAll,
  CollectionGrid
} from "./styles";
import Icon from "../../_core/Icon";

const Videos = () => {
  return (
    <VideosContainer>
      <SearchBar>
        <Icon style={{ margin: "0 18px" }} color="#665dc3" name="search" />
        <SearchInput placeholder="Search video.." />
      </SearchBar>
      <VideosListContainer>
        <CollectionContainer>
          <CollectionHeader>
            <CollectionHeaderTitle>Footage</CollectionHeaderTitle>
            <CollectionHeaderSeeAll>
              <span>SEE ALL</span>
              <Icon
                style={{ marginLeft: 12, transform: "rotate(-90deg)" }}
                size={14}
                name="arrowLeft"
              />
            </CollectionHeaderSeeAll>
          </CollectionHeader>
        </CollectionContainer>
      </VideosListContainer>
    </VideosContainer>
  );
};

export default Videos;
