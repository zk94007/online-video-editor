/**
 * @file Timeline.js
 * @author Ervis Semanaj
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import vis from "../../_lib/vis-timeline/vis"; //Customized vis-timeline

import { server } from "../../../config";
import timeManager from "../../../models/timeManager";

import Editor from "../Editor";
import AddFilterDialog from "./AddFilterDialog";
import moment from "moment";
import { extendMoment } from "moment-range";
import { formattedDateFromString, DateToString } from "../../utils";
import AlertErrorDialog from "../../_core/Dialog/Dialogs/AlertErroDialog";
const Moment = extendMoment(moment);
import { TimelineHeader } from "../style";
const generate = require("nanoid/generate");

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.timeline = null;

    this.state = {
      selectedItems: [],
      showAddFilterDialog: false,
      duration: "00:00:00,000",
      timePointer: "00:00:00,000",
      error: false,
      movingTimePointer: false
    };

    this.onSelect = this.onSelect.bind(this);
    // this.onMoving = this.onMoving.bind(this);
    // this.onMove = this.onMove.bind(this);
    this.buttonFilter = this.buttonFilter.bind(this);
    this.closeAddFilterDialog = this.closeAddFilterDialog.bind(this);
    this.getItem = this.getItem.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.delTrack = this.delTrack.bind(this);
    this.updateTimePointer = this.updateTimePointer.bind(this);
  }

  componentDidMount() {
    const container = document.getElementById("vis-timeline");
    const options = {
      orientation: "top",
      min: new Date(1970, 0, 1),
      max: new Date(1970, 0, 1, 23, 59, 59, 999),
      showCurrentTime: true,
      start: new Date(1970, 0, 1),
      end: new Date(1970, 0, 1, 0, 0, 10, 0),
      multiselect: false,
      multiselectPerGroup: false,
      stack: false,
      zoomMin: 1000 * 80,
      editable: {
        overrideItems: false,
        add: true,
        updateTime: true,
        updateGroup: true,
        remove: false
      },
      itemsAlwaysDraggable: {
        item: true,
        range: true
      },
      zoomMax: 315360000000000,
      // onRemove: this.onRemove,
      // onMove: this.onMove,
      moveable: false,
      zoomable: false,
      zoomKey: "ctrlKey",
      horizontalScroll: true,
      onMoving: this.onMoving,
      onAdd: item => {
        if (item?.group?.includes(item?.support)) {
          const videoMatch = new RegExp(/^videotrack\d+/);
          const textMatch = new RegExp(/^texttrack\d+/);
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
              className: videoMatch.test(item?.group)
                ? "video"
                : !!textMatch.test(item?.group)
                ? "text"
                : "audio"
            });
          } else {
            const items = this.timeline.itemsData.get();
            const itemsIndex = [];
            for (let i = 0; i < items.length; i++) {
              if (item.start < items[0].start) {
                itemsIndex.push(0);
                break;
              }
              if (item.start < items) {
                break;
              }
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
              className: videoMatch.test(item?.group)
                ? "video"
                : !!textMatch.test(item?.group)
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
      },
      onDropObjectOnItem: (objectData, item, callback) => {},
      timeAxis: {
        scale: "second",
        step: 2
      },
      format: {
        minorLabels: {
          millisecond: "SSS [ms]",
          second: "s [s]",
          minute: "HH:mm:ss",
          hour: "HH:mm:ss",
          weekday: "HH:mm:ss",
          day: "HH:mm:ss",
          week: "HH:mm:ss",
          month: "HH:mm:ss",
          year: "HH:mm:ss"
        },
        majorLabels: {
          millisecond: "HH:mm:ss",
          second: "HH:mm:ss",
          minute: "",
          hour: "",
          weekday: "",
          day: "",
          week: "",
          month: "",
          year: ""
        }
      }
    };
    this.timeline = new vis.Timeline(container, [], [], options);
    this.timeline.addCustomTime(new Date(1970, 0, 1));
    this.timeline.setCustomTimeTitle("00:00:00,000");
    this.timeline.on("select", this.onSelect);
    this.timeline.on("timechange", this.onTimeChange);
    this.timeline.on("moving", this.onMoving);
    // this.timeline.on("move", this.onMove);
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
          // todo Subtract transition duration
          // let endTime = item?.out?.split(/:|,/);
          // let startTime = item?.in?.split(/:|,/);
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

  onSelect(properties) {
    this.setState({ selectedItems: properties.items });
  }

  buttonFilter() {
    if (this.state.selectedItems.length === 0) return;

    this.setState({ showAddFilterDialog: true });
  }

  closeAddFilterDialog() {
    this.setState({ showAddFilterDialog: false });
  }

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

  getItem(trackIndex) {
    const itemPath = trackIndex.split(":");
    const trackItems = Editor.findTrack(this.props.items, itemPath[0]);
    return Editor.findItem(trackItems, Number(itemPath[1]));
  }

  getItemInRange(timelineID, itemID, start, end) {
    const track = Editor.findTrack(this.props.items, timelineID);
    const items = [];
    let time = "00:00:00,000";
    let index = 0;
    for (let item of track) {
      if (item.resource === "blank") {
        time = timeManager.addDuration(item.length, time);
      } else {
        if (end <= time) break;
        const timeStart = time;
        time = timeManager.addDuration(time, item.out);
        time = timeManager.subDuration(time, item.in);
        // todo Subtract transition duration
        if (index++ === itemID) continue; // Same item
        if (start >= time) continue;
        items.push({
          start: timeStart,
          end: time
        });
      }
    }
    return items;
  }

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
        const itemsMain = this.timeline.itemsData.get();
        const items = [];
        const itemGroup = item.group;
        // filtering specific group items
        for (let i = 0; i < itemsMain.length; i++) {
          if (
            itemsMain[i].group[itemsMain[i].group.length - 1] !==
            itemGroup[itemGroup.length - 1]
          ) {
            delete itemsMain[i];
          }
        }
        for (let i = 0; i < itemsMain.length; i++) {
          if (!!itemsMain[i]) {
            items.push(itemsMain[i]);
          }
        }
        // checking overlapping of same group items
        const overlapping = itemsMain.filter(testItem => {
          if (testItem.id == item.id) {
            return false;
          }
          return item.start < testItem.end && item.end > testItem.start;
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
            var nextItemEndSplittedTime = items[i + 1].start
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            var itemStartSplittedTime = items[i].end
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            var comingItemStartSplittedTime = item.start
              .toString()
              .split(" ")[4]
              .split(":")
              .join("");
            if (
              parseInt(comingItemStartSplittedTime) <=
                parseInt(nextItemEndSplittedTime) &&
              parseInt(itemStartSplittedTime) <=
                parseInt(comingItemStartSplittedTime)
            ) {
              itemsIndex.push(i);
              itemsIndex.push(i + 1);
            }
          }
          const differenceOfOverlappingItemStartAndEndTime =
            parseInt(
              items[itemsIndex[itemsIndex.length - 2]].end
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            ) -
            parseInt(
              items[itemsIndex[itemsIndex.length - 1]].start
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            );
          const differenceOfComingItemStartAndEndTime =
            parseInt(
              item.end
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            ) -
            parseInt(
              item.start
                .toString()
                .split(" ")[4]
                .split(":")
                .join("")
            );
          if (
            differenceOfOverlappingItemStartAndEndTime <
            differenceOfComingItemStartAndEndTime
          ) {
            if (
              item.group[item.group.length - 1] ===
              items[itemsIndex[0]].group[items[itemsIndex[0]].group.length - 1]
            ) {
              if (item.start < items[0].start) {
                item.start = items[0].end;
                item.end = items[1].start;
                callback(item);
              } else if (itemsIndex.length > 1) {
                item.start = items[itemsIndex[itemsIndex.length - 2]].end;
                item.end = items[itemsIndex[itemsIndex.length - 1]].start;
                item.clip.right = timeManager.subDuration(
                  this.dateToString(item.end),
                  this.dateToString(item.start)
                );
                callback(item);
              }
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

    // const searchTrack = Editor.findTrack(
    //   this.props.items,
    //   item?.id?.split(":")?.[0]
    // );
    // let itemTrack = Editor.findItem(
    //   searchTrack,
    //   Number(item?.id?.split(":")?.[1])
    // );
    // const length = formattedDateFromString(
    //   timeManager.subDuration(itemTrack.item?.out, itemTrack.item?.in)
    // );
    // const subTime = formattedDateFromString(
    //   timeManager.subDuration(
    //     moment(item.end).format("HH:mm:ss,SSS"),
    //     moment(item.start).format("HH:mm:ss,SSS")
    //   )
    // );
    // const range = Moment.range(
    //   formattedDateFromString(itemTrack.item?.in),
    //   formattedDateFromString(itemTrack.item?.out)
    // );
    // if (length && subTime <= length) {
    //   this.setState(
    //     {
    //       isResize: subTime < length
    //     },
    //     () => {
    //       callback(this.itemMove(item));
    //     }
    //   );
    // }
  };

  // onMove(item) {
  //   item.className = "video";
  //   item = this.itemMove(item);
  //   if (item !== null) {
  //     if (!!this.state.isResize) {
  //       let track = Editor.findTrack(
  //         this.props.items,
  //         item?.id?.split(":")?.[0]
  //       );
  //       let itemTrack = Editor.findItem(
  //         track,
  //         Number(item?.id?.split(":")?.[1])
  //       );
  //       let direction =
  //         item.end < formattedDateFromString(itemTrack.item.out)
  //           ? "back"
  //           : "front";
  //       let time =
  //         item.end < formattedDateFromString(itemTrack.item.out)
  //           ? Timeline.dateToString(item.end)
  //           : Timeline.dateToString(item.start);
  //       const url = `${server.apiUrl}/project/${this.props.project}/item/crop`;
  //       const params = {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({
  //           track: item?.group,
  //           direction: direction,
  //           item: itemTrack?.item?.id,
  //           time: time
  //         })
  //       };

  //       fetch(url, params)
  //         .then(response => response.json())
  //         .then(data => {
  //           if (typeof data.err !== "undefined") {
  //             alert(`${data.err}\n\n${data.msg}`);
  //           } else {
  //             // Same track
  //             this.props.loadData();
  //           }
  //         })
  //         .catch(error => console.log(error.message));
  //       // if (item.end < formattedDateFromString(itemTrack.item.out)) {
  //       //   console.log("Backword");
  //       // } else if (item.start > formattedDateFromString(itemTrack.item.in)) {
  //       //   console.log("forwar");
  //       // }
  //     } else {
  //       const itemPath = item.id.split(":");
  //       const currentItem = Editor.findTrack(this.props.items, itemPath[0]);
  //       const url = `${server.apiUrl}/project/${this.props.project}/item/move`;
  //       const params = {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({
  //           track: itemPath[0],
  //           trackTarget: item.group,
  //           item: currentItem?.[0]?.id,
  //           time: Timeline.dateToString(item.start)
  //         })
  //       };

  //       fetch(url, params)
  //         .then(response => response.json())
  //         .then(data => {
  //           if (typeof data.err !== "undefined") {
  //             alert(`${data.err}\n\n${data.msg}`);
  //           } else {
  //             if (itemPath[0] === item?.group) {
  //               // Same track
  //               this.props.loadData();
  //             } else {
  //               // Moving between tracks
  //               const trackType = item.group.includes("audio")
  //                 ? "audio"
  //                 : "video";
  //               const prevTrack = Editor.findTrack(
  //                 this.props.items,
  //                 itemPath[0]
  //               )?.[0];
  //               const newTrack = Editor.findTrack(
  //                 this.props.items,
  //                 item.group
  //               )?.[0];
  //               const addTrack = newTrack?.items?.length === 0; //
  //               const delTrack = Editor.findItem(prevTrack, 1) === null;
  //               if (addTrack && delTrack)
  //                 this.addTrack(trackType, prevTrack.id);
  //               else if (addTrack) this.addTrack(trackType, null);
  //               else if (delTrack) this.delTrack(prevTrack.id);
  //               else this.props.loadData();
  //             }
  //           }
  //         })
  //         .catch(error => console.log(error.message));
  //     }
  //   }
  // }

  itemMove = item => {
    if (item.start.getFullYear() < 1970) return null;
    // Deny move before zero time
    else {
      const itemPath = item.id.split(":");

      if (
        !(
          item.group.includes("videotrack") &&
          itemPath[0].includes("videotrack")
        )
      ) {
        if (
          !(
            item.group.includes("audiotrack") &&
            itemPath[0].includes("audiotrack")
          )
        ) {
          if (
            !(
              item.group.includes("texttrack") &&
              itemPath[0].includes("texttrack")
            )
          ) {
            return null;
          }
        }
      }

      item.className = item.className.includes("video") ? "video" : "audio";
      const itemIndex = itemPath[0] === item.group ? Number(itemPath[1]) : null;
      const start = Timeline.dateToString(item.start);
      const end = Timeline.dateToString(item.end);
      const collision = this.getItemInRange(item.group, itemIndex, start, end);
      if (collision.length === 0) {
        // Free
        return item;
      } else if (collision.length > 1) {
        // Not enough space
        return null;
      } else {
        // Space maybe available before/after item
        let itemStart = "";
        let itemEnd = "";
        const duration = timeManager.subDuration(end, start);
        if (
          timeManager.middleOfDuration(start, end) <
          timeManager.middleOfDuration(collision[0].start, collision[0].end)
        ) {
          // Put before
          item.className =
            item.className === "video"
              ? "video stick-right"
              : "audio stick-right";
          itemEnd = collision[0].start;
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

          itemStart = timeManager.subDuration(collision[0].start, duration);
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
          // Put after
          item.className =
            item.className === "video"
              ? "video stick-left"
              : "audio stick-left";
          itemStart = collision[0].end;
          const itemStartParsed = collision[0].end.match(
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

          itemEnd = timeManager.addDuration(collision[0].end, duration);
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
        // Check if there is enough space
        if (
          this.getItemInRange(item.group, itemIndex, itemStart, itemEnd)
            .length === 0
        ) {
          return item;
        }
        return null;
      }
    }
  };

  addTrack(type, delTrack) {
    const url = `${server.apiUrl}/project/${this.props.project}/track`;
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

        if (delTrack !== null) this.delTrack(delTrack);
        else this.props.loadData();
      })
      .catch(error => this.props.fetchError(error.message));
  }

  delTrack(trackId) {
    const url = `${server.apiUrl}/project/${this.props.project}/track`;
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        track: trackId
      })
    };

    fetch(url, params)
      .then(response => response.json())
      .then(data => {
        if (typeof data.err !== "undefined") {
          alert(`${data.err}\n\n${data.msg}`);
        }
        this.props.loadData();
      })
      .catch(error => this.props.fetchError(error.message));
  }

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
