import React from "react";
import { Button, Drawer } from "antd";

const Filter = (props) => {
  const { onClose, onSearch, children, ...rest } = props;
  return (
    <Drawer
      title="검색 항목"
      width={300}
      placement="right"
      footer={
        <>
          <Button
            type="primary"
            style={{
              marginRight: 10,
            }}
            onClick={onSearch}
          >
            검색
          </Button>
          <Button onClick={onClose}>취소</Button>
        </>
      }
      onClose={onClose}
      {...rest}
    >
      {children}
    </Drawer>
  );
};
export default Filter;
