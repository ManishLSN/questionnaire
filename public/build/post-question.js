'use strict';

var mountNode = document.getElementById('post-question');

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

  handleAddMore: function (event) {
    event.preventDefault();

    var newQuestions = this.state.questions.concat([{
      id: this.state.id,
      text: this.refs.questionText.value
    }]);
    var newId = this.state.id + 1;

    // Reset the question field.
    this.refs.questionText.value = '';

    this.setState({
      id: newId,
      questions: newQuestions
    });
  },
  getInitialState: function () {
    return {
      id: 1,
      questions: []
    };
  },
  componentDidMount: function () {
    var self = this;

    // Delete question and set new state.
    $(document).on('click', '.remove-question', function () {
      var $id = $(this).attr('data-attr');
      var newQuestions = self.state.questions.filter(function (question, index, questions) {
        return question.id != $id;
      });

      self.setState({
        questions: newQuestions
      });
    });
  },
  render: function () {
    var createItem = function (question) {
      return React.createElement(
        'div',
        { key: question.id },
        React.createElement(
          'span',
          null,
          question.text
        ),
        React.createElement(
          'span',
          { 'data-attr': question.id, className: 'remove-question' },
          'Remove'
        )
      );
    };

    return React.createElement(
      'div',
      { className: 'multiple-question-wrapper' },
      this.state.questions.map(createItem),
      React.createElement(
        'form',
        { onSubmit: this.handleAddMore },
        React.createElement('textarea', { className: 'form-control', ref: 'questionText' }),
        React.createElement(
          'button',
          { className: 'btn btn-default' },
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