# Introduction

The card is built on TypeScript and is compiled into a single JavaScript file using `npm`.

## Environment setup

In order to develop the card, the best way is to run a dev environemnt using a Docker image. [This](https://community.home-assistant.io/t/tutorials-how-to-develop-a-custom-card-and-ship-hacs-repositories/526566) link provides a tutorial on how to get a dev environment up and running

After the environment is set up, and you connected to the environment isntance, install `npm` by running thefollowing command in the terminal:

```zsh
nvm install node
```

To compile the card into a single file, navigate to the card's cource folder (Be on the same level as `package.json` file) and run this command:

```zsh
npm run build
```
