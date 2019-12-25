import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NewProjectDialog from "../newProject/NewProjectDialog";
import Editor from "../editor/Editor";
import Stockpanel from "../editor/StockPanel/StockPanel";

const Routing = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <NewProjectDialog />
        </Route>
        <Route exact path="/project/:id" component={Editor} />
        <Route
          exact
          path="/editor/stock/collections/video"
          component={Stockpanel}
        />
        <Route
          exact
          path="/editor/stock/collections/audio"
          component={Stockpanel}
        />
        <Route
          exact
          path="/editor/stock/collections/video/:key"
          component={Stockpanel}
        />
      </Switch>
    </Router>
  );
};

export default Routing;
