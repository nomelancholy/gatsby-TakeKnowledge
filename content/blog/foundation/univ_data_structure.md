---
title: "자료구조 - "
date: "2020-09-20"
category: "foundation"
draft: true
---

## 자료구조란 무엇인가

### 자료와 정보의 관계

자료와 정보는 쌀과 밥의 관계라고 할 수 있습니다. 수집, 측정, 관찰 등을 통해 수집한 자료를 사용자에게 좀 더 적합한 형태로 처리하면 정보가 됩니다.

### 추상화의 개념

추상화란 다양한 특성을 가지고 있어 세세하게는 다를 수 있는 서로 다른 객체들을 그것들이 공통적으로 가지고 있는 특정 개념을 이용하여 같은 종류의 묶음으로 정의하는 것 입니다. 예를 들자면 외관상으로는 다른 부분이 있더라도 여러 명의 사람들을 실어나르는 큰 차들을 모두 버스라고 부르는 것도 추상화가 이루어졌기에 가능한 일입니다.

### 자료구조의 개념

이런 추상화는 객체라면 어디에든 적용할 수 있고 자료 역시 추상화할 수 있습니다. 자료구조는 이렇게 자료를 추상화하여 그 논리적 관계를 구체화 한 것을 말합니다. 이런 자료구조는 프로그래밍 언어에서 제공하는 '미리 정의된 자료구조'와 개발자가 정의하여 사용하는 '사용자 정의 자료 구조'로 나눌 수 있고 '미리 정의된 자료구조'는 다시 '기본 자료구조'와 '파생된 자료구조'로 나눌 수 있습니다. 기본 자료구조로는 정수, 실수, 문자 등이 있고 파생된 자료구조로는 구조체, 배열, 포인터등이 있으며 사용자 정의 자료 구조로는 스택, 큐, 리스트, 트리, 그래프 등이 있습니다.

### 자료구조와 알고리즘의 관계 및 알고리즘의 특성

### 알고리즘 성능의 분석과 측정

#### 알고리즘 실행 시간의 예측

#### 실행 메모리의 예측

#### 실행 시간의 측정

## 배열

### 배열의 정의

### 배열 추상 자료형

### 배열의 연산의 구현

### 1차원 배열

### 배열의 확장

### 희소행렬의 개념

## 스택

### 스택의 개념

스택은 위쪽 한 방향으로만 물건을 넣고 뺄 수 있는 박스와 같은 형태의 자료 구조입니다. 그렇기 때문에 데이터가 넣은 순서대로 쌓이고 뺄 때도 나중에 넣은 걸 먼저 빼야 합니다. 이런 특성을 LIFO (Last in first out, 후입선출) 라고 합니다. 스택에서 대표적으로 사용되는 연산은 스택에 데이터를 넣는 push와 스택에서 데이터를 삭제하는 pop, 그리고 스택이 가득 찼는지를 확인하는 isFull 이 있습니다. 스택에는 top이라는 포인터 변수가 있어 가장 나중에 들어온 데이터 부분을 가리키고 있는데 (스택이 비어있을 때는 스택의 가장 아래 부분을 가리키고 있습니다.) push 명령이 발생하면 top 포인터 변수가 가리키고 있는 곳 하나 위쪽 부분에 데이터를 넣은 다음 포인터 변수를 1 증가시키고 반대로 pop 연산이 발생하면 top 포인터 변수가 가리키고 있는 부분의 데이터를 삭제하고 포인터 변수를 1 감소 시킵니다. 스택의 저장공간은 유한한데 (스택의 사이즈는 스택 생성시 정할 수 있습니다) 스택이 가득 차있는 경우에 push 명령이 발생하면 스택이 가득 찼다는 메시지를 출력되고 데이터의 추가 삽입이 이루어지지 않습니다. 이렇게 스택이 가득 차 있는지를 확인할 수 있는 연산인 isFull 이고 스택이 가득 차 있다면 True 값을, 가득 차 있지 않다면 False 값을 반환합니다. 스택을 구현하는 여러 가지 방법들이 있지만 대표적으로는 배열을 활용해 구현할 수 있습니다. 이렇게 구현한 스택은 LIFO의 특성을 활용해 변수에 대한 메모리의 할당과 수집을 위한 시스템 스택, 서브루틴의 수행이 끝난 후 되돌아갈 함수 주소를 저장하기 위한 서브루틴 호출 관리, 연산자들 간의 우선순위에 의해 계산 순서가 결정되는 수식 계산, 프로그램 수행 도중 발생되는 인터럽트 처리와 되돌아갈 명령 수행 지점 저장 등에 사용됩니다.

