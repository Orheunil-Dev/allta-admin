# Builder + Runtime 한 스테이지
FROM node:22.16.0
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스코드 복사
COPY . .

# 빌드
RUN npm run build

# Cloud Run은 8080 포트 사용
EXPOSE 8080

# Next.js 서버 실행
CMD ["npm", "run", "start"]
