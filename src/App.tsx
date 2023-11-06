import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Components/Sidebar/index";
import SignUp from "./Components/SignUp/index";
import Login from "./Components/Login/index";
import Forgate from "./Components/Forgate/index";
import Tasks from "./Components/YourTasksDetails/Tasks/index";
import CreateTasks from "./Components/CreateTask/index";
import CompletedTask from "./Components/YourTasksDetails/CompletedTask";
import InProgress from "./Components/YourTasksDetails/InProgress";
import AllInProgress from "./Components/AllTaskDetails/InProgress";
import AllCompletedTask from "./Components/AllTaskDetails/CompletedTask";
import Pending from "./Components/YourTasksDetails/Pending";
import AllPending from "./Components/AllTaskDetails/Pending";
import AllTasks from "./Components/AllTaskDetails/Tasks";
import Profile from "./Components/Profile";

function App() {
  const [view, setView] = useState("list");

  const list = (data: any) => {
    setView(data);
  };

  return (
    <div className="page">
      <Router>
        <Routes>
          <Route path="/" element={<Sidebar view={view} list={list} />}>
            <Route
              path="/Create Task"
              element={<CreateTasks view={view} data="Create Task" />}
            />
            <Route
              path="/Your Task"
              element={<Tasks view={view} data="Your Task" />}
            />
            <Route
              path="/Pending"
              element={<Pending view={view} data="Pending" />}
            />
            <Route
              path="/Completed"
              element={<CompletedTask view={view} data="Completed" />}
            />
            <Route
              path="/Open"
              element={<InProgress view={view} data="Open" />}
            />
            <Route
              path="/Profile"
              element={<Profile view={view} data="Profile" />}
            />
            <Route
              path="/All Task"
              element={<AllTasks view={view} data="All Task" />}
            />
            <Route
              path="/In Progress"
              element={<AllInProgress view={view} data="In Progress" />}
            />
            <Route
              path="/All Done"
              element={<AllCompletedTask view={view} data="All Done" />}
            />
            <Route
              path="/On Hold"
              element={<AllPending view={view} data="On Hold" />}
            />
          </Route>
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Forgate" element={<Forgate />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
