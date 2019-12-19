import React from "react";
import {
  Card,
  Preview,
  DefaultWrapper,
  ThumbnailText,
  DeleteContainer
} from "./style";
import Icon from "../components/Icon";

export const CardComponent = props => {
  return (
    <Card>
      <Preview>
        <DefaultWrapper></DefaultWrapper>
      </Preview>
      <ThumbnailText>{props.item.name}</ThumbnailText>
      <DeleteContainer onClick={() => props.onRemove(props.item.id)}>
        <Icon color={"#ff5157"} name="delete" />
      </DeleteContainer>
    </Card>
  );
};
