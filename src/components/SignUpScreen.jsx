import React, { useState } from 'react';
import LogoCard from './LogoCard';
import { ClipLoader } from "react-spinners";
import FetchHelper from '../fetchHelper';

export default function SignUpScreen({ onLogin = () => { }, onRegisterSuccess = () => { } }) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [registerCall, setRegisterCall] = useState({ state: "inactive" });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationState, setValidationState] = useState(
    {
      username:"valid",
      email:"valid",
      password:"valid",
      overall:"valid"
    }
  );

  const password_re = new RegExp("^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9])(?!.*\s).*$");

  const handleRegister = async () => {
    // TODO: when backend ready -> fetch('/auth/login', {method:'POST', body: JSON.stringify({email,password})})
    // temporary: simulate loading and success
    var isValid = true
    var newValidationState = {
      username:"valid",
      email:"valid",
      password:"valid",
      overall:"valid"
    }

    if ( !username ) { isValid = false; newValidationState.username="A username is required"; }
    if ( !email ) { isValid = false; newValidationState.email="An email is required"; }

    if ( !password_re.test(password) ) { isValid=false; newValidationState.password="Password must be at least 10 characters long and include an uppercase letter, a lowercase letter, a number, and a special character. Spaces are not allowed. (dev: abcdefghijkL+1)" }
    if ( !password ) { isValid = false; newValidationState.password="A password is required"; }

    
    if (isValid) {
        // Call backend to register user
        const result = await FetchHelper.user.register(
          {
            username: username,
            email: email,
            password: password
          }
        )
        console.log( result )
        // If request is succesful
        if ( result.ok ) {
          const response = result.response;
          // Response is succesful, handle response data
          if (response.status === "success") {
              // Registration was successful, prompt the user to log in,
              // we could automatically log in the user right here, although in the case there is a problem with the logging in, it might
              // cause problems later
              //
              // Besides, the backend doesnt send responses yet, so we can do that once thats fixed
              onRegisterSuccess();
          }
          // Error, display response error
          if (response.status === "error") {
            newValidationState.overall = response.message;
          }

        }else{
          newValidationState.overall = "Something went wrong...";
        }
    }else{
        //invalid
    }
    setValidationState(newValidationState)
  }

  return (
    <div className="auth-root signup-root">
      <div className={`auth-container auth-container-signup ${isAuthor ? 'author-mode' : ''}`}
        style={{ minHeight: "100vh" }}>
        <LogoCard />
        <h1 className="title">Welcome</h1>
        <p className="subtitle">Sign up to get started</p>

        <input className="input" placeholder="Username" value={username} onChange={ (e) => setUsername(e.target.value) }/>
        <div className="error-message">{validationState.username != "valid" ? validationState.username : ""}</div>

        <input className="input" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value) }/>
        <div className="error-message">{validationState.email != "valid" ? validationState.email : ""}</div>

        <input className="input" type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value) }/>
        <div className="error-message">{validationState.password != "valid" ? validationState.password : ""}</div>

        <div className="checkbox-row" onClick={() => setIsAuthor(!isAuthor)} style={{ cursor: 'pointer' }}>
          <div className={`checkbox ${isAuthor ? 'checked' : ''}`}>{isAuthor && <div className="tick" />}</div>
          <div style={{ color: '#fff' }}>I want to be an author</div>
        </div>

        {/*isAuthor && (
          <>
            <div className="small-label">Author biography</div>
            <textarea className="input textarea" placeholder="Short biography (min 20 characters)" />

            <div className="small-label">Genres (comma separated)</div>
            <input className="input" placeholder="e.g. Fantasy, Sci-fi, Drama" />
            <div className="note">Separate multiple genres with commas. At least one genre is recommended.</div>
          </>
        )*/}

        <button className="cta" onClick={handleRegister} style={{ marginTop: 18 }}>{
          registerCall.state === "pending" ?
            <ClipLoader color="white" size={20} /> : "Sign up"
        }
        </button>
        <div className="error-message">{validationState.overall != "valid" ? validationState.overall : ""}</div>

        <button style={{ marginBottom: 50 }} className="link" onClick={onLogin}>Already have an account? Log in</button>
      </div>
    </div>
  );
}