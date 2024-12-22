# Website running at [https://www.antoinehazebrouck.com](https://www.antoinehazebrouck.com)

## Run

```shell
./run.bat
```

## Fetch lets-encrypt certifications (for HTTPS)

```shell
docker run -it --rm --name certbot -p 80:80 -v "C:/Users/Jez/Desktop/certs:/etc/letsencrypt" -v "C:/Users/Jez/Desktop/certs:/var/lib/letsencrypt" certbot/certbot certonly
```

## State

[![check-website-status](https://github.com/AntoineHazebrouck/rythm/actions/workflows/check-website-status.yml/badge.svg)](https://github.com/AntoineHazebrouck/rythm/actions/workflows/check-website-status.yml)