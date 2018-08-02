# Britain Breathing Mobile App

[Britain Breathing](http://britainbreathing.org/) is mobile app that tracks user's allergies.

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
6. The platform data is outdated and should be updated. `npm cordova platform rm android ios browser` will remove all three platforms. `npm cordova platform add android ios browser` will add updated version of each platform.
7. Run `ionic cordova run android --device`, with an Android device plugged in. Initial build will take a few minutes. Subsequent times will be quicker. The apk files that are built can be found in `platforms\android\app\build\outputs\apk\debug`

### Using the App

#### Home Screen

* Layout - `src/pages/home/home.html`
* CSS - `src/pages/home/home.scss`
* Logic - `src/pages/home/home.ts`

![Home Screen](screenshots\screenshot4.png)

#### My Symptoms - How Are you Feeling?

* Layout - `src/pages/symptoms/symptoms.html`
* CSS - `src/pages/symptoms/symptoms.scss`
* Logic - `src/pages/symptoms/symptoms.ts`

Clicking "My Symptoms" will bring users here. They have three options.

* **Great** - will send the default values and return user to the Homescreen.
* **So-So** and **Bad** will prompt users to tell us how their allergy is affecting them.

No matter the option the user will be asked if they had taken any allergy medicine today.

![My Symptoms - How Are you Feeling?](screenshots\screenshot3.png)

#### My Symptoms - How Are Your Allergies Affecting You?

* Layout - `src/pages/symptoms/symptoms.html`
* CSS - `src/pages/symptoms/symptoms.scss`
* Logic - `src/pages/symptoms/symptoms.ts`

If users chose **So-So** or **Bad**, they are prompted to say how their allergy is affecting them with a rating from 0 - 3. (0 - None, 1 - Mild, 2 - Moderate, 3 - Severe)

This is the last step of recording their symptoms. They will see a thanks page, then return to the Homescreen.

![My Symptoms - How Are Your Allergies?](screenshots\screenshot2.png)

#### My Data

* Layout - `src/pages/data/data.html`
* CSS - `src/pages/data/data.scss`
* Logic - `src/pages/data/data.ts`

"My Data" visualises the data that the user has input so they can see how their symptoms
have changed over time. The graphs show the last seven entries.

![Data](screenshots\screenshot1.png)

#### About

* Layout - `src/pages/about/about.html`
* CSS - `src/pages/about/about.scss`
* Logic - `src/pages/about/about.ts`

A brief overview of the Britain Breathing research as well as an email to send technical issues.

#### Settings

Users can update their email, unsubscribe from the mailing list as well as change when they receive an alert notification to add their symptoms.
