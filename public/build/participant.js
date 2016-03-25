'use strict';

var mountNode = document.getElementById('participant-form');

// Obtain question id from URL.
var uri = new URI(window.location.href);
var questionId = uri.search(true).question;

/**
 * Participant form component.
 */
var ParticipantForm = React.createClass({
  displayName: 'ParticipantForm',

  handlePostAnswer: function (event) {
    event.preventDefault();

    // @TODO Don't hardcode user id.
    var postData = {
      'questionId': this.props.question.id,
      'answer': this.state.selectedOption,
      'userId': 'fe851c8b5e6a1812',
      'time': Date.now()
    };

    dpd.answer.post(postData, function (result, err) {
      if (err) return console.log(err);
      this.setState({
        success: true
      });
    }.bind(this));
  },
  handleOptionChange: function (event) {
    // WTF!!
    // @TODO use https://github.com/chenglou/react-radio-group
    if (event.target.type === 'radio') {
      this.setState({
        selectedOption: event.target.value
      });
    }
  },
  getDefaultProps: function () {
    return {
      question: {},
      questionOptions: []
    };
  },
  getInitialState: function () {
    return {
      selectedOption: '',
      success: false
    };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return nextState.success === true;
  },
  render: function () {
    if (this.state.success) {
      // @TODO May be we can move this to a new component, or a mixin.
      var alert = React.createElement(
        'div',
        { className: 'alert alert-success alert-dismissible fade in', role: 'alert' },
        React.createElement(
          'button',
          { type: 'button', className: 'close', 'data-dismiss': 'alert', 'aria-label': 'Close' },
          React.createElement(
            'span',
            { 'aria-hidden': 'true' },
            '×'
          )
        ),
        React.createElement(
          'strong',
          null,
          'Answer submitted'
        )
      );

      // Reset success state.
      this.setState({
        success: false
      });
    } else {
      var alert = '';
    }

    return React.createElement(
      'div',
      { className: 'form-wrapper' },
      alert,
      React.createElement(
        'form',
        { onSubmit: this.handlePostAnswer },
        React.createElement(
          'h3',
          { className: 'question' },
          this.props.question.question
        ),
        React.createElement(
          'div',
          { className: 'options-wrapper well', onClick: this.handleOptionChange },
          this.props.questionOptions.map(function (currentValue, index, array) {
            return React.createElement(
              'div',
              { className: 'radio' },
              React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'radio', name: 'options', value: currentValue }),
                ' ',
                currentValue
              )
            );
          })
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn btn-primary' },
          'Submit'
        )
      )
    );
  }
});

// Fetch question info and it's options, finally render the form.
dpd.ques.get(questionId, function (question, error) {
  var query = {
    "questionId": questionId
  };

  dpd.questionoptions.get(query, function (questionOptions, error) {
    ReactDOM.render(React.createElement(ParticipantForm, { question: question, questionOptions: questionOptions[0].options }), mountNode);
  });
});