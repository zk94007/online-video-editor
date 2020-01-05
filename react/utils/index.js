export const handleObjectItemDragStart = (event, id, text = false) => {
  var dragSrcEl = event.target;
  event.dataTransfer.effectAllowed = "move";
  var objectItem = {
    content: id,
    target: "itemType",
    text: text
  };
  event.dataTransfer.setData("text", JSON.stringify(objectItem));
};

export const formattedDateFromString = date => {
  let splittedDate = date.split(/:|,/);
  return new Date(
    1970,
    0,
    1,
    Number(splittedDate[0]),
    Number(splittedDate[1]),
    Number(splittedDate[2]),
    Number(splittedDate[3])
  );
};
