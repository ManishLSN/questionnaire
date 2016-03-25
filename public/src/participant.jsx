'use strict';

var mountNode = document.getElementById('participant-form');

// Obtain question id from URL.
var uri = new URI(window.location.href);
var questionId = uri.search(true).question;

var ParticipantForm = React.createClass({
  handlePostAnswer: function(event) {
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
  },
  handleOptionChange: function(event) {
    // WTF!!
    // @TODO use https://github.com/chenglou/react-radio-group
    if (event.target.type === 'radio') {
      this.setState({
        selectedOption: event.target.value
      });
    }
  },
  getDefaultProps: function() {
    return {
      question: {},
      questionOptions: []
    };
  },
  getInitialState: function() {
    return {
      selectedOption: '',
      success: false
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.success === true;
  },
  render: function() {
    if (this.state.success) {
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
});

// Fetch question info and it's options, finally render the form.
dpd.ques.get(questionId, function(question, error) {
  var query = {
    "questionId": questionId
  };

  dpd.questionoptions.get(query, function(questionOptions, error) {
    ReactDOM.render(<ParticipantForm question={question} questionOptions={questionOptions[0].options}/>, mountNode);
  });
});

