---
title: "컴퓨터 과학 개론 - "
date: "2020-08-27"
category: "foundation"
draft: true
---

한국 방송통신 대학교 '컴퓨터 과학 개론' 수업을 듣고 공부한 내용을 제 언어로 정리한 포스팅입니다.

## 컴퓨터와 자료

### 컴퓨터

#### 컴퓨터란 무엇인가

컴퓨터는 외부에서 자료와 명령 등을 입력을 받아 이를 처리하고 출력하는 기계입니다. 이 중에서 처리 부분을 담당하는 것은 일련의 명령어 집합이고 이를 프로그램이라 합니다. 즉 컴퓨터는 이 프로그램이 없으면 아무런 처리도 할 수 없지만 이것만 있다면 어디서나 동일한 결과를 신속하게 얻어낼 수 있습니다.

#### 컴퓨터의 발전과 구분

이전에도 기계식 계산장치는 있었지만 최초의 완전 전자식 범용 컴퓨터 (여러 가지 유형의 작업을 처리할 목적의 컴퓨터)인 ENIAC이 등장한 건 1946년입니다. 그러나 이는 메모리에는 데이터만 저장하고 외부에서 전선의 연결 상태를 바꾸거나 스위치의 온/오프를 조정해서 프로그래을 실행하던 방식의 기게로서 지금의 컴퓨터와는 달랐습니다.

지금처럼 데이터 뿐만이 아니라 프로그램도 메모리에 저장하여 처리하는 존 폰 노이만의 내장 프로그램 방식을 따른 최초의 컴퓨터는 EDVAC으로 1950년도에 개발되었고 머지않아 유사한 개념의 EDSAC도 등장했습니다.

이 당시의 1세대 컴퓨터는 모두 진공관을 사용하는 형태라 큰 기관/ 조직에서만 운영할 수 있었는데 진공관 대신 트랜지스터를 사용하는 2세대 컴퓨터가 발명되고, 그 대신 집적회로를 사용하는 3세대 컴퓨터, 나아가 초고밀도 집적회로 (VSLI)를 사용하는 4새대 컴퓨터를 거쳐 현재 사용되는 5세대 컴퓨터까지 발전해오며 가격도 저렴해지고 널리 사용되게 되었습니다.

### 컴퓨터 과학

#### 컴퓨터 과학이란 무엇인가

컴퓨터가 외부에서 자료와 명령등을 입력을 받아 이를 처리하고 출력하는 기계라면, 컴퓨터 과학은 이 중 처리 부분과 관련이 있는 학문입니다. 정확히는 자료의 획득, 표현, 처리, 저장, 통신, 접근을 위한 방법들의 실행 가능성, 구조화, 표현, 기계화에 관련된 내용을 다루는 학문 분야인데 이는 모두 알고리즘의 한계, 분석, 개발, 실행, 표현 및 통신의 관점에서 바라볼 수 있을 정도로 알고리즘이 핵심적인 키워드 입니다.

#### 컴퓨터 과학의 특성

컴퓨터가 등장한지 얼마 되지 않았기 때문에 컴퓨터 과학의 역사는 짧지만 그 발전 속도는 매우 빠르고 범위도 매우 넓은 학문입니다. 비슷한 컴퓨터 공학은 가격 대비 성능 특성이 가장 좋은 컴퓨팅 엔진을 만들기 위해 하드웨어와 소프트웨어의 요소를 조립하는 방법에 관심을 두지만 컴퓨터 과학은 문제 해결에 좀 더 초점을 맞추고 있습니다.

### 컴퓨터 시스템

컴퓨터 시스템은 크게 하드웨어와 소프트 웨어, 자료, 사용자로 구성됩니다.

#### 하드웨어

오늘날의 모든 컴퓨터는 컴퓨터의 내부 구조와 처리 과정을 정의한 폰 노이만 시스템에 기반을 둡니다. 여기서는 컴퓨터의 하드웨어를 기억 장치, 제어 장치, 산술논리연산 장치, 입출력 장치, 이렇게 크게 네 부분으로 나눕니다.

이 중 기억 장치는 다시 주기억 장치(RAM)와 보조 기억 장치(HDD / SDD)로 나뉩니다. 주기억 장치는 큰 용량의 프로그램과 데이터를 담아두기엔 적합하지 않기 때문에 저장 가능 용량이 큰 보조기억장치에 프로그램과 데이터를 담아뒀다가 사용되는 데이터와 프로그램만 주기억 장치에 담아 실행하기 위해 입니다.

제어 장치와 산술논리연산 장치의 역할은 CPU에서 담당합니다. 제어 장치는 메모리에 올라온 명령어를 하나씩 가져와 해석하고 산술논리연산 장치는 해석된 명령을 실행하는 역할을 합니다.
가장 간단한 입출력 장치는 키보드와 모니터처럼 입출력을 담당하는 장치를 말합니다.

#### 소프트웨어

모든 프로그램을 총체적으로 소프트웨어라고 표현합니다. 이는 운영체제, 컴파일러 등이 해당하는 시스템 소프트웨어와 사용자의 요구를 수행하는 응용 소프트웨어로 나눌 수 있습니다.

#### 자료와 사용자

사용자와 자료도 각각 컴퓨터 시스템 중 하나입니다. 단 자료는 컴퓨터가 이해할 수 있게 0과 1이 나열된 비트패턴으로 변환되어 사용되고 출력시에도 비트 패턴의 데이터가 다시 적절한 형태로 변환되어 출력됩니다.

### 자료의 표현

이처럼 0과 1만 사용하는 비트 패턴을 사용하는 이유는 컴퓨터가 트랜지스터라고 하는, 전기로 작동하는 스위치들의 합으로 작동하기 떄문입니다. 1이 이 스위치의 켜진 상태를, 0이 이 스위치의 꺼진 상태를 표현하며 자료를 처리하는 겁니다.

물론 하나의 스위치, 즉 1비트로 자료를 처리할 순 없습니다. 그렇기 떄문에 이를 묶어 사용합니다.비트가 8개 나열되면 바이트, 그 바이트가 1024개가 모이면 킬로 바이트, 그게 다시 1024개가 모이면 메가바이트가 되는 식으로, 기가 바이트, 테라 바이트, 페타 바이트 등의 단위를 사용하며 자료를 처리합니다.

#### 진법