### 스택의 추상 자료형

### 스택의 응용

- 서브루틴 함수 호출 관리

프로그램이 메인 함수 하나만으로 구성되는 경우는 드뭅니다. 여러 개의 서브루틴 함수로 나뉘어서 이를 필요할 때마다 호출해가며 프로그램을 진행되는 경우가 대부분입니다. 이런 서브루틴 함수 호출 관리를 위해 스택이 사용됩니다. 방법은 아래와 같습니다.

예를 들어 메인 함수 진행중에 A 함수를 호출한다면 메인 함수가 호출될 때 push된 스택의 메인 함수 부분에 A 함수 호출이 끝나고 이어서 진행해야 할 부분의 위치를 저장합니다. 이는 A함수의 내용을 순차적으로 실행해가다가 B 함수를 호출한다해도 마찬가지 입니다. A함수가 호출될 때 스택의 메인 함수 위로 push되어 생성된 A함수 영역에 B함수의 호출이 끝나면 실행되어야 하는 부분의 위치를 저장 합니다. 이렇게 하면 호출한 함수가 동작을 모두 마쳤을 때 스택에 저장한 위치부터 이어서 동작을 실행하면 되고 스택의 특성상 나중에 생긴 영역이 실행되고 삭제되는 것은 보장되기 때문에 순서를 관리하는 측면에서 봐도 효율적으로 서브루틴 함수 호출 관리를 할 수 있습니다.

### 스택의 연산

#### 스택의 삭제 연산

#### 스택의 삽입 연산

### 배열을 이용한 스택의 구현

#### 스택의 삭제 연산

#### 스택의 삽입 연산

### 사칙연산식의 전위/후위/중위 표현

#### 전위 표기법

#### 후위 표기법

#### 스택을 이용한 후위 표기식의 계산

#### 후위 표기식의 계산 알고리즘과 설명

## 큐

### 큐의 개념

큐는 양 옆이 뚫려있는 파이프 관 같은 형태의 자료구조입니다. 이 관의 한 쪽에서 삽입이 일어나고 한 쪽에서 삭제가 일어나기 때문에 큐에서는 스택과는 달리 데이터가 들어온 순서대로, 한 쪽에서 넣은 물이 반대쪽으로 나오듯이 나옵니다. 이런 특성을 FIFO (First in first out, 선입선출) 라고 합니다. 큐에서 대표적으로 사용되는 연산은 스택과 비슷합니다. 큐에 데이터를 넣은 add와 큐에서 데이터를 삭제하는 delete, 큐가 가득차 있는 상태인지 확인하는 isFull과 큐가 비어있는 상태인지를 확인하는 isEmpty가 있습니다. 한 쪽에서는 삽입이, 한 쪽에서는 삭제가 일어나는 큐에서는 포인터 변수가 2개 있는데 하나는 삽입에 관여하는 rear고 하나는 삭제에 관여하는 front입니다. 그래서 add 연산이 발생하면 rear 포인터 변수가 가리키는 곳 다음 부분에 데이터가 저장되고 rear 포인터 변수가 1증가하며 delete 연산이 발생하면 front 포인터 변수가 가리키는 곳 다음 부분 데이터가 삭제되며 delete 포인터 변수가 1증가합니다. 이렇게 작동하기 때문에 rear와 front가 같은 장소를 가리키면 큐가 비어있다는 의미가 됩니다. 이럴 경우 isEmpty 명령어가 발생하면 True 값을 리턴하고, 그렇지 않다면 False 값을 반환합니다. isFull은 스택과 마찬가지고 큐가 가득 차 있다면 True 값을, 그렇지 않다면 False 값을 반환합니다. 큐 역시 다양한 방법으로 구현할 수 있는데 메모리의 낭비와 불필요한 연산을 막기 위해 연결 리스트를 활용해 원형 큐 형태로 구현하는 게 가장 효과적입니다. 위에서 설명한 바와 같이 삽입과 삭제 연산시 포인터가 1씩 증가한다면 이미 삽입과 삭제 연산이 일어난 부분의 메모리는 더 이상 활용되지 못하고 낭비되는데 말 그대로 원 형태의 큐는 삽입과 삭제시 그 메모리 원을 돌며 메모리를 사용하기 때문입니다.

