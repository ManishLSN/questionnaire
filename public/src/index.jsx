'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Answers = React.createClass({
  getAnswersFrequency: function(answers, questionOptions) {
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
  },
  getInitialState: function() {
    return {
      answers: [],
      answersFrequency: [],
      questionOptions: []
    };
  },
  componentWillMount: function() {
    var query = {
      'questionId': this.props.questionId
    };

    dpd.questionoptions.get(query, function(result) {
      this.setState({
        questionOptions: result[0].options
      });
    }.bind(this));

    dpd.answer.get(query, function(result) {
      this.setState({
        answers: result
      });

      this.setState({
        answersFrequency: this.getAnswersFrequency(this.state.answers, this.state.questionOptions)
      });
    }.bind(this));
  },
  componentDidUpdate: function() {
    $('#' + this.props.questionId).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Result'
      },
      xAxis: {
        categories: this.state.questionOptions
      },
      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      series: [{
        data: this.state.answersFrequency
      }]
    });
  },
  render: function() {
    return (
      <div className="answers-wrapper" id={this.props.questionId}>
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
