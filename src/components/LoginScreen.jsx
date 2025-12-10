import { React, useState } from 'react';
import LogoCard from './LogoCard';
import { ClipLoader } from "react-spinners";
import FetchHelper from '../fetchHelper';

export default function LoginScreen({ onSignUp = () => { }, onLoginSuccess = () => { } }) {
  const [loginCall, setLoginCall] = useState({ state: "inactive" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationState, setValidationState] = useState(
    {
      email:"valid",
      password:"valid",
      overall:"valid"
    }
  );

  const handleLogin = async () => {
    // TODO: when backend ready -> fetch('/auth/login', {method:'POST', body: JSON.stringify({email,password})})
    // temporary: simulate loading and success
    var isValid = true
    var newValidationState = {
      email:"valid",
      password:"valid",
      overall:"valid"
    }

    if ( !password ) { isValid = false; newValidationState.password="Please enter your password"; }
    if ( !email ) { isValid = false; newValidationState.email="Please enter your email"; }

    setValidationState(newValidationState);

    if (isValid) {
      // Call backend to log in user
      const result = await FetchHelper.user.login(
        {
          email: email,
          password: password
        }
      )
      console.log(result)
      // If request is succesful
      if ( result.ok ) {
        const response = result.response;
        // Response is succesful, handle response data
        if (response.accessToken) {
            localStorage.setItem("accessToken", response.accessToken)
            localStorage.setItem("username", response.username)
            localStorage.setItem("email", response.email)
            localStorage.setItem("userId", response.userId)
            localStorage.setItem("authorId", response.authorId)
            onLoginSuccess();
        }else{
          newValidationState.overall = response.message ?? "Something went wrong...";
        }
      }
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-container auth-container-login">
        <div>
          <LogoCard />
        </div>
        <h1 className="title">Welcome</h1>
        <p className="subtitle">Log in to your account</p>
        <input className="input" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value) }/>
        <div className="error-message">{validationState.email != "valid" ? validationState.email : ""}</div>

        <input className="input" type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value) }/>
        <div className="error-message">{validationState.password != "valid" ? validationState.password : ""}</div>


        <button className="cta" onClick={handleLogin} style={{ marginTop: 18 }}>{
          loginCall.state === "pending" ?
            <ClipLoader color="white" size={20} /> : "Log in"
        }
        </button>
        <div className="error-message">{validationState.overall != "valid" ? validationState.overall : ""}</div>


        <button className="link" onClick={onSignUp}>Don’t have an account? Sign up</button>
      </div>
    </div>
  );
}