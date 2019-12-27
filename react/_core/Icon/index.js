import React from "react";
import { string, number, object, func } from "prop-types";

import Plus from "./Icons/Plus";
import Stock from "./Icons/Stock";
import File from "./Icons/File";
import Text from "./Icons/Text";
import Background from "./Icons/Background";
import Transition from "./Icons/Transition";
import Sheild from "./Icons/Sheild";
import Help from "./Icons/Help";
import Upload from "./Icons/Upload";
import Delete from "./Icons/Delete";
import Star from "./Icons/Star";
import Video from "./Icons/Video";
import Audio from "./Icons/Audio";
import Close from "./Icons/Close";
import Search from "./Icons/Search";
import ArrowLeft from "./Icons/ArrowLeft";
import Add from "./Icons/Add";
import Caret from "./Icons/Caret";

const ICONS = {
  plus: Plus,
  stock: Stock,
  file: File,
  text: Text,
  background: Background,
  transition: Transition,
  sheild: Sheild,
  help: Help,
  upload: Upload,
  delete: Delete,
  star: Star,
  video: Video,
  audio: Audio,
  close: Close,
  search: Search,
  arrowLeft: ArrowLeft,
  add: Add,
  caret: Caret
};

const Icon = ({ name, size = 16, color = "white", style, onClick, className }) => {
  const IconComponent = ICONS[name];

  return (
    <IconComponent className={className} size={size} color={color} style={style} onClick={onClick} />
  );
};

Icon.propTypes = {
  name: string,
  size: number,
  color: string,
  style: object,
  onClick: func
};

export default Icon;
