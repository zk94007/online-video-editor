import React from "react";
import { ItemContainer, ItemText, ActiveLine } from "./style";
import Icon from "../../_core/Icon";
import { string, bool, func } from "prop-types";
import { withRouter } from "react-router-dom";

const Item = ({ name, icon, isActive = false, onClickSide, history }) => {
  if (name === "Stock") {
    return (
      <ItemContainer
        onClick={() => history.push("/editor/stock/collections/video")}
      >
        {isActive && <ActiveLine />}
        <Icon name={icon} />
        <ItemText>{name}</ItemText>
      </ItemContainer>
    );
  }
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

export default withRouter(Item);
