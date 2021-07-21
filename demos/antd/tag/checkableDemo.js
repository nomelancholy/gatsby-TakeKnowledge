import CheckableTag from "@components/elements/CheckableTag";
import React from "react";

const CheckableDemo = () => {
  const list = [
    { label: "tag1", check: true },
    { label: "tag2", check: false },
    { label: "tag3", check: true },
  ];

  const handleChange = (key, value) => {
    console.log(`key`, key);
    console.log(`value`, value);
  };

  return (
    <>
      {list.map((element) => (
        <>
          <p>{element.check}</p>
          <CheckableTag
            key={element.label}
            label={element.label}
            onChange={handleChange}
            checked={element.check}
          />
        </>
      ))}
    </>
  );
};

export default CheckableDemo;