### 큐의 추상 자료형

### 큐의 응용

### 배열을 이용한 큐의 구현

#### 큐의 삽입 연산

#### 큐의 삭제 연산

### 원형 큐

## 연결 리스트

### 리스트의 개념

### 배열을 이용한 리스트의 구현

### 포인터를 이용한 리스트의 구현

### 포인터 변수

#### 구조체 포인터 타입

#### 프로그램 싱행 중의 구조체 메모리 할당

### 연결 리스트에서 노드의 삽입과 삭제

### 연결 리스트의 여러 가지 연산 프로그램

#### 연결 리스트의 생성

#### 연결 리스트의 노드 삽입

#### 연결 리스트의 노드 삭제

#### 연결 리스트의 특정 노드 뒤에 삽입

#### 연결 리스트의 특정 노드 검색

## 연결 리스트의 응용

### 연결 리스트의 변형

### 원형 연결 리스트

#### 원형 연결 리스트의 생성

#### 원형 연결 리스트의 노드 삽입

#### 원형 연결 리스트의 노드 삭제

### 이중 연결 리스트

#### 이중 연결 리스트의 노드 구조

#### 이중 연결 리스트의 노드 삽입

#### 이중 연결 리스트의 노드 삭제

## 트리

### 트리

### 용어와 논리적 표현 방법

### 추상 자료형

### 이진 트리

#### 이진 트리 개요

#### 이진 트리 구현

### 이진 트리 연산

#### 이진 트리 순회

#### 이진 트리 생성, 삽입, 삭제

#### 이진 트리 노드 개수 세기

### 일반 트리를 이진 트리로 변환

## 스레드 트리

### 스레드 트리

### 스레드 트리 구현

### 스레드 트리 순회, 삽입, 삭제

#### 스레드 트리 순회

#### 스레드 트리 노드 삽입 및 삭제

## 힙

### 우선 순위 큐

### 힙 추상 자료형

### 힙에서 삭제 및 삽입 연산

## 선택트리, 숲, 이진트리 개수

### 선택트리

### 숲

### 이진 트리 개수

## BS, Splay, AVL, BB

### 이진 탐색 트리 (BS 트리)

#### BS 트리 순회

#### BS 트리 탐색

#### BS 트리 삽입 및 삭제

### Splay, AVL, BB 트리

#### Splay 트리

#### AVL 트리

#### BB 트리

## 멀티웨이 탐색 트리

### m원 탐색 트리

이진 탐색 트리는 다루기 매우 편리한 트리지만 노드의 개수가 많아지면 트리의 높이가 높아지며 탐색에 더 많은 연산이 필요해지는 문제가 있습니다. 그런 문제를 해결하기 위해 이진 탐색 트리의 제한을 따르되 두 개 이상의 자식을 가질 수 있게 이진 탐색 트리를 확장한 m원 탐색 트리가 등장했습니다.

### B 트리

트리의 노드가 m개 이하의 가지를 가질 수 있게 하는 m원 탐색 트리가 등장하며 이진 탐색 트리의 높이를 줄여 최대 탐색 길이를 짧게 하는데는 성공했지만 m원 탐색 트리는 트리의 균형에 대해서는 특별한 제한을 두지 않았습니다. 이를 개선하기 위해 m원 탐색 트리처럼 트리의 높이를 줄이면서 전체적으로 균형을 유지하도록 만든 이진 탐색 트리가 B트리입니다.

B트리가 되기 위해서는 세가지 조건을 충족해야 합니다. 차수가 m이라고 했을 때 루트와 잎노드를 제외한 트리의 각 노드는 최소 ‘m/2’ 개의 서브트리를 가져야 하고 (트리의 각 내부 노드가 최소한 반은 차 있어야 한다는 의미입니다) 트리의 루트는 최소한 2개의 서브트리를 가져야 하며 트리의 모든 잎노드가 같은 레벨에 있어야 합니다.

이런 조건을 갖는 B트리는 동일한 차수를 가지는 이상적인 (모든 노드가 꽉 채워진) m원 탐색 트리보다 탐색 경로 길이는 길 수 있습니다. 그러나 균형이 잡혀있기 때문에 키 값을 삽입하고 삭제할 때 드는 노력은 적게 됩니다.

