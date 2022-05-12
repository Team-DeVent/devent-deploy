![head](./head.png)

# devent-deploy
Automatic container deployment system using Github webhook

## To-Do

* [x] Webhook endpoint designation
* [x] Docker interworking
* [x] Create container image
* [x] Create container
* [x] Git clone and download
* [x] Fix git clone event
* [x] Edit image tag
* [x] Container version control
* [x] Event logic separation
* [x] Auth Git clone
* [x] Patch container env.



## Execute


**start**

```
npm run start
```

**start(production)**

```
npm run start:prod
```

**start(development)**

```
npm run start:dev
```


## Webhook


**endpoint url**

```
https://test.test/api/webhook/github
```


## Preferences

#### 1. create config file

./backend/config/setting.json

```json
{
    "GITHUB_SECRET":"<github_webhook_secret>",
    "GITHUB_PAT":"",
    "CLONE_REPO_DIR":"<github_repo_local_dir>",
    "ENABLE_USERS":["DipokalLab"]
}
```

#### 2. nginx-proxy


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

#### 3. nginx-proxy


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

#### 4. update container env

http://localhost:9003/env

