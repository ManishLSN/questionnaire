'use strict';

import React from 'react';
import ReactDom from 'react-dom';

let mountNode = document.getElementById('name-form');

class NameForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $('form').submit(function(event) {
      event.preventDefault();

      let name = $('#name').val();
      // Random username and password.
      let username = Math.random().toString(36).substr(2, 10);
      let password = Math.random().toString(36).substr(2, 7);
      // Dummy email id.
      let email = 'dummy@mailinator.com';

      dpd.users.post({
        "username": username,
        "password": password,
        "email": email,
        "name": name
      }, function(user, err) {
        if (err) {
          return console.log(err);
        }
        else {
          dpd.users.login({
            "username": username,
            "password": password
          }, function(user, err) {
            if (err) {
              return console.log(err);
            }
            else {
              window.location.href = 'participant.html?question=' + this.props.questionId;
            }
          }.bind(this));
        }
      }.bind(this));
    }.bind(this));
  }
  render() {
    return (
      <div>
        <h2>Enter your name</h2>
        <form>
          <div className="form-group">
            <input type="text" className="form-control" id="name" placeholder="Name" required />
          </div>
          <div className="btn-toolbar">
            <button type="submit" className="btn btn-success">Let's start</button>
          </div>
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
      ReactDom.render(<NameForm questionId={result[0].id} />, mountNode);
    }
  });
});
