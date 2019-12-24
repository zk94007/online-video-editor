import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
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

export { Container, SideBar, ListItem, ListViewContainer, Item };
