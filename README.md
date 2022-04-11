# Project Animan Lab
## Frontend stack:
* VueJS 3
* VueX
* Axios
* Tailwind CSS
* SASS
* Editor: Quill
* Upload Image: Filepond
* Cloudinary
* Swiper
## Backend stack:
* NodeJS
* ExpressJS
* MongoDB
* Mongoose
* Joi
* Url-slug
* JWT Token
* Passport
* NodeMailer
## Deployment:
* Ubuntu 18.04
* Nginx
* PM2
* SSL Cloudflare
## How to setup this project?
### Make sure you execute the command in both client and server folders after git clone

```
npm i
```
### Client
* You need to register an account [Cloudinary](https://cloudinary.com/)
.It's free 25gb and the connection is very good.
* SECRET_LS serve the purpose of encrypting the access token to ensure more security on the client side.
> Set up .env
```
VUE_APP_URL=your-api-backend
VUE_APP_CLOUDINARY=your-preset-api-cloudinary
VUE_APP_SECRET_LS=random-secrect-key
```
> Run client (client setup by VueCli)
```
npm run serve
```
### Server
* Create log file (Optional), Lniux command

```
mkdir -p server/src/logs && touch server/src/logs/server.log
```
* If you don't need log file, just comment these block code in /src/index.js
```
  //const logEvents = require("./helper/logEvents");
  
  ...

  // logEvents(
  //   `id:${nanoid(5)} --- ${req.url} --- ${req.method} --- ${JSON.stringify({
  //     message: error.message,
  //   })}`
  // );
```
and /src/helper/mailService
```
  //const logEvents = require("../helper/logEvents");

  ...

  // logEvents(`id:${nanoid(5)} --- mail service --- ${error}`);
  
  ...

  // logEvents(`id:${nanoid(5)} --- mail service --- ${info.response}`);
```
> config database in server/src/configs/db

> config export jwt secret key in server/src/configs/jwt

> config .env file
```
JWT_SECRET=random-secret-key
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-pass@gmail.com
```

> run server
```
npm start
```

## Happy coding!
## I hope you can give me feedback on the project via email pttl2k1@gmail.com or discord lee2001#9563