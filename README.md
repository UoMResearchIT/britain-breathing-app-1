# Britain Breathing Mobile App

Built with the [Ionic Framework](https://ionicframework.com).

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Java SDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Android SDK](https://developer.android.com/studio/install)   
- [git](https://git-scm.com/downloads)

### Set-Up

1. Install Node.js, Java SDK, Android SDK.

  > Make sure that **JAVA_HOME** is in the Environment Variables and is pointed at it. The path will be something like - `C:\Program Files\Java\jdk1.8.0_171`. Remember to open a new Node.js command prompt when changing the path to allow changes to resolve.

  > **ANDROID_HOME** should be automatically found, usually here - `C:\Users\<USERNAME>\AppData\Local\Android\sdk`. I've had issue where the directory was named 'Sdk' rather than 'sdk'.

2. Using git, clone the repo into the directory of your choice
`git clone https://github.com/IAM-lab/britain-breathing-app.git` to your directory of choice.

3. In the Node.js command prompt `cd` into the `britain-breathing-app` directory
4. Run the command `npm install`. This will install the dependencies.
5. A message will prompt you to install specific additional dependencies. You will need to install these manually with something like `npm install @ionic-native/core@3.6.0`
6. Run `ionic cordova run android --device`, with an Android device plugged in. Initial build will take a few minutes.

> **Tips**
> - There may be build errors. Deleting the build folder and rebuilding will solve most problems.
