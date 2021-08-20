import React from "react";
import { Button, Drawer } from "antd";

const Filter = (props) => {
  const { onSearch, onReset, onClose, children, ...rest } = props;
  return (
    <Drawer
      title="검색 항목"
      width={300}
      placement="right"
      footer={
        <>
          <Button
            type="primary"
            key="search"
            style={{
              marginRight: 10,
            }}
            onClick={onSearch}
          >
            검색
          </Button>
          <Button key="reset" onClick={onReset}>
            초기화
          </Button>
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
