# Website running at [https://www.antoinehazebrouck.com](https://www.antoinehazebrouck.com)

## Status

[![check-website-status](https://github.com/AntoineHazebrouck/rythm/actions/workflows/check-website-status.yml/badge.svg)](https://github.com/AntoineHazebrouck/rythm/actions/workflows/check-website-status.yml)

## Compile and run

```shell
./run.bat
```

## Release new version

[https://github.com/AntoineHazebrouck/rythm/actions/workflows/maven-release.yml](https://github.com/AntoineHazebrouck/rythm/actions/workflows/maven-release.yml)

## Fetch lets-encrypt certifications (for HTTPS)

```shell
docker run -it --rm --name certbot -p 80:80 -v "C:/Users/Jez/Desktop/certs:/etc/letsencrypt" -v "C:/Users/Jez/Desktop/certs:/var/lib/letsencrypt" certbot/certbot certonly
```

## OAuth2

### Google : antoine.haz@gmail.com

[https://console.cloud.google.com/auth/overview?inv=1&invt=AblGng&project=antoinehazebrouck&supportedpurview=project](https://console.cloud.google.com/auth/overview?inv=1&invt=AblGng&project=antoinehazebrouck&supportedpurview=project)

### Osu : antoine.haz@gmail.com (jesusdu59_old)

[https://osu.ppy.sh/home/account/edit#new-oauth-application](https://osu.ppy.sh/home/account/edit#new-oauth-application)

## DNS

[https://njal.la/domains/antoinehazebrouck.com/](https://njal.la/domains/antoinehazebrouck.com/)

## TODO

comments and notes on maps
scores from osu api
oauth2 osu api
scores du jeu pendant le jeu et à la fin
scoreboard : pour une map, la liste de tous les meilleurs temps, avec npm prenom photo etc
