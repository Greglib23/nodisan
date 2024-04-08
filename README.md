# Nodisan

Nodisan is a boilerplate generator inspired in **artisan** from **laravel**. This module for nodejs works similar to that and that makes it possible to enjoy all the benefits that this entails.

# Requirements

| Nodejs  | Npm |
|--|--|
| <img src="https://www.svgrepo.com/show/376337/node-js.svg" alt="Node.js Logo" width="150" height="150" /> |<img src="https://cdn.iconscout.com/icon/free/png-256/free-npm-3-1175132.png" alt="Node.js Logo" width="150" height="150" />  |

# Instalation

To start a backend project with nodisan, you only have to start a new project in any folder you want and run

```linux
mkdir first-nodisan-project
cd first-nodisan-project
```

Then run:

```linux
npm init -y
npm i nodisan@latest
```

Now you will notice that the common process of installing any Nodejs package will be executed, but with the difference that a file will appear in your root folder: **nodisan.js**.
This file is the entry point of the application and it is the one that will generate the templates.
To start the process of creating them, you only have to do:

```linux
node nodisan
```

And, in principle, that is all.

# In development

- Integration with front end libraries
- Integration of tipical commands of artisan, considering the differences between php and js, commands like:

```
php artisan make:controller userController
```

Will be used on your console like:

```
node nodisan make:controller userController
```

# Contact

- [LinkedIn](https://www.linkedin.com/feed/)
- [Github](https://github.com/Greglib23)
- Mail: <Cristianisaias@outlook.com.ar>
