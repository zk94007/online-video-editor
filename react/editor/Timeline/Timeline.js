/**
 * @file Timeline.js
 * @author Ervis Semanaj
 */
import { server } from "../../../config";
import React, { Component } from "react";
import config from "./options";
import PropTypes from "prop-types";
import vis from "../../_lib/vis-timeline/vis"; //Customized vis-timeline
import timeManager from "../../../models/timeManager";
import Editor from "../Editor";
import AddFilterDialog from "./AddFilterDialog";
import moment from "moment";
import { formattedDateFromString, DateToString, getContent } from "../../utils";
import AlertErrorDialog from "../../_core/Dialog/Dialogs/AlertErroDialog";
import { TimelineHeader } from "../style";
const generate = require("nanoid/generate");
import axios from "axios";
import { isEqual, debounce } from "lodash";
export default class Timeline extends Component {
  timeline = null;
  state = {
    selectedItems: [],
    showAddFilterDialog: false,
    duration: "00:00:00,000",
    timePointer: "00:00:00,000",
    error: false,
    fetchError: "",
    showFetchError: false,
    movingTimePointer: false
  };
  servicesValue = debounce(() => this.onTimelineChange(), 2000);

  openFetchErrorDialog = msg => {
    this.setState({
      showFetchError: true,
      fetchError: msg
    });
  };

  closeFetchErrorDialog = () => {
    this.setState({
      showFetchError: false,
      fetchError: ""
    });
  };

  movingBar = null;

  playSeekBar = () => {
    if (!this.movingBar) {
      this.movingBar = setInterval(() => {
        let date = this.timeline?.getCustomTime();
        const max = this.timeline?.getItemRange()?.max;
        date = moment(date)
          .add(100, "milliseconds")
          .format("HH:mm:ss,SSS");
        const data = this.timeline.itemsData.get({
          filter: itemsData => {
            return itemsData?.start <= formattedDateFromString(date) && itemsData?.end >= formattedDateFromString(date);
          }
        });
          this.props.onSelectVideo(
            true,
            data
          );
        this.updateTimePointer(formattedDateFromString(date));
        if (formattedDateFromString(date) >= max) {
          this.pauseSeekBar();
        }
      }, 100);
    }
  };

  pauseSeekBar = () => {
    if (this.movingBar) {
      clearInterval(this.movingBar);
      this.movingBar = null;
    }
  };

  stopSeekBar = () => {
    this.pauseSeekBar();
    this.updateTimePointer(new Date(1970, 0, 1));
  };

