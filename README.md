![testIcon](https://user-images.githubusercontent.com/55415793/173568881-43b09052-592d-412d-b3c2-e4e7c310cb4e.png)

# VanIsLord: NightTown 夜镇系统

[中文文档](https://github.com/wzl778633/vanIsLord/blob/master/README_cn.md)

[Server repo is here](https://github.com/star-wyx/drive)

A Self-hosted Cloud Storage & File Sharing Platform, best to serve for a medium-sized (under 1000) user groups.

Example scenarios for this project usage are: a group of your friends/multiple families/median-size working groups and so on.

This project has 2 parts currently, Front-End web-client server and Back-End server:
Front-End web-client server is based on Vue 2.x, Element-Ui & Nginx 1.23.0 (Which is the current repo).
Back-End server is based on Java Springboot & MongoDB 4.4.0.

![image](https://user-images.githubusercontent.com/55415793/173569340-9c1efaa2-3329-4129-a4f0-aa33165f1473.png)
![image](https://user-images.githubusercontent.com/55415793/173570282-483bc72d-0d5b-40a7-874b-78e9cf775a20.png)


## Table of Contents

- [What this project can do?](#What-this-project-can-do)
- [How To Install?](#How-To-Install)
- [How to use this system?](#How-to-use-this-system)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## What this project can do?

If you have a NAS (DS720+ etc.) or a real server or even a idle computer and you want to have a personal web-based cloud storage server for you and your friends/families/classmates..., you come to a right place!

The reason I build VanIsLord/NightTown is I have a bunch of friends who met on the Internet wants to share their music/movies/anime/manga/academic resource to each other. So I build this system for them. 

The main features for this repository are:

1. 📂 A **complete cloud storage system**. It has nearly all main atioatures that a file system should has. **Extra**: Support large/multiple files uploading with browser (No support for folder uploading yet). Support Single file/Multi files operations such as delete/download/move to other folder/share/add favorites. Support Single file/Multi files drag operations. 
2. 🛫**MD5 Back-End file storage system**. Same files will only be stored once in real disk with a unique MD5 marker. So you will save A LOT OF space for more file sharing & storage!
3. 🎥 **Online preview**. Natively support images/videos/music/pdf/txt files' preview based on client browser. **Unsupported video encode format will be transcode to H.264 with ffmpeg in Back-End with Hardware Acceleration based on Intal Quick Sync (QSV)**. But you CAN have more files preview support powered by [kkFileView](https://github.com/kekingcn/kkFileView). We will use this third-party project to provide support for doc/docx/xlsx/rar files preview and so on.
4. 🎼 A **Native Web Music Player** with a unique UI interface which will show Main-info & Cover from songs. it can also store user's playlist and sync-update it with all clients that this user login.
5. 🌃 A **Piazza**. "a town for sharing", you can find all the files that other user sharing in this place. Get to your own cloud!
6. 📋 A **Clipboard**. if you want anything from other users, name it! This **complete-chat-system** can help you to communicate with any user in your user pool!
7. 🛠**Tools** _(still in development)_. Provide many useful tools for advance file opreation. Such as a helper tool for file renaming with TMDB API, so you can send your movies/anime to your Media System such as Jellyfin currently and quickly without searching the right names and seasons info on TMDB and rename each files by yourself!
8. **And maybe More in the future!**

## How To Install?

Currently, This project is specify built for our own server. But we will build a general version which will have config customize. 

We use docker to build this project. For **BETTER futrue database maintenance**, we don't build MongoDB inside this project, you need to build your own and set users:
```sh
$ docker run -p 27017:27017 -v /**place to store your DB**:/data/db --name vanislord_db -d mongo:4.4.0
$ docker exec -it vanislord_db bash
$ db.createUser(
     {
       user:"**username you want**",
       pwd:"**pwd you want**",
       roles:[{role:"root",db:"admin"}]
     }
    )
$ db.createUser( 
    { 
        user: "**username you want**", 
        pwd: "**pwd you want**", 
        roles: [{role:"readWrite",db:"vnetdisk"},
        {role:"userAdminAnyDatabase",db:"admin"}] 
        } 
    ) 
```
**Cautions: Make sure you don't use any user name that in default! And DO NOT expose your database port outside your server in any kind of situation!**

Now you can pull this project from Docker Hub:

```sh
$ docker run -d --privileged -p 9090:9090 -v /**place to store your File system**:/usr/local/netdisk --name **Anything you want** --device /dev/dri:/dev/dri wzl778633/vanislord_server:latest // Back-End Server

$ docker run -d -p 9070:443 --name **Anything you want** wzl778633/vanislord_web:latest //Front-End Web Server
```

Port Mapping is based on your own situation. If your region's network don't have support for 80 (http) & 443 (ssl) ports, the [default config](https://github.com/wzl778633/vanIsLord/blob/master/default.conf) provides a way to work around.

**You may need to change your --device input base on the enviroment you have for currect Hardware Acceleration support. (Currently we only provide support for devices which support QSV)** More Info you can find in [docker hub documentation](https://docs.docker.com/engine/reference/commandline/run/#add-host-device-to-container---device)

[More complex for device input](https://docs.docker.com/storage/storagedriver/device-mapper-driver/)

After pulling completed and the containers for both Back-End and Front-End client are working correctly, try http://**your IP**:9070 or http://localhost:9070 to see if is showing the current web pege for login without any problems poping.

## How to use this system?

// TODO May need more update in the future.

## Demo

nighttown.aijiangsb.com or https://aijiangsb.com:9070

```
user: test
pwd: **Ask me if you want to see the demo**

For Special Demo only. So plz DO NOT submit any files.
```

## Contributing
### Contributors

Currently 2 main contributors are working for this project. 
<a href="https://github.com/wzl778633/vanIsLord/graphs/contributors">
Tom "Van" Wang & YiXing "Star-xyz" Wu
</a>

We will welcome any contribution for this project! 


## License

[MIT](LICENSE)


