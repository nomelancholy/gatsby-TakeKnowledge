---
title: '자바스크립트 모듈(Module) 학습 내용 간단 요약'
date: '2019-12-21 22:34:13'
category: 'foundation'
draft: false
---

![main.png](https://images.velog.io/post-images/takeknowledge/f384bf00-22f0-11ea-bb3b-d1369ba18e7b/image.png)

## 📣 주의사항

---

> 1. 이 글은 핵심만 추린 요약글입니다. 자세한 내용과 예시는 참조의 링크를 확인하세요
> 2. 오류가 없도록 최선을 다했지만 공부가 부족해 틀린 부분이 있을 수 있습니다. 감안하여 읽어주시고 오류를 발견하시면 댓글로 알려주세요 !

## 💫 모듈(Module)이란

---

자바스크립트 코드의 크기가 갈수록 커지고 기능도 복잡해지자 자바스크립트 커뮤니티는 코드 전체를 기능 단위의 코드 뭉치로 분해하고 필요에 따라 결합할 수 있도록 하는 시스템의 도입을 고민했습니다. 그 결과 도입된 것이 `Module System`입니다. 이 때 사용되는 코드 뭉치 각각을 `Module`이라고 합니다.

## 🏓 모듈 활용법

---

모듈을 내보낼 때는 `export`를, 가져올 때는 `import`를 활용합니다.

### 1️⃣ named export

모듈을 내보내는 가장 쉬운 방법은 내보내려는 항목 앞에 `export` 지시자를 배치하는 것입니다. 그 항목이 변수인지, 함수인지, 클래스인지는 상관없습니다. 최상위 항목이기만 하다면 이 방법으로 모두 내보낼 수 있습니다. 이런 방법을 `named export`라고 합니다.

```js
// 📃export.js

// 배열 내보내기
export let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// 상수 내보내기
export const MODULES_BECAME_STANDARD_YEAR = 2015

// 함수 내보내기
export function sayHi(user) {
  alert('Hello! `user`')
}

// 클래스 내보내기
export class User {
  constructor(name) {
    this.name = name
  }
}
```

위와 같이 각각 내보내지 않고 모듈 최하단에서 여러 항목을 중괄호로 묶어 내보낼 수도 있습니다.

```js
// 배열 내보내기
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 상수 내보내기
const MODULES_BECAME_STANDARD_YEAR = 2015

// 함수 내보내기
function sayHi(user) {
  alert(`Hello, ${user}!`)
}

// 클래스 내보내기
class User {
  constructor(name) {
    this.name = name
  }
}

export { months, MODULES_BECAME_STANDARD_YEAR, sayHi, User }
```

`as`를 활용해 이름을 바꿔 내보낼 수도 있습니다.

```js
export { months, MODULES_BECAME_STANDARD_YEAR as year, sayHi, User }
```

### 2️⃣ named export - import

named export로 내보낸 모듈은 `import` 지시자를 활용해 가져올 수 있습니다.
규칙은 아래와 같습니다.

```js
// 📃 import.js

import { months, year, sayHi, User } from './modules/export.js'
```

import 뒤 중괄호안에 가져올 모듈을 적습니다. 여러개인 경우 , 로 구분합니다.
from 뒤엔 경로를 적습니다. `.`이 현재 경로를 의미합니다. `.`을 기준으로 경로를 작성하면 됩니다.
일부 모듈 시스템에선 확장명을 생략할 수 있지만 네이티브 자바스크립트에서는 확장명이 있어야 합니다.

```js
import { months, year, sayHi as hello, User } from './modules/export.js'

hello('길동')
```

import에서도 역시 `as` 지시자로 이름을 바꿀 수 있습니다.

```js
import * as all from './modules/export.js'

console.log(all)
```

또한 import 에서 `*` 를 활용하면 경로에서 export된 모든 모듈을 가져와 사용할 수 있습니다.
console.log를 활용해 확인한 all의 내용은 아래와 같습니다.

![console.log(all) 출력 결과](https://images.velog.io/post-images/takeknowledge/a4bcb260-23a4-11ea-adc3-83579acfb55a/image.png)

> ❓*만약 export.js 에서 export 한 모듈을 import하지 않고 사용하려고 하면 어떻게 될까요?*
>
> 각각의 모듈은 **독립된 스코프를 갖기 때문에** 사용할 수 없습니다.

### 3️⃣ default export

named export를 설명하기 위해 예시를 든 방식과는 다르게, 대개는 한 파일에서 하나의 개체만 모듈로 넘기는 방식을 선호합니다. 그에 맞춰 유용하게 쓰이는 것이 default export 입니다.

내보내는 방법은 크게 다르지 않습니다. 위의 방식에서 export 뒤에 default만 더해주면 됩니다.

```js
// 📃export.js

export default class User {
  // export 옆에 "default"를 추가해보았습니다.
  constructor(name) {
    this.name = name
  }
}
```

이 방식을 활용하면 어차피 하나의 파일에서 하나의 개체만 넘길 수 있기 때문에 이름없는 함수나 클래스, 배열도 넘길 수 있습니다

```js
export default class { // 클래스 이름이 없음
  constructor() { ... }
}

export default function(user) { // 함수 이름이 없음
  alert(`Hello, ${user}!`);
}

// 이름 없이 배열 형태의 값을 내보냄
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 모두 export 가능합니다.

```

또한 기본 내보내기는

```js
function sayHi(user) {
  alert(`Hello, ${user}!`)
}

// 함수 선언부 앞에 "export default"를 붙여준 것과 동일합니다.
export { sayHi as default }
```

이와 같은 방식으로도 구현할 수 있습니다.

### 4️⃣ default export - import

default export로 내보낸 값을 가져올 때는 import 뒤에 중괄호를 적지 않아도 됩니다.
또한 넘어온 모듈의 이름은 import 한 페이지에서 원하는 대로 적어 사용할 수 있습니다.

```js
import Lorem from './modules/export.js' // 동작
import Ipsum from './modules/export.js' // 동작
// 어떤 이름이든 에러 없이 동작합니다.
```

흔치 않지만 만약 한 파일에서 default export 하나와 다수의 named export가 넘어오는 상황이라면

```js
// 📁 main.js
import { default as User, sayHi } from './user.js'

new User('John')
```

위와 같이 import 해서 사용할 수 있습니다.

### 5️⃣ export ... from 으로 다시 내보내기

받은 걸 바로 내보내야 하는 상황도 있을 수 있습니다. 이럴 경우

```js
// named export로 넘어온 모듈
// login과 logout을 가지고 온 후 바로 내보냅니다.
export { login, logout } from './helpers.js'

// default export로 넘어온 모듈
// User 가져온 후 default 지시자를 활용해 바로 내보냅니다.
export { default as User } from './user.js'
```

위와 같이 처리할 수 있습니다.

### 6️⃣ HTML에 module 적용하기

위에서 정리한 내용은 모듈과 모듈간의 결합. 그러니까 스크립트 파일과 스크립트 파일간의 결합이었습니다.
이걸 html 파일에 적용하려면 어떻게 해야 할까요?

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>모듈 적용</title>
  </head>
  <body>
    <h1>테스트</h1>
    <script type="module" src="js/index.js"></script>
  </body>
</html>
```

위와 같이 script 태그에 type 속성값을 module로 줘서 활용하면 됩니다.
type 속성을 명시하지 않으면

`Uncaught SyntaxError: Cannot use import statement outside a module`

위와 같은 에러가 발생합니다.

참고로 하나 덧붙이자면, script태그에 type을 module로 준 모듈 스크립트는 defer 속성을 붙인 것 처럼 HTML 문서가 완전히 만들어진 이후 실행되고

```html
<script type="module">
  alert(typeof button)
  // 모듈 스크립트는 지연 실행되기 때문에
  //페이지가 모두 로드되고 난 다음에 얼럿 함수가 실행되므로
  // 얼럿창에 object가 정상적으로 출력됩니다. 모듈 스크립트는 아래쪽의 button 요소를 '볼 수' 있죠.
</script>

하단의 일반 스크립트와 비교해 봅시다.

<script>
  alert(typeof button) // 일반 스크립트는 페이지가 완전히 구성되기 전이라도 바로 실행됩니다.
  // 버튼 요소가 페이지에 만들어지기 전에 접근하였기 때문에 undefined가 출력되는 것을 확인할 수 있습니다.
</script>

<button id="button">Button</button>
```

모듈을 외부에서 불러오는 외부 모듈 스크립트를 다운로드 할 때는

```html
<script type="module" src="js/index.js"></script>
<!-- 이와 같은 방식을 지칭합니다 -->
```

브라우저가 외부 모듈 스크립트와 기타 리소스를 병렬적으로 불러옵니다.

## 📚 더 공부할 것

---

### 1️⃣ CORS

`HTML에 module 적용하기`에 소개된 방식을 로컬에서 직접 실행해보면

> index.html:1 Access to script at '경로/js/index.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.

와 같은 에러가 발생합니다. 이를 해결하기 위해선 CORS에 대한 이해가 필요합니다.

### 2️⃣ webpack

CORS 에러를 해결했다고 해도, 예를 들어

![cytoscape install guide.png](https://images.velog.io/post-images/takeknowledge/69a2bbe0-23ca-11ea-96a6-e9e3c3f9acf4/image.png)

위와 같은 가이드를 보고 npm을 통해 패키지(모듈) 설치 후 import 해 사용하려 하면 에러가 발생합니다.
애초에 가이드에 나와있는 방식이 위에서 모듈 사용법에 부합하지 않죠. 경로도 명시하지 않았고요.
이를 해결하기 위해선 webpack과 같은 모듈 번들러에 대한 이해가 필요합니다.

### 3️⃣ 브라우저가 script 태그를 해석하는 방식

마지막 모듈 스크립트에 대한 설명이 개운하게 이해되지 않는 다면 브라우저가 HTML 태그를 해석하는 방식에 대한 이해가 필요합니다.

[script 태그는 어디에 위치해야 할까요?](https://velog.io/@takeknowledge/script-%ED%83%9C%EA%B7%B8%EB%8A%94-%EC%96%B4%EB%94%94%EC%97%90-%EC%9C%84%EC%B9%98%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C%EC%9A%94)

## 🔍 참조

---

- [MDN - javascript 안내서 - Javascript modules](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules)
- [모던 JavaScript 튜토리얼 - 코어 자바스크립트 - 모듈 소개](https://ko.javascript.info/modules-intro)
- [모던 JavaScript 튜토리얼 - 코어 자바스크립트 - 모듈 내보내고 가져오기](https://ko.javascript.info/import-export)
- [doondoony - JavaScript Module System](https://velog.io/@doondoony/JavaScript-Module-System)
