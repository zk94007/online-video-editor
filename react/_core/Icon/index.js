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
  star: Star
};

const Icon = ({ name, size = 16, color = "white", style, onClick }) => {
  const IconComponent = ICONS[name];

  return (
    <IconComponent size={size} color={color} style={style} onClick={onClick} />
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