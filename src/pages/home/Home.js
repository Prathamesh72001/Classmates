import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    "Home",
    "My Profile",
    "Categories",
    "Favourites",
    "Suggestions",
    "Upload",
    "Logout",
  ];

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <div className="App">
      <AppBar
        position="static"
        style={{ background: "#ffffff", boxShadow: "none" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Button to Open Drawer #fefcc1*/}
          <IconButton
            style={{
              color: "#000000",
              border: "2px solid black",
              background: "#fefcc1",
            }}
            onClick={toggleDrawer(true)}
            edge="start"
          >
            <HiOutlineMenuAlt2 />
          </IconButton>

          <span className="title">ClassMates</span>

          <div
            style={{
              gap: "10px",
            }}
          >
            {/* Text Button */}
            <button className="rounded-button">Sign In</button>

            {/* Outline Button */}
            <button className="rounded-button">Sign Up</button>
          </div>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)} // Close drawer when clicking outside
      >
        <List>
          {menuItems.map((item, index) => (
            <div
              onClick={() => {
                setActiveTab("tab" + (index + 1));
              }}
            >
              <ListItem
                button
                key={index}
                onClick={toggleDrawer(false)} // Close drawer when clicking a tab
                className={`menu ${
                  activeTab === "tab" + (index + 1) ? "active" : ""
                }`}
              >
                <ListItemText primary={item} />
              </ListItem>
            </div>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
export default Home;
