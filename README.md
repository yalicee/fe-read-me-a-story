# Read Me A Story

Read Me A Story is an app that allows family members to record, upload and playback bedtime stories for young children in the family when they are unable to read them in person.

A parent can sign up to the app, create a family group and invite their partner or relatives to join. Family members can then choose to record and upload stories, or view a list of stories created by the family. Stories can be selected from the list and played back to the child.

To find out more about the project watch the [product demonstration](#), visit the [live app](https://read-me-a-story.netlify.app) or take a look at the accompanying [API respository](https://github.com/yangalexyangg/be-read-me-a-story/).

## Installation

Follow the instructions below to configure and run your own instance of the Read Me A Story app.

### Requirements

This project was built using Svelte, TypeScript and Tailwind and uses Firebase. The project requires Node.js (v17.6) and npm (v8.5).

You will need to set up and run the [Read Me A Story API](https://github.com/yangalexyangg/be-read-me-a-story).

### Setup the project

To run the project locally, first download the source and install the dependencies.

```
git clone https://github.com/yangalexyangg/fe-read-me-a-story
cd fe-read-me-a-story
npm install
```

### Configure Firebase

You will need to create a [Firebase](https://firebase.google.com/) project with email-based Authentication and a Storage bucket.

Once the services are available in the project, you will need to set up an app for the project and replace the credentials in `src/utils/config.ts` with your details.

### Usage

To run the app locally:

```
npm run dev
```

The app should now be available on [https://localhost:3000](https://localhost:3000).

## About

Read Me A Story was created by Minimum Viable Panic as their final project in the [Northcoders](https://northcoders.com) coding bootcamp.

Minimum Viable Panic are [Rob](https://github.com/RobParry6/), [Charlotte](https://github.com/321jellyfish/), [Alex](https://github.com/yangalexyangg/) and [Andy](https://github.com/akflds/).

### Acknowledgements

Thanks to August, Emily and the other mentors for their support!

Icons:

- <a href="https://www.flaticon.com/free-icons/owl" title="owl icons">Owl icons created by Freepik - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/microphone" title="microphone icons">Microphone icons created by Freepik - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/book" title="book icons">Book icons created by Freepik - Flaticon</a>
