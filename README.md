# React 프로젝트 개발 환경 구성

## 1. Node js 설치
[Node.js 다운로드](https://nodejs.org/ko/)

#### ---------------------------------------------
## 2. React 프로젝트 생성
### `npx create-react-app 프로젝트명`
프로젝트명으로 폴더가 만들어지고 그 안에 리엑트 프로젝트 구조가 자동 생성된다.
#### ---------------------------------------------
## 3. React 라우터 설치
### `npm install --save react-router-dom`
#### ---------------------------------------------

## 4. package.json 수정
`"homepage": "./"` 추가
```
...
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "homepage": "./"
}
  ```
