# MirimPetition Backend

미림여자정보과학고등학교 청원 시스템 백엔드 서버입니다.

## 기술 스택

- NestJS
- TypeORM
- PostgreSQL
- Redis
- JWT Authentication
- Swagger API Documentation

## 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- PostgreSQL
- Redis
- Yarn

### 설치

1. 저장소 클론
```bash
git clone https://github.com/yourusername/mirimpetition-backend.git
cd mirimpetition-backend
```

2. 의존성 설치
```bash
yarn install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가합니다:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mirimpetition

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3000
NODE_ENV=development
```

4. 데이터베이스 생성
```bash
createdb mirimpetition
```

### 실행

개발 모드:
```bash
yarn start:dev
```

프로덕션 모드:
```bash
yarn build
yarn start:prod
```

## API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:
http://localhost:3000/api

## 주요 기능

- 사용자 인증 (회원가입, 로그인, 로그아웃)
- 청원 작성, 조회, 수정, 삭제
- 청원 투표 (찬성/반대)
- 댓글 작성 및 관리
- 공식 답변 작성
- 알림 시스템
- AI 기반 청원 분석 및 추천

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
