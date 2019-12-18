import React from "react";
import { ItemContainer, ItemText, ActiveLine } from "./style";
import Icon from "../Icon";
import { string, bool, func } from "prop-types";

const Item = ({ name, icon, isActive = false, onClickSide }) => {
  return (
    <ItemContainer onClick={() => onClickSide(name)}>
      {isActive && <ActiveLine />}
      <Icon name={icon} />
      <ItemText>{name}</ItemText>
    </ItemContainer>
  );
};

Item.prototype = {
  name: string.isRequired,
  icon: string.isRequired,
  isActive: bool,
  onClickSide: func
};

export default Item;
