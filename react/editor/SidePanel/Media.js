import React from "react";
import { MediaContainer, UploadIcon, Title, LibraryGrid, ScrollContainer } from "./style";
import { func, any, string } from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";
import { CardComponent } from "./Card";
import PerfectScrollbar from "react-perfect-scrollbar";
import Icon from "../../_core/Icon";

const Media = ({ onChangeState, items = [], onRemove, projectId }) => {
  return Object.keys(items).length ? (
    <ScrollContainer>
      <PerfectScrollbar component="div">
        <LibraryGrid>
          {Object.keys(items).map((val, ind) => (
            <CardComponent projectId={projectId} onRemove={onRemove} item={items[val]} key={ind} />
          ))}
        </LibraryGrid>
      </PerfectScrollbar>
    </ScrollContainer>
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
  onRemove: func,
  projectId: string
};

export default Media;