자료를 0과 1로 표현하기 위해 컴퓨터는 2진법을 사용합니다. 진법이란 수를 세는 방법입니다. 우리가 일상적으로 쓰는 10진법은 0부터 9까지의, 10개의 숫자를 이용해 수를 표현하는 방식이고 같은 맥락으로 2진법은 0과 1, 2개의 숫자만을 이용해 수를 세는 방식입니다.

그렇다면 10은 어떻게 읽어야 할까요? 2진법에 대해 몰랐을 때는 고민할 필요도 없는 문제였지만 이제는 십진법의 관점에서 `십`이라고 읽어야 할지 이진법의 관점에서 '일공'으로 읽어야 할지 모호할 것입니다. 그렇기 때문에 기본적으로 십진법을 사용하는, 10을 십으로 읽는 일상에선 그렇게까지 표현할 필요는 없지만 2진법과 10진법을 구분해야 하는 경우에 십진법 10은 10<sub>10</sub>, 이진법 10은 10<sub>2</sub> 와 같이 아래 첨자를 사용해 그 수의 진법을 표현해 줄 수 있습니다.

##### 2진수를 10진수로 변환

진법끼리는 변환도 가능합니다. 우선 2진수를 10진수로 변환하는 방법을 알아보겠습니다. 10진법의 수에서 오른쪽 첫째 자리 각 자리가 10의 0제곱을 곱한 수를, 둘째 자리가 10의 1제곱을 곱한 수를, 셋째 자리고 10의 2제곱을 곱한 수를.. 그렇게 n번째 자리수가 10의 n-1 제곱을 곱한 수라는 걸 생각하면 그렇게 어렵지 않습니다.

만약 2진수 10111이라는 수가 있다면 똑같은 방식으로 2의 n-1제곱을 곱하면 됩니다. 1 x 2<sup>0</sup> + 1 x 2<sup>1</sup> + 1 x 2<sup>2</sup> + 1 x 2<sup>4</sup>를 하면 1 + 2 + 4 + 16이되니 23이 나오고 이것이 2진수 10111을 10진수로 변환한 값입니다. 만약 소수점 이하의 수가 있다면 같은 방식으로 2<sup>-1</sup>, 2<sup>-2</sup>, 2 <sup>-3</sup>을 곱하면 됩니다.

##### 10진수를 2진수로 변환

10진수를 2진수로 변환하기 위해선 일단 그 수를 더이상 2로 나눌 수 없을 때까지 2로 나눠야 합니다. 그 후 마지막 몫과 나머지들을 거꾸로 이어붙이면 그게 2진수가 됩니다. 예를 들어 43을 2진수로 바꾼다고 하면

```text
43/2 = 21 ○○○ 1
21/2 = 10 ○○○ 1
10/2 = 5 ○○○ 0
5/2 = 2 ○○○ 1
2/2 = 1 ○○○ 0
```

의 과정을 거쳐서 101101<sub>2</sub> 가 됩니다. 이는 10진수를 8진수나 16진수로 변환하려 할 때도 나누는 값이 2에서 8이나 16으로 바뀔 뿐 동일한 방법으로 수행할 수 있습니다.

##### 2진수, 8진수, 16진수 간의 변환

8이 2의 3제곱이고 16은 2의 4제곱이라는 걸 생각하면 2진수, 8진수, 16진수 간의 변환은 좀 더 쉽습니다. 2진수와 8진수간의 변환을 예로 들어보자면 2진수를 8진수로 변환하고자 할 때는 2진수를 3자리씩 끊어서 한자리의 8진수로 만든 후 이어 붙이면 되고 반대로 8진수를 2진수로 변환하고자 할 때는 한자리의 8진수를 세자리의 2진수로 변경하면 됩니다. 같은 방법으로 16진수는 이를 4자리로만 수행해주면 됩니다.

ex)

- 11101<sub>2</sub> -> 011/101 -> 35<sub>8</sub>
- 11101<sub>2</sub> -> 01/1101 -> 1D<sub>16</sub>

#### 정수 표현

원래 정수는 소수점 이하의 값을 갖지 않는 수로서 그 범위는 음의 무한대부터 양의 무한대까지 이지만 컴퓨터에서는 메모리가 허용하는 범위까지만 저장하거나 표현할 수 있습니다. 이로 인해 컴퓨터에서 정수를 표현하는 방법은 부호 없는 정수와 부호 있는 정수를 표현하는 방법으로 나뉩니다.

##### 부호 없는 정수

컴퓨터에서 부호 없는 정수를 표현하는 방법은 간단합니다. 부호를 별도로 표현해 줄 필요가 없기 때문에 예를들어 40이라는 정수가 있다면 이를 이진수인 101000으로 변환해 비트에 담아서 표현해주기만 하면 됩니다. 6자리 이진수이니 8비트로 충분히 가능하겠죠. 그러나 275처럼 이진수로 변환 했을 때 100010011이 되는, 9자리 이진수는 8비트로 담을 수 없고 더 큰 그릇이 필요합니다. 그렇지 않고 8비트에 담으려하면 오버플로가 발생합니다. 간단히 정리하자면 부호 없는 정수의 경우엔 0부터 n비트에 2<sup>n</sup>-1까지의 수를 담을 수 있습니다.

##### 부호 있는 정수

부호 있는 정수를 표현하기 위한 방식으로는 크게 부호화-크기 방식과 1의 보수 방식, 2의 보수 방식이 쓰입니다. 이 방식들은 가장 앞쪽 비트를 부호를 나타내는 비트로 사용한다는 공통점이 있지만 음의 정수를 표현할 때 차이를 보입니다.

- 부호화 크기 방식

부호 비트가 0이면 양수를, 1이면 음수를 나타내는 방식입니다. 앞의 비트 하나를 부호비트로 사용하기 때문에 -2<sup>n-1</sup>-1 까지의 수부터 2<sup>n-1</sup>-1 까지의 수를 나타낼 수 있습니다. 그러나 00000000은 0, 10000000은 -0이 되어 0과 -0이 존재하는 문제가 있습니다.

- 1의 보수 방식

1의 보수 방식에선 음의 정수를 표현하기 위해 이진수로 표현된 양의 정수값의 모든 0을 1로, 모든 1을 0으로 바꿉니다. 예를 들어 -124라는 음의 정수를 표현하기 위해선 124의 이진수 값 01111100 (맨 앞의 0은 부호 비트)을 구한뒤 여기의 모든 0을 1로, 모든 1을 0으로 바꿔 10000011 이라고 구하는 방식입니다. 그러나 이 방식 역시도 00000000은 0이고 11111111은 -0이 되어 0과 -0이 존재하는 문제가 있습니다. 또한 표현 가능 범위도 부호화 크기 방식과 동일하게 -2<sup>n-1</sup>-1 까지의 수부터 2<sup>n-1</sup>-1 까지의 수를 나타낼 수 있습니다.

