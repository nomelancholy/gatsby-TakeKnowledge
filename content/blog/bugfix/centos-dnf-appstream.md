---
title: 'Cent OS8 - Errors during downloading metadata for repository 'AppStream'
date: 2020-08-12 17:00:00
category: 'bugfix'
draft: true
---

## 버그 발생 상황

Cent OS 8 터미널에서 한글 입력을 하기 위해

```bash
dnf install ibus-hangul
```

명령어를 입력해 dnf 에서 ibus-hangul을 설치하려고 하자

![dnf-appstream-error](../../assets/bugfix/centos-dnf-appstream/dnf-appstream.PNG)

위와 같은 에러가 발생했습니다.

## 원인 확인 및 해결

검색해보니 굉장히 민망한 이유때문에 발생한 에러였습니다.

인터넷 연결

![complete-dnf-appstream-error](../../assets/bugfix/centos-dnf-appstream/complete-dnf-appstream.PNG)

## 참조

[CentOS 8.1 설치할 때 주의사항(VirtualBox에서 설치할 때 포함) - 인터넷 연결 설정, 부팅 시 오류 메시지](https://wnw1005.tistory.com/353)
