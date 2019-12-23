import React from "react";
import { MainContainer, Content, Section } from "./style";
import Item from "./Items";
import { shape, arrayOf, string, func } from "prop-types";

const SideMenu = ({ items = [], activeState, onClickSide }) => {
  return (
    <MainContainer>
      <Content>
        <Section style={{ flex: 1 }}>
          {items.map((val, ind) => {
            const isActive = !!(activeState === val.name);
            return (
              <Item
                onClickSide={onClickSide}
                key={ind}
                isActive={isActive}
                name={val.name}
                icon={val.icon}
              />
            );
          })}
        </Section>
        <Section>
          <Item
            isActive={!!(activeState === "Help")}
            name="Help"
            icon="help"
            onClickSide={onClickSide}
          />
        </Section>
      </Content>
    </MainContainer>
  );
};

SideMenu.prototype = {
  items: arrayOf(
    shape({
      name: string,
      icon: string
    })
  ),
  activeState: string,
  onClickSide: func
};

export default SideMenu;
