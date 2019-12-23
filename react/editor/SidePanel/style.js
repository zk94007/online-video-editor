import styled from "styled-components";
import ReactPlayer from "react-player";

const MainContainer = styled.div`
  width: 60px;
`;

const Content = styled.div`
  height: 100%;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(39, 39, 49);
`;

const Section = styled.div``;

const ItemContainer = styled.div`
  position: relative;
  height: 60px;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  cursor: pointer;
  transition: background 100ms ease-in-out 0s;
`;

const Items = styled.div`
  position: relative;
  height: 60px;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  cursor: pointer;
  transition: background 100ms ease-in-out 0s;
`;

const ItemText = styled.span`
  text-transform: capitalize;
  font-size: 9px;
  margin-top: 5px;
  color: #c0c0cd;
  font-weight: 600;
  ${ItemContainer}:hover & {
    color: white;
  }
`;

const ActiveLine = styled.div`
  height: 100%;
  width: 2px;
  position: absolute;
  left: 0px;
  background: rgb(147, 130, 215);
  transition: all 200ms ease-in-out 0s;
`;

const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SourcesContainer = styled.div`
  flex: 1;
  padding: 24px;
`;

const UploadContainer = styled.div`
  flex-direction: column;
  padding: 48px;
  cursor: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 20px;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  user-select: none;
`;

const Button = styled.button`
  margin-top: 4.4vh;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  border-radius: 100px;
  transition: background-color 0.2s ease-in-out;
  border: 2px solid #665dc3;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0 28px;
  min-width: 140px;
  color: #fff;
  &:hover {
    background-color: rgba(102, 93, 195, 0.25);
  }
`;

const UploadIcon = styled.div`
  height: 50%;
  max-height: 100px;
  margin-bottom: 2vh;
  ${({ logo }) =>
    logo &&
    `
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4vh;
  `}
`;

const LogoButton = styled.button`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  border-radius: 100px;
  transition: background-color 0.2s ease-in-out;
  border: 2px solid #665dc3;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0 28px;
  min-width: 140px;
  color: #fff;
  background-color: #665dc3;
  margin-top: 20px;
  margin-bottom: 30px;
  &:hover {
    background-color: #665dc3;
  }
`;

const MediaContainer = styled.div`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  display: flex;
  border: 1px dashed rgba(229, 230, 241, 0.25);
  border-radius: 5px;
  z-index: 1;
  cursor: pointer;
`;

const Card = styled.div`
  width: 130.3px;
  max-width: 100%;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
`;

const Preview = styled.div`
  color: #e5e6f1;
  cursor: move;
  display: flex;
  width: 100%;
  height: 75px;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  transition: opacity 0.2s ease-in-out;
`;

const DefaultWrapper = styled.div`
  pointer-events: none;
  width: 100%;
  height: 100%;
  background: linear-gradient(148deg, #5a5a72, #3d3d57);
  ${({ color }) => color && `background: ${color}`}
`;

const TextHeader = styled.div`
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  color: #fff;
  font-kerning: auto;
  text-rendering: optimizeLegibility;
  margin-bottom: 8px;
`;

const ThumbnailText = styled.h4`
  color: #e5e6f1;
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 4px 0;
  font-kerning: auto;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const DeleteContainer = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 28px;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 0;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  animation: 0.2s ease-in-out fade-in;
  padding: 0;
  margin: 0;
  &:hover {
    background-color: #ffffff;
  }
  display: none;
  ${Card}:hover & {
    display: flex;
  }
`;

const LibraryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ScrollContainer = styled.div`
  height: 100%;
  overflow: auto;
  max-height: 250px;
`;

const Image = styled.img`
  object-fit: cover;
  height: calc(100% + 2px);
  transform: translate(-1px, -1px);
  width: calc(100% + 2px);
  background: black;
  transition: opacity 0.2s ease-in-out 0s;
`;

const Time = styled.span`
  position: absolute;
  bottom: 7px;
  left: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-shadow: black 1px 1px 4px;
`;

const VideoContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  top: 0px;
  left: 0px;
`;

const VideoWrapper = styled.div`
  height: 100%;
  opacity: 1;
`;

const Video = styled(ReactPlayer)`
  width: 100% !important;
  height: 100% !important;
`;

const Note = styled.p`
  text-align: center;
  opacity: 0.5;
  position: absolute;
  bottom: 22px;
`;

export {
  MainContainer,
  Content,
  Section,
  ItemContainer,
  Items,
  ItemText,
  ActiveLine,
  EditSection,
  SourcesContainer,
  UploadContainer,
  Title,
  Button,
  UploadIcon,
  MediaContainer,
  Card,
  Preview,
  DefaultWrapper,
  ThumbnailText,
  DeleteContainer,
  LibraryGrid,
  ScrollContainer,
  Image,
  Time,
  VideoContainer,
  VideoWrapper,
  Video,
  LogoButton,
  Note,
  TextHeader
};
