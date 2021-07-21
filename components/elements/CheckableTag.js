import { Tag } from "antd";
import React, { useState, useEffect } from "react";

const CheckableTag = (props) => {
  const { label, onChange, checked } = props;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setIsChecked(checked);
    } else {
      setIsChecked(false);
    }
  }, []);

  const handleChange = (checked) => {
    setIsChecked(checked);
    onChange(label, checked);
  };

  return (
    <Tag.CheckableTag checked={isChecked} onChange={handleChange}>
      {label}
    </Tag.CheckableTag>
  );
};

export default CheckableTag;
