import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  // ================= STATES =================
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await axios.post(`${API}/account-info`, {
        accountNumber: Number(accountNumber),
        pin
      });

      setLoggedIn(true);
      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
      setName(res.data.name);
      setMessage("✅ Login successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setTransactions([]);
    setBalance(null);
    setMessage("Logged out successfully");
  };

  // ================= CREATE ACCOUNT =================
  const createAccount = async () => {
    try {
      const res = await axios.post(`${API}/create-account`, {
        name,
        pin,
        balance: Number(amount)
      });

      setMessage(`✅ Account Created! Account Number: ${res.data.accountNumber}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating account");
    }
  };

  // ================= DEPOSIT =================
  const deposit = async () => {
    try {
      await axios.post(`${API}/deposit`, {
        accountNumber: Number(accountNumber),
        amount: Number(amount)
      });

      setMessage("💰 Deposit Successful!");
      refreshAccount();
    } catch (err) {
      setMessage(err.response?.data?.message || "Deposit failed");
    }
  };

  // ================= WITHDRAW =================
  const withdraw = async () => {
    try {
      await axios.post(`${API}/withdraw`, {
        accountNumber: Number(accountNumber),
        pin,
        amount: Number(amount)
      });

      setMessage("🏧 Withdrawal Successful!");
      refreshAccount();
    } catch (err) {
      setMessage(err.response?.data?.message || "Withdrawal failed");
    }
  };

  // ================= TRANSFER =================
  const transfer = async () => {
    try {
      await axios.post(`${API}/transfer`, {
        fromAccount: Number(accountNumber),
        toAccount: Number(toAccount),
        pin,
        amount: Number(amount)
      });

      setMessage("💸 Transfer Successful!");
      refreshAccount();
    } catch (err) {
      setMessage(err.response?.data?.error || "Transfer failed");
    }
  };

  const refreshAccount = async () => {
    try {
      const res = await axios.post(`${API}/account-info`, {
        accountNumber: Number(accountNumber),
        pin
      });

      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
    } catch {}
  };

  // ================= LOGIN SCREEN =================
  if (!loggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.loginWrapper}>
          <div style={styles.loginCard}>
            <h1 style={{ marginBottom: "20px" }}>🏦 Virtual Bank</h1>

            <input
              style={styles.input}
              placeholder="Account Number"
              onChange={e => setAccountNumber(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="PIN"
              onChange={e => setPin(e.target.value)}
            />
            <button style={styles.button} onClick={login}>
              Login
            </button>

            <p style={styles.message}>{message}</p>
          </div>

          <div style={styles.createCard}>
            <h2>Create Account</h2>
            <input style={styles.input} placeholder="Name" onChange={e => setName(e.target.value)} />
            <input style={styles.input} type="password" placeholder="PIN" onChange={e => setPin(e.target.value)} />
            <input style={styles.input} placeholder="Initial Balance" onChange={e => setAmount(e.target.value)} />
            <button style={styles.button} onClick={createAccount}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div style={styles.container}>
      <h1>🏦 Welcome, {name}</h1>
      <h2>Balance: ₹{balance}</h2>
      <button style={styles.logout} onClick={logout}>Logout</button>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Deposit</h3>
          <input style={styles.input} placeholder="Amount" onChange={e => setAmount(e.target.value)} />
          <button style={styles.button} onClick={deposit}>Deposit</button>
        </div>

        <div style={styles.card}>
          <h3>Withdraw</h3>
          <input style={styles.input} placeholder="Amount" onChange={e => setAmount(e.target.value)} />
          <button style={styles.button} onClick={withdraw}>Withdraw</button>
        </div>

        <div style={styles.card}>
          <h3>Transfer</h3>
          <input style={styles.input} placeholder="To Account" onChange={e => setToAccount(e.target.value)} />
          <input style={styles.input} placeholder="Amount" onChange={e => setAmount(e.target.value)} />
          <button style={styles.button} onClick={transfer}>Transfer</button>
        </div>
      </div>

      <div style={styles.historyCard}>
        <h2>📜 Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul style={styles.list}>
            {transactions.map((t, index) => (
              <li key={index} style={styles.listItem}>
                {t.type} | ₹{t.amount} | {new Date(t.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
    color: "#fff",
    fontFamily: "Segoe UI",
    padding: "40px"
  },

  loginWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap"
  },

  loginCard: {
    background: "#fff",
    color: "#333",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center"
  },

  createCard: {
    background: "#fff",
    color: "#333",
    padding: "25px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "40px auto"
  },

  card: {
    background: "#fff",
    color: "#333",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
  },

  historyCard: {
    background: "#fff",
    color: "#333",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "800px",
    margin: "20px auto"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2a5298",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },

  logout: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "red",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  },

  list: {
    listStyle: "none",
    padding: 0
  },

  listItem: {
    padding: "8px",
    borderBottom: "1px solid #ccc"
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold"
  }
};

export default App;
