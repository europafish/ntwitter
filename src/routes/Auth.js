import { useState } from "react";
import { AuthService } from "firebase/auth";
import { authService, firebaseInstance } from "../fbase";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true); // 로그인할지 회원가입 할지 여부 상태관리
  const [error, setError] = useState("");

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      await authService.setPersistence(
        firebaseInstance.auth.Auth.Persistence.SESSION
      );
      if (newAccount) {
        // create Account

        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // Login
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const onSocialClick = async (event) => {
    //console.log(event.target.name);
    const {
      target: { name },
    } = event;
    let provider;

    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = authService.signInWithPopup(provider);
    // console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        ></input>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        ></input>
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
        ></input>
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue With Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue With Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
