'use strict';

var mountNode = document.getElementById('post-question');

/*var Question = React.createClass({
  render: function() {
    return (
      <textarea className="form-control" name={this.props.questionId} value={this.props.questionText}></textarea>
    );
  }
});*/

var SingleQuestion = React.createClass({
  displayName: 'SingleQuestion',

  render: function () {
    return React.createElement(
      'div',
      { className: 'single-question-wrapper' },
      React.createElement('textarea', { className: 'form-control', name: 'single-question' })
    );
  }
});

var MultipleQuestion = React.createClass({
  displayName: 'MultipleQuestion',

  // Code taken from todo app example here:
  // https://facebook.github.io/react/index.html#examples
  onChange: function (event) {
    this.setState({
      text: event.target.value
    });
  },
  handleAddMore: function (event) {
    event.preventDefault();

    var nextQuestion = this.state.questions.concat([{
      id: this.state.questions.length + 1,
      text: this.state.text
    }]);
    this.setState({
      questions: nextQuestion,
      text: ''
    });
  },
  getInitialState: function () {
    return {
      questions: [],
      text: ''
    };
  },
  componentDidMount: function () {
    var self = this;

    $(document).on('click', '.remove-question', function () {
      var id = $(this).prev().attr('id').split('-');
      var newQuestions = self.state.questions.filter(function (question, index, questions) {
        return question.id != id[1];
      });
      console.log(newQuestions);

      self.setState({
        questions: newQuestions
      });
    });
  },
  render: function () {
    var createQuestion = function (question, index) {
      return React.createElement(
        'div',
        { className: 'question', key: Date.now() },
        React.createElement(
          'span',
          { id: "question-" + question.id },
          question.text
        ),
        React.createElement(
          'span',
          { className: 'remove-question' },
          'Remove'
        )
      );
    };

    return React.createElement(
      'div',
      { className: 'multiple-question-wrapper' },
      this.state.questions.map(createQuestion),
      React.createElement(
        'form',
        { onSubmit: this.handleAddMore },
        React.createElement('input', { onChange: this.onChange, value: this.state.text }),
        React.createElement(
          'button',
          null,
          'Add more'
        )
      )
    );
  }
});

var QuestionForm = React.createClass({
  displayName: 'QuestionForm',

  render: function () {
    return React.createElement(
      'div',
      { className: 'question-form-wrapper' },
      React.createElement(
        'div',
        { className: 'question-title-wrapper' },
        React.createElement(
          'h4',
          null,
          'Enter question'
        ),
        React.createElement('input', { type: 'text', className: 'form-control', name: 'question-title' })
      ),
      React.createElement(
        'div',
        { className: 'question-type-wrapper' },
        React.createElement(
          'h4',
          null,
          'Question type:'
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio', name: 'question-type', value: 'single' }),
            ' Single'
          )
        ),
        React.createElement(
          'div',
          { className: 'radio' },
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'radio', name: 'question-type', value: 'multiple' }),
            ' Multiple'
          )
        )
      ),
      React.createElement(SingleQuestion, null),
      React.createElement(MultipleQuestion, null)
    );
  }
});

ReactDOM.render(React.createElement(QuestionForm, null), mountNode);