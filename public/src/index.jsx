'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Answers = React.createClass({
  getAnswersFrequency: function(answers) {
    // Thanks to http://stackoverflow.com/a/5668029/1233922
    var counts = {};

    for(var i = 0; i < answers.length; i++) {
      var answer = answers[i].answer;
      counts[answer] = counts[answer] ? counts[answer] + 1 : 1;
    }

    return counts;
  },
  getInitialState: function() {
    return {
      answers: [],
      answersFrequency: {}
    };
  },
  componentWillMount: function() {
    var query = {
      'questionId': this.props.questionId
    };

    dpd.answer.get(query, function(result) {
      this.setState({
        answers: result
      });

      this.setState({
        answersFrequency: this.getAnswersFrequency(this.state.answers)
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div className="answers-wrapper">
        {this.state.answers.map(function(currentValue, index, array) {
          return (
            <div key={currentValue.id}>{currentValue.answer}</div>
          );
        })}
      </div>
    );
  }
});

var Slides = React.createClass({
  getInitialState: function() {
    return {
      questions: []
    };
  },
  componentWillMount: function() {
    dpd.ques.get(function(result, err) {
      if (err) {
        this.setState({
          error: err
        });
      }

      this.setState({
        questions: result
      });
    }.bind(this));
  },
  componentDidUpdate: function() {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
  },
  render: function() {
    if (this.state.error === undefined) {
      return (
        <div className="slides">
          {this.state.questions.map(function(currentValue, index, array) {
            return (
              <div key={currentValue.id}>
                <div className="question">{currentValue.question}</div>
                <Answers questionId={currentValue.id} />
              </div>
            );
          })}
        </div>
      );
    }
    else {
      console.log(this.state.error);
      return false;
    }
  }
});

ReactDOM.render(<Slides />, mountNode);
