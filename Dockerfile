# Node.js 이미지를 베이스로 사용
FROM node:21

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위한 package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install --legacy-peer-deps

# 애플리케이션 코드 복사
COPY . .

# 개발 서버 실행
CMD ["npm", "start"]

# 개발 서버 포트 노출
EXPOSE 3000
