import React from "react";
import { ListItem } from "./styles";
import Icon from "../../_core/Icon";
import { withRouter } from "react-router-dom";

const SideBarItems = ({ items = [], active, setActive, history }) => {
  console.log("aaaaa", history);
  return (
    <>
      {items.map((val, key) => {
        return (
          <div key={key}>
            <ListItem
              onClick={() => {
                setActive(val.url);
                history.push(val.url);
              }}
              style={
                active === val.url ? { background: "rgba(32,32,44,.9)" } : {}
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
