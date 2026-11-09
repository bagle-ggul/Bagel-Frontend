# 프론트 운영 이미지: 빌드 단계(node) > 서빙 단계(nginx 정적 파일) (#131)

# 1단계: 의존성 설치 > 운영 빌드
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN CI=false npm run build

# 2단계: 빌드 결과물만 nginx로 서빙 (node·소스 미포함)
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# 컨테이너 포트 3000 유지 (FRONTEND-CICD 의 호스트 3006 -> 3000 매핑과 짝)
EXPOSE 3000
