---
title: "운영체제 - "
date: "2020-08-10"
category: "foundation"
draft: true
---

## 개요

컴퓨터는 CPU, 메모리, 저장장치, 입출력장치, 네트워크장치등의 하드웨어로 구성된다. 그러나 유저가 실제로 사용하는 건 웹 브라우저나 문서 편집 프로그램등의 응용 소프트웨어다.

이 응용 소프트웨어와 하드웨어 사이에 위치해서 하드웨어를 제어하고 운영체제다

시스템 소프트웨어나 시스템 소프트웨어 등의 소프트웨어다.

즉 운영체제는 컴퓨터의 하드웨어 자원을 관리하고 컴퓨터 그로그램이 동작하기 위한 서비스를 제공하는 시스템 소프트웨어를 말한다.

## 운영체제의 역할

- 컴퓨터의 자원을 효율적으로 제어 및 관리
- 응용프로그램들의 실행을 도움

- 사용자의 명령을 해석하여 실행
- 사용자와 하드웨어 사이의 매개체 역할 수행

## 운영체제가 없던 시절

운영체제가 없던 시절엔 응용 프로그램이 하드웨어를 직접 제어했어야 했다. 그렇기 때문에 응용 프로그램 개발자는 하드웨어 제어 방법을 잘 알아야 했고 여러 응용 프로그램이 하드웨어를 공유하는 경우엔 자원 분할이 어려웠다.

## CPU의 동작 모드

- 슈퍼바이저 모드 (커널 모드) : 운영체제의 커널이 동작되는 모드. 하드웨어를 직접 제어할 수 있는 CPU 명령어 사용 가능

- 보호 모드 (사용자 모드) : 응용 프로그램이 동작되는 모드. 하드웨어를 직접 제어할 수 있는 CPU 명령어 사용 불가능

운영체제에 따라 여러 모드가 추가적으로 있을 수 있지만 대표적으로 크게 이 두가지 모드로 구분 가능하다.

보호 모드에서 응용 프로그램이 '시스템 호출'을 통해 운영체제에게 서비스를 요청하면 슈퍼바이저 모드로 변환되고 커널이 동작된다.

## 커널

운영 체제의 핵심요소
