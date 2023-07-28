import React from "react";
import ResponsiveDrawer from "../Component/ResponsiveDrawer";
import ResponsiveAppBar from "../Component/ResponsiveAppBar";

export default function Home() {
  return (
    <>
      <ResponsiveAppBar isHomePage={true}></ResponsiveAppBar>
      <ResponsiveDrawer></ResponsiveDrawer>
    </>
  );
}
