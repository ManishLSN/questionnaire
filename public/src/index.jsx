'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactHighcharts = require('react-highcharts');
var URI = require('urijs');
var array = require('lodash/array');
var collection = require('lodash/collection');

var mountNode = document.getElementById('slides-wrapper');

// Obtain question id from URL.
var uri = new URI(window.location.href);
var questionId = uri.search(true).question;

/**
 * Question component.
 *
 * This is used to render question.
 */
class Question extends React.Component {
  render() {
    return (
      <div className="question">{this.props.question.question}</div>
    );
  }
}

/**
 * Navigate question component.
 *
 * This renders question navigational links.
 */
class NavigateQuestion extends React.Component {
  // Generate href.
  // This is similar to Drupal's url() https://api.drupal.org/api/drupal/includes%21common.inc/function/url/7
  // @TODO This is 2016 and I am creating href like this?? WTF!!
  href(url) {
    return url._parts.protocol + '://' + url._parts.hostname + (url._parts.port ? (':' + url._parts.port) : '') + (url._parts.query ? ('?' + (url._parts.query)) : '');
  }
  directionText(direction) {
    switch (direction) {
      case 'next':
        return 'Next';
        break;

      case 'previous':
        return 'Previous';
        break;
    }
  }
  render() {
    let url = new URI(window.location.href).query({
      question: this.props.questionId
    });

    return (
      <a href={this.href(url)}>{this.directionText(this.props.direction)}</a>
    );
  }
}

/**
 * Question answer wrapper.
 *
 * This will render the question and it's graph.
 */
class QuestionAnswer extends React.Component {
  constructor(props) {
    super(props);

    this.question = collection.find(props.questions, function(o) { return o.id == props.questionId; }).question;
    this.graphConfig = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Result'
      },
      xAxis: {
        categories: props.questionOptions
      },
      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      series: [{
        data: this.getAnswersFrequency(props.answers, props.questionOptions)
      }]
    };

    this.state = {
      answers: props.answers
    };
  }
  getAnswersFrequency(answers, questionOptions) {
    // Thanks to http://stackoverflow.com/a/5668029/1233922.
    var tempCount = {};
    var counts = [];

    // Create a temporary array that stores frequency of every answer.
    for(var i = 0; i < answers.length; i++) {
      var answer = answers[i].answer;
      tempCount[answer] = tempCount[answer] ? tempCount[answer] + 1 : 1;
    }

    // Create a data structure suitable for graph rendering.
    for (var i = 0; i < questionOptions.length; i++) {
      // If answer is present for an option, then assign it's frequency.
      // Otherwise, assign 0.
      if (tempCount[questionOptions[i]]) {
        counts.push(tempCount[questionOptions[i]]);
      }
      else {
        counts.push(0);
      }
    }

    return counts;
  }
  getPreviousQuestionId(questions, questionId) {
    let index = array.findIndex(questions, function(o) { return o.id == questionId; });

    if ((index - 1) < 0) {
      return questions[questions.length - 1].id;
    }
    else {
      return questions[index - 1].id;
    }
  }
  getNextQuestionId(questions, questionId) {
    let index = array.findIndex(questions, function(o) { return o.id == questionId; });

    if ((index + 1) > (questions.length - 1)) {
      return questions[0].id;
    }
    else {
      return questions[index + 1].id;
    }
  }
  componentDidMount() {
    let self = this;

    dpd.answer.on('create', function(answer) {
      // Only update state if answer submitted for the same question that we are
      // currently viewing.
      if (answer.questionId == self.props.questionId) {
        self.setState({
          answers: self.state.answers.concat(answer)
        });
      }
    });
  }
  componentWillUpdate(nextProps, nextState) {
    this.graphConfig.series = [{
      data: this.getAnswersFrequency(nextState.answers, this.props.questionOptions)
    }];
  }
  render() {
    return (
      <div className="question-answer-wrapper">
        <Question question={this.question} />
        <ReactHighcharts config={this.graphConfig}></ReactHighcharts>
        <div className="navigation-wrapper">
          <NavigateQuestion questionId={this.getPreviousQuestionId(this.props.questions, this.props.questionId)} direction="previous" />
          <NavigateQuestion questionId={this.getNextQuestionId(this.props.questions, this.props.questionId)} direction="next" />
        </div>
      </div>
    );
  }
}

dpd.ques.get(function(questionsResult, err) {
  // Create a data structure where question is mapped with it's id.
  // This will help us to create next/previous links.
  let questions = questionsResult.map(function(currentValue) {
    let obj = {};
    obj['id'] = currentValue.id;
    obj['question'] = currentValue;
    return obj;
  }, {});

  // If no question id is passed in URL, render the first question from
  // database (no particular order).
  if (questionId === undefined) {
    let question = array.head(questions);
    questionId = question['id'];
  }

  let query = {
    'questionId': questionId
  };

  dpd.questionoptions.get(query, function(questionOptionsResult) {
    dpd.answer.get(query, function(answersResult) {
      ReactDOM.render(<QuestionAnswer questionId={questionId} questions={questions} questionOptions={questionOptionsResult[0].options} answers={answersResult} />, mountNode);
    });
  });
});
