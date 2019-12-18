import styled from "styled-components";

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

export {
  MainContainer,
  Content,
  Section,
  ItemContainer,
  Items,
  ItemText,
  ActiveLine
};
