import axios from "axios";
import { server } from "../../config";

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

export const DateToString = date => {
  let string = `${date.getHours()}:`;
  if (string.length < 3) string = "0" + string;

  string += `00${date.getMinutes()}:`.slice(-3);
  string += `00${date.getSeconds()},`.slice(-3);
  string += `${date.getMilliseconds()}000`.slice(0, 3);
  return string;
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

export const addToLibrary = (e, url, setError, reloadResources, setLoading) => {
  e.stopPropagation();
  const projectId = localStorage.getItem("id");
  const requestUrl = `${server.apiUrl}/project/${projectId}/import`;
  setLoading(true);
  axios
    .post(
      requestUrl,
      JSON.stringify({
        url: url,
        projectID: projectId
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(data => {
      if (typeof data.err !== "undefined") {
        setLoading(false);
        alert(`${data.err}\n\n${data.msg}`);
      }
      setLoading(false);
      reloadResources();
    })
    .catch(error => {
      setError(error.message);
      setLoading(false);
    });
};
export const getResources = setError => {
  const project = localStorage.getItem("id");
  const url = `${server.apiUrl}/project/${project}`;
  const params = {
    method: "GET"
  };
  return fetch(url, params)
    .then(response => response.json())
    .then(data => {
      if (typeof data.err === "undefined") {
        return data?.resources;
      } else {
        alert(`${data.err}\n\n${data.msg}`);
      }
    })
    .catch(error => {
      setError(error.message);
    });
};
