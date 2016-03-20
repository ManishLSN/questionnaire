'use strict';

var mountNode = document.getElementById('slides-wrapper');

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
  componentDidUpdate: function() {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
  },
  render: function() {
    if (this.state.error === undefined) {
      return (
        <div className="slides">
          {this.state.questions.map(function(currentValue, index, array) {
            return <div key={currentValue.id}>{currentValue.question}</div>;
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