- 2의 보수 방식

2의 보수 방식은 1의 보수 방식에서 1을 더해주는 방식입니다. 이럴 경우 -0이 존재하지 않게되고 -2<sup>n-1</sup> 까지의 수부터 2<sup>n-1</sup>-1 까지의 수까지 표현할 수 있습니다. 또한 산술 연산도 다른 방식보다 편하게 할 수 있기 때문에 컴퓨터에서 정수를 표현할 때는 이 2의 보수 방식이 사용됩니다.

#### 실수 표현

정수와는 달리 소수점 아래의 수가 존재하는 실수를 컴퓨터로 표현하기 위해선 좀 더 다양한 방법들을 동원해 아래와 같은 단계를 거칩니다.

1. 부호를 부호 비트에 저장합니다.
2. 표현하려는 실수를 정수 부분과 소수점 아래 부분으로 나눠 이진수로 변환합니다.
3. 2<sup>n</sup> 또는 2<sup>-n</sup>을 활용해 소수점을 가장 앞에 있는 1 뒤로 옮깁니다. 이렇게 하면 가장 앞에 있는 수가 1이라는 것과 밑이 2가 되는 것은 고정이 되기에 가수 부분과 지수 부분만 저장하면 되기 때문입니다.
4. 그러나 위와 같은 방법을 취하면 지수가 음수가 될 수 있습니다. 그러면 지수를 저장하는데도 별도의 부호 비트를 할당해야 할까요? 그런 방식을 택하지 않기 위해, 할당된 비트가 n비트라면 2<sup>n-1</sup>-1에 해당하는 매직 넘버를 더해 음수 지수가 존재할 수 없도록 만든 후 이진수로 변환해 지수 비트에 저장합니다.
5. 가수 부분을 가수 비트에 저장하고 남는 부분은 0으로 채웁니다.

- 43.6875라는 숫자를 예시로 이 방식을 구현해 보면 각 단계는 다음과 같습니다.

1. 일단 양수기 때문에 가장 앞 부호 비트에 0을 저장합니다.
2. 43과 0.6875를 각각 이진수로 변환해 101011과 1011로 만들고 소수점을 경계로 101011.1011로 표현합니다.
3. 위 숫자를 정규화 과정을 거쳐 1.010111011 x 2<sup>5</sup>로 만듭니다.
4. 8비트에 지수를 저장한다고 가정하고 127을 더해 132를 만든후 이를 2진수 1000100으로 변화해 지수 비트에 저장합니다.
5. 이후 가수 부분인 010111011을 가수 비트에 저장합니다.

이렇게 하면 최종적으로 0 10000100 010111011000000이 됩니다.

#### 문자 표현

컴퓨터에서 모든 자료는 0과 1의 조합으로 표현되기 때문에 문자를 표현하기 위해선 특정 코드에 문자가 매칭되어 있는 코드 체계가 동원됩니다. 보편적으로 ASCII, 유니코드, EBCDIC등이 사용됩니다.

EBCDIC는 컴퓨터 초기 시대 IBM에서 개발한 8비트 코드 체계입니다. 총 256개 문자 코드를 구성할 수 있으나 실제 사용되는 문자 코드 수는 128개 입니다.현재는 IBM 메인프레임을 제외한 다른 컴퓨터에서는 사용되지 안ㅅ습니다.

ASCII는 미국표준협회에서 개발한 코드로서 7비트를 사용해 총 128개의 서로 다른 문자를 표현할 수 있습니다. 실제 사용될 때는 1바이트에 맞추기 위해 왼쪽에 1비트가 추가된 형태로 사용되며 이를 확장된 ASCII라고 부릅니다.

유니코드는 숫자와 알파벳만 부호화할 수 있는 ASCII의 한계를 극보하기 위해 전 세계 컴퓨터 하드웨어 및 소프트웨어 업체들이 모여서 발표한 코드 체계입니다. 1995년 국제 표준으로 젲어되었고 국제 ISO/IEC 10646과 완전히 호환됩니다. 유니코드에서 지원하는 방식은 UTF-8, UTF-16, UTF-32가 있으며 뒤에 붙은 숫자는 인코딩에 사용되는 단위의 비트 수를 의미합니다. UTF-8에서는 ASCII 코드에 해당되는 문자와 유니코드 문자가 동일한 값을 가지기 때문에 이 형태로 인코딩된 유니코드 문자는 기존 소프트웨어에서도 수정하지 않고 사용 가능합니다.

## 자료구조

### 기본 개념

#### 자료구조의 개념

자료 구조는 자료를 추상화하고 논리적 관계를 구조화 한 것 입니다. 자료구조는 프로그래밍 언어에서 제공하는 '미리 정의된 자료구조'와 개발자가 정의하여 사용하는 '사용자 정의 자료구조'로 구분됩니다. '미리 정의된 자료구조'는 정수, 실수, 문자 등과 같은 기본 자료 구조와 여기서 파생된 배열, 구조체, 포인터 등과 같은 파생된 자료 구조로 구성되고 '사용자 정의 자료구조'는 리스트, 스택, 큐, 트리, 그래프 등이 있습니다.

### 배열

#### 배열의 개념

배열은 동일한 자료형을 가진 여러개의 데이터를 동일한 변수 이름의 방에 일렬로 저장하는 자료의 집합체를 의미합니다. 이 때 이 방에 저장된 각각의 자료는 '원소' 또는 '요소' 라고 하고 이 방에 접근하기 위한 방번호는 '인덱스' 또는 '첨자' 라고 합니다. 이 인덱스는 주로 0부터 시작합니다.

#### 1차원 배열

1차원 배열은 원소들이 1열로만 정렬된 말그대로 1차원인 가장 간단한 형태의 배열입니다.

![1-dimensional-array](../../assets/foundation/univ-cs/1-dimensional-array.PNG)

배열의 원소들은 컴퓨터 메모리 상에서도 연속적인 기억장소에 순차적으로 할당됩니다. 따라서 0번째 원소가 저장된 메모리 시작 주소를 a라 하고 원소의 크기를 k라 하면 i번째 원소가 저장된 위치는 a+k\*i로 구할 수 있습니다.

