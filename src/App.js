import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/home/Home";
import NewStory from "./pages/new-story/NewStory";
import Topics from "./pages/topics/Topics";
import Read from "./pages/read/Read";
import Search from "./pages/search/Search";
import Stats from "./pages/stats";
import Stories from "./pages/stories";

const routes = [
  { path: "/", component: Home },
  { path: "/new-story", component: NewStory },
  { path: "/topics", component: Topics },
  { path: "/read/:slug", component: Read },
  { path: "/search", component: Search },
  { path: "/stats", component: Stats },
  { path: "/stories", component: Stories },
  { path: "/signUp", component: Stories },
];

function App() {
  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    if (token && refreshToken) {
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.replace("/");
    }
  }, []);

  return (
    <Router>
      <NavBar />
      {routes.map(({ path, component }, key) => (
        <Route exact path={path} component={component} key={key} />
      ))}
    </Router>
  );
}

export default App;