#### B 트리의 노드 삽입

B 트리에 노드를 삽입하는 과정은 이렇게 일어납니다. 먼저 삽입할 위치를 찾기 위해 노드의 키 값을 좌에서 우로 탐색하다가 들어갈 곳에 빈자리가 있다면 삽입 후 과정을 종료하지만, 만약 그 노드가 꽉 차 있다면 중간 값을 찾아 이것이 부모 노드가 되게 하고 중간 값보다 작은 값은 왼쪽에, 큰 값은 오른 쪽에 위치하도록 노드를 분리합니다. 이런 노드 분리는 부모 노드로 만들기 위해 키 값을 올려준 곳의 노드가 꽉 차 있을 경우엔 그 노드에서도 일어납니다. 즉 연쇄적으로 노드 분리를 해줘야 하는 상황이 발생할 수도 있다는 말입니다.

#### B 트리의 노드 삭제

또한 B트리에서 노드를 삭제할 때도, B트리의 조건을 충족하기 위해 새로운 기준값을 정하고 이를 기준으로 노드를 재배열 하는 과정에서도 발생할 수 있습니다.

### B\* 트리, B+ 트리

#### B\* 트리

노드의 약 2/3 이상이 차야 하고 모든 잎 노드는 동일한 레벨에 놓여야 하는 B*트리는 이렇게 B트리에서 삽입 삭제시 발생하는 노드 분리를 줄이기 위해 고안된 것입니다. 이 B* 트리에 노드를 새로 삽입하려 할때는, 물론 빈자리가 있다면 B트리와 마찬가지로 그냥 삽입하고 종료하지만 그렇지 않은 경우엔 노드를 분리하지 않고 키와 포인터를 재배치하여 다른 형제 노드로 옮기는 방식을 택합니다. 이 때 만약 형제 노드도 가득 차 있다고 하면 꽉 차 있는 노드의 키와 포인터를 분배해 새로운 노드를 만듭니다. 이렇게 되면 꽉 차 있는 노드들을 조정한 것이기 때문에 새로운 노드도 2/3 이상을 채울 수 있고 결과적으로 B*트리의 조건을 충족 시킬 수 있습니다. 이런 특성을 가지고 동작하는 B* 트리는 당연히 B 트리보다 분리 횟수가 적고 동일한 수의 노드를 가질 경우 B트리보다 높이가 낮을 확률이 높고 따라서 탐색 시간이 향상되는 장점을 가집니다.

#### B+ 트리

그러나 이렇게 이진 탐색 트리 계열을 개선해 오면서도 탐색 트리가 갖는 근원적인 불편함은 해결하지 못했습니다. 특정 값을 탐색하는 건 매우 빠르게 할 수 있지만 전체 데이터를 차례로 처리하기엔 매번 노드를 비교하고 다음 노드를 찾아가면서 처리해야 하기 때문에 불편하다는 문제인데 이를 해결 하기 위해 등장한 것인 B+ 트리입니다. B+트리는 모든 키 값이 잎 노드에 존재하고 이 잎 노드들은 각각의 잎 노드가 지닌 마지막 포인터가 다음 키 값은 갖는 노드를 가리키는 방식으로 모두 연결되어 있으며 내부 노드는 이 잎 노드의 키 값을 찾아가기 위한 인덱스처럼 사용되는 트리입니다. 이렇게 구성되기 때문에 전체를 순차 처리 하고자 할 때 굳이 키 값을 비교하는 과정을 거치지 않고도 왼쪽 끝에서부터 차례로 나아가며 전체를 처리할 수 있다는 장점을 가집니다.

### 2-3 트리

#### 2-3 트리의 탐색

#### 2-3 트리의 삽입 및 삭제

### 2-3-4 트리

### 레드 블랙 트리

## 그래프

### 개념 및 용어

### 추상 자료형

### 그래프 표현법

#### 인접 행렬에 의한 그래프 표현

#### 인접 리스트에 의한 그래프 표현

### 그래프 탐색

#### 깊이 우선 탐색

#### 너비 우선 탐색

### 최소 신장 트리

#### 프림 알고리즘

#### 크루스컬 알고리즘

#### 솔린 알고리즘