![1-dimensional-array-in-memory](../../assets/foundation/univ-cs/1-dimensional-array.-in-memory.png)

#### 2차원 배열

2차원 배열은 동일한 크기의 1차원 배열을 여러개 모아놓은 형태의 배열입니다. 2차원 배열은 가로인 행과 세로인 열이 존재하기 때문에 자료에 접근 하기 위해 두개의 인덱스를 사용해야 합니다.

![2-dimensional-array](../../assets/foundation/univ-cs/2-dimensional-array.PNG)

그러나 메모리에 저장될 때는 1차원 배열과 마찬가지로 메모리에 순차적으로 저장됩니다. 이 때 같은 행에 있는 데이터가 다 저장된 후 다음 열의 같은 행에 있는 데이터가 저장되는 형태의 배열을 행우선 순서 배열이라고 하고 같은 열에 있는 데이터가 다 저장된 후 다음 행의 같은 열에 있는 데이터가 저장되는 형태의 배열을 열우선 순서 배열이라고 합니다. 이 둘은 프로그래밍 언어에 따라 다르게 결정됩니다.

![2-dimensional-array-in-memory](../../assets/foundation/univ-cs/2-dimensional-array-in-memory.PNG)

#### 희소행렬

2차원 배열은 그 구조 때문에 행렬을 저장하기 수월합니다. 그러나 특정값이 과반이 넘는 희소 행렬을 그 형태 그대로 2차원 배열로 저장하려면 메모리의 낭비가 너무 심하기 때문에 이럴 경우엔 다른 형태로 저장합니다.

각각 행, 열, 값을 나타낼 3개의 열과 값의 갯수 만큼의 행을 가지고 있는 배열을 선언해 첫 행엔 총 행,열, 그리고 다른 값을 가진 원소의 개수를 저장하고 그 다음 행부터는 다른 값을 가진 원소의 행 좌표 값과 열 좌표 값, 그리고 원소값 그 자체를 저장하는 방식을 택하는데 이럴 경우 메모리 낭비를 막을 수 있습니다.

### 리스트

#### 선형 리스트

선형 리스트 또는 순서 리스트는 1개 이상의 원소가 순서를 가지고 구성되는 자료 구조입니다. 예를 들어 (월, 화, 수, 목, 금, 토, 일) 은 요일 리스트고 (빨, 주, 노, 초 ,파, 남, 보) 는 색깔 리스트 입니다. 이런 선형 리스트에는 삽입, 삭제, 검색, 정렬 , 호출, 갱신 등의 연산이 적용될 수 있습니다.

#### 선형 리스트의 구현

선형 리스트를 구현하는 가장 간단한 방법은 1차원 배열을 활용하는 것입니다. 그러나 이는 삽입, 삭제시 원소 전체를 앞 뒤로 옮겨야 하는 상황이 발생하는 등 메모리가 비효율적으로 낭비될 수 있기 때문에 실제로 사용되지 않습니다.

그렇기 때문에 선형 리스트의 구현에 주로 쓰이는 방법은 포인터 변수를 활용하는 연결리스트를 활용하는 것 입니다. 원소를 담는 데이터 필드와 다음 노드의 주소를 담는 링크 필드로 구성된 노드들을 활용하는 것인데 이 방식은 추가 노드 삽입/삭제 시에 원소의 위치를 변경할 필요 없이 링크 필드의 주소 값만 변경하면 되기 때문에 불필요한 메모리 낭비를 막을 수 있습니다.

연결리스트는 단일 연결 리스트와 다중 연결리스트로 나눌 수 있는데 단일 연결 리스트는 바로 뒤의 노드 주소만을 가지고 있어 다음 노드를 찾기엔 수월하지만 바로 앞 노드를 찾기 위해선 이 리스트의 첫 노드 주소를 가지고 있는 head부터 다시 검색해 나가야 하는 단점이 있지만 다중 연결 리스트에는 선행 노드의 주소도 저장할 수 있는 링크 필드도 있어 선행 노드에 대한 접근도 용이합니다.

![linked-list](../../assets/foundation/univ-cs/linked-list.jpeg)

### 스택과 큐

#### 스택

스택은 삽입과 삭제가 한쪽 끝에서만 이루어지는 자료 구조를 의미합니다. 그 때문에 마지막으로 들어온 자료가 가장 먼저 삭제되는 LIFO (Last in first out, 후입선출)의 특성을 가집니다. 삽입 연산은 Push, 삭제 연산은 Pop이라고 하며 삽입과 삭제가 일어나는 부분을 top이라는 변수가 가리키고 있습니다.

![stack](../../assets/foundation/univ-cs/stack.png)

#### 큐

큐는 삽입은 한쪽 끝에서만 삭제는 반대쪽 끝에서만 이루어지는 자료 구조를 의미합니다. 그 때문에 먼저 들어온 자료가 먼저 삭제되는 FIFO (First in first out, 선입선출)의 특성일 가집니다. 삭제가 이루어질 부분은 front 변수가 삽입이 이루어질 부분은 rear 변수가 가르키는데 rear 변수는 마지막으로 삽입된 데이터 부분을 가르키지만 front 변수는 마지막으로 삭제된 데이터의 앞 부분을 가르킵니다. 이는 큐의 마지막 데이터를 삭제해서 빈 큐가 되었을 때 front와 rear의 값이 같아지게 하기 위함입니다.

![queue](../../assets/foundation/univ-cs/queue.png)

### 트리

#### 트리의 개념

트리는 기업의 조직도처럼 계층적인 관계성을 나타낼 때 사용하는 비선형 자료구조입니다. 트리는 노드와 노드를 연결하는 간선으로 구성됩니다. 트리의 가장 위에 있는 노드를 루트(root) 노드라고 하고 가장 끝에 있는 노드, 노드에 연결된 간선의 개수를 차수(degree)라고 하는데 차수가 0인 노드를 잎(Leaf) 노드라고 합니다. 루트 노드와 잎 노드를 제외한 노드는 모두 내부(internal) 노드라고 합니다.

노드 간의 관계는 부모, 자식, 형제, 조상, 자손 등 가족을 지칭하는 단어로 나타냅니다. 바로 위 노드는 부모(parent) 노드라고 하고 반대로 바로 아래 노드는 자식 (child) 노드라고 합니다. 같은 부모 노드를 갖는 노드는 형제 (sibling) 노드 라고 부르고 루트 노드로부터 어떤 노드 X까지의 경로에 있는 모든 노드는 X의 조상(ancestor) 노드, 어떤 노드 X부터 잎 노드 까지의 경로에 있는 모든 노드는 자손(descendant) 노드라고 합니다.

