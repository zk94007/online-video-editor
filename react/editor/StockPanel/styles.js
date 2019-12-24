import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";

const Container = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  background: #1c1c26;
  color: #d8d8d8;
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

const CollectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 53px 50px 32px;
`;

const CollectionHeaderTitle = styled.h2`
  font-weight: 600;
  color: #fff;
  text-transform: capitalize;
`;

const CollectionHeaderSeeAll = styled.div`
  transition: opacity 0.2s ease-in-out;
  font-size: 1rem;
  outline: 0;
  align-items: flex-end;
  display: flex;
  opacity: 0.6;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #e5e6f1;
  &:hover {
    opacity: 1;
  }
`;

const CollectionGrid = styled.div`
    top: 0;
    height: 100%;
    width: 100%;
    align-content: start;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill,246px);
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
    @media(min-width: 1000px){
      grid-template-columns: repeat(2,1fr)
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
  CollectionHeader,
  CollectionHeaderTitle,
  CollectionHeaderSeeAll,
  CollectionGrid
};
