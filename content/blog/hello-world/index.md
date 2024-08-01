---
title: tailwind theme 동적 할당을 통한 커스텀 애니메이션 구현하기
date: "2024-07-28T22:12:03.284Z"
description: "tailwind theme 동적 할당을 통한 커스텀 애니메이션 구현하기"
image: "../assets/custom_css.png"
---

> 졸업을 부탁해 <br/>
> 간편 졸업요건검사 서비스<br/>

<details>
<summary>졸업을 부탁해 더 알아보기</summary>

> 졸업을 부탁해는 졸업을 위해 반드시 필요한 수강과목과 졸업요건 정보가 파편화되어져 있고 자주 변경되어 학우들이 어려움을 겪는다는 문제점에서 시작된 프로젝트로, MyiWeb MSI의 성적표만으로 졸업을 위해 필요한 미이수 과목 정보 및 잔여학점 조회, 카테고리별 수강학점현황, 강의 커스텀을 통한 졸업사정예측 서비스를 원클릭으로 제공합니다.
> <br/> [레포 이동하기](https://github.com/Open-Eye-Im-Developer/MoGakGo-FE) <br/> [서비스 이동하기](https://mju-graduate.com) <br/> [PR 이동하기](https://github.com/Myongji-Graduate/myongji-graduate-next/pull/59/files)

</details>

<br/>
<br/>

## 졸부의 커스텀 애니메이션

![화면 기록 2024-07-28 오후 3 15 40](https://github.com/user-attachments/assets/289b5960-b164-4181-904d-d18f70bd26ff)

졸업을 부탁해는 성적표를 입력하는 경우, 졸업요건의 충족을 위해 카테고리 별로 수강 정보 및 이수 현황을 제공하고 있습니다! <br/>
그 과정에서 시각화도구로 chart를 이용하였으며, 이수 현황 비율에 맞춰 chart animation을 custom하여 제공하고 있습니다.

## 요구사항

1. percentage 변수에 맞춰 동적으로 chart게이지를 노출할 수 있어야한다.
2. 졸부팀이 사용하는 css framework(tailwind)로 구현해야한다.

## 구현

> 만일 저희 팀이 CSS-in-JS를 사용하는 경우였다면, props를 통해 percentage변수를 전달하여 동적 애니메이션을 노출했을 것으로 예상됩니다. <br/>
> 하지만.. 우리팀은 tailwind를 쓰니까!!!

1. percentage css 변수 생성

```css
@property --percentage {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}
```

2. css animation 구현

```css
@keyframes piechart {
  from {
    opacity: 0.8;
    --percentage: 0;
  }
}

.piechart::before {
  animation: piechart 1s forwards;
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 0;
  background: radial-gradient(farthest-side, #7590ff 98%, #0000) top/1.1rem 1.5rem
      no-repeat, conic-gradient(#7590ff calc(var(—percentage) * 1%), #0000 0);
}

.piechart:after {
  content: "";
  animation: piechart 1s forwards;
  border-radius: 46%;
  inset: calc(50% - 0.74rem);
  position: absolute;
  background: #7590ff;
  transform: rotate(calc(var(—percentage) * 3.6deg)) translateY(
      calc(50% - 9rem / 2)
    );
}
```

3. piechart component에서 --percentage 변수에 동적으로 값을 할당 & class 추가

```typeScript

'use client';

export interface PieChartProp {
  percentage: number;
}

function PieChart({ percentage }: PieChartProp) {
  const filterdPercentage = percentage > 100 ? 100 : percentage;

  return (
    <div
      className= 'piechart ...'
      style={{
        '--percentage': percentage
      }}
    >
      <div>
        {filterdPercentage}%
      </div>
    </div>
  );
}

export default PieChart;


```

4. --percectage 커스텀 변수를 할당하면 build시에
   `Object literal may only specify known properties, and ''--percentage'' does not exist in type 'Properties<string | number, string & {}>'.`
   해당 타입오류가 발생할겁니당 <br/>
   TypeScript에서 예상하는 속성타입에는 없는 `--percentage` 속성이 존재하기때문에 발생하는 이슈로
   이를 해결하기 위해 react가 권장하는 [모듈 확장](https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors)을 통해 확장을 진행했습니다.

```ts
//css.d.ts
import type * as CSS from "csstype"

declare module "csstype" {
  interface Properties {
    //Add CSS Custom Properties
    "--percentage"?: number
  }
}
```

## 경험한 문제

### 커스텀 애니메이션이 적용되지않아 (.இ﹏இ`｡)

pie-chart의 애니메이션은 커스텀 변수(--percentage)가 0부터 할당해준 값까지 상승하며 차트가 그려지는 구조입니다.<br/>
하지만 0%와 100%의 경우에만 애니메이션으로 변화가 적용되는 문제!!를 경험했습니다.

```ts
//tailwind.config.ts
theme : {
    extend : {
       animation : {
            piechart : {
                '0%': {  '--percentage' : '0' }
            }
       }
    }
}

```

위 코드는 처음 애니메이션을 적용한 코드입니다.<br/> 졸부팀은 tailwind를 사용하기때문에 tailwind.config.ts에
커스텀 변수가 애니메이션을 적용시켰습니다. <br/> --percentage는 number type으로 0을 할당해줘야하는데, tailwind.config.ts에는 string type으로만 type지정이 가능하므로 커스텀 변수의 값을 ‘0’으로 지정한 것이 원인이었습니다. <br/>
해당 문제를 확인하고, 위의 코드와 같이 piechart에 사용되는 css는 별도로 분리해서 pie-chart.css file을 통해 관리하고 있습니다!!