루트 노드로부터의 거리를 의미하는 레벨(level)이란 개념도 있는데 루트 노드로부터 루트 노드까지의 거리는 0이라 0부터 시작하기 떄문에 트리의 깊이 또는 높이는 루트 노드로부터가장 긴 경로에 있는 단말 노드의 레벨에 1의 값을 더한 것 입니다.

마지막으로 특정 노드를 루트 노드로 하여 아래에 있는 연결된 구조는 서브트리라고 하고 n개의 서비트리를 가진 트리에서 루트 노드를 제거해서 얻을 수 있는 분리된 서브트리의 집합을 숲이라고 합니다.

![tree](../../assets/foundation/univ-cs/tree.jpeg)

#### 이진 트리

이진 트리는 모든 노드의 차수가 최대 2를 넘지 않는 트리를 의미합니다. 이러한 특성 때문에 이진 트리는 노드의 개수만 알면 최대 높이와 최소 높이를 구할 수 있는데 노드의 개수가 N이라면 경사 이진 트리 형태로 쭉 뻗어나가는 경우가 최대 높이를 가지는 경우가 되어 최대 높이는 N이 되고 모든 노드의 차수가 2인 경우가 최소 높이를 가지는 경우가 되어 log<sub>2</sub>N + 1이 최소 높이가 됩니다.

이진트리의 주요 연산은 삽입, 삭제, 순회가 있는데 그 중 순회 연산은 일정한 순서에 따라 트리에 있는 각 노드를 한번씩 방문하는 것 입니다. 순회의 방법은 루트 노드를 어느 시점에 방문하느냐에 따라 크게 세가지로 나눌 수 있는데 가장 먼저 루트 노드를 방문하는 전위(preorder) 순회와 왼쪽 서브트리와 오른쪽 서브트리 방문 사이에 루트 노드를 방문하면 중위(inorder) 순회, 좌우의 서브트리를 모두 방문한 다음 루트 노드를 방문하는 후위(postorder) 순회로 나눌 수 있습니다.

#### 특수한 조건을 갖는 이진 트리

포화 이진트리(full binary tree), 완전 이진트리(complete binary tree), 경사 이진트리(skewed binary tree)는 특수한 조건을 갖는 이진트리입니다.

먼저 포화 이진트리는 가질 수 있는 최대 갯수만큼의 노드를 가진 이진 트리를 말합니다. 이진 트리의 깊이를 k라고 하면 가질 수 있는 최대 노드 갯수는 2<sup>k</sup>-1인데 포화 이진 트리는 그만큼의 노드를 가지고 있는 이진 트리입니다. 따라서 모든 레벨에서 빈 자리가 없이 노드를 가득 가지고 있습니다.

![full-binary-tree](../../assets/foundation/univ-cs/full-binary-tree.png)

완전 이진트리는 최대 레벨이 K일때 레벨 K-1까지는 포화이진 트리를 형성하고 마지막 레벨 k에서는 왼쪽에서부터 오른쪽으로, 노드가 순서대로 채워진 트리입니다. 즉 포화 이진 트리는 완전 이진 트리 이기도 합니다.

경사 이진트리는 한쪽 방향으로만 가지가 뻗어 나간 이진 트리를 말합니다.

![skewed-complete-binary-tree](../../assets/foundation/univ-cs/skewed-complete-binary-tree.jpg)

### 그래프

#### 그래프의 개념과 용어

그래프는 정점(vertex)과 정점들을 잇는 간선(edge)으로 이루어진 자료구조 입니다. 그래프는 간선이 방향성을 가지는 방향 그래프(directed graph, digraph)와 간선이 방향성을 가지지 않는 무방향 그래프 (undirected graph) 로 나눌 수 있습니다.

![graph](../../assets/foundation/univ-cs/graph.png)

그래프에서 두 정점이 하나의 간선으로 연결되어 있으면 인접(adjacent)해 있다고 하고, 해당 간선은 두 정점에 부수(incident)되었다고 합니다. 즉 인접하다는 정점과 정점간의 관계를 나타내는 표현이고 부수되었다는 정점과 간선간의 관계를 나타내는 표현입니다.

두 정점이 서로 연결되어 있다면 두 정점 사이에 경로(Path)가 존재한다는 것입니다. 이 경로는 정점들의 순차적 나열로 표현합니다. 또한 경로는 구분이 가능한데 경로상에 존재하는 정점들이 모두 다르면 단순 경로, 세개 이상의 정점을 가진 경로 중에서 시작 정점과 끝 정점이 같은 경로를 사이클, 시작 정점과 끝 정점을 제외하고 모든 정점이 다른 사이클을 단순 사이클이라고 합니다.

방향 그래프에서 그래프의 모든 정점들이 어떤 경로를 통해서든 모두 연결되어 있으면 '강하게 연결되었다'고 하고 그렇지 않은 경우 '약하게 연결되었다'고 합니다. 무방향 그래프에서 한 정점의 차수는 정점에 부수된 가수의 개수이고 방향 그래프에선 방향에 따라 진입차수와 진출차수로 나눕니다.

사실 트리는 그래프의 특수한 형태로 볼 수 있습니다. 무방향 그래프로서 모든 정점이 서로 연결되어 있으면서 사이클이 존재하지 않는 그래프가 트리입니다.

#### 그래프의 표현

그래프를 컴퓨터 프로그래밍 언어로 구현하기 위해서는 인접행렬(adjacency matrix)이나 인접 리스트(adjacency list)를 이용합니다.

인접 행렬을 이용하는 방법은 n개의 정점을 가지고 있는 그래프를 표현하려 한다면 n \* n 크기의 2차원 배열 A[n][n]을 생성하고 정점 i에서 정점 j로 가는 간선이 존재한다면 A[i][j]의 값을 1로 저장해 그래프를 구현하는 것 입니다.

인접 리스트를 이용하는 방법은 정점 n개만큼의 연결 리스트를 만들고 각 정점에서 인접한 정점들의 번호를 연결 리스트에 이어붙여 그래프를 구현하는 것입니다.

#### 그래프의 탐색

그래프의 모든 정점을 체계적으로 방문하는 것을 그래프의 탐색이라고 하는데 이 탐색 방법에는 깊이 우선 탐색 (depth first search)과 너비 우선 탐색(breadth first search)가 있습니다.

