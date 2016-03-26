'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var URI = require('urijs');

var mountNode = document.getElementById('participant-form');

// Obtain question id from URL.
var uri = new URI(window.location.href);
var questionId = uri.search(true).question;

/**
 * Participant form component.
 */
class ParticipantForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      success: false
    };

    this.handlePostAnswer = this.handlePostAnswer.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  handlePostAnswer(event) {
    event.preventDefault();

    // @TODO Don't hardcode user id.
    var postData = {
      'questionId': this.props.question.id,
      'answer': this.state.selectedOption,
      'userId': 'fe851c8b5e6a1812',
      'time': Date.now()
    };

    dpd.answer.post(postData, function(result, err) {
      if(err) return console.log(err);
      this.setState({
        success: true
      });
    }.bind(this));
  }
  handleOptionChange(event) {
    // WTF!!
    // @TODO use https://github.com/chenglou/react-radio-group
    if (event.target.type === 'radio') {
      this.setState({
        selectedOption: event.target.value
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // Update component ONLY IF answer post is successful.
    return nextState.success === true;
  }
  componentDidUpdate() {
    // Reset success state.
    if (this.state.success) {
      this.setState({
        success: false
      });
    }
  }
  render() {
    if (this.state.success) {
      // @TODO May be we can move this to a new component, or a mixin?
      var alert = <div className="alert alert-success alert-dismissible fade in" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <strong>Answer submitted</strong>
      </div>
    }
    else {
      var alert = '';
    }

    return (
      <div className="form-wrapper">
        {alert}
        <form onSubmit={this.handlePostAnswer}>
          <h3 className="question">{this.props.question.question}</h3>
          {/* @TODO use https://github.com/chenglou/react-radio-group */}
          <div className="options-wrapper well" onClick={this.handleOptionChange}>
            {this.props.questionOptions.map(function(currentValue, index, array) {
              return (
                <div className="radio">
                  <label>
                    <input type="radio" name="options" value={currentValue} /> {currentValue}
                  </label>
                </div>
              );
            })}
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

ParticipantForm.defaultProps = {
  question: {},
  questionOptions: []
}

// Fetch question info and it's options, finally render the form.
dpd.ques.get(questionId, function(question, error) {
  var query = {
    "questionId": questionId
  };

  dpd.questionoptions.get(query, function(questionOptions, error) {
    ReactDOM.render(<ParticipantForm question={question} questionOptions={questionOptions[0].options}/>, mountNode);
  });
});
