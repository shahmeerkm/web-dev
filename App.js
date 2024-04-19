import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    idno: "",
    email: "",
    password: "",
    age: 0,
    name: "",
    jobid :"",
    isadmin:""
  });
  const [user, setUser] = useState({ loggedIn: false, token: "" });
  const [recipe, setRecipe] = useState([]);

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const signupSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/signup",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/login",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
      if (res.data.token) setUser({ loggedIn: true, token: res.data.token });
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const handleAddIngredientForm = (e) =>
    setIngredientForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const AddIngredient = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/books/AddIngredient",
        method: "post",
        data: { ...ingredientForm, ingredientid: data.ingredientid },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.msg === "Ingredient added");
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  
  return (
    <div
      className="mera-dabba"
    >
      {user.loggedIn ? (
        <div style={{ margin: 50 }}>
          <form
            onSubmit={AddIngredient}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>Add Ingredient</h1>
              
              <input
                type="text"
                name="ingredientid"
                value={data.name}
                onChange={handleAddIngredientForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="name"
                value={data.year}
                onChange={handleAddIngredientForm}
                style={{ margin: 5 }}
              />

              <input
                type="text"
                name="description"
                value={data.genre}
                onChange={handleAddIngredientForm}
                style={{ margin: 5 }}
              />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <>
          <div style={{ margin: 50 }}>
            <form
              onSubmit={signupSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Signup</h1>
              <input
                type="number"
                name="idno"
                value={data.idno}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="number"
                name="age"
                value={data.age}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="number"
                name="jobid"
                value={data.jobid}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="boolean"
                name="isadmin"
                value={data.isadmin}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <form
              onSubmit={loginSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Login</h1>
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
