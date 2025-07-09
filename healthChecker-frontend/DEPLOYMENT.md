# nginx 배포 가이드

## 1. 로컬 빌드 및 테스트

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

## 2. Docker를 사용한 배포

### Docker 이미지 빌드
```bash
docker build -t health-checker-frontend .
```

### Docker 컨테이너 실행
```bash
docker run -p 80:80 health-checker-frontend
```

### Docker Compose 사용 (백엔드와 함께)
```bash
# docker-compose.yml에서 백엔드 이미지를 실제 이미지로 변경 후
docker-compose up -d
```

## 3. 수동 nginx 배포

### 1) 프로젝트 빌드
```bash
npm run build
```

### 2) nginx 설치 (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx
```

### 3) nginx 설정
```bash
# nginx.conf 파일을 /etc/nginx/sites-available/에 복사
sudo cp nginx.conf /etc/nginx/sites-available/health-checker

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/health-checker /etc/nginx/sites-enabled/

# 기본 설정 비활성화
sudo rm /etc/nginx/sites-enabled/default

# nginx 설정 테스트
sudo nginx -t

# nginx 재시작
sudo systemctl restart nginx
```

### 4) 빌드된 파일 배포
```bash
# dist 폴더를 nginx 웹 루트로 복사
sudo cp -r dist/* /usr/share/nginx/html/

# 권한 설정
sudo chown -R www-data:www-data /usr/share/nginx/html/
```

## 4. 환경별 설정

### 개발 환경
- API 서버: `http://localhost:8080`
- 프론트엔드: `http://localhost:3000`

### 프로덕션 환경
- API 서버: `http://your-backend-server:8080`
- 프론트엔드: `http://your-domain.com`

## 5. SSL/HTTPS 설정 (선택사항)

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # 기존 설정과 동일...
}
```

## 6. 문제 해결

### nginx 로그 확인
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 포트 확인
```bash
sudo netstat -tlnp | grep :80
```

### nginx 상태 확인
```bash
sudo systemctl status nginx
``` 