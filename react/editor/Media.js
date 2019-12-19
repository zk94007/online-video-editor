import React from "react";
import { MediaContainer, UploadIcon, Title, LibraryGrid } from "./style";
import { func, any } from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";
import { CardComponent } from "./Card";
import Icon from "../components/Icon";

const Media = ({ onChangeState, items = [], onRemove }) => {
  return Object.keys(items).length ? (
    <LibraryGrid>
      {Object.keys(items).map((val, ind) => (
        <CardComponent onRemove={onRemove} item={items[val]} key={ind} />
      ))}
    </LibraryGrid>
  ) : (
    <MediaContainer onClick={() => onChangeState("Add Media")}>
      <CSSTransitionGroup
        transitionName="animate"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}
      >
        <UploadIcon>
          <Icon name="upload" />
        </UploadIcon>
        <Title>
          <span>Your library is empty,</span>
          <br />
          <span>click 'Add Media' to get started.</span>
        </Title>
      </CSSTransitionGroup>
    </MediaContainer>
  );
};

Media.prototype = {
  onChangeState: func,
  items: any,
  onRemove: func
};

export default Media;
