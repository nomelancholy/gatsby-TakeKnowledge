import { Tag } from "antd";
import React, { useState, useEffect } from "react";

const TimeTable = (props) => {
  const { id, label, onChange, checked } = props;
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
    onChange(id, checked);
  };

  return (
    <ul
      onDragOver={(e) => {
        e.preventDefault();
        console.log(`e`, e);
      }}
    >
      <li draggable>테스트</li>
    </ul>
  );
};

export default TimeTable;
