---
title: PWA & FCM 알람 구현 | 웹서비스 모각GO가 실시간 알람을 구현하기 위한 과정
date: "2024-07-06T23:46:37.121Z"
image: "../assets/example.png"
---

### pull, push 둘 다 사용합니다!

모각GO는 모각코 매칭 서비스인만큼, 실시간으로 매칭 요청에 대한 결과를 사용자가 확인하는 기능이 중요하다고 생각합니다. 따라서 일반적인 client와 server의 상호작용에서는 client가 server로 http Protocol을 통해 요청을 보내고, 서버의 응답을 받아서 사용자에게 노출하지만, server에서 client로 먼저 알림 정보를 전송하는 역 방향으로 동작하는 방식이 필요하다는 생각을 하게 되었습니다.

1. 클라이언트에서 서버로 요청을 보내서 내역을 확인하는 방법 (pull 방식)
2. 서버에서 클라이언트로 전송하는 방법 (push 방식)

따라서, 위 두 가지 방식을 모두 사용하기로 했습니다.

### 왜 하필 FCM?

알람 구현을 위해서 Short polling, Long Polling, webSocket, SSE(Server Sent Event)방식 등이 존재하지만, 디바이스별 알림처리를 위해 FCM을 이용해서 알림 기능을 구현했습니다.

FCM는 클라이언트와 서버 사이에 메시지 전송 전용 클라우드 서버를 두고 클라이언트와 연결을 유지합니다. 알림 발송 이벤트가 발생하는 순간에만 FCM서버로 요청을 보내고 응답을 즉시 받는 무상태 상호작용을 진행하므로, 위에서 언급한 다양한 방식이 갖는 서버의 자원 지속적 소모 문제도 함께 해결할 수 있다는 장점도 함께 가져갈 수 있게 되었습니다 👍🏻

## 모각Go의 알람 구조

모각Go서비스는 pull 알람과 push 알람을 통해 알람의 성격에 따라서 구분해서 알람을 보내주기로 설계했습니다. pull, push, 둘다 적용시키는 공통 3가지 방식으로 분리하였고, 각 방식 별 처리해줘야하는 내용을 별도로 작성했습니다.

### pull

| 업적 | 마이페이지 + 모달 |
| ---- | ----------------- |

프론트 처리

- 확인하지 않은 알람이 있는 경우, (전체 아이콘, 개별)알림에 대한 표시를 제공한다.
- 알람 아이콘을 클릭하면 사용자에게 온 알람 내역을 확인할 수 있다.
- 알람을 클릭하면, 확인 표시와 함께 이벤트가 클릭한 화면으로 전환할 수 있다.

### push → FCM

| 찔러보기 상대가 모각코 생성 | 모각코로 이동    |
| --------------------------- | ---------------- |
| 채팅                        | 채팅 방으로 이동 |

프론트 처리

- 로직을 단순하게 가져가고 싶어서 채팅 알람도 모각코로 이동하고 싶었는데, 채팅방 유효시간이랑 모각코 유효시간이 동일하지 않아서 채팅방으로 적어뒀어요.
- pull 알람 내역의 읽음 표시

### 공통

| 나에게 찔러보기 도착 | 상대 카드로 이동 |
| -------------------- | ---------------- |
| 매칭 종료 알람 도착  |                  |
| 매칭 수락            | 모각코로 이동    |
| 매칭 거절            |                  |
| 후기 작성            |                  |

프론트 처리

- 매칭 종료 알람 도착 시, 후기 페이지로 이동

# PWA와 FCM 전송

## PWA 환경 구축

- 모각코는 next이기때문에 next-pwa를 통해 next.config.mjs를 구성

  ```jsx
  //next.config.mjs

  /** @type {import('next').NextConfig} */
  import pkg from "next-pwa"

  const withPWA = pkg

  const nextConfig = withPWA({
    dest: "public",
  })

  export default nextConfig
  ```

- 빌드를 진행하면 **`/public`** 내부에 **`workbox-*.js`**와 **`sw.js`** 파일이 자동으로 생성된다 !
- PWA를 위해 manifest파일을 작성
  ```json
  //manifest.json
  {
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "name": "모각GO Projressive Web App",
    "short_name": "모각GO",
    "description": "모각Go는 지역기반 모각코 1:1 매칭 서비스입니다.",
    "icons": [
      {
        "src": "/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```
- header에 manifest 추가를 진행
  ```json
  <link rel="manifest" href="/manifest.json" />
  ```
- 스플래쉬 스크린은 MVP가 아니라고 파악해서, 로고 나오면 적용해보는 것으로 우선순위를 미뤘습니당

## FCM 연동

아래 작업 내역의 경우에는 테스트로 생성한 Firebase app을 기준으로 정리한 내용이며, 현재 삭제된 프로젝트이므로 모각GO와는 관련없으니 걱정하지 않으셔도 됩니다.

- firebase service worker등록

  ```json
  import { initializeApp } from "firebase/app";

  const firebaseConfig = {
    apiKey: "AIzaSyAsST86aqVITDUXVuYFi4J4wMir_IYEmTE",
    projectId: "web-push-cf450",
    messagingSenderId: "735744104710",
    appId: "1:735744104710:web:d8454962b445db084ce687",
  };

  initializeApp(firebaseConfig);
  ```

- 사용자 권한 요청
  - 해당 과정이 선행되어야 FCM 알람을 받을 수 있어요
  ```json
   const requestPermission = () => {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          //알림 권한이 허용된 경우에 따른 처리
        } else {
          //알림 권한이 거절을 선택한 경우에 따른 처리
        }
      });
    };
  ```
