import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Unable to sign in.");
      }

      const data = await response.json();
      localStorage.setItem("mockToken", data.token);
      localStorage.setItem("mockUserId", username);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Streaming QA Login</h1>
        <p className="muted">Sign in to explore the mock streaming catalog.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input
              data-testid="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="test_user"
              required
            />
          </label>
          <label>
            Password
            <input
              data-testid="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="test_pass"
              required
            />
          </label>
          {error ? <div className="error">{error}</div> : null}
          <button data-testid="sign-in" className="primary" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
