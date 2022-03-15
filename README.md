![head](./head.png)

# devent-deploy
도커 - 깃허브 Webhook 자동 배포

## To-Do

* [x] 웹훅 받기
* [x] 도커 연동
* [x] 도커 - 깃허브 이미지 생성
* [x] 도커 컨테이너 생성
* [x] git clone and download
* [x] fix git clone event
* [x] 도커 컨테이너 이미지 태그 수정
* [x] 도커 컨테이너 버전관리
* [x] event 로직 분리
* [x] git clone 권한 부여
* [x] patch container env.



## Execute


**실행**

```
npm run start
```

**실행(프로덕션)**

```
npm run start:prod
```

**실행(개발)**

```
npm run start:dev
```


## Webhook


**url**

```
https://test.test/api/webhook/github
```


## Preferences

**create config file**

./backend/config/setting.js

```js
export default 
{
    "GITHUB_SECRET":"<github_webhook_secret>",
    "CLONE_REPO_DIR":"<github_repo_local_dir>",
    "ENABLE_USERS":['DipokalLab']
}
```

**1. nginx-proxy**


```
docker run --detach \
    --name deploy-nginx-proxy \
    --publish 80:80 \
    --publish 443:443 \
 	  -e HTTP_PORT=80 \
	  -e HTTPS_PORT=443 \
    --volume certs:/etc/nginx/certs \
    --volume vhost:/etc/nginx/vhost.d \
    --volume html:/usr/share/nginx/html \
    --volume /var/run/docker.sock:/tmp/docker.sock:ro \
    nginxproxy/nginx-proxy:alpine
```

**2. nginx-proxy**


```
docker run --detach \
    --name deploy-nginx-proxy-letsencrypt \
    --volumes-from deploy-nginx-proxy \
    --volume /var/run/docker.sock:/var/run/docker.sock:ro \
    --volume acme:/etc/acme.sh \
    --env "DEFAULT_EMAIL=hhj@devent.kr" \
    nginxproxy/acme-companion
```

Then create and run a './deployenv' file on the service. An example of a 'deployenv' file. Separators are commas.

**nginx-proxy service setting**

./deployenv

```
VIRTUAL_HOST=foo.bar.com,VIRTUAL_HOST=dds.devent.kr,LETSENCRYPT_HOST=pc.devent.kr,LETSENCRYPT_EMAIL=hhj.devent.kr,SAMPLE_ENV=env
```