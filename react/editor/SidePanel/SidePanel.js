/**
 * @file SidePanel.js
 * @author Ervis Semanaj
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { server } from "../../../config";
import timeManager from "../../../models/timeManager";

import { SourcesContainer } from "./style";

import Media from "./Media";
import Uploader from "./Uploader";
import Text from "./Text";
import Transition from "./Transition";
import Background from "./Background";
import Logo from "./Logo";
import axios from "axios";

export default class SidePanel extends Component {
  constructor(props) {
    super(props);

    this.delResource = this.delResource.bind(this);
    this.putResource = this.putResource.bind(this);
  }

  delResource(id) {
    const url = `${server.apiUrl}/project/${this.props.project}/file/${id}`;
    const params = {
      method: "DELETE"
    };

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err === "undefined") {
          this.props.onDelResource(id);
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.props.fetchError(error.message));
  }

  delLogo = id => {
    const url = `${server.apiUrl}/project/${this.props.project}/logo/${id}`;

    axios
      .delete(url)
      .then(val => {
        this.props.loadData();
      })
      .catch(err => {
        this.props.fetchError(error.message);
      });
  };

  putResource(id) {
    // Get duration for image files
    let duration = null;
    if (new RegExp(/^image\//).test(this.props.items[id].mime)) {
      duration = prompt("Enter a duration", "00:00:00,000");
      if (duration === null) return;

      if (!timeManager.isValidDuration(duration)) {
        alert("Enter a non-zero length in the format HH:MM:SS,sss");
        this.putResource(id);
        return;
      }
    }

    const track = this.props.items[id].mime.includes("audio/")
      ? "audiotrack0"
      : "videotrack0";

    // Send request to API
    const url = `${server.apiUrl}/project/${this.props.project}/file/${id}`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        track: track,
        duration: duration
      })
    };

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err === "undefined") {
          this.props.onPutResource(id, duration, track);
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.props.fetchError(error.message));
  }

  __render = active => {
    switch (active) {
      case "Media":
        return (
          <Media
            items={this.props.items}
            onChangeState={this.props.onChangeState}
            onRemove={this.delResource}
            projectId={this.props.project}
          />
        );
      case "Logo":
        return (
          <Logo
            loadData={this.props.loadData}
            onRemove={this.delLogo}
            id={this.props.project}
            logos={this.props.logos}
          />
        );
      case "Background":
        return <Background />;
      case "Text":
        return <Text />;
      case "Transition":
        return <Transition />;
      case "Add Media":
        return (
          <Uploader
            onAdd={resource => this.props.onAddResource(resource)}
            project={this.props.project}
            onChangeState={this.props.onChangeState}
          />
        );
      default:
        return <div></div>;
    }
  };

  render() {
    const { activeState } = this.props;
    return (
      <SourcesContainer id={"sources"}>
        {this.__render(activeState)}
      </SourcesContainer>
    );
  }
}

SidePanel.propTypes = {
  project: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  onAddResource: PropTypes.func.isRequired,
  onDelResource: PropTypes.func.isRequired,
  onPutResource: PropTypes.func.isRequired,
  fetchError: PropTypes.func.isRequired
};
