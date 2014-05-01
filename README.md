#Github Team Viewer

[![Build Status](https://travis-ci.org/vinitkumar/github-team-viewer.svg?branch=v1.1.2)](https://travis-ci.org/vinitkumar/github-team-viewer)

Github Team Viewer is a handy application built with Angular.js which helps
you find developers from any organization on github.
In order to use it just enter company name in the search bar and you will get a list of developers.

Then, click on any of the image to get detailed information such as email,
website and location. Also, you can check their projects by clicking on check projects
button.

<img src="https://i.cloudup.com/tNcPJgI_GN.gif" height="600" width="800">


## Installation

```sh
git clone git@github.com:vinitkumar/github-team-viewer.git
cd github-team-viewer
npm install
npm start
```

The app will be running on [http://localhost:5000](http://localhost:5000)

## Background

The app is built with Angular.js and Github API. You should take care that github
doesn't allow more than 60 requests per hour per IP. Since there is no
oauth implemented in the system as of yet.








