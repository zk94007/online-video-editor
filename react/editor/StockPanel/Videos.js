import React from "react";
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
  CollectionImage
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
          <CollectionGrid>
            <CollectionBackdropCard>
              <PanelOne />
              <PanelTwo />
              <PanelThree />
              <CollectionContent>
                <CollectionImage src="https://public-stock-data.clipchamp.com/raw-data/collection-thumbs/free-forever.jpg" />
              </CollectionContent>
            </CollectionBackdropCard>
            <CollectionBackdropCard>
              <PanelOne />
              <PanelTwo />
              <PanelThree />
              <CollectionContent>
                <CollectionImage src="https://public-stock-data.clipchamp.com/raw-data/collection-thumbs/born-to-be-wild.jpg" />
              </CollectionContent>
            </CollectionBackdropCard>
          </CollectionGrid>
        </CollectionContainer>
      </VideosListContainer>
    </VideosContainer>
  );
};

export default Videos;
