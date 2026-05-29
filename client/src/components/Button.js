import React from "react";
import "./styles/Button.css";

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.children}
      <span />
    </button>
  );
};

export default Button;
