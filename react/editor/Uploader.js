/**
 * @file Uploader.js
 * @author Ervis Semanaj
 */

import React, { Component, useRef } from "react";
import Dropzone from "react-dropzone-uploader";
import PropTypes from "prop-types";
import { UploadContainer, Title, Button, UploadIcon } from "./style";
import Icon from "../components/Icon";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { CSSTransitionGroup } from "react-transition-group";

export default class Uploader extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.getUploadParams = this.getUploadParams.bind(this);
    this.state = {
      status: null
    };
  }

  getUploadParams() {
    return {
      url: `/api/project/${this.props.project}/file`
    };
  }

  handleChangeStatus({ meta, xhr, remove }, status) {
    if (status === "done") {
      const response = JSON.parse(xhr.response);
      this.props.onAdd({
        id: response.resource_id,
        name: meta.name,
        duration: response.length,
        mime: response.resource_mime
      });
      this.setState(
        {
          status: null
        },
        () => {
          remove();
        }
      );
    } else if (status === "aborted") {
      this.setState({
        status: null
      });
      alert(`${meta.name}, upload failed...`);
    } else if (status === "uploading") {
      this.setState({
        status: "uploading"
      });
    }
  }

  __renderInput = ({ accept, onFiles, files, getFilesFromEvent, ...props }) => {
    const fileUploader = useRef(null);
    return (
      <CSSTransitionGroup
        transitionName="animate"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}
      >
        {this.state.status !== "uploading" && (
          <UploadContainer>
            <UploadIcon>
              <Icon name="upload" />
            </UploadIcon>

            <Title>
              <span>Add files to start your project, </span>
              <br />
              <span>simply drag and drop!</span>
            </Title>
            <Button onClick={() => fileUploader.current.click()}>
              Browse my files
            </Button>
            <input
              type="file"
              ref={fileUploader}
              className={props.className}
              accept={accept}
              multiple
              onChange={e => {
                getFilesFromEvent(e).then(chosenFiles => {
                  onFiles(chosenFiles);
                });
              }}
            />
          </UploadContainer>
        )}
      </CSSTransitionGroup>
    );
  };
  getFilesFromEvent = e => {
    return new Promise(resolve => {
      getDroppedOrSelectedFiles(e).then(chosenFiles => {
        resolve(chosenFiles.map(f => f.fileObject));
      });
    });
  };
  render() {
    return (
      <Dropzone
        getUploadParams={this.getUploadParams}
        onChangeStatus={this.handleChangeStatus}
        accept="image/*,audio/*,video/*"
        inputContent={(files, extra) =>
          extra.reject
            ? "Only video, audio and image files can be recorded."
            : "Upload files"
        }
        inputWithFilesContent={"Upload files"}
        styles={{
          dropzoneReject: { borderColor: "#7a281b", backgroundColor: "#DAA" },
          dropzone: {
            height: "100%",
            borderRadius: 6,
            border: "1px dashed rgba(229,230,241,.25)",
            transition: "all .2s ease-in-out"
          }
        }}
        InputComponent={this.__renderInput}
        getFilesFromEvent={this.getFilesFromEvent}
      />
    );
  }
}

Uploader.propTypes = {
  onAdd: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
};
