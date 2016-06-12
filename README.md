# Real Time Crowd Survey using DeployD and ReactJs

# Demo
https://subhojit777-questionnaire.herokuapp.com

# Installation
- [Install MongoDB](https://docs.mongodb.org/manual/installation)
- `git clone https://github.com/subhojit777/questionnaire.git && cd questionnaire`
- `npm install`
- Execute `dpd` from terminal and visit [http://localhost:2403](http://localhost:2403)

# Usage
- Go to root directory of project and execute `dpd` from terminal
- Visit [http://localhost:2403](http://localhost:2403) to see the main page of the project

## Project features
#### Presenter page
Question with a graphical representation of answers is displayed. This page shows realtime polls.
#### Poll
Participant will be able to submit their votes from this page. This page is in sync with the presenter page, i.e. when a presenter changes question, this page will show the current question.

## What else?
You can only participate in polls if you are an authenticated user. This may seem a bit clumsy - as a lazy user has to fill out his name, usename, email and password (twice) and has to register "and" login to answer a poll. Therefore, I have added a simpler approach. In this approach you have to enter your name to participate in poll. However, in this approach you will register and login at the same time, but you have to enter your name only.

The registration process is in [`master`](https://github.com/subhojit777/questionnaire/tree/master) branch. And the simpler approach or kind of "no authentication" approach is in [`noauth`](https://github.com/subhojit777/questionnaire/tree/noauth) branch.

The demo is in no authentication approach.
