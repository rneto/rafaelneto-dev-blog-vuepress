---
date: 2021-1-24
tags:
  - Nodejs
  - nvm
  - npm
summary: Once we have delved into the realms of contemporary front-end frameworks and development environments, we begin to encounter the scenario where each of our projects may have been crafted using distinct Node.js versions ...
permalink: /en/blog/:slug
---

# Installing multiple Node.js versions on Windows

<social-share class="social-share--header" />

[Español](/blog/instalar-multiples-versiones-nodejs-windows/) | English

Once we have delved into the realms of contemporary front-end frameworks and development environments, we begin to encounter the scenario where each of our projects may have been crafted using distinct Node.js versions. Consequently, it necessitates us to take into consideration the minimum and maximum supported versions of each npm package for every Node.js release. An exemplar of this is the package [node-sass](https://github.com/sass/node-sass), which specifies compatible minimum and maximum versions concerning Node.js:

Node.js | Supported node-sass version
--------|----------------------------
Node 15 | 5.0+
Node 14 | 4.14+
Node 13 | 4.13+, <5.0
Node 12 | 4.12+
Node 11 | 4.10+, <5.0
Node 10 | 4.9+
Node 8  | 4.5.3+, <5.0
Node <8 | <5.0

In this context, it could be the case that we haven't been able to migrate an older Angular project from version 7.0.0 to the latest one. In such a scenario, if we wish to continue working on it without undergoing the migration process, we may encounter in our `package.json` file the dependency ```"@angular-devkit/build-angular": "~0.7.0"```, which, in turn, relies on ```"node-sass": "^4.9.3"```. This implies that, instead of working with the most current Node.js version, we should work with version _10.x_ of Node.js, as failing to do so could lead to complications with dependent libraries like _node-sass_ as outlined in the table above.

## Node Version Manager (nvm) to the rescue

Now that there's no turning back, it's time to explore tools such as [nvm for Windows](https://github.com/coreybutler/nvm-windows), which will enable us to manage multiple Node.js installations on our Windows system. If you are a Mac or Linux user, you should utilize the [nvm project](https://github.com/creationix/nvm), which is very similar but exclusive to those environments.

### Installation

First and foremost, **it is crucial to eliminate any prior Node.js installations and all associated references** to prevent potential conflicts. This involves removing the installation directories located at _C:\Program Files\nodejs_ and the npm installation directory at _C:\Users\<user>\AppData\Roaming\npm_. Remember to create a backup of the configuration at _C:\Users\<user>\AppData\Roaming\npm\etc\npmrc_ or copy it to the user configuration at _C:\Users\<user>\.npmrc_ before proceeding.

[Download the latest installer](https://github.com/coreybutler/nvm/releases) (_nvm-setup.zip_) and complete the installation process.

### Usage

Simply entering the command ```nvm``` in our terminal will provide us with a list of all available options.

#### Node.js Installation

Simply use the command ```nvm install [version]``` to install the desired Node.js version. Please note that administrative privileges in Windows are required to execute this command.

#### Switching the Node.js version to be used

By using the command ```nvm use [version]```, we specify the Node.js version we wish to employ. Please be aware that administrative privileges in Windows are necessary to execute this command.

Once the version in use is set, we can work with it using the regular commands, such as ```npm i```.

It's important to note that from this point onward, we must install each global utility we require separately for each Node.js version we intend to maintain. This applies to tools like _Yarn_ or _Angular CLI_, whose versions must be installed for each Node.js instance.

``` bash
nvm install 10.23.1
nvm use 10.23.1
npm install -g yarn
npm install -g @angular/cli

nvm install 12.20.1
nvm use 12.20.1
npm install -g yarn
npm install -g @angular/cli

nvm install 15.6.7
nvm use 15.6.7
npm install -g yarn
npm install -g @angular/cli
```

#### Checking the existing Node.js installations

Using the command ```nvm list``` will display the list of installed Node.js versions, along with the currently active version.

---
<social-share class="social-share--footer" />