깊이 우선 탐색은 기준이 되는 노드에서 아직 방문하지 않은 인접한 정점이 있다면 그 정점을 방문하고 그 노드를 기준으로 다시 아직 방문하지 않은 인접한 정점을 찾아 방문하는 방식이고 너비 우선 탐색은 기준이 되는 노드에서 아직 방문하지 않은 인접한 정점을 일단 모두 방문하고 그 이후 기준이 되는 노드를 옮겨 다시 인접한 정점을 모두 방문하는 방식입니다.

## 알고리즘

### 알고리즘의 기본 개념

알고리즘(algorithm)이란 주어진 주어진 문제를 해결하기 위한 단계적인 풀이 과정의 모임을 의미합니다.

#### 알고리즘의 정의와 요건

알고르짐은 다음 조건을 만족해야 합니다

- 입출력 : 0개 이상의 외부 입력과 하나 이상의 출력이 있어야 합니다.
- 명확성 : 각 명령은 모호하지 않고 단순 명확해야 합니다.
- 유한성 : 한정된 수의 단계를 거친 후에는 반드시 종료되어야 합니다.
- 유효성 : 모든 명령들은 실행 가능한 것이어야 합니다.

이외에도 실용적인 관점에서 보면 효율성도 충족되어야 하는 알고리즘의 조건 중 하나입니다

#### 알고리즘 생성 단계

알고리즘을 생성하기 위해서는

1. 알고리즘을 설계하고
2. 설계한 알고리즘을 적절한 방법으로 표현하고
3. 알고리즘의 정확성을 검증하고
4. 알고리즘의 효율을 분석하는

과정을 거치게 됩니다.

#### 자료구조와 알고리즘의 관계

자료구조와 알고리즘은 밀접한 상호 관계를 가지고 있습니다. 어떤 자료구조를 기반으로 자료가 표현되느냐에 따라 이들 자료를 처리하고 조작하는 방법이 달라질 수 있고 어떤 처리 방법을 사용하느냐에 따라 적합한 자료 표현 방법이 달라질 수 있습니다.

### 알고리즘의 설계

우리가 풀어야 하는 문제와 그 문제의 제반조건은 매우 다양하기 때문에 모든 문제에 적용할 수 있는 알고리즘 설계 기법은 존재하지 않습니다. 다만 비교적 단순하고 많은 부류의 문제에 사용 가능한 기법으로 분할 정복 (divide and conquer) 방법, 동적 프로그래밍 (dynamic programming) 방법, 욕싱쟁이(greedy) 방법이 있습니다.

#### 분할정복 방법

분할 정복 방법은 주어진 문제를 더 이상 나눌 수 없을 때 까지 작은 문제로 나누는 분할 과정과 이렇게 나누어진 문제들을 각가 해결하는 정복 과정, 이후 이들의 해를 결합하여 원래 문제의 해를 구하는 결합 과정을 거치는 알고리즘의 설계 방법입니다. 이진 탐색, 퀵 정렬, 합병 정렬 등이 분할 정복 방법을 적용한 알고리즘 입니다.

#### 동적 프로그래밍 방법

동적 프로그래밍 방법은 최소치 또는 최대치를 구하는 최적화 문제의 해를 구하기 위해 사용됩니다. 주어진 문제를 여러개의 부분 문제로 분할하고, 가장 작은 부분 문제부터 해를 구한 후 이를 이용하여 원래의 문제를 점진적으로 해결해 나가는 접근 방법입니다. 모든 정점 쌍의 최단 경로를 구하는 플로이드 알고리즘이 동적 프로그래밍을 적용한 알고리즘 입니다.

#### 욕심쟁이 방법

욕심쟁이 방법 역시 최소치 또는 최대치를 구하는 최적하 문제의 해를 구하기 위해 사용됩니다. 이는 일련의 선택 과정을 통해 해를 찾게 될 때 전후 단계의 선택과는 상관없이 각 과정마다 최적해를 선택해 나가면 결과적으로 전체적인 최적해를 얻을 수 있을 거라고 희망하는 방법입니다.희망이라는 표현에서 알 수 있듯 욕심쟁이 방법으로 전체적인 최적해를 얻지 못할 수도 있으므로 적용 범위는 제한적입니다.

### 알고리즘의 분석 및 성능 표현

알고리즘의 설계를 마친 후에는 정확성과 효율성을 분석해야 합니다.

#### 정확성 분석

정확성 분석을 위해서는 다양한 수학적 기법을 활용한 증명이 필요하지만 현실적인 어려움 때문에 다양한 상황을 가정한 테스트 데이터의 집합을 통해 알고리즘의 문제점을 찾고 수정해 나가며 정확성을 분석합니다

#### 효율성 분석

알고리즘의 효율성은 해당 알고리즘을 수행하기 위해 필요한 메모리 양을 의미하는 공간복잡도와 수행 시간을 의미하는 시간 복잡도를 따지는 것으로 판답합니다.

##### 공간 복잡도

공간 복잡도는 컴파일 과정에서 결정되는 고정 공간과 동적 할당이나 함수 호출 등과 같이 실행 시간에 동적으로 결정되는 가변 공간으로 이루어집니다. 이 때 고정 공간은 상수이므로 복잡도는 주로 가변 공간에 의해 좌우됩니다.

##### 시간 복잡도

#### 점근 성능

### 정렬 알고리즘

#### 선택 정렬

선택 정렬은 주어진 데이터 전체를 뒤져서 가장 작은 값을 선택해 끝으로 옮기고, 다음엔 그 다음으로 작은 값을 선택해 가장 작은 값 옆으로 옮기고를 모든 값이 순서대로 정렬될 때까지 반복하는 정렬 방법입니다. 즉 n개의 원소가 있다면 가장 작은 값부터 두 번째로 큰 값까지 찾아서 옮기는 과정을 총 n-1번 거치며 정렬합니다. 이는 데이터의 양과는 상관없이 언제나 O(n<sup>2</sup>) 의 수행시간을 가집니다.

#### 버블 정렬

