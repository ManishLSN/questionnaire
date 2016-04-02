'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactHighcharts = require('react-highcharts');
var URI = require('urijs');

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
 * Question answer wrapper.
 *
 * This will render the question and it's graph.
 */
class QuestionAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {},
      graphConfig: {}
    }
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
  componentWillMount() {
    var self = this;
    var query = {
      'questionId': this.props.questionId
    };

    // @TODO so many nesting!!!
    dpd.ques.get(self.props.questionId, function(questionResult) {
      dpd.questionoptions.get(query, function(questionOptionsResult) {
        dpd.answer.get(query, function(answersResult) {
          self.setState({
            question: questionResult,
            graphConfig: {
              chart: {
                type: 'column'
              },
              title: {
                text: 'Result'
              },
              xAxis: {
                categories: questionOptionsResult[0].options
              },
              yAxis: {
                title: {
                  text: 'Frequency'
                }
              },
              series: [{
                data: self.getAnswersFrequency(answersResult, questionOptionsResult[0].options)
              }]
            }
          });
        });
      });
    });

  }
  render() {
    return (
      <div className="question-answer-wrapper">
        <Question question={this.state.question} />
        <ReactHighcharts config={this.state.graphConfig}></ReactHighcharts>
      </div>
    );
  }
}

ReactDOM.render(<QuestionAnswer questionId={questionId} />, mountNode);
