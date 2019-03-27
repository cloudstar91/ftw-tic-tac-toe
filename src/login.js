import React from "react";
import FacebookLogin from "react-facebook-login";

class Login extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   showLoginForm: true
    // };
  }

  render() {
    // const style = this.props.isLogin ? {} : { display: "none" };
    return (
      <div id="myForm">
        <h1>LOGIN WITH FACEBOOK </h1>
        {!this.props.isLogin && (
          <FacebookLogin
            className="form-popup"
            appId="316275069085315" //APP ID NOT CREATED YET
            fields="name,email,picture"
            callback={this.props.responseFacebook}
            disabled={!this.props.isLogin}
          />
        )}
      </div>
    );
  }
}

export default Login;
