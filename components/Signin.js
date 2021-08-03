import { Button, Checkbox, Form, Input, Message, Row } from "antd";
import { EyeTwoTone, MailTwoTone, PlaySquareTwoTone } from "@ant-design/icons";

import React, { useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import { useAppState } from "./shared/AppProvider";
import AuthActionCreators from "@state/actions/AuthActionCreators";

const FormItem = Form.Item;

const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

const Signin = (props) => {
  const { dispatch } = props;
  const { isLoggedIn, msg } = props.auth;

  const [form] = Form.useForm();
  const [state] = useAppState();

  useEffect(() => {
    if (isLoggedIn) {
      Router.push("/contract");
    }
  }, [isLoggedIn]);

  const handleSigninSubmit = (values) => {
    const { email, password, remember } = values;

    dispatch(
      AuthActionCreators.authenticate({
        user_login: email,
        user_pass: password,
        remember,
      })
    );
  };

  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      className="px-3 bg-white mh-page"
      style={{ minHeight: "100vh" }}
    >
      <Content>
        <div className="text-center mb-5">
          <Link href="/signin">
            <a className="brand mr-0">
              <PlaySquareTwoTone style={{ fontSize: "32px" }} />
            </a>
          </Link>
          <h5 className="mb-0 mt-3">Sign in</h5>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSigninSubmit}>
          <FormItem
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input
              prefix={<MailTwoTone style={{ fontSize: "16px" }} />}
              type="email"
              placeholder="Email"
            />
          </FormItem>

          <FormItem
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<EyeTwoTone style={{ fontSize: "16px" }} />}
              type="password"
              placeholder="Password"
            />
          </FormItem>

          <FormItem name="remember" valuePropName="checked" initialValue={true}>
            <Checkbox>Remember me</Checkbox>

            <Button type="primary" htmlType="submit" block className="mt-3">
              Log in
            </Button>
            {msg && <p>{msg}</p>}
          </FormItem>
        </Form>
      </Content>
    </Row>
  );
};

export default Signin;
