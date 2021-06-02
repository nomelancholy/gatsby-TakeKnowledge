---
title: "typescript props 받는 법"
date: "2020-07-23"
category: "bugfix"
draft: true
---

## destructuring + props

```js

interface TestProps {
  name: string
  age: number
}

const Parent = () => {
  const props = {
    name: 'test',
    age: 20
  } as TestProps
  return (
    <>
      <TestComp1 {...props} />
      <TestComp2 {...props.name}></TestComp2>
      <TestComp3 name={props.name} age={props.age}></TestComp3>
    </>
  )
}

const TestComp1 = (props: TestProps) => {
  return <>{props.name + ' ' + props.age}</>
}

const TestComp2 = (name: string) => {
  return <>{name}</>
}

const TestComp3 = ({ name }: TestProps) => {
  return <>{name}</>
}


```
