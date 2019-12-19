import React from "react";
import { MediaContainer, UploadIcon, Title } from "./style";
import Icon from "../components/Icon";
import { func } from "prop-types";
import { CSSTransitionGroup } from "react-transition-group";

const Media = ({ onChangeState }) => {
  return (
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
  onChangeState: func
};

export default Media;