  componentDidMount() {
    const container = document.getElementById("vis-timeline");
    const options = {
      ...config,
      onMoving: this.onMoving,
      onMove: this.onMove,
      onAdd: item => {
        if (item?.group?.includes(item?.support)) {
          const resource = this.props?.resources?.[item?.content];

          let startDate = item?.start;
          let length = resource?.length
            ? formattedDateFromString(
                timeManager.addDuration(
                  this.dateToString(item?.start),
                  resource?.length
                )
              )
            : formattedDateFromString(
                moment(startDate)
                  .add(3, "s")
                  .format("HH:mm:ss,SSS")
              );

          let trackLength = resource?.length
            ? formattedDateFromString(resource?.length)
            : formattedDateFromString("00:00:03,000");
          const right = timeManager.subDuration(
            this.dateToString(length),
            this.dateToString(startDate)
          );
            const content = getContent(item, resource);
          var overlapping = this.timeline.itemsData.get({
            filter: function(testItem) {
              if (testItem.id == item.id) {
                return false;
              }
              return (
                testItem?.group === item?.group &&
                item.start <= testItem.end &&
                length >= testItem.start
              );
            }
          });

          if (overlapping.length == 0) {
            this.timeline.itemsData.add({
              ...item,
              type: "range",
              content,
              ...(resource?.id
                ? { resource_id: resource?.id }
                : { textAnimation: item?.content }),
              end: length,
              clip: {
                left: "00:00:00,000",
                right
              },
              className: item?.group?.includes("video")
                ? "video"
                : item?.group?.includes("text")
                ? "text"
                : "audio"
            });
          } else {
            const items = this.timeline.itemsData.get({
              filter: testItem => {
                return testItem?.group === item?.group;
              },
              order: (a, b) => {
                return a.start - b.start;
              }
            });
            const itemsIndex = [];

            // checking overlapping issue
            for (let i = 0; i < items.length - 1; i++) {
              if (item.start < items[0].start) {
                itemsIndex.push(0);
                break;
              }
              if (item.start < items) {
                break;
              }
              var nextItemEndSplittedTime = items[i + 1].end;
              var itemStartSplittedTime = items[i].start;
              var comingItemStartSplittedTime = item.start;
              var comingItemEndSplittedTime = item.end;
              if (
                comingItemEndSplittedTime < nextItemEndSplittedTime &&
                itemStartSplittedTime < comingItemEndSplittedTime
              ) {
                itemsIndex.push(i);
                itemsIndex.push(i + 1);
              } else if (
                comingItemStartSplittedTime < nextItemEndSplittedTime &&
                itemStartSplittedTime < comingItemStartSplittedTime
              ) {
                itemsIndex.push(i);
                itemsIndex.push(i + 1);
              }
            }

            const differenceOfOverlappingItemStartAndEndTime = formattedDateFromString(
              timeManager.subDuration(
                DateToString(items[itemsIndex[itemsIndex.length - 1]]?.start),
                DateToString(items[itemsIndex[itemsIndex.length - 2]]?.end)
              )
            );
            const overlappingTime =
              differenceOfOverlappingItemStartAndEndTime.getHours() * 60 * 60 +
              differenceOfOverlappingItemStartAndEndTime.getMinutes() * 60 +
              differenceOfOverlappingItemStartAndEndTime.getSeconds();
            if (overlappingTime !== 0) {
              if (itemsIndex.length > 1) {
                item.start = items[itemsIndex[itemsIndex.length - 2]].end;
                startDate = items[itemsIndex[itemsIndex.length - 2]].end;
                length = items[itemsIndex[itemsIndex.length - 1]].start;
              }
            } else if (itemsIndex.length === 1) {
              const newDate = new Date(1970, 0, 1);
              item.start = newDate;
              length = items[0].start;
            } else {
              length = resource?.length
                ? formattedDateFromString(
                    timeManager.addDuration(
                      this.dateToString(items[items.length - 1]?.end),
                      resource?.length
                    )
                  )
                : formattedDateFromString(
                    moment(startDate)
                      .add(3, "s")
                      .format("HH:mm:ss,SSS")
                  );
              item.start = items[items.length - 1].end;
            }
            const rightModified = timeManager.subDuration(
              this.dateToString(length),
              this.dateToString(startDate)
            );

            this.timeline.itemsData.add({
              ...item,
              type: "range",
              content,
              ...(resource?.id
                ? { resource_id: resource?.id }
                : { textAnimation: item?.content }),
              end:
                formattedDateFromString(
                  timeManager.subDuration(
                    DateToString(length),
                    DateToString(item?.start)
                  )
                ) < trackLength
                  ? length
                  : formattedDateFromString(
                      timeManager.addDuration(
                        DateToString(item?.start),
                        DateToString(trackLength)
                      )
                    ),
              clip: {
                left: "00:00:00,000",
                right: rightModified
              },
              className: item?.group?.includes("video")
                ? "video"
                : item?.group?.includes("text")
                ? "text"
                : "audio"
            });
          }
        } else if (
          (item?.support === "transition" &&
            item?.group.includes("videotrack0")) ||
          item?.group.includes("videotrack1")
        ) {
          const itemsIndex = [];
          const itemsValue = this.timeline.itemsData.get({
            filter: data => {
              return (
                (!data?.transition &&
                  data.group === item?.group &&
                  data.group === "videotrack0") ||
                data.group === "videotrack1"
              );
            },
            order: (a, b) => {
              return a.start - b.start;
            }
          });
          for (let i = 0; i < itemsValue?.length - 1; i++) {
            if (
              item.start <= itemsValue[i + 1].end &&
              itemsValue[i].end <= item.start
            ) {
              itemsIndex.push(i);
              itemsIndex.push(i + 1);
            }
          }
          const length1 = itemsValue?.[itemsIndex?.[0]];
          const length2 = itemsValue?.[itemsIndex?.[1]];
          if (length1 && length2) {
            let duration = timeManager.subDuration(
              DateToString(length2.start),
              DateToString(length1.end)
            );
            if (
              formattedDateFromString(duration) <
              formattedDateFromString("00:00:02,000")
            ) {
              this.timeline.itemsData.update({
                ...length2,
                start: formattedDateFromString(
                  timeManager.addDuration(
                    DateToString(length2?.start),
                    "00:00:01,000"
                  )
                ),
                clip: {
                  left: timeManager.addDuration(
                    length2?.clip?.left,
                    "00:00:01,000"
                  ),
                  right: length2?.clip?.right
                }
              });
              this.timeline.itemsData.update({
                ...length1,
                end: formattedDateFromString(
                  timeManager.leftDuration(
                    DateToString(length1?.end),
                    "00:00:01,000"
                  )
                ),
                clip: {
                  right: timeManager.leftDuration(
                    length2?.clip?.right,
                    "00:00:01,000"
                  ),
                  left: length2?.clip?.left
                }
              });
              this.timeline.itemsData.add({
                ...item,
                content: `<i class="material-icons" aria-hidden="true">compare_arrows</i>`,
                start: formattedDateFromString(
                  timeManager.leftDuration(
                    DateToString(length1?.end),
                    "00:00:01,000"
                  )
                ),
                end: formattedDateFromString(
                  timeManager.addDuration(
                    DateToString(length1?.end),
                    "00:00:01,000"
                  )
                ),
                className: "transition",
                type: "range",
                itemA: length1?.id,
                itemB: length2?.id,
                transition: item?.content,
                duration: formattedDateFromString(duration)
              });
            }
          }
        } else {
          this.setState({
            error: `can't drag on ${item?.group}`
          });
        }
      }
    };
    this.timeline = new vis.Timeline(container, [], [], options);
    this.timeline.addCustomTime(new Date(1970, 0, 1));
    this.timeline.setCustomTimeTitle("00:00:00,000");
    this.timeline.on("select", this.onSelect);
    this.timeline.on("markerchanged", () => console.log("Sdfsadsadsa"));
    this.timeline.on("timechange", this.onTimeChange);
    this.timeline.on("moving", this.onMoving);
    this.timeline.on("mouseDown", event => {
      if (!event?.item && event.time) {
        this.setState({ movingTimePointer: true });
        this.updateTimePointer(event.time);
        this.props.onSelectVideo(
          false,
          this.timeline.itemsData.get({
            filter: itemsData => {
              return (
                itemsData?.start <= event.time && itemsData?.end >= event.time
              );
            }
          })
        );
      }
    });
    this.timeline.on("mouseMove", event => {
      if (this.state.movingTimePointer && event.time) {
        this.updateTimePointer(event.time);
      }
    });

    this.timeline.on("mouseUp", event => {
      if (this.state.movingTimePointer && event.time) {
        this.setState({ movingTimePointer: false });
        this.updateTimePointer(event.time);
        this.props.onSelectVideo(
          false,
          this.timeline.itemsData.get({
            filter: itemsData => {
              return (
                itemsData?.start <= event.time && itemsData?.end >= event.time
              );
            }
          })
        );
      }
    });
    container.addEventListener("DOMNodeInserted", () => {
      if (
        !document.querySelector(".customize-bar") &&
        document.querySelector(".vis-custom-time ")
      ) {
        const element = document.createElement("div");
        element.setAttribute("class", "customize-bar");
        container.removeEventListener("DOMNodeInserted", null);
        document.querySelector(".vis-custom-time ").appendChild(element);
      }
    });
    this.createGroups();
    this.timeline.fit();
  }

