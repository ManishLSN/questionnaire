'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Answers = React.createClass({
  displayName: 'Answers',

  getAnswersFrequency: function (answers, questionOptions) {
    // Thanks to http://stackoverflow.com/a/5668029/1233922.
    var tempCount = {};
    var counts = [];

    // Create a temporary array that stores frequency of every answer.
    for (var i = 0; i < answers.length; i++) {
      var answer = answers[i].answer;
      tempCount[answer] = tempCount[answer] ? tempCount[answer] + 1 : 1;
    }

    // Create a data structure suitable to D3.js graph rendering.
    for (var i = 0; i < questionOptions.length; i++) {
      // If answer is present for an option, then assign it's frequency.
      // Otherwise, assign 0.
      if (tempCount[questionOptions[i]]) {
        counts.push({
          'answer': questionOptions[i],
          'count': tempCount[questionOptions[i]]
        });
      } else {
        counts.push({
          'answer': questionOptions[i],
          'count': 0
        });
      }
    }

    return counts;
  },
  getInitialState: function () {
    return {
      answers: [],
      answersFrequency: [],
      questionOptions: []
    };
  },
  componentWillMount: function () {
    var query = {
      'questionId': this.props.questionId
    };

    dpd.questionoptions.get(query, function (result) {
      this.setState({
        questionOptions: result[0].options
      });
    }.bind(this));

    dpd.answer.get(query, function (result) {
      this.setState({
        answers: result
      });

      this.setState({
        answersFrequency: this.getAnswersFrequency(this.state.answers, this.state.questionOptions)
      });
    }.bind(this));
  },
  /*componentDidMount: function() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
     var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
     var y = d3.scale.linear()
        .range([height, 0]);
     var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
     var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(1, "%");
     var svg = d3.select(".answers-wrapper").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  },*/
  render: function () {
    return React.createElement(
      'div',
      { className: 'answers-wrapper' },
      this.state.answers.map(function (currentValue, index, array) {
        return React.createElement(
          'div',
          { key: currentValue.id },
          currentValue.answer
        );
      })
    );
  }
});

var Slides = React.createClass({
  displayName: 'Slides',

  getInitialState: function () {
    return {
      questions: []
    };
  },
  componentWillMount: function () {
    dpd.ques.get(function (result, err) {
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
  render: function () {
    if (this.state.error === undefined) {
      return React.createElement(
        'div',
        { className: 'slides' },
        this.state.questions.map(function (currentValue, index, array) {
          return React.createElement(
            'div',
            { key: currentValue.id },
            React.createElement(
              'div',
              { className: 'question' },
              currentValue.question
            ),
            React.createElement(Answers, { questionId: currentValue.id })
          );
        })
      );
    } else {
      console.log(this.state.error);
      return false;
    }
  }
});

ReactDOM.render(React.createElement(Slides, null), mountNode);