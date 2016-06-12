'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

let mountNode = document.getElementById('register-form');

class RegisterForm extends React.Component {
  componentDidMount() {
    $('.close').click(function() {
      $(this).parent().removeClass('in');
    });

    $('form').submit(function(event) {
      event.preventDefault();

      let name = $('#name').val();
      let username = $('#username').val();
      let email = $('#email').val();
      let password = $('#password').val();
      let confirmPassword = $('#confirm-password').val();
      let query = {};

      if ((username == '') || (email == '') || (password == '') || (name == '')) {
        $('#alert-warning').addClass('in');
        $('#alert-warning strong').text('Enter all information');

        return false;
      }

      if (password !== confirmPassword) {
        $('#alert-warning').addClass('in');
        $('#alert-warning strong').text('Passwords not matching');

        return false;
      }

      // Check if email is unique.
      // @TODO too many nested callbacks.
      query = {"email": email};
      dpd.users.get(query, function(result) {
        if (result.length) {
          $('#alert-success').removeClass('in');
          $('#alert-warning').addClass('in');
          $('#alert-warning strong').text('Email already exists');
        }
        else {
          // Check if username is unique.
          query = {"username": username};
          dpd.users.get(query, function(result) {
            if (result.length) {
              $('#alert-success').removeClass('in');
              $('#alert-warning').addClass('in');
              $('#alert-warning strong').text('Username already exists');
            }
            else {
              // Everything is alright.
              // Store data to database.
              dpd.users.post({"username": username, "password": password,  "email": email, "name": name}, function(user, err) {
                if(err) return console.log(err);
                $('#alert-warning').removeClass('in');
                $('#alert-success').addClass('in');
                $('#alert-success strong').text('You are successfully registered');
              });
            }
          });
        }
      });
    });
  }
  render() {
    return (
      <div>
        <h2>Create new account</h2>
        <div className="alert alert-warning alert-dismissible fade collapse" role="alert" id="alert-warning">
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <strong></strong>
        </div>
        <div className="alert alert-success alert-dismissible fade collapse" role="alert" id="alert-success">
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <strong></strong>
        </div>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" id="name" placeholder="Name" />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" id="username" placeholder="Username" />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" className="form-control" id="confirm-password" placeholder="Confirm password" />
          </div>
          <div className="btn-toolbar">
            <button type="submit" className="btn btn-success">Submit</button>
            <a href="login.html" className="btn btn-default">Log in</a>
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
      ReactDOM.render(<RegisterForm />, mountNode);
    }
  });
});
