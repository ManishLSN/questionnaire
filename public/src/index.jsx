'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Slides = React.createClass({
  getInitialState: function() {
    return {
      questions: {}
    };
  },
  componentWillMount: function() {
    dpd.ques.get(function(result, err) {
      if (err) {
        return console.log(err);
      }

      this.setState({
        questions: result
      });
    }.bind(this));
  },
  componentDidMount: function() {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
  },
  render: function() {
    console.log(this.state.questions);
    return (
      <div className="slides">
        <div>hello</div>
      </div>
    );
  }
});

ReactDOM.render(<Slides />, mountNode);
