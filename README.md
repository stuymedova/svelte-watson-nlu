# Svelte Watson NLU

Svelte app + [Watson Natural Language Understanding](https://www.ibm.com/cloud/watson-natural-language-understanding) service and [Carbon Design System](https://www.carbondesignsystem.com) components

## Overview

```
.
├── src
│   ├── App.svelte
│   └── main.js
├── server.js
└── webpack.config.js
```

## Prerequisites

[Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

## Setup

1. Sign up for IBM Cloud and create a Watson NLU resource
2. Duplicate `.env.example` as `.env` and copy resource credentials over to the `.env` file
4. Add links to be analyzed to the `src/main.js` file
3. Run in terminal:
```
npm install
npm run dev
```

## Result

<img width="1552" alt="svelte-watson-nlu" src="https://user-images.githubusercontent.com/53351370/127515357-4d99049d-50df-4110-a1e9-92a9b5135c57.png">

*Articles were taken from [MIT Technology Review](https://www.technologyreview.com/topic/artificial-intelligence/)
