import React from "react";
import { string, number, object, func } from "prop-types";

import { Plus, Stock, File, Text, Background, Transition, Sheild, Help } from "./icons";

const ICONS = {
  plus: Plus,
  stock: Stock,
  file: File,
  text: Text,
  background: Background,
  transition: Transition,
  sheild: Sheild,
  help: Help
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