버블 정렬은 주어진 리스트의 왼쪽부터 모든 인접한 두 원소를 차례대로 비교해가며 큰 값을 오른쪽으로 옮기는 방식으로 정렬해나가는 방법입니다. 버블 정렬을 사용할 때는 최선의 경우와 최악의 경우 수행 시간이 달라지는데 리스트가 이미 정렬되어 있어 자리바꿈이 한번도 일어나지 않는 경우엔 한 번의 단계만을 통해서 정렬을 완료할 수 있는 최선의 경우고 이 때는 O(n)의 수행 시간을 가집니다. 그러나 리스트가 내림차순으로 정렬되어 있는 최악의 경우에는 n-1 회의 단계를 거쳐 n(n-1)/2 회의 비교와 자리 바꿈이 발생하기 때문에 O(n<sup>2</sup>) 의 수행시간을 가집니다.

#### 삽입 정렬

삽입 정렬은 데이터를 정렬된 부분과 정렬되지 않은 부분으로 나누고 정렬되지 않은 부분의 값을 정렬된 부분의 오른쪽부터 비교해나가며 (처음엔 가장 왼쪽의 값이 정렬되어 있는 값이라고 가정하고 작업을 수행합니다.) 바른 위치에 삽입해나가는 방식으로 데이터를 정렬하는 방식입니다. 이 방법은 버블 정렬과 마찬가지로 데이터가 내림차순으로 정렬되어 있는 경우가 최악의 경우로 O(n<sup>2</sup>) 의 수행시간을 가지고 이미 데이터가 원하는 대로 정렬되어 있는 최선의 경우엔 O(n)의 수행시간을 가집니다.

#### 퀵 정렬

퀵 정렬은 기준이 되는 값인 피벗을 기준으로 리스트를 피벗보다 작은 값들의 리스트인 왼쪽 서브 리스트와 피벗보다 큰 값들의 리스트인 오른쪽 서브 리스트로 분할해가며 정렬하는 방법입니다. 이 때 분할의 과정은 다음과 같습니다.

피벗을 정하고, 왼쪽에서 오른쪽으로 진행하며 피벗보다 큰 원소를 찾아나가는 변수 L과 오른쪽에서 왼쪽으로 진행하며 피벗보다 작은 값들을 찾아나가는 변수 R이 각각 피벗보다 큰 값과 작은 값을 찾으면 두 값의 위치를 바꿔줍니다. 이후에도 L과 R은 각자의 진행 방향으로 나아가며 위의 작업을 반복하다 L과 R이 만나거나 교차가 발생하면 피벗과 R의 위치를 바꿔줍니다. 이럴 경우 피벗의 왼쪽에는 모두 피벗보다 작은 값이, 피벗의 오른쪽에는 모두 피벗보다 큰 값이 위치하는데 이 과정을 분할이라고 합니다.

이후에는 왼쪽 서브리스트와 오른쪽 서브리스트에서 위에서 진행한 분할 과정을 순환적으로 적용하면 최종적으로는 정렬된 결과를 얻을 수 있습니다. 퀵 정렬의 경우 선택, 버블, 삽입 정렬과는 달리 선택된 피벗이 분할을 거쳤을 때 정중앙에 위치하는 최선의 경우엔 O(n log n)의 수행시간을 가집니다. 그러나 피벗이 리스트에서 항상 가장 큰 값이나 작은 값으로 선택되는 최악의 경우엔 O(n<sup>2</sup>) 의 수행시간을 가집니다.

#### 합병 정렬

퀵 정렬과 비슷하게 데이터를 왼쪽 서브리스트와 오른쪽 서브리스트로 분할해서 정렬을 수행하는 합병 정렬은 최선, 최악, 평균 수행 시간 모두 O(n log n)의 수행 시간을 가지는데 이는 왼쪽 서브리스트와 오른쪽 서브리스트의 크기를 항상 같게 분할하기 때문입니다. 합병 정렬은 리스트를 절반씩 나누어가다 크기가 1이 되어 더 이상 분할할 수 없게 되면 이를 비교하고 정렬된 상태로 합병해 크기가 2인 리스트를 만들고, 그걸 다시 정렬된 상태로 합병해 크기가 4인 리스트를 만들고 하는 방식을 전체 리스트를 정렬할 때까지 수행하는 정렬 방식입니다.

### 탐색 알고리즘

#### 순차 탐색

#### 이진 탐색

#### 이진 탐색 트리

#### 해싱

## 컴퓨터 구조

### 컴퓨터 하드웨어의 기본 구성

### 불 대수와 논리회로

### 조합회로와 순차회로

#### 조합회로

#### 순차회로

### 기억장치

#### ROM

#### RAM

#### 기억장치의 계층구조

### 명령어

#### 명령어 종류

#### 명령어 형식

#### 주소지정방식

### 중앙처리장치

#### 레지스터

#### 처리장치

#### 제어장치

### 입출력장치

#### 입출력 시스템의 기본 구성요소

#### 입출력 제어 방식

#### 입출력장치의 전용

### 병렬처리

#### 파이프라인 처리기

#### 멀티코어 구조

## 운영체제

### 운영체제의 개념

#### 운영체제의 개요

### 운영체제의 주기억장치 관리

#### 기억장치의 구성

##### 기억장치의 계층구조

##### 주기억장치의 할당

#### 가상기억장치

가상기억장치란 주기억장치에서 이용 가능한 영역보다 큰 프로그램을 작은 단위로 쪼개 옮겨 놓은 보조기억장치의 특별한 영역을 말합니다.

이런 가상기억장치를 구현하는 방법으로는 프로그램을 쪼개는 방식에 따라 페이징 기법과 세그멘테이션 기법으로 나뉩니다. 프로그램을 동일한 크기의 블록인 페이지로 나누는 방법을 페이징 기법이라고 하고 동일한 크기가 아닌 하나의 모듈처럼, 하나의 논리적인 단위를 이루고 있는 세그먼트 단위로 나누는 방법을 세그멘테이션 기법이라고 합니다.

이렇게 가상기억장치 (보조기억장치) 에 프로그램을 나누어 저장할 경우 주기억 장치와 보조 기억 장치의 주소 체계가 다르기 때문에 운영체제가, 프로세스가 참조하는 가상주소를 실주소로 변환하는 역할을 담당해주며 이런 과정을 거치며 사용자나 프로세스는 데이터 전체가 주기억장치에 적재되어 실행되는 것처럼 느끼게 됩니다.

##### 페이지 반입 기법

##### 배치 기법

##### 교체 기법

### 프로세서 관리

### 장치 관리와 파일 관리

## 프로그래밍 언어

### 개요

### 프로그래밍 언어의 파싱 트리

### 프로그램에서 실행 가능 코드로의 변환

### 프로그래밍 언어의 기본 공통 개념

#### 대입문

#### 변수형 검사

#### 블록과 변수의 유효범위

