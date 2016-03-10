'use strict';

var mountNode = document.getElementById('slides-wrapper');

var Slides = React.createClass({
  displayName: 'Slides',

  componentDidMount: function () {
    $('.slides').slick({
      prevArrow: '<a>Previous</a>',
      nextArrow: '<a>Next</a>'
    });
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'slides' },
      React.createElement(
        'div',
        null,
        'first content'
      ),
      React.createElement(
        'div',
        null,
        'second content'
      ),
      React.createElement(
        'div',
        null,
        'third content'
      ),
      React.createElement(
        'div',
        null,
        'fourth content'
      ),
      React.createElement(
        'div',
        null,
        'fifth content'
      )
    );
  }
});

ReactDOM.render(React.createElement(Slides, null), mountNode);