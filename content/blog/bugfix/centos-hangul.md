---
title: 'Cent OS8 - Errors during downloading metadata for repository 'AppStream'
date: '2020-10-12 17:00:00'
category: 'bugfix'
draft: true
---

## 버그 발생 상황

Cent OS 8 터미널에서 한글 입력을 하려고 한영키를 눌러봐도 한글이 입력되지 않더군요

## 해결

````ps
### 사용자 추가

- root 계정으로 이동 : su -
- 사용자 추가 : useradd 사용자계정

### Cent OS 8 한글 입력

```terminal
dnf install ibus-hangul
```

1. 위 명령어를 입력해 ibus-hangul을 다운받고
2. 재부팅 후
3. `설정 -> 지역 및 언어 -> 입력 소스 -> + 클릭 -> ... 클릭 -> korea 검색 -> 한국어 클릭 -> 한국어 (Hangul) 클릭` 해 추가

### 사용자 변경

- 사용자 정보 변경: usermod [option] 사용자계정
- test라는 사용자 계정의 코멘트를 '테스트'로 변경하는 예

```terminal
usermod -c "테스트" test
```
````
