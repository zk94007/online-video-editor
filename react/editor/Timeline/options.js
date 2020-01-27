export default {
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
  moveable: false,
  zoomable: false,
  zoomKey: "ctrlKey",
  horizontalScroll: true,
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
