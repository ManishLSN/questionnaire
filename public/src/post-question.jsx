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
  render: function() {
    return (
      <div className="single-question-wrapper">
        <textarea className="form-control" name="single-question"></textarea>
      </div>
    );
  }
});

var MultipleQuestion = React.createClass({
  // Code taken from todo app example here:
  // https://facebook.github.io/react/index.html#examples
  onChange: function(event) {
    this.setState({
      text: event.target.value
    });
  },
  handleAddMore: function(event) {
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
  getInitialState: function() {
    return {
      questions: [],
      text: ''
    };
  },
  componentDidMount: function() {
    var self = this;

    $(document).on('click', '.remove-question', function() {
      var id = $(this).prev().attr('id').split('-');
      var newQuestions = self.state.questions.filter(function(question, index, questions) {
        return question.id != id[1];
      });
      console.log(newQuestions);

      self.setState({
        questions: newQuestions
      });
    });
  },
  render: function() {
    var createQuestion = function(question, index) {
      return (
        <div className="question" key={Date.now()}>
          <span id={"question-" + question.id}>{question.text}</span>
          <span className="remove-question">Remove</span>
        </div>
      );
    }

    return (
      <div className="multiple-question-wrapper">
        {this.state.questions.map(createQuestion)}
        <form onSubmit={this.handleAddMore}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>Add more</button>
        </form>
      </div>
    );
  }
});

var QuestionForm = React.createClass({
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
              <input type="radio" name="question-type" value="single" /> Single
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" name="question-type" value="multiple" /> Multiple
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
