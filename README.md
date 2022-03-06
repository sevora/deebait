# Deebait
## Setup and Installation for Development
### Backend
In the root folder of this repository run, `npm install` to get all necessary packages for the backend. If you wish to exclude development dependencies, do `npm install --production`.

### Frontend
The frontend is written on [React v17](https://reactjs.org/blog/2020/10/20/react-v17.html). Simply run `npm install` inside the deebait-react directory.

## Environment Variables
### Backend
```
# The URL of the frontend, necessary to allow CORs
FRONTEND_URL="https://deebait.space"

# The MongoDB URL for the database connection
ATLAS_URL="mongodb+srv://username:password@cluster.mongodb.net/deebait-data?retryWrites=true&w=majority"

# This is a very important string that the server will use for encryption
JWT_SECRET="a very long string"

# No need to explicitly define this on services such as Heroku
PORT=8080

# Not implemented yet, but this is for the Twitter API Auth
TWITTER_API_KEY="YOUR_KEY_HERE"
TWITTER_CLIENT_ID="YOUR_CLIENT_ID_HERE"
TWITTER_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"

# This is used to enable Google Authorization feature
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"

# Development mode opens a /authentication/testing route
# which makes it easy to log-in without having to use any authorization
DEVELOPMENT_MODE="true"
```

### Frontend
```
# The url for the backend server
REACT_APP_API_URL="https://deebait.herokuapp.com"

# The Google Client ID same value from backend
REACT_APP_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"

# This shows the easy button for log-in without authentication
REACT_APP_DEVELOPMENT_MODE="true"
```

## Project Structure
### Backend
<details><summary>Show Directory Tree</summary>

```
.
├── cli.js
├── helper.js
├── models
│   ├── thread.js
│   ├── topic.js
│   └── user.js
├── package.json
├── package-lock.json
├── README.md
├── routes
│   ├── authentication.js
│   ├── decode-token.js
│   └── user-controls.js
├── server.js
├── sockets
│   ├── chat.js
│   └── connection.js
└── TODO
```
</details>

This is a simple and straightforward backend file management and structure. `./models` contain the [Mongoose Schema Definitions](https://mongoosejs.com/docs/guide.html), `./routes` contain the routes made with Express Router instance, and `./sockets` contain the implementation of the 
websockets. The main script to run for the server is obviously named `server.js` and CLI-tool for
manual database operations is `cli.js`

### Frontend
<details><summary>Show Directory Tree</summary>

```
deebait-react
├── package.json
├── package-lock.json
├── public
│   ├── cookie-policy.html
│   ├── favicon.ico
│   ├── images
│   │   └── triple-dot.gif
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── privacy-policy.html
│   ├── _redirects
│   ├── robots.txt
│   └── terms-of-service.html
├── README.md
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── components
    │   ├── AlignTextIcon.js
    │   ├── BrandBar.js
    │   ├── Dashboard.js
    │   ├── Debate.js
    │   ├── DebateMessage.js
    │   ├── DebateQuip.js
    │   ├── DesktopNavigation.js
    │   ├── EndButton.js
    │   ├── FAQ.js
    │   ├── Footer.js
    │   ├── History.js
    │   ├── HistoryView.js
    │   ├── Home.js
    │   ├── Landing.js
    │   ├── Loader.js
    │   ├── MobileNavigation.js
    │   ├── OpinionCard.js
    │   ├── Opinions.js
    │   ├── OpinionTable.js
    │   ├── PaperGridItem.js
    │   ├── SendButton.js
    │   ├── Settings.js
    │   └── TemporaryAlert.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    ├── setupTests.js
    └── Theme.js
```
</details>

This is written on [React v17](https://reactjs.org/blog/2020/10/20/react-v17.html). Currently looking at it, it could be messy since all components are on the same folder and there is no clear hierarchy of how things are. Would like to separate them by folder at a later date or like at least add a chart here that shows the hierarchy.