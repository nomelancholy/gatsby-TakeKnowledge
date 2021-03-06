---
title: "머신러닝1 수업 내용 정리 "
date: "2020-08-16"
category: "foundation"
draft: false
---

생활코딩의 [머신러닝1](https://opentutorials.org/module/4916) 수업을 듣고 내용을 정리한 포스팅입니다.

## 머신러닝이란

기계 학습이라고도 합니다. 기계를 학습시켜 학습시킨 문제뿐만 아니라 그와 비슷한 문제도 해결할 수 있도록 하는 기술입니다

## 반드시 원리와 수학과 코딩을 알아야 할까

머신러닝은 원리를 이용해서 수학과 코딩으로 만들어지는 것이지만 스마트폰을 사용하기 위해 스마트폰의 제조 방법을 알아야 할 필요는 없듯이 머신 러닝의 사용자가 되기 위해 반드시 머신 러닝의 원리와 수학과 코딩을 알 필요는 없습니다. [Teachable Machine](https://teachablemachine.withgoogle.com/) 등의 사이트를 활용하면 원리를 몰라도, 수학과 코딩 없이도 머신 러닝을 사용해 볼 수 있습니다.

## 모델과 학습

위 사이트에선 기계가 우리가 입력한 데이터를 통해 어떤 판단력을 가지는 과정을 실습해 볼 수 있는데 머신 러닝에선 이런 판단력을 '모델'이라고 합니다. 그리고 이런 모델을 쌓아나가는 과정을 '학습'이라고 합니다. 중요한 건 이 부분입니다. 학습이 잘되어야 더 좋은 모델을 만들 수 있고, 모델이 좋아야 더 좋은 추측을 할 수 있으며 추측이 정확해야 좋은 결정을 할 수 있습니다.

## 머신러닝 응용 가능 분야

머신러닝 1 팀이 제작한 [머신러닝머신](https://ml-app.yah.ac/) 사이트에서 teachablemachine에서 제작한 모델을 바탕으로 애플리케이션을 제작할 수도 있습니다. 이처럼 머신러닝은 응용이 가능한데 적용 가능한 분야는 다양합니다.

인터넷으로 사물을 제어하는 사물 인터넷이나 자유 주행 자동차는 물론이고 본인이 겪고 있는 문제들을 해결할 수도 있을 것입니다. 이 [구글 문서](https://docs.google.com/spreadsheets/d/1mdCb-xRYBAsAOeiC7miyQgcMqVzCpg_67OmfdGRvVAY/edit#gid=1139916340)에선 다른 사람들이 머신 러닝을 활용해 해결하고 싶은 문제들을 적은 목록을 확인할 수 있습니다.

## 데이터

이런 아이디어들을 현실화하기 위해선 데이터가 필요합니다. 데이터 자체는 현실이 아니지만, 현실을 관심사만 뽑아서 단순한 데이터로 표현할 수만 있다면 컴퓨터의 힘으로 데이터를 처리할 수 있게 되니까요. 이 때 유용하게 사용할 수 있는 것이 바로 '표'입니다.

표는 가로인 행과 세로인 열로 이루어져 있습니다. 행은 개체, 관측치, 기록, 사례, 경우와 같은 단어로도 표현하고, 열은 특성, 속성, 변수 등의 단어로도 표현합니다.

특성(열)간엔 서로 상관이 있을 수도 있습니다. 한 쪽 값이 바뀌었을 때 다른 쪽 값도 바뀐다면 두 개읜 특성은 서로 관련이 있다고 추측할 수 있습니다. 이런 관계를 '상관 관계'라고 합니다. 그런데 이게 단순한 '상관 관계'를 넘어서 한 쪽이 변해서 다른 쪽 값이 변하면, 즉 한 쪽의 특성이 원인인 '독립변수'가 되고, 다른 쪽의 특성이 결과인 '종속변수'가 된다면 이런 관계를 '인과 관계'라고 합니다. 실전에서는 이런 특성간의 관계를 매우 엄격하고 정확히 파악하는 게 중요합니다.

## 머신 러닝의 분류

머신 러닝은 크게 3가지로 분류가 가능합니다

### 지도 학습

지도 학습의 '지도'는 기계를 가르친다(supervised)는 의미입니다. 데이터로 컴퓨터를 학습시켜 모델을 만드는 방식입니다.

지도 학습은 역사와 비슷합니다. 독립변수와 종속변수로 이루어진 과거의 데이터로부터 원인과 결과를 학습하고 이를 통해 모델을 만들어 미래를 예측하도록 합니다.

이런 지도 학습은 또 크게 '회귀'와 '분류'로 나눌 수 있습니다. 종속변수가 숫자같은 양적 데이터라면 '회귀'를 사용하고 문자같은 범주형 데이터라면 '분류'를 사용하면 됩니다.

### 비지도 학습

지도학습에 포함되지 않는 방법들입니다. 정답을 알려주지 않았는데도 무언가에 대한 관찰을 통해 새로운 의미나 관계를 밝혀내는 것입니다. 비지도 학습의 사례로는 크게 군집화와 변환, 연관이 있습니다.

군집화는 서로 가까운 관측치를 찾아주는, 비슷한 행을 그룹핑 해주는 머신러닝 기법입니다.

연관 규칙 학습은 서로 연관된 특징을 찾아내는 것으로 일명 장바구니 분석이라고도 불립니다. 장바구니에 담긴 것과 연관규칙이 있는 특성을 찾아주는 머신 러닝 기법입니다. 각종 추천을 해주는 로직은 거의 연관규칙을 이용한 것이라 보면 됩니다.

변환은 데이터를 새롭게 표현하여 다른 머신러닝 알고리즘이 원래 데이터보다 데이터를 쉽게 해석할 수 있도록 만드는 알고리즘입니다.

역사와 비슷한 지도학습과 달리 비지도학습은 이렇듯 탐험적입니다. 독립변수와 종속변수를 명확하게 파악해서 제공해야 하는 지도학습과는 달리 비지도 하습은 제공된 데이터를 정리 정돈해서 표에 담긴 데이터의 성격을 파악하는 것을 컴퓨터에게 맡기는 방법입니다.

### 강화 학습

지도학습과 비슷하지만 정답을 알려주는 지도 학습과는 달리 강화 학습은 룰과 보상을 주고 기계가 스스로 더 큰 상을 받기 위해 성장하도록 하는 방식입니다.

특정한 환경(environment)을 제공하면 컴퓨터가 에이전트(agent)가되어 상태(state)를 파악하고 에이전트의 행동(state)에 따라 제공되는 보상(reward)을 기반으로 컴퓨터가 스스로의 정책(policty)를 수립해 나가는 방법입니다. 알파고가 바둑으로 인간을 이긴 것도 이 강화 학습 방법을 통해서 였습니다.
