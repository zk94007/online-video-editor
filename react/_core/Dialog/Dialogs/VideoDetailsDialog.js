import React from "react";
import Modal from "react-modal";
import {
  VideoDetailModalContainer,
  VideoDetailModalButton,
  VideoDetailModalLeft,
  VideoDetailModalRight,
  VideoDetailModalTitle,
  VideoDetailModalContent,
  VideoDetailModalCategory,
  VideoDetailModalTags,
  VideoDetailModalKeyword,
  VideoDetailModalDetails,
  VideoDetailModalTable
} from "../style/VideoDetails";
import Icon from "../../Icon";
import Scroller from "react-perfect-scrollbar";
import ReactPlayer from "react-player";
import { Button } from "../../../editor/SidePanel/style";
import { CSSTransitionGroup } from "react-transition-group";
import { addToLibrary, getResources } from "../../../utils";

Modal.setAppElement("#app");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "1px solid rgba(102,93,195,.25)",
    zIndex: 10,
    background: "linear-gradient(142deg,#262633,#1c1c26)",
    color: "rgba(229,230,241,.8)",
    boxShadow: "0 3px 8px 0 rgba(0,0,0,.24), 0 3px 12px 0 rgba(0,0,0,.12)",
    height: "100%",
    maxHeight: "500px"
  },
  overlay: {
    zIndex: 10,
    background: "rgba(28,28,38,.97)"
  }
};

class VideoDetailsDialog extends React.Component {
  state = {
    detail: false
  };
  render() {
    const { setLoading, setError, getNetworkRequest, resources } = this.props;
    const isAdded = Object.keys(resources).filter(keys => {
      return this.props?.data?.url.includes(resources[keys].name || "");
    });
    return (
      <Modal
        isOpen={this.props.open}
        style={customStyles}
        contentLabel="Video Details Modal"
      >
        <Scroller component="div">
          <VideoDetailModalContainer>
            <VideoDetailModalButton onClick={() => this.props.closeModal()}>
              <Icon name="close" size={14} />
            </VideoDetailModalButton>
            <VideoDetailModalLeft>
              <VideoDetailModalTitle>
                Attractive young blonde woman owner turns sign fro..
              </VideoDetailModalTitle>
              <Scroller component="div">
                <VideoDetailModalContent>
                  <ReactPlayer
                    style={{ width: "100%", height: "100%" }}
                    controls={true}
                    url={this.props?.data?.url}
                  />
                </VideoDetailModalContent>
              </Scroller>
            </VideoDetailModalLeft>
            <VideoDetailModalRight>
              {!!isAdded.length ? (
                <Button
                  disabled
                  style={{
                    padding: 0,
                    backgroundColor: "rgba(102,93,195,0.25)"
                  }}
                >
                  Already Added
                </Button>
              ) : (
                <Button
                  onClick={e =>
                    addToLibrary(
                      e,
                      this.props?.data?.url,
                      setError,
                      getNetworkRequest,
                      setLoading
                    )
                  }
                  style={{ padding: 0 }}
                >
                  <Icon style={{ marginRight: 8 }} name="add" />
                  Add to Library
                </Button>
              )}

              <VideoDetailModalCategory>
                <h4>Category:</h4>
                <VideoDetailModalTags>footage</VideoDetailModalTags>
              </VideoDetailModalCategory>
              <VideoDetailModalKeyword>
                <h4>Keyword:</h4>
                <VideoDetailModalTags>background</VideoDetailModalTags>
                <VideoDetailModalTags>buisness</VideoDetailModalTags>
              </VideoDetailModalKeyword>
              <VideoDetailModalDetails>
                <h4>Details:</h4>
                <Icon
                  style={{
                    marginRight: 8
                  }}
                  onClick={() =>
                    this.setState({
                      detail: !this.state.detail
                    })
                  }
                  className={`${this.state.detail ? `open` : "caret"}`}
                  name="caret"
                  size={14}
                />
              </VideoDetailModalDetails>
              {this.state.detail && (
                <CSSTransitionGroup
                  transitionName="animate"
                  transitionAppear={true}
                  transitionAppearTimeout={1000}
                  transitionEnter={false}
                  transitionLeave={false}
                >
                  <VideoDetailModalTable>
                    <tbody>
                      <tr>
                        <th>Duration</th>
                        <td>00:10</td>
                      </tr>
                      <tr>
                        <th>Frame Rate</th>
                        <td>25 fps</td>
                      </tr>
                      <tr>
                        <th>Codec</th>
                        <td>h264</td>
                      </tr>
                      <tr>
                        <th>File Size</th>
                        <td>1.825 MB</td>
                      </tr>
                    </tbody>
                  </VideoDetailModalTable>
                </CSSTransitionGroup>
              )}
            </VideoDetailModalRight>
          </VideoDetailModalContainer>
        </Scroller>
      </Modal>
    );
  }
}

export default VideoDetailsDialog;