#### 부프로그램: 함수와 프로시저

##### 함수 호출과 제어의 이전

##### 함수의 매개변수

##### 함수의 매개변수 전달 방식

함수의 매개변수 전달 방식은 값호출 방식과 참조호출 방식으로 나눌 수 있습니다.

값호출 방식은 호출하는 함수에서 실매개변수로도 값을 넘기고 호출되는 함수에서도 형식 매개변수로 값을 받는 방식입니다. 이런 값호출 방식으로 매개 변수를 넘기는 경우 호출 하는 함수 a에서 실매개변수를 넘기고 이를 함수 b에서 조작해도 이는 형식 매개변수가 변하는 것일 뿐 실매개변수에는 영향을 끼치지 않습니다. 반면 참조호출 방식은 호출하는 함수에서 실매개변수로 값의 주소를 전달하고 호출되는 함수의 형식 매개변수에서도 값의 주소를 전달받는 방식이기 때문에 위와 같이 b 함수에서 매개 변수를 조작할 경우 그 내용이 a에 그대로 반영됩니다. C언어에서 이런 참조 호출 방식으로 매개변수를 전달하고자 할 때는 실매개변수의 변수 이름 앞에 & 연산자를 붙이고, 형식 매개변수의 변수 이름 앞에 \* 연산자를 붙이면 됩니다.

### 변수의 수명

### 객체지향 프로그램을 위한 추상 자료혀

## 데이터베이스

### 데이터베이스 개념

### 데이터베이스 시스템

### 데이터 모델링

### SQL

## 컴퓨터 네트워크

### 컴퓨터 네트워크의 개요 및 발전 역사

### 통신의 기초

### 컴퓨터 네트워크의 구성

#### 컴퓨터 간의 연결 방식

#### 네트워크 간의 연결 방식

### 네트워크 시스템의 계층적 구조

#### OSI 참조 모델

OSI 참조 모델은 국제 표준화 기구(ISO)에서 확립한 것으로 네트워크 프로토콜이 통신하는 구조를 7개의 계층으로 분리하여 각 계층간 상호 작동하는 방식을 정해놓은 모델입니다. 각 계층으로는 위에서부터 응용 계층(application layer), 표현 계층(presentation layer), 세션 계층(session layer), 전송 계층(transport layer), 네트워크 계층(network layer), 데이터 링크 계층(datalink lyaer), 물리 계층(physical layer) 이 있습니다. 이들은 모두 독립되어 있어 7단계 중 특정한 곳에 이상이 생기면 다른 단계의 장비 및 소프트웨어를 건드리지 않고도 이상이 생긴 단계만 고칠 수 있습니다. 데이터를 보낼 때는 상위 계층으로부터 하위 계층으로 내려가는 과정을 거치고, 데이터를 받을 때는 하위 계층으로부터 상위 계층으로 올라가는 과정을 거칩니다.

응용 계층(application layer) 은 사용자와 가장 가까운 최상위 계층으로서 사용자 인터페이스를 제공하며 웹에서 사용하는 HTTP나 파일 전송을 위한 FTP, 이메일 전송을 위한 SMTP 등과 같은 응용 프로토콜의 기능을 지원하여 사용자가 네트워크를 이용할 수 있게 해주는 역할을 담당합니다. 이 계층에서 사용되는 대표적인 프로토콜로는 HTTP, SMTP, FTP 등이 있습니다.

표현 계층(presentation layer) 은 응용 계층에서 전달받은 데이터들을 다른 시스템을 가진 컴퓨터의 응용 계층에서도 정확히 읽을 수 있도록 데이터의 인코딩과 디코딩, 암호화와 복호화, 압축과 압축해제 작업을 담당하는 계층입니다. 이 계층에서 사용되는 대표적인 프로토콜로는 ASCII 가 있습니다.

세션 계층(session layer) 은 세션을 통해 통신 컴퓨터 간 연결의 접속과 차단, 방향을 관리합니다. 즉 통신 대상자의 접속을 제한 혹은 허용할지를 정하고, 허용한다면 통신 방향은 양방향으로 할지, 단방향으로 할지 등을 결정하는 계층입니다. 이 계층에서 사용되는 대표적인 프로토콜로는 SSH 가 있습니다.

전송 계층(transport layer) 은 데이터를 보내는 쪽일 때는 효율적인 데이터 전송을 위해 데이터를 패킷(packet) 단위로 나눠주는 역할을, 받는 쪽일 때는 패킷들을 원래의 파일로 재결합하는 역할을 담당합니다. 또한 오류나 중복을 검사하여 컴퓨터 간에 신뢰성 있는 데이터 통신이 이루어 질 수 있도록 해주는 계층입니다. 이 계층에서 사용되는 대표적인 프로토콜로는 TCP, UDP 등이 있습니다.

네트워크 계층(network layer) 은 라우팅을 담당합니다. 라우팅이란 송신 컴퓨터에서 수신 컴퓨터로 데이터를 보낼 최적의 경로를 찾는 과정을 말합니다. 즉 전송 계층에서 패킷으로 나눠진 데이터를 최대한 빠르게 수신 컴퓨터로 보낼 방법을 찾고 결정하는 역할을 담당하는 계층입니다. 이 계층에서 사용되는 대표적인 프로토콜로는 IP, ARP 등이 있습니다.

데이터 링크 계층(datalink layer) 은 직접 연결된 물리적인 네트워크를 통해 데이터를 전송하는 수단을 제공하는 계층입니다. 이 계층의 주 목적은 물리적인 장치를 식별하는 데 사용할 수 있는 주소 지정 체계를 제공하는 것입니다. 이 계층에서 사용되는 대표적인 프로토콜로는 MAC, ethernet, wifi 등이 있습니다.

물리 계층(physical layer) 은 디지털 신호와 아날로그 신호간의 변환이 이루어져 데이터가 0과 1로 이루어진 비트 단위로 전송되거나 반대로 수신되는 계층입니다. 이 계층은 네트워크 카드들이 사용하는 케이블의 종류, 데이터 송수신속도, 신호의 전기전압, 허브, 네트워크 어댑터, 중계기 등 네트워크 통신을 위한 모든 물리적, 전기적인 특성과 표준을 정의합니다.

#### TCP/IP

### 인터넷

#### 데이터 계층 프로토콜

#### 네트워크 계층 프로토콜

#### 전송 계층 프로토콜: TCP

#### 응용 계층 프로토콜

#### 도메인 이름 시스템
