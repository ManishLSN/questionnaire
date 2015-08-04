# DeployD + ReactJs 
> Real Time Crowd Survey using DeployD + ReactJs 

## Requirements
DeployD[Link](http://deployd.com)

ReactJs[Link](http://facebook.github.io/react/docs/getting-started.html)

ReactJs-Cookie[Link](https://www.npmjs.com/package/react-cookie)

ReactJs-d3-Component(To draw Graph)[Link](https://github.com/codesuki/react-d3-components)

SlidesJS[Link](www.slidesjs.com/)

## Clone the Project 

$ git clone https://github.com/vishalchandna1/project1

#How To Run?

## 1. Set up DeployD

### install from npm

	npm install deployd -g

### install on windows

[Download](https://bintray.com/artifact/download/deployd/dpd-win-installer/deployd-win-0.8.0.exe) the installer.

### install on macosx

The macosx installer is deprecated. The recommended way is now npm (`npm install deployd -g`) and [install mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) separately.

### install from source

	git clone https://github.com/deployd/deployd.git
	npm install
	npm link

## 2. Running the project

1. Go to the root directory of the project ...\project\ and type "dpd" in your terminal to run the project

2. After Doing that Your local server has started at port number 2403 and listening for the requests

3. Open up your browser and open up the URL : localhost:2403 or 127.0.0.1:2403

# localhost:2403/dashboard

IT will open up your dashboard that helps to create collections and events.

For more info [Link](http://deployd.com)

# localhost:2403/admin.html

1. This page respresents a list of questions. 
2. And you can post a question

# localhost:2403/presentQuestion.html?Qid

Qid = Id of the question that is to be presented to the user eg. localhost:2403/presentQuestion.html?f5b91ab886325839

# localhost:2403/presentQuestion.html?Qid?mode

mode respresents two types of mode that is Presenter mode and Guest mode

1. mode = true represent Presenter mode eg. localhost:2403/presentQuestion.html?f5b91ab886325839?true
2. mode = false represent Guest mode eg. localhost:2403/presentQuestion.html?f5b91ab886325839?false
					
By Default : mode =false eg.  localhost:2403/presentQuestion.html?f5b91ab886325839
