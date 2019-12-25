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
  CollectionImage,
  CollectionDetails
} from "./styles";
import Icon from "../../_core/Icon";

const Audio = () => {
  const collections = [
    {
      name: "Free Forever",
      image:
        "https://public-stock-data.clipchamp.com/raw-data/collection-thumbs/free-forever.jpg"
    },
    {
      name: "Born to be Wild",
      image:
        "https://public-stock-data.clipchamp.com/raw-data/collection-thumbs/born-to-be-wild.jpg"
    },
    {
      name: "Celebrate the World",
      image:
        "https://public-stock-data.clipchamp.com/raw-data/collection-thumbs/celebrate-the-world.jpg"
    }
  ];
  return (
    <VideosContainer>
      <SearchBar>
        <Icon style={{ margin: "0 18px" }} color="#665dc3" name="search" />
        <SearchInput placeholder="Search audio.." />
      </SearchBar>
      <VideosListContainer>
        <CollectionContainer>
          <CollectionGrid>
            {collections.map((val, key) => {
              return (
                <CollectionBackdropCard key={key}>
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
      </VideosListContainer>
    </VideosContainer>
  );
};

export default Audio;
