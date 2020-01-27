/**
 * @file Timeline.js
 * @author Ervis Semanaj
 */

import React, { Component } from "react";
import config from "./options";
import PropTypes from "prop-types";
import vis from "../../_lib/vis-timeline/vis"; //Customized vis-timeline
import timeManager from "../../../models/timeManager";
import Editor from "../Editor";
import AddFilterDialog from "./AddFilterDialog";
import moment from "moment";
import { formattedDateFromString, DateToString } from "../../utils";
import AlertErrorDialog from "../../_core/Dialog/Dialogs/AlertErroDialog";
import { TimelineHeader } from "../style";
const generate = require("nanoid/generate");

export default class Timeline extends Component {
  timeline = null;
  state = {
    selectedItems: [],
    showAddFilterDialog: false,
    duration: "00:00:00,000",
    timePointer: "00:00:00,000",
    error: false,
    movingTimePointer: false
  };

  componentDidMount() {
    const container = document.getElementById("vis-timeline");
    const options = {
      ...config,
      onMoving: this.onMoving,
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
          const right = timeManager.subDuration(
            this.dateToString(length),
            this.dateToString(startDate)
          );

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
              filter: (testItem) => {
                return testItem?.group === item?.group
              }
            });
            const itemsIndex = [];
            for (let i = 0; i < items.length; i++) {
              if (item.start < items[0].start) {
                itemsIndex.push(0);
                break;
              }
              if (item.start < items) {
                break;
              }
              if (
                item.start <= items[i + 1].end &&
                items[i].start <= item.start
              ) {
                itemsIndex.push(i);
                itemsIndex.push(i + 1);
                break;
              }
            }
            if (itemsIndex.length > 1) {
              item.start = items[itemsIndex[itemsIndex.length - 2]].end;
              startDate = items[itemsIndex[itemsIndex.length - 2]].end;
              length = items[itemsIndex[itemsIndex.length - 1]].start;
            } else if (itemsIndex.length === 1) {
              const newDate = new Date(1970, 0, 1);
              item.start = newDate;
              length = items[0].start;
            }
            const rightModified = timeManager.subDuration(
              this.dateToString(length),
              this.dateToString(startDate)
            );
            this.timeline.itemsData.add({
              ...item,
              type: "range",
              ...(resource?.id
                ? { resource_id: resource?.id }
                : { textAnimation: item?.content }),
              end: length,
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
          const items = this.timeline.itemsData.get({
            filter: data => {
              return (
                data.group === "videotrack0" || data.group === "videotrack1"
              );
            }
          });
          for (let i = 0; i < items.length - 1; i++) {
            if (item.start <= items[i + 1].end && items[i].end <= item.start) {
              itemsIndex.push(i);
              itemsIndex.push(i + 1);
            }
          }
          const length1 = items?.[itemsIndex?.[0]];
          const length2 = items?.[itemsIndex?.[1]];
          if (length1 && length2) {
            let duration = timeManager.subDuration(
              DateToString(length2.start),
              DateToString(length1.end)
            );
            if (duration === "00:00:00,000") {
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
    this.timeline.on("timechange", this.onTimeChange);
    this.timeline.on("moving", this.onMoving);
    this.timeline.on("mouseDown", event => {
      if (!event?.item && event.time) {
        this.setState({ movingTimePointer: true });
        this.updateTimePointer(event.time);
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
      this.timeline.itemsData.remove(itemPath);
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

  componentDidUpdate(prevProps) {
    if (prevProps.items === this.props.items) return;

    const groups = new vis.DataSet([]);
    const items = new vis.DataSet([]);

    let duration = "00:00:00,000";
    const tracks = [...this.props.items];
    const videoMatch = new RegExp(/^videotrack\d+/);
    const textMatch = new RegExp(/^texttrack\d+/);
    for (let track of tracks) {
      let isVideo = videoMatch.test(track.id);
      groups.add({
        id: track.id,
        content: `<div style="height: ${
          isVideo ? "60px" : "40px"
        }; align-items: center;display: flex; justify-content: center; border-bottom: none; text-transform: capitalize">
        <i class="material-icons" aria-hidden="true">${this.getIcons(
          track.id
        )}</i></div>`,
        className: "timeline-group"
      });

      let actualTime = "00:00:00,000";
      let index = 0;

      for (let item of track.items) {
        if (item?.resource === "blank") {
          actualTime = timeManager.addDuration(item.length, actualTime);
        } else {
          const timeIn = actualTime.match(/^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/);
          actualTime = timeManager.addDuration(actualTime, item.out);
          actualTime = timeManager.subDuration(actualTime, item.in);
          const timeOut = actualTime.match(
            /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/
          );
          let content =
            this.props.resources?.[item?.resource_id]?.name ||
            item?.textAnimation;
          if (item?.filters?.length > 0)
            content =
              '<div class="filter"></div><i class="filter material-icons">flare</i>' +
              content;
          items.update({
            id: track.id + ":" + index,
            content: content,
            align: "center",
            start: formattedDateFromString(item?.in),
            end: formattedDateFromString(item?.out),
            group: track.id,
            className: videoMatch.test(track.id)
              ? "video"
              : !!textMatch.test(track.id)
              ? "text"
              : "audio"
          });
          index++;
        }
      }
      if (actualTime > duration) {
        duration = actualTime;
      }
    }

    if (this.state.duration !== duration) this.setState({ duration: duration });

    this.timeline.setData({
      items: items,
      groups: groups
    });

    // this.timeline.fit();
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
            {/*<button><i className="material-icons" aria-hidden="true">menu</i>Vlastnosti</button>*/}
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
        {/*<button><i className="material-icons" aria-hidden="true">photo_filter</i>Přidat přechod</button>*/}
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
      this.setState({ timePointer: DateToString(date) });
    } else {
      this.setState({ timePointer: timePointer });
      this.timeline.setCustomTimeTitle(timePointer);
    }
  };

  onMoving = (item, callback) => {
    let itemData = this.timeline?.itemsData.get(item?.id);

    const oriLength = timeManager.subDuration(
      DateToString(itemData?.start),
      DateToString(itemData?.end)
    );
    const length = timeManager.subDuration(
      DateToString(item?.start),
      DateToString(item?.end)
    );
    if (
      item?.group?.includes(item?.support) &&
      item.start > new Date(1970, 0, 1)
    ) {
      if (
        formattedDateFromString(length) > formattedDateFromString(oriLength)
      ) {
        if (item?.start > itemData?.start || item?.end < itemData?.end) {
          callback(item);
        }
      } else if (length == oriLength) {
        const itemsMain = this.timeline.itemsData.get({
          filter: value => {
            return value?.group === item?.group;
          }
        });
        for (let i = 0; i < itemsMain.length - 1; i++) {
          for (let j = 0; j < itemsMain.length - 1; j++) {
            if (itemsMain[j].end > itemsMain[j + 1].end) {
              let check = itemsMain[j];
              itemsMain[j] = itemsMain[j + 1];
              itemsMain[j + 1] = check;
            }
          }
        }
        const items = [];
        const pivotItem = [];
        let pivotItemIndex;
        // filtering specific group items
        for (let i = 0; i < itemsMain.length; i++) {
          // removing active item
          if (itemsMain[i].id === item.id) {
            pivotItemIndex = i;
            pivotItem.push(itemsMain[i]);
            delete itemsMain[i];
          }
        }
        for (let i = 0; i < itemsMain.length; i++) {
          // removing empty indexes in itemsMain
          if (!!itemsMain[i]) {
            items.push(itemsMain[i]);
          }
        }
        // checking overlapping of same group items
        const overlapping = itemsMain.filter(testItem => {
          if (testItem.id == item.id) {
            return false;
          }
          return item.start <= testItem.end && item.end >= testItem.start;
        });

        if (overlapping.length > 0) {
          const itemsIndex = [];
          // sorting items
          for (let i = 0; i < items.length - 1; i++) {
            for (let j = 0; j < items.length - 1; j++) {
              if (items[j].end > items[j + 1].end) {
                let check = items[j];
                items[j] = items[j + 1];
                items[j + 1] = check;
              }
            }
          }

          // checking overlapping issue
          for (let i = 0; i < items.length - 1; i++) {
            var nextItemEndSplittedTime = items[i + 1].end
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            var itemStartSplittedTime = items[i].start
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            var comingItemStartSplittedTime = item.start
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            var comingItemEndSplittedTime = item.end
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            if (
              parseInt(comingItemEndSplittedTime) <=
                parseInt(nextItemEndSplittedTime) &&
              parseInt(itemStartSplittedTime) <=
                parseInt(comingItemEndSplittedTime)
            ) {
              itemsIndex.push(i);
              itemsIndex.push(i + 1);
              continue;
            }
            if (
              parseInt(comingItemStartSplittedTime) <=
                parseInt(nextItemEndSplittedTime) &&
              parseInt(itemStartSplittedTime) <=
                parseInt(comingItemStartSplittedTime)
            ) {
              itemsIndex.push(i);
              itemsIndex.push(i + 1);
              break;
            }
          }
          const differenceOfOverlappingItemStartAndEndTime =
            parseInt(
              items[itemsIndex[itemsIndex.length - 1]]?.start
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            ) -
            parseInt(
              items[itemsIndex[itemsIndex.length - 2]]?.end
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            );
          const differenceOfComingItemStartAndEndTime =
            parseInt(
              item.clip.right
                .split(":")
                .join("")
                .split(",")
                .join(".")
            ) + 1;
          // when items length is 2 resolving overlapping issue
          if (items.length < 2) {
            if (item.end >= items[0].end) {
              const pivotItemTime = pivotItem[0].clip.right
                .split(":")
                .concat(pivotItem[0].clip.right.split(":")[2].split(","));
              const nextItemStartTime = items[0].start
                .toString()
                .split(" ")[4]
                .split(":");
              pivotItemTime.splice(2, 1);
              let timeInSeconds =
                parseInt(pivotItemTime[0]) * 60 * 60 +
                parseInt(pivotItemTime[1]) * 60 +
                parseInt(pivotItemTime[2]) +
                parseFloat(`0.${pivotItemTime[3]}`);
              let starttimeInSecondsOfNextItem =
                parseInt(nextItemStartTime[0]) * 60 * 60 +
                parseInt(nextItemStartTime[1]) * 60 +
                parseInt(nextItemStartTime[2]);
              const startTime = starttimeInSecondsOfNextItem - timeInSeconds;
              const newDate = new Date(1970, 0, 1, 0, 0, startTime);
              item.end = items[0].start;
              item.start = newDate;
              return callback(item);
            } else {
              const pivotItemTime = pivotItem[0].clip.right
                .split(":")
                .concat(pivotItem[0].clip.right.split(":")[2].split(","));
              const nextItemEndTime = items[0].end
                .toString()
                .split(" ")[4]
                .split(":");
              let timeInSeconds =
                parseInt(pivotItemTime[0]) * 60 * 60 +
                parseInt(pivotItemTime[1]) * 60 +
                parseInt(pivotItemTime[2]) +
                parseFloat(`0.${pivotItemTime[3]}`);
              let endtimeInSecondsOfNextItem =
                parseInt(nextItemEndTime[0]) * 60 * 60 +
                parseInt(nextItemEndTime[1]) * 60 +
                parseInt(nextItemEndTime[2]);
              const endTime = endtimeInSecondsOfNextItem + timeInSeconds + 2;
              const newDate = new Date(1970, 0, 1, 0, 0, endTime);
              item.start = items[0].end;
              item.end = newDate;
              return callback(item);
            }
          }
          // checking  if length between overlapping items and active length is less than or greater
          if (
            differenceOfOverlappingItemStartAndEndTime <=
            differenceOfComingItemStartAndEndTime
          ) {
            if (item.start < items[0].start) {
              item.start = items[0].end;
              item.end = items[1].start;
              callback(item);
            } else if (itemsIndex.length > 1) {
              item.start = items[itemsIndex[itemsIndex.length - 2]].end;
              item.end = items[itemsIndex[itemsIndex.length - 1]].start;

              callback(item);
            }
          } else {
            // left right adjustment issue fixed
            if (
              itemsIndex[itemsIndex.length - 2] <= pivotItemIndex &&
              item.start <= items[itemsIndex[itemsIndex.length - 2]].end
            ) {
              const pivotItemTime = pivotItem[0].clip.right
                .split(":")
                .concat(pivotItem[0].clip.right.split(":")[2].split(","));
              const nextItemStartTime = items[
                itemsIndex[itemsIndex.length - 2]
              ].end
                .toString()
                .split(" ")[4]
                .split(":");
              pivotItemTime.splice(2, 1);
              let timeInSeconds =
                parseInt(pivotItemTime[0]) * 60 * 60 +
                parseInt(pivotItemTime[1]) * 60 +
                parseInt(pivotItemTime[2]) +
                parseFloat(`0.${pivotItemTime[3]}`);
              let starttimeInSecondsOfNextItem =
                parseInt(nextItemStartTime[0]) * 60 * 60 +
                parseInt(nextItemStartTime[1]) * 60 +
                parseInt(nextItemStartTime[2]);
              const startTime = starttimeInSecondsOfNextItem + timeInSeconds;
              const newDate = new Date(1970, 0, 1, 0, 0, startTime);
              item.start = items[itemsIndex[itemsIndex.length - 2]].end;
              item.end = newDate;
              return callback(item);
            } else {
              const pivotItemTime = pivotItem[0].clip.right
                .split(":")
                .concat(pivotItem[0].clip.right.split(":")[2].split(","));
              const nextItemStartTime = items[
                itemsIndex[itemsIndex.length - 1]
              ].start
                .toString()
                .split(" ")[4]
                .split(":");
              pivotItemTime.splice(2, 1);
              let timeInSeconds =
                parseInt(pivotItemTime[0]) * 60 * 60 +
                parseInt(pivotItemTime[1]) * 60 +
                parseInt(pivotItemTime[2]) +
                parseFloat(`0.${pivotItemTime[3]}`);
              let starttimeInSecondsOfNextItem =
                parseInt(nextItemStartTime[0]) * 60 * 60 +
                parseInt(nextItemStartTime[1]) * 60 +
                parseInt(nextItemStartTime[2]);
              const startTime = starttimeInSecondsOfNextItem - timeInSeconds;
              const newDate = new Date(1970, 0, 1, 0, 0, startTime);
              item.end = items[itemsIndex[itemsIndex.length - 1]].start;
              item.start = newDate;
              return callback(item);
            }
          }
        } else if (overlapping.length == 0) {
          let transition = this.timeline?.itemsData.get({
            filter: val => {
              return (
                (val?.transition && val?.itemA === item.id) ||
                val?.itemB === item.id
              );
            }
          });
          if (!!transition?.length) {
            this.timeline?.itemsData?.remove(transition?.[0].id);
          }
        }

        callback(item);
      }
    } else {
      return false;
    }
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
