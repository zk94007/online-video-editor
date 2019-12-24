import React from "react";
import {
  SideBar,
  Container,
  ListItem,
  ListViewContainer,
  Item
} from "./styles";
import Icon from "../../_core/Icon";

const StockPanel = () => {
  return (
    <Container>
      <SideBar>
        <ListItem style={{ background: "rgba(32,32,44,.9)" }} acive={true}>
          <Icon color="#665dc3" style={{ marginRight: 16 }} name="video" />
          Video
        </ListItem>
        <ListViewContainer>
          <Item>Footage</Item>
          <Item>Background</Item>
        </ListViewContainer>
        <ListItem>
          <Icon color="#665dc3" style={{ marginRight: 16 }} name="audio" />
          Audio
        </ListItem>
        <ListItem>
          <Icon color="#665dc3" style={{ marginRight: 16 }} name="close" />
          Close
        </ListItem>
      </SideBar>
    </Container>
  );
};

export default StockPanel;
