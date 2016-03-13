'use strict';

var mountNode = document.getElementById('post-question');

var SingleQuestion = React.createClass({
  render: function() {
    return (
      <div className="single-question-wrapper hidden">
        <textarea className="form-control" name="single-question"></textarea>
      </div>
    );
  }
});

var MultipleQuestion = React.createClass({
  handleAddMore: function(event) {
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
  getInitialState: function() {
    return {
      id: 1,
      questions: []
    };
  },
  componentDidMount: function() {
    var self = this;

    // Delete question and set new state.
    $(document).on('click', '.remove-question', function() {
      var $id = $(this).attr('data-attr');
      var newQuestions = self.state.questions.filter(function(question, index, questions) {
        return question.id != $id;
      });

      self.setState({
        questions: newQuestions
      });
    });
  },
  render: function() {
    var createItem = function(question) {
      return (
        <div key={question.id}>
          <span>{question.text}</span>
          <span data-attr={question.id} className="remove-question">Remove</span>
        </div>
      );
    }

    return (
      <div className="multiple-question-wrapper hidden">
        {this.state.questions.map(createItem)}
        <form onSubmit={this.handleAddMore}>
          <textarea className="form-control" ref="questionText"></textarea>
          <button className="btn btn-default">Add more</button>
        </form>
      </div>
    );
  }
});

var QuestionForm = React.createClass({
  componentDidMount: function() {
    // Toggle single/multiple question visibility as per user's selection.
    $('[name=question-type-option]').change(function() {
      switch ($(this).val()) {
        case 'single':
          $('.single-question-wrapper').removeClass('hidden');
          $('.multiple-question-wrapper').addClass('hidden');

          break;

        case 'multiple':
          $('.multiple-question-wrapper').removeClass('hidden');
          $('.single-question-wrapper').addClass('hidden');

          break;
      }
    });
  },
  render: function() {
    return (
      <div className="question-form-wrapper">
        <div className="question-title-wrapper">
          <h4>Enter question</h4>
          <input type="text" className="form-control" name="question-title" />
        </div>
        <div className="question-type-wrapper">
          <h4>Question type:</h4>
          <div className="radio">
            <label>
              <input type="radio" name="question-type-option" value="single" /> Single
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" name="question-type-option" value="multiple" /> Multiple
            </label>
          </div>
        </div>
        <SingleQuestion />
        <MultipleQuestion />
      </div>
    );
  }
});

ReactDOM.render(<QuestionForm />, mountNode);
