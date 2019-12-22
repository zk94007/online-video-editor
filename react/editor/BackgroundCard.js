import React from "react";
import { Card, Preview, DefaultWrapper, ThumbnailText } from "./style";

export const BackgroundCard = ({ name, color }) => {
  return (
    <Card>
      <Preview>
        <DefaultWrapper color={color}></DefaultWrapper>
      </Preview>
      <ThumbnailText>{name}</ThumbnailText>
    </Card>
  );
};
