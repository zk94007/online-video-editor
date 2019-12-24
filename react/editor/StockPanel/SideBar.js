import React from "react";
import { ListItem, ListViewContainer, Item, SideBar } from "./styles";
import Icon from "../../_core/Icon";
import { CSSTransitionGroup } from "react-transition-group";
import { withRouter } from "react-router-dom";

const SideBarItems = ({ items = [], active, setActive, history }) => {
  return (
    <>
      {items.map((val, key) => {
        return (
          <div key={key}>
            <ListItem
              onClick={() => setActive(val.url)}
              style={
                active === val.name ? { background: "rgba(32,32,44,.9)" } : {}
              }
              acive={true}
            >
              <Icon color="#665dc3" style={{ marginRight: 16 }} name="video" />
              {val.name}
            </ListItem>
          </div>
        );
      })}
      <ListItem onClick={() => history.goBack()}>
        <Icon color="#665dc3" style={{ marginRight: 16 }} name="close" />
        Close
      </ListItem>
    </>
  );
};

export default withRouter(SideBarItems);
