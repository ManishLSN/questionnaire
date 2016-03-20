'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Answers = React.createClass({
  displayName: 'Answers',

  getInitialState: function () {
    return {
      answers: []
    };
  },
  componentWillMount: function () {
    var query = {
      'questionId': this.props.questionId
    };

    dpd.answer.get(query, function (result) {
      this.setState({
        answers: result
      });
    }.bind(this));
  },
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
  componentDidUpdate: function () {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
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