  updateTimePointer = time => {
    let date = new Date(
      1970,
      0,
      1,
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
    this.timeline.setCustomTime(date);
    this.setState({ timePointer: this.dateToString(date) });
  };

  onMove = (item, callback) => {
    if (!item?.transition) {
      item.className =
        item?.support === "video"
          ? "video"
          : item?.support === "text"
          ? "text"
          : "audio";
      callback(this.itemMove(item));
      let transition = this.timeline?.itemsData.get({
        filter: val => {
          return (
            (val?.transition && val?.itemA === item.id) ||
            val?.itemB === item.id
          );
        }
      });
      if (!!transition?.length) {
        this.setState(
          {
            selectedItems: [transition?.[0].id]
          },
          () => {
            this.onRemove();
          }
        );
      }
    }
  };

  createGroups = () => {
    var names = ["texttrack0", "audiotrack0", "videotrack0", "videotrack1"];
    const groups = new vis.DataSet([]);
    for (let group of names) {
      const videoMatch = new RegExp(/^videotrack\d+/);
      let isVideo = videoMatch.test(group);
      groups.add({
        id: group,
        content: `<div style="height: ${
          isVideo ? "60px" : "40px"
        }; align-items: center;display: flex; justify-content: center; border-bottom: none; text-transform: capitalize">
        <i class="material-icons" aria-hidden="true">${this.getIcons(
          group
        )}</i></div>`,
        className: "timeline-group"
      });
    }
    this.timeline.setGroups(groups);
  };

  onRemove = () => {
    const itemPath = this.state.selectedItems?.[0];
    const item = this.timeline.itemsData.get(itemPath, {
      filter: data => {
        return !!data.transition;
      }
    });
    if (item) {
      const transitionItems = this.timeline.itemsData.get([
        item?.itemA,
        item?.itemB
      ]);
      this.timeline.itemsData.update({
        ...transitionItems?.[0],
        end: formattedDateFromString(
          timeManager.addDuration(
            DateToString(transitionItems?.[0]?.end),
            "00:00:01,000"
          )
        ),
        clip: {
          ...transitionItems?.[0].clip,
          right: timeManager?.addDuration(
            transitionItems?.[0].clip.right,
            "00:00:01,000"
          )
        }
      });
      this.timeline.itemsData.update({
        ...transitionItems?.[1],
        start: formattedDateFromString(
          timeManager.subDuration(
            DateToString(transitionItems?.[1]?.start),
            "00:00:01,000"
          )
        ),
        clip: {
          ...transitionItems?.[1].clip,
          left: timeManager?.subDuration(
            transitionItems?.[1].clip.left,
            "00:00:01,000"
          )
        }
      });
      this.timeline.itemsData.remove(itemPath);
    } else {
      const isTransition = this.timeline.itemsData.get({
        filter: unique => {
          return (
            (unique?.transition && unique?.itemA === itemPath) ||
            unique?.itemB === itemPath
          );
        }
      });

      if (!!isTransition?.length) {
        this.timeline.itemsData.remove(itemPath);
        this.timeline.itemsData.remove(isTransition?.[0]?.id);
      } else {
        this.timeline.itemsData.remove(itemPath);
      }
    }
  };

  getIcons = text => {
    switch (text) {
      case "texttrack0":
        return "text_fields";
      case "audiotrack0":
        return "audiotrack";
      case "videotrack0":
        return "videocam";
      default:
        return "videocam";
    }
  };

  componentWillUnmount() {
    this?.timeline?.itemsData?.off("*", null);
    this.pauseSeekBar();
  }

  componentDidUpdate(prevProps) {
    if (isEqual(prevProps, this.props.items)) return;
    this.timeline?.itemsData?.on("*", (event, properties, senderId) => {
      this.servicesValue();
    });
    if (prevProps.items === this.props.items) return;
    if (isEqual(this.props.projectTimeline, this.timeline.itemsData.get())) {
    } else {
      let duration = "00:00:00,000";

      if (this.state.duration !== duration)
        this.setState({ duration: duration });

      this.timeline.setItems(this.props.projectTimeline);
    }
  }

  onFitScreen = () => {
    this.timeline.fit();
  };

  onZoomIn = () => {
    this.timeline.zoomIn(1);
  };

  onZoomOut = () => {
    this.timeline.zoomOut(0.1);
  };

  render() {
    return (
      <div
        style={{ zIndex: 10000 }}
        onDragOver={event => {
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        {!!this.state.error && (
          <AlertErrorDialog
            onClose={() =>
              this.setState({
                error: false
              })
            }
            msg={this.state.error}
          />
        )}
        <TimelineHeader>
          <div>
            <button onClick={this.buttonSplit}>
              <i className="material-icons" aria-hidden="true">
                flip
              </i>
              Split in point
            </button>
            <button onClick={this.onRemove}>
              <i className="material-icons" aria-hidden="true">
                remove
              </i>
              Remove
            </button>
          </div>
          <div id="time">
            {this.state.timePointer} / {this.state.duration}
          </div>
          <div>
            <button onClick={this.onZoomIn}>
              <i className="material-icons" aria-hidden="true">
                zoom_in
              </i>
              Zoom in
            </button>
            <button onClick={this.onZoomOut}>
              <i className="material-icons" aria-hidden="true">
                zoom_out
              </i>
              Zoom out
            </button>
            <button onClick={this.onFitScreen}>
              <i className="material-icons" aria-hidden="true">
                remove
              </i>
              Fit To Screen
            </button>
          </div>
        </TimelineHeader>
        <div id="vis-timeline" />
        {this.state.showAddFilterDialog && (
          <AddFilterDialog
            item={this.state.selectedItems[0]}
            getItem={this.getItem}
            project={this.props.project}
            onClose={this.closeAddFilterDialog}
            onAdd={filter => this.props.onAddFilter(filter)}
            onDel={filter => this.props.onDelFilter(filter)}
            fetchError={this.props.fetchError}
          />
        )}
      </div>
    );
  }

  onSelect = properties => {
    this.setState({ selectedItems: properties.items });
  };

  buttonFilter = () => {
    if (this.state.selectedItems.length === 0) return;

    this.setState({ showAddFilterDialog: true });
  };

  closeAddFilterDialog = () => {
    this.setState({ showAddFilterDialog: false });
  };

  onTimelineChange = timeLine => {
    axios
      .post(
        `${server.apiUrl}/project/${this.props.project}/projectTimeline`,
        JSON.stringify({
          projectID: this.props.project,
          projectTimeline: this.timeline.itemsData.get()
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(data => {
        if (typeof data.err === "undefined") {
          // this.props.loadData();
        } else {
          alert(`${data.err}\n\n${data.msg}`);
        }
      })
      .catch(error => this.openFetchErrorDialog(error.message));
  };
  buttonSplit = () => {
    if (this.state.selectedItems.length !== 1) return;

    let item = this.timeline?.itemsData?.get({
      filter: item => {
        return item.id == this.state.selectedItems?.[0];
      }
    });
    let cloneItem = { ...item?.[0] };
    let start = DateToString(cloneItem?.start);
    let end = DateToString(cloneItem?.end);
    let time = "00:00:00,000";
    let startTime = time;
    time = timeManager.addDuration(time, end);
    time = timeManager.subDuration(time, start);
    const splitTime = DateToString(this.timeline.getCustomTime());
    const splitItemTime = timeManager.subDuration(splitTime, startTime);
    if (splitTime <= start || splitTime >= end) return;
    const leftDuration = timeManager.subDuration(splitItemTime, start);
    const rightDuration = timeManager.subDuration(end, splitItemTime);
    const itemLeft = { ...cloneItem };
    const itemRight = { ...cloneItem };

    itemLeft.end = splitItemTime;
    itemRight.start = splitItemTime;
    itemLeft.clip.right = timeManager.subDuration(
      itemLeft.clip.right,
      rightDuration
    );
    itemRight.clip.left = timeManager.addDuration(
      itemRight.clip.left,
      leftDuration
    );
    if (itemRight && itemLeft) {
      itemRight.id = generate(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
        16
      );
      itemLeft.id = generate(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
        16
      );
      itemLeft.start =
        typeof itemLeft.start === "string"
          ? formattedDateFromString(itemLeft.start)
          : itemLeft.start;
      itemLeft.end =
        typeof itemLeft.end === "string"
          ? formattedDateFromString(itemLeft.end)
          : itemLeft.end;
      itemRight.start =
        typeof itemRight.start === "string"
          ? formattedDateFromString(itemRight.start)
          : itemRight.start;
      itemRight.end =
        typeof itemRight.end === "string"
          ? formattedDateFromString(itemRight.end)
          : itemRight.end;

      this.timeline?.itemsData?.remove(this.state?.selectedItems);
      this.timeline?.itemsData?.add(itemLeft);
      this.timeline?.itemsData?.add(itemRight);
    }
  };

  getItem = trackIndex => {
    const itemPath = trackIndex.split(":");
    const trackItems = Editor.findTrack(this.props.items, itemPath[0]);
    return Editor.findItem(trackItems, Number(itemPath[1]));
  };

  onTimeChange = event => {
    const timePointer = Timeline;
    if (event.time.getFullYear() < 1970) {
      this.timeline.setCustomTime(new Date(1970, 0, 1));
      this.timeline.setCustomTimeTitle("00:00:00,000");
      this.setState({ timePointer: "00:00:00,000" });
    } else if (timePointer > this.state.duration) {
      let date = new Date(
        1970,
        0,
        1,
        event.time.getHours(),
        event.time.getMinutes(),
        event.time.getSeconds(),
        event.time.getMilliseconds()
      );
      this.timeline.setCustomTime(date);
      this.timeline.setCustomTimeTitle(DateToString(date));
      this.setState({ timePointer: DateToString(date) }, () =>
        this.props.onSelectVideo(
          false,
          this.timeline.itemsData.get({
            filter: itemsData => {
              return itemsData?.start <= date && itemsData?.end >= date;
            }
          })
        )
      );
    } else {
      this.setState({ timePointer: timePointer });
      this.timeline.setCustomTimeTitle(timePointer);
    }
  };

  onMoving = (item, callback) => {
    let itemData = this.timeline?.itemsData.get(item?.id);
    let getLength = this.props.resources[item?.resource_id]?.length || false;
    const oriLength = timeManager.subDuration(
      DateToString(itemData?.end),
      DateToString(itemData?.start)
    );
    const length = timeManager.subDuration(
      DateToString(item?.end),
      DateToString(item?.start)
    );
    if (!item?.transition && item?.group?.includes(item?.support)) {
      if (
        getLength &&
        formattedDateFromString(getLength) > formattedDateFromString(length)
      ) {
        callback(this.itemMove(item));
      } else if (oriLength === length) {
        callback(this.itemMove(item));
      } else if (!getLength && oriLength !== length) {
        callback(this.itemMove(item));
      }
    } else {
      return false;
    }
  };

  itemMove = item => {
    if (item.start.getFullYear() < 1970) return null;
    // Deny move before zero time
    else {
      const start = DateToString(item?.start);
      const end = DateToString(item?.end);
      const collision = this.getItemInRange(item.group, item?.id, start, end);
      if (collision.length === 0) {
        // Free
        return item;
      } else if (collision.length > 1) {
        return null;
      } else {
        let itemStart = "";
        let itemEnd = "";
        const duration = timeManager.subDuration(end, start);
        if (
          timeManager.middleOfDuration(start, end) <=
          timeManager.middleOfDuration(
            DateToString(collision[0].start),
            DateToString(collision[0].end)
          )
        ) {
          item.className =
            item.support === "video"
              ? "video stick-right"
              : item.support === "text"
              ? "text stick-right"
              : "audio stick-right";
          itemEnd = DateToString(collision[0].start);
          const itemEndParsed = itemEnd.match(
            /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/
          );
          item.end = new Date(
            1970,
            0,
            1,
            itemEndParsed[1],
            itemEndParsed[2],
            itemEndParsed[3],
            itemEndParsed[4]
          );
          itemStart = timeManager.subDuration(
            DateToString(collision[0].start),
            duration
          );
          const itemStartParsed = itemStart.match(
            /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/
          );
          if (itemStartParsed === null) return null; // Not enough space at begining of timeline
          item.start = new Date(
            1970,
            0,
            1,
            itemStartParsed[1],
            itemStartParsed[2],
            itemStartParsed[3],
            itemStartParsed[4]
          );
        } else {
          item.className =
            item.support === "video"
              ? "video stick-left"
              : item.support === "text"
              ? "text stick-left"
              : "audio stick-left";
          itemStart = DateToString(collision[0].end);
          const itemStartParsed = DateToString(collision[0].end).match(
            /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/
          );
          item.start = new Date(
            1970,
            0,
            1,
            itemStartParsed[1],
            itemStartParsed[2],
            itemStartParsed[3],
            itemStartParsed[4]
          );
          itemEnd = timeManager.addDuration(
            DateToString(collision[0].end),
            duration
          );
          const itemEndParsed = itemEnd.match(
            /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/
          );
          item.end = new Date(
            1970,
            0,
            1,
            itemEndParsed[1],
            itemEndParsed[2],
            itemEndParsed[3],
            itemEndParsed[4]
          );
        }
        if (
          this.getItemInRange(item.group, item?.id, itemStart, itemEnd)
            .length === 0
        ) {
          return item;
        }
        return null;
      }
    }
  };

  getItemInRange = (group, itemID, start, end) => {
    const track = this.timeline?.itemsData.get({
      filter: itemTest => {
        return itemTest?.group === group;
      },
      order: (a, b) => {
        return a.start - b.start;
      }
    });
    const items = [];
    for (let item of track) {
      if (item?.id === itemID) continue;
      if (
        item?.start < formattedDateFromString(end) &&
        item?.end > formattedDateFromString(start)
      ) {
        items.push(item);
      }
    }
    return items;
  };

  /**
   * Get duration format from Date object
   *
   * @param {Date} date
   * @return {string} Duration in format '00:00:00,000'
   */
  dateToString = date => {
    let string = `${date.getHours()}:`;
    if (string.length < 3) string = "0" + string;

    string += `00${date.getMinutes()}:`.slice(-3);
    string += `00${date.getSeconds()},`.slice(-3);
    string += `${date.getMilliseconds()}000`.slice(0, 3);
    return string;
  };
}

Timeline.propTypes = {
  resources: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  project: PropTypes.string.isRequired,
  onAddFilter: PropTypes.func.isRequired,
  onDelFilter: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  fetchError: PropTypes.func.isRequired
};
