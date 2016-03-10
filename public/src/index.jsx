'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Slides = React.createClass({
  componentDidMount: function() {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
  },
  render: function() {
    return (
      <div className="slides">
        <div>first content</div>
        <div>second content</div>
        <div>third content</div>
        <div>fourth content</div>
        <div>fifth content</div>
      </div>
    );
  }
});

ReactDOM.render(<Slides />, mountNode);