- FCM을 위한 사용자 토큰 발급

  - 해당 토큰의 주인에게 알람이 발송되는 시스템이고, 동일 사용자가 여러개의 디바이스로 접속했다면 여러개의 토큰이 한 명의 사용자의 소속으로 생성됩니다. 이 경우에는 가장 최근 토큰으로 알람을 전송하게 백엔드와 약속했어요 🤙🏻

  ```json
    const allowAlarm = () => {
      const firebaseApp = initializeApp({
        apiKey: "AIzaSyAsST86aqVITDUXVuYFi4J4wMir_IYEmTE",
        authDomain: "web-push-cf450.firebaseapp.com",
        projectId: "web-push-cf450",
        storageBucket: "web-push-cf450.appspot.com",
        messagingSenderId: "735744104710",
        appId: "1:735744104710:web:d8454962b445db084ce687",
      });

      const messaging = getMessaging(firebaseApp);

      getToken(messaging, {
        vapidKey:
          "BMx4Oq3RdTOvyqpRuL7kwdi3m9-EWXwQumnkjm-mrXWfGNeSHcLQrlLr4LA6d4o07M-H8xtNTeV4biV138boEjA",
      })
        .then(currentToken => {
          if (currentToken) {
           //해당 클라이언트의 디바이스에 대한 토큰을 전달 받은 경우의 처리
  				 //저희 서비스에서는 해당 단계에서 서버로 토큰을 전송하는 POST 요청을 발생시켰어요
        })
        .catch(err => {
  				//토큰 발급 과정에서 에러가 발생하는 경우
        });
    };
  ```

# 삽질하기

- 모각GO 서비스 특성 상, 모바일로 사용할 가능성이 높기때문에 PWA로 구현하기로 했습니다 !

## IOS 에서는 안돼 ~

- push알람을 받기 위해서 PWA를 적용 시키고 FCM과의 연동을 진행했음 !
- PWA로 모바일에서 사용하기 위해서는

1. Safari에서 웹 사이트에 접속
2. 가운데에 있는 공유 버튼 클릭
3. 홈 화면에 추가하기
   **4. 추가한 아이콘을 클릭해서 앱에 접속한 이후, 푸시 허용을 해야지만 알림이 전송 됨**

![잘 도착하쟈나 ~~~~~](https://github.com/user-attachments/assets/81d5d14a-b46f-4d1c-b0fc-55f605d67ce0)

잘 도착하쟈나 ~~~~~

<aside>
🫠 BUT IOS에서는 알림이 가지 않는 이슈 존재
→ 아무런 반응도 하지 않아, 4번 절차를 진행할 수 없었다.

</aside>

1. 데스크탑에서는 정상적으로 도착하기 때문에, FCM의 연결이 잘못된 것이라고는 볼 수 없었고 IOS의 연결에 문제가 있는지 구글링을 반복할 수 밖에 없었는데

> FCM은 https에서만 실행 가능하며 사파리는 FCM이 지원을 하지 않아 아이폰에는 알람이 가지 않았는데, [WWDC 2022에서 Safari 16부터 웹 푸시 알람을 지원]()한다고 발표했으므로 별도 문제 없음.

1. 명확한 이유를 찾고 싶어서 기본적으로 모바일 기기에서는 safari에 대한 기본 notification 설정이 false로 되어져 있는데( 이 경우 aleart가 작동하지 않는다 ! ),

디바이스 설정을 true로 변경하고 aleart 알람창을 통해 `Notification.permission`권한을 확인해보니 `Notification.permission` 이 `dennied` 상태로 존재하기때문에 알람 허용 요청조차 가지 않고 있는 것이라는 것을 확인했음 - 한 번 이상 거절하면, `Notification.permission` 가 dennied로 설정 되고 알람 허용 요청 조차 가지 않음 ! 변경을 위해서는 직접 앱 설정으로 이동해 변경해줘야한다 !

2. iOS에서는 웹 앱이 홈 화면에 설치되지 않은 경우 항상 `denied`를 반환하는데, 여러번의 배포 과정을 통해 **혹시 내가 PWA가 아닌가..?** 라는 질문을 하게 되었고 검증을 위해 LightHouse의 progresive web app을 통해 검사를 진행했다. → 만족하지 않은 조건이 있길래 만족시킨 후, 다시 테스트를 진행했다

1. ㅋ.ㅋ pwa가 아니었던.. 머슥.. 모바일에서 정상적으로 오는 것도 확인했움 !

   ![스크린샷 2024-02-23 오전 11.55.18.png](https://github.com/user-attachments/assets/1dca3c8d-ee95-4d7c-9ecf-336562716b99)

### 고민) 권한허용을 어느 시점에 받을까

기존에는 서비스에 접근하자마자 요청을 보내는 방식이었는데, 우리 서비스의 성격상 **서비스에 진입하자마자 위치정보의 동의**를 받아야한다. 알람 요청까지 서비스 진입 시에 받는다면,

1. 반복된 권한 요청이 사용자로 하여금 개인정보의 부담을 느끼게 할 수 있다
2. 이벤트 없이 메소드를 호출할 경우 브라우저마다 작동하지 않는 이슈 가능성이 존재하므로 `Notification.requestPermission()` 을 통한 권한 요청은 사용자의 클릭을 통해서 호출되는 방식을 권장한다

위 두가지의 이유로 알람페이지의 화면에서 알림 켜기 버튼을 구현했다.

![스크린샷 2024-02-23 오전 11.25.22.png](https://github.com/user-attachments/assets/99b556a4-6ace-4372-9a11-37c5ead3c4c0)
