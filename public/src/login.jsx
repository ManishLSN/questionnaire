import React from 'react';
import  ReactDOM from 'react-dom';

let mountNode = document.getElementById('login-form');

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // Hide alert.
    $('.close').click(function() {
      $(this).parent().removeClass('in');
    });

    $('form').submit(function(event) {
      event.preventDefault();

      dpd.users.login({"username": $('#username').val(), "password": $('#password').val()}, function(user, err) {
        if (err) {
          $('#alert-warning').addClass('in');
          $('#alert-warning strong').text(err.message);
        }
        else {
          window.location.href = 'participant.html?question=' + this.props.questionId;
        }
      }.bind(this));
    }.bind(this));
  }
  render() {
    return (
      <div>
        <h2>Log in</h2>
        <div className="alert alert-warning alert-dismissible fade collapse" role="alert" id="alert-warning">
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <strong></strong>
        </div>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" id="username" placeholder="Username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
}

dpd.ques.get(function(result, err) {
  dpd.users.me(function(user) {
    if (user) {
      window.location.href = 'participant.html?question=' + result[0].id;
    }
    else {
      ReactDOM.render(<LoginForm questionId={result[0].id} />, mountNode);
    }
  });
});
