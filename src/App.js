import SignIn from "./Screens/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Screens/SignUp";
import Blog from "./Screens/Blog";
import Home from "./Screens/Home";
import ResponsiveAppBar from "./Component/ResponsiveAppBar";
import SharedLocations from "./Screens/SharedLocations";
import Favourites from "./Screens/Favourites";
import Location from "./Screens/Location";
import DetailBlog from "./Screens/DetailBlog";
import "bootstrap/dist/css/bootstrap.min.css";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Profile from "./Screens/Profile";
import * as geolib from "geolib";

export const UserContext = createContext();

function App() {
  const [userLoginStatus, setuserStatusLogin] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("LoginStatus");
    if (status === true) {
      let token = localStorage.getItem("token");
      let decodedToken = jwt_decode(token);
      let currentDate = new Date();

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        localStorage.clear();
      } else {
        console.log("Valid token");
      }
    }
  }, []);

  useEffect(() => {
    const status = localStorage.getItem("LoginStatus");
    if (status) {
      setuserStatusLogin(true);
    } else {
      setuserStatusLogin(false);
    }
  }, []);

  

  return (
    <UserContext.Provider value={[userLoginStatus, setuserStatusLogin]}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              index
              element={userLoginStatus ? <Home /> : <SignIn></SignIn>}
              f
            />

            <Route
              path="blogs/"
              element={
                <>
                  {userLoginStatus ? (
                    <>
                      <ResponsiveAppBar></ResponsiveAppBar>
                      <Blog />
                    </>
                  ) : (
                    <SignIn></SignIn>
                  )}
                </>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                userLoginStatus ? (
                  <>
                    <ResponsiveAppBar></ResponsiveAppBar>
                    <DetailBlog />
                  </>
                ) : (
                  <SignIn></SignIn>
                )
              }
            />
            <Route
              path="sharedlocations/"
              element={
                userLoginStatus ? (
                  <>
                    <SharedLocations></SharedLocations>
                  </>
                ) : (
                  <SignIn></SignIn>
                )
              }
            />
            <Route
              path="profile/"
              element={
                userLoginStatus ? (
                  <>
                    <Profile></Profile>
                  </>
                ) : (
                  <SignIn></SignIn>
                )
              }
            />
            <Route
              path="/:id/"
              index
              element={
                userLoginStatus ? (
                  <>
                    <ResponsiveAppBar></ResponsiveAppBar>
                    <Location />
                  </>
                ) : (
                  <SignIn></SignIn>
                )
              }
            />
            <Route
              path="favourites/"
              element={
                userLoginStatus ? (
                  <>
                    <Favourites></Favourites>
                  </>
                ) : (
                  <SignIn></SignIn>
                )
              }
            />
            <Route path="SignUp/" element={<SignUp />} />
            <Route path="Signin/" element={<SignIn />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
