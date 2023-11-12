import { authService, firebaseInstance } from "fbase";
import { useState } from "react";
const AuthForm = () => {
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

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          className="authInput"
        ></input>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          className="authInput"
          required
        ></input>
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Log In"}
        ></input>
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
