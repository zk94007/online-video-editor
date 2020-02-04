/**
 * @file Editor.js
 * @author Ervis Semanaj
 */

import React, { Component } from "react";

import { server } from "../../config";
import timeManager from "../../models/timeManager";

import { LoadingDialog, FetchErrorDialog } from "../_core/Dialog";
import SubmitDialog from "./SubmitDialog";

import SidePanel from "./SidePanel/SidePanel";
import Timeline from "./Timeline/Timeline";
import SideMenu from "./SideMenu/SideMenu";

import { Container, EditSection, ProjectTitle, ProjectInput } from "./style";
import axios from "axios";
import Canvas from "./Canvas";

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.addResource = this.addResource.bind(this);
    this.delResource = this.delResource.bind(this);
    this.putResource = this.putResource.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.delFilter = this.delFilter.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.openSubmitDialog = this.openSubmitDialog.bind(this);
    this.closeSubmitDialog = this.closeSubmitDialog.bind(this);
    this.openFetchErrorDialog = this.openFetchErrorDialog.bind(this);
    this.closeFetchErrorDialog = this.closeFetchErrorDialog.bind(this);
    this.projectRef = "";

    this.state = {
      project: this.props?.match?.params?.id,
      resources: {},
      timeline: [],
      loading: true,
      showSubmitDialog: false,
      showFetchError: false,
      fetchError: "",
      activeState: "Media",
      logos: {},
      titleClicked: false,
      projectName: "",
      videoSrc: []
    };

    this.loadData();
  }

  onClickSide = name => {
    this.setState({
      activeState: name
    });
  };

  componentDidMount() {
    localStorage.setItem("id", this.props?.match?.params?.id);
    window.addEventListener("click", this.handleClickOutside);
    window.addEventListener("keyup", event => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.handleClickOutside();
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.projectRef && !this.projectRef.contains(event?.target)) {
      if (this.state.projectName) {
        this.setState(
          {
            titleClicked: false
          },
          () => {
            this.onProjectRename();
          }
        );
      } else {
        this.setState({
          projectName: this.state.prevProject,
          titleClicked: false
        });
      }
    }
  };

  onProjectRename = () => {
    axios
      .post(
        `${server.apiUrl}/project/${this.state.project}/projectName`,
        JSON.stringify({
          projectID: this.state.project,
          projectName: this.state.projectName
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(data => {
        if (typeof data.err === "undefined") {
          this.loadData();
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.openFetchErrorDialog(error.message));
  };

  onSelectVideo = (value, data) => {
    const item = this.state.resources[data?.[0]?.content];
    this.setState({
      videoSrc: [item]
    });
  };

  onPauseBtnClick = e => {
    const { video, timeline } = this.refs;
    if (video && typeof video.pause == "function") {
      video.pause();
      if (timeline && typeof timeline.pauseSeekBar == "function") {
        timeline.pauseSeekBar();
      }
    }
  };

  onPlayBtnClick = e => {
    const { video, timeline } = this.refs;
    if (video && typeof video.play == "function") {
      video.play();
      if (timeline && typeof timeline.playSeekBar == "function") {
        timeline.playSeekBar();
      }
    }
  };

  render() {
    const items = [
      {
        name: "Add Media",
        icon: "plus"
      },
      {
        name: "Stock",
        icon: "stock"
      },
      {
        name: "Media",
        icon: "file"
      },
      {
        name: "Text",
        icon: "text"
      },
      {
        name: "Background",
        icon: "background"
      },
      {
        name: "Transition",
        icon: "transition"
      },
      {
        name: "Logo",
        icon: "sheild"
      }
    ];
    // const videoSrc = [
    //   {
    //     src: "https://s3.amazonaws.com/virginia-testing.webrand.com/upload/UCOh7FkGs0S3YDK2ojYLQfC4DGjmtInt/hmmPuiLNkjZ5NrW9.mp4",
    //     type: "video/mp4"
    //   },
    //   {
    //     src: "https://www.w3schools.com/html/mov_bbb.ogg",
    //     type: "video/ogg"
    //   }
    // ];
    console.log(this.state);
    return (
      <>
        <header>
          {this.state.loading && <LoadingDialog />}
          {this.state.showSubmitDialog && (
            <SubmitDialog
              project={this.state.project}
              onClose={this.closeSubmitDialog}
              fetchError={this.openFetchErrorDialog}
            />
          )}
          {this.state.showFetchError && (
            <FetchErrorDialog
              msg={this.state.fetchError}
              onClose={this.closeFetchErrorDialog}
            />
          )}
          <a href={"/"}>
            <button className="error">
              <i className="material-icons" aria-hidden="true">
                arrow_back
              </i>
              Cancel edits
            </button>
          </a>
          <div className="divider" />
          {!!this.state.titleClicked ? (
            <ProjectInput
              ref={e => {
                this.projectRef = e;
              }}
              onChange={event =>
                this.setState({
                  projectName: event.target.value
                })
              }
              value={this.state.projectName}
            />
          ) : (
            <ProjectTitle
              onClick={e => {
                e.stopPropagation();
                this.setState({
                  titleClicked: true
                });
              }}
            >
              <h3>{this.state.projectName}</h3>
            </ProjectTitle>
          )}
          <button
            onClick={this.openSubmitDialog}
            className="success"
            style={{ float: "right" }}
          >
            <i className="material-icons" aria-hidden="true">
              done_outline
            </i>
            Complete
          </button>
        </header>
        <Container>
          <SideMenu
            onClickSide={this.onClickSide}
            items={items}
            activeState={this.state.activeState}
          />
          <EditSection>
            <main>
              <div>
                <SidePanel
                  loadData={this.loadData}
                  activeState={this.state.activeState}
                  onChangeState={this.onClickSide}
                  project={this.state.project}
                  logos={this.state.logos}
                  items={this.state.resources}
                  onAddResource={this.addResource}
                  onDelResource={this.delResource}
                  onPutResource={this.putResource}
                  fetchError={this.openFetchErrorDialog}
                />
                <div id="preview">
                  <h3>
                    <i className="material-icons" aria-hidden={true}>
                      {" "}
                      movie_filter{" "}
                    </i>
                    Preview
                  </h3>
                  <Canvas
                    id="video"
                    width={380}
                    height={200}
                    muted={true}
                    ref="video"
                    src={this.state.videoSrc}
                    autoPlay={false}
                  />
                  <br />
                  <div className="prev-toolbar">
                    <button className="no-border" title="Zastavit přehrávání">
                      <i className="material-icons" aria-hidden="true">
                        stop
                      </i>
                    </button>
                    <button
                      onClick={this.onPlayBtnClick}
                      title="Pokračovat v přehrávání"
                    >
                      <i className="material-icons" aria-hidden="true">
                        play_arrow
                      </i>
                    </button>
                    <button
                      onClick={this.onPauseBtnClick}
                      title="Pozastavit přehrávání"
                    >
                      <i className="material-icons" aria-hidden="true">
                        pause
                      </i>
                    </button>
                    <button title="Předchozí událost">
                      <i className="material-icons" aria-hidden="true">
                        skip_previous
                      </i>
                    </button>
                    <button title="Následující událost">
                      <i className="material-icons" aria-hidden="true">
                        skip_next
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </main>
            <footer>
              <Timeline
                ref="timeline"
                resources={this.state.resources}
                onPutResource={this.putResource}
                items={this.state.timeline}
                projectTimeline={this.state.projectTimeline}
                project={this.state.project}
                onAddFilter={this.addFilter}
                onDelFilter={this.delFilter}
                loadData={this.loadData}
                onSelectVideo={this.onSelectVideo}
                fetchError={this.openFetchErrorDialog}
              />
            </footer>
          </EditSection>
        </Container>
      </>
    );
  }

  loadData() {
    const url = `${server.apiUrl}/project/${this.state.project}`;
    const params = {
      method: "GET"
    };
    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err === "undefined") {
          this.setState({
            resources: data.resources,
            timeline: data.timeline,
            logos: data.logos,
            projectName: data.projectName,
            prevProject: data.projectName,
            projectTimeline: data?.projectTimeline
          });
          this.setState({ loading: false });
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.openFetchErrorDialog(error.message));
  }
  addResource(resource) {
    const resources = Object.assign({}, this.state.resources);
    resources[resource.id] = resource;
    this.setState({ activeState: "Media", resources: resources });
  }

  delResource(id) {
    const resources = Object.assign({}, this.state.resources);
    delete resources[id];
    this.setState({ resources: resources });
  }

  putResource(id, duration, trackId) {
    const timeline = Object.assign({}, this.state.timeline);
    const track = Editor.findTrack(timeline, trackId);
    const trackLength = track.items.length;

    track.items.push({
      resource: id,
      in: "00:00:00,000",
      out: duration !== null ? duration : this.state.resources[id].duration,
      filters: [],
      transitionTo: null,
      transitionFrom: null
    });
    this.setState({ timeline: timeline });

    if (trackLength === 0) {
      this.addTrack(trackId.includes("audio") ? "audio" : "video");
    }
  }

  addTrack(type) {
    const url = `${server.apiUrl}/project/${this.state.project}/track`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type
      })
    };

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err !== "undefined") {
          alert(`${data.err}\n\n${data.msg}`);
        }

        this.loadData();
      })
      .catch(error => this.openFetchErrorDialog(error.message));
  }

  addFilter(parameters) {
    const url = `${server.apiUrl}/project/${this.state.project}/filter`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parameters)
    };

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err === "undefined") {
          const timeline = Object.assign({}, this.state.timeline);

          const track = Editor.findTrack(timeline, parameters.track);
          const item = Editor.findItem(track.items, parameters.item).item;

          item.filters.push({
            service: parameters.filter
          });
          this.setState({ timeline: timeline });
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.openFetchErrorDialog(error.message));
  }

  delFilter(parameters) {
    const timeline = Object.assign({}, this.state.timeline);
    const track = Editor.findTrack(timeline, parameters.track);
    const item = Editor.findItem(track.items, parameters.item).item;

    item.filters = item.filters.filter(
      filter => filter.service !== parameters.filter
    );

    this.setState({ timeline: timeline });
  }

  openSubmitDialog() {
    this.setState({ showSubmitDialog: true });
  }

  closeSubmitDialog() {
    this.setState({ showSubmitDialog: false });
  }

  /**
   * Show Connection error dialog
   *
   * @param {String} msg
   */
  openFetchErrorDialog(msg) {
    this.setState({
      showFetchError: true,
      fetchError: msg
    });
  }

  /**
   * Close Connection error dialog
   */
  closeFetchErrorDialog() {
    this.setState({
      showFetchError: false,
      fetchError: ""
    });
  }

  /**
   * Get track with specified trackId
   *
   * @param {Object} timeline
   * @param {String} trackId
   * @return {null|Object}
   */
  static findTrack(timeline = [], trackId) {
    let track = timeline.filter(data => data.id === trackId);
    return track?.[0]?.items;
  }

  /**
   * Get nth item of track. Blanks are ignored, first element is zero element.
   *
   * @param {Array} items
   * @param {Number} position
   * @return {null|Object}
   */
  static findItem(items, position) {
    let time = "00:00:00,000";
    let index = 0;
    for (let item of items) {
      if (item.resource === "blank") {
        time = timeManager.addDuration(item.length, time);
      } else {
        let startTime = time;
        time = timeManager.addDuration(time, item.out);
        time = timeManager.subDuration(time, item.in);
        // todo Subtract transition duration
        if (index === position) {
          return {
            item: item,
            start: startTime,
            end: time
          };
        }
        index++;
      }
    }
    return null;
  }
}
