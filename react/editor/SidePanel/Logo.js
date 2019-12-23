import {
  MediaContainer,
  UploadIcon,
  LogoButton,
  Note,
  ScrollContainer,
  LibraryGrid,
  AddLogoButton
} from "./style";
import React, { useRef, useCallback } from "react";
import { CSSTransitionGroup } from "react-transition-group";
import Icon from "../../_core/Icon";
import axios from "axios";
import { CardComponent } from "./Card";
import PerfectScrollbar from "react-perfect-scrollbar";

const Logo = ({ id, logos, onRemove, loadData }) => {
  const inputRef = useRef(null);

  const onAddLogo = useCallback(event => {
    const file = event?.target?.files?.[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`/api/project/${id}/logo`, formData)
      .then(val => {
        loadData();
      })
      .catch(err => {
        console.log(err);
      });
  });

  return Object.keys(logos).length ? (
    <>
      <AddLogoButton onClick={() => inputRef.current.click()}>
        Add Logo
        <input
          accept="image/x-png,image/jpeg"
          ref={inputRef}
          type="file"
          onChange={onAddLogo}
          style={{ display: "none" }}
        />
      </AddLogoButton>
      <ScrollContainer>
        <PerfectScrollbar component="div">
          <LibraryGrid>
            {Object.keys(logos).map((val, ind) => (
              <CardComponent
                projectId={id}
                onRemove={onRemove}
                item={logos[val]}
                key={ind}
              />
            ))}
          </LibraryGrid>
        </PerfectScrollbar>
      </ScrollContainer>
    </>
  ) : (
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
          <input
            accept="image/x-png,image/jpeg"
            ref={inputRef}
            type="file"
            onChange={onAddLogo}
            style={{ display: "none" }}
          />
        </LogoButton>
      </CSSTransitionGroup>
      <Note>
        We accept PNG or JPG. Maximum 5MB. Make sure your logo is high
        resolution!
      </Note>
    </MediaContainer>
  );
};

Logo.prototype = {};

export default Logo;
