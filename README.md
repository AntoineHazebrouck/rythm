```shell
docker run -it --rm --name certbot -p 80:80 -v "C:/Users/Jez/Desktop/certs:/etc/letsencrypt" -v "C:/Users/Jez/Desktop/certs:/var/lib/letsencrypt" certbot/certbot certonly
```