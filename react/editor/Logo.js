import React, { useRef } from "react";
import { MediaContainer, UploadIcon, LogoButton } from "./style";
import { CSSTransitionGroup } from "react-transition-group";
import Icon from "../components/Icon";

const Logo = () => {
  const inputRef = useRef(null);
  return (
    <MediaContainer>
      <CSSTransitionGroup
        transitionName="animate"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <UploadIcon logo={true}>
          <Icon name="sheild" size={90} />
        </UploadIcon>
        <h3>You haven't uploaded your logo yet! Let's do that now.</h3>
        <LogoButton onClick={() => inputRef.current.click()}>
          <Icon style={{ marginRight: 10 }} name="star" color="#ffbd13" />
          Upload a Logo
          <input ref={inputRef} type="file" style={{ display: "none" }} />
        </LogoButton>
      </CSSTransitionGroup>
    </MediaContainer>
  );
};

Logo.prototype = {};

export default Logo;
