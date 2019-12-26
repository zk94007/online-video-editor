import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactPlayer from "react-player";

const Container = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  background: #1c1c26;
  color: #d8d8d8;
  height: 100vh;
  overflow: hidden;
`;

const SideBar = styled.div`
  width: 243px;
  flex-shrink: 0;
  background: linear-gradient(165deg, #262633, #1c1c26);
  box-shadow: 5px 0 5px -2px rgba(0, 0, 0, 0.15);
  padding-top: 49px;
`;

const ListItem = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  transition: background 0.2s ease-in-out;
  background: 0 0;
  color: #fff;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.6px;
  height: 70px;
  text-transform: uppercase;
  opacity: 1;
  padding-left: 38px;
  &:hover {
    background: rgba(32, 32, 44, 0.9);
  }
`;

const ListViewContainer = styled.div`
  background: 0 0;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  background: rgba(32, 32, 44, 0.9);
`;

const Item = styled.a`
  opacity: 0.6;
  margin-bottom: 1px;
  text-transform: capitalize;
  padding: 5px 68px;
  &:hover {
    opacity: 1;
  }
`;

const SearchBar = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 48px;
  min-height: 48px;
  max-height: 48px;
  border-radius: 100px;
  opacity: 0.95;
  font-size: 1rem;
  letter-spacing: 0.5px;
  outline: 0;
  transition: border-color 0.2s ease-in-out, color 0.2s ease-in-out;
  margin: 50px 50px 30px;
  border: 1px solid rgba(229, 230, 241, 0.25);
  font-weight: 600;
  background: 0 0;
  color: #fff;
  width: calc(100% - 100px);
`;

const VideosContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SearchInput = styled.input`
  background: 0 0;
  caret-color: #000;
  border: 0;
  padding-bottom: 3px;
  font-weight: 600;
  outline: 0;
  width: 50px;
  flex: 1;
  color: inherit;
  caret-color: #fff;
  &::placeholder {
    color: #d8d8d8;
    font-style: italic;
  }
`;

const VideosListContainer = styled(PerfectScrollbar)`
  position: relative;
  flex-grow: 1;
  z-index: 1;
`;

const CollectionContainer = styled.div``;

const CollectionGrid = styled.div`
  top: 0;
  height: 100%;
  align-content: start;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, 246px);
  grid-template-rows: auto;
  padding-right: 50px;
  padding-left: 50px;
  align-content: start;
  display: grid;
  grid-area: results-grid;
  grid-gap: 26px;
  grid-template-rows: auto;
  padding-bottom: 30px;
  grid-template-columns: 1fr;
  flex-grow: 1;
  @media (min-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CollectionBackdropCard = styled.div`
  position: relative;
  cursor: pointer;
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 56.25%;
  }
`;

const PanelOne = styled.div`
  opacity: 0.05;
  transform: scaleX(0.91) translateY(-12px);
  transition: transform 0.2s ease-in-out;
  position: absolute;
  background: #fff;
  margin-top: 18px;
  border-radius: 4px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${CollectionBackdropCard}:hover & {
    opacity: 0.05;
    transform: scaleX(0.93) translateY(-9px);
  }
`;

const PanelTwo = styled.div`
  transition: transform 0.2s ease-in-out;
  position: absolute;
  background: #fff;
  margin-top: 18px;
  border-radius: 4px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.1;
  transform: scaleX(0.94) translateY(-8px);
  ${CollectionBackdropCard}:hover & {
    opacity: 0.1;
    transform: scaleX(0.96) translateY(-6px);
  }
`;

const PanelThree = styled.div`
  opacity: 0.2;
  transform: scaleX(0.97) translateY(-4px);
  transition: transform 0.2s ease-in-out;
  position: absolute;
  background: #fff;
  margin-top: 18px;
  border-radius: 4px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${CollectionBackdropCard}:hover & {
    opacity: 0.2;
    transform: scaleX(0.99) translateY(-3px);
  }
`;

const CollectionContent = styled.div`
  overflow: hidden;
  border-radius: 4px;
  background-color: #000;
  margin-top: 18px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const CollectionImage = styled.img`
  transition: opacity 0.2s ease-in-out;
  height: 100%;
  width: 100%;
  opacity: 0.6;
  object-fit: cover;
  ${CollectionContent}:hover & {
    opacity: 0.8;
  }
`;

const VideosHeader = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
  flex-direction: row;
  margin: 40px 65px 40px 50px;
`;

const VideosBackContainer = styled.p`
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
  outline: 0;
  display: flex;
  opacity: 0.5;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  align-items: center;
  position: absolute;
  &:hover {
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 50px;
  padding-left: 50px;
  padding-bottom: 50px;
`;

const CollectionDetails = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VideoContent = styled.div`
  overflow: hidden;
  border-radius: 4px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const VideoResult = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-gap: 20px 20px;
  grid-template-columns: 1fr;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (min-width: 1400px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (min-width: 1800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
`;

const Video = styled(ReactPlayer)`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: initial;
  bottom: initial;
  left: initial;
  object-fit: cover;
`;

const StockAsset = styled.div`
  position: relative;
  cursor: pointer;
  outline: 0;
  padding: 0;
  user-select: none;
  ${({ audio }) =>
    audio &&
    `
  border: 1.2px solid rgba(229,230,241,.15);
  border-radius: 4px;
  `}
  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 56.25%;
  }
`;

const ContextMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AddButton = styled.button`
  z-index: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  padding: 3px;
  background-color: #fff;
  color: #665dc3;
  opacity: 1 !important;
  display: none;
  ${StockAsset}:hover & {
    display: flex;
  }
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #665dc3;
    color: #fff;
    svg {
      fill: white;
      path {
        stroke: white;
      }
    }
  }
`;

export {
  Container,
  SideBar,
  ListItem,
  ListViewContainer,
  Item,
  SearchBar,
  VideosContainer,
  SearchInput,
  VideosListContainer,
  CollectionContainer,
  CollectionGrid,
  CollectionBackdropCard,
  PanelOne,
  CollectionContent,
  CollectionImage,
  PanelThree,
  PanelTwo,
  CollectionDetails,
  VideosHeader,
  VideosBackContainer,
  MainContainer,
  VideoResult,
  VideoContent,
  Video,
  StockAsset,
  ContextMenu,
  AddButton
};
