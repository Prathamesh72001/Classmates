import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
} from "@mui/material";
import {
  HiOutlineMenuAlt2,
  HiOutlineUserAdd,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineChat,
  HiOutlineUpload,
  HiOutlineLogout,
} from "react-icons/hi";
import { BiCategory } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import "./Home.css";
import "./CategorySections";
import { useNavigate } from "react-router-dom";
import CategorySection from "./CategorySections";
import Favourites from "../Favourites";

function Home() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  const menuItems = [
    { text: "Home", icon: <HiOutlineHome /> },
    { text: "Categories", icon: <BiCategory /> },
    { text: "Suggestions", icon: <HiOutlineChat /> },
    { text: "Upload", icon: <HiOutlineUpload /> },
  ];

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getInitials = () => {
    try {
      const parsedData = JSON.parse(localStorage.getItem("user"));
      const firstInitial = parsedData.firstName.charAt(0).toUpperCase();
      const lastInitial = parsedData.lastName.charAt(0).toUpperCase();
      return firstInitial + lastInitial;
    } catch (e) {
      return "US";
    }
  };

  return (
    <div className="App">
      <AppBar
        position="fixed"
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
            edge="start"
            onClick={toggleDrawer(true)}
          >
            <HiOutlineMenuAlt2 />
          </IconButton>

          <span className="title">ClassMates</span>

          {screenWidth > 1000 ? (
            localStorage.getItem("user") ? (
              <button
                edge="end"
                className="rounded-button"
                onClick={() => {
                  navigate("/");
                  localStorage.removeItem("user");
                }}
              >
                Logout
              </button>
            ) : (
              <button
                edge="end"
                className="rounded-button"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            )
          ) : localStorage.getItem("user") ? (
            <IconButton
              style={{
                color: "#000000",
                border: "2px solid black",
                background: "#fefcc1",
              }}
              edge="end"
              onClick={() => {
                navigate("/");
                localStorage.removeItem("user");
              }}
            >
              <HiOutlineLogout />
            </IconButton>
          ) : (
            <IconButton
              style={{
                color: "#000000",
                border: "2px solid black",
                background: "#fefcc1",
              }}
              edge="end"
              onClick={() => navigate("/signup")}
            >
              <HiOutlineUserAdd />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={screenWidth > 1000 ? "permanent" : "temporary"}
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: 240,
        }}
      >
        {/* 🔹 Drawer Header */}
        <Box
          sx={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            justifyItems: "center",
            textAlign: "center",
            padding: "16px",
            bgcolor: "white",
            color: "black",
          }}
        >
          {localStorage.getItem("user") ? (
            <div className="circle">{getInitials()}</div>
          ) : (
            <button
              className="rounded-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </Box>
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
                <ListItemIcon>{item.icon}</ListItemIcon> {/* Icon Added */}
                <ListItemText primary={item.text} />
              </ListItem>
            </div>
          ))}
        </List>
        {localStorage.getItem("user") ? (
          <div style={{ cursor: "pointer" }}>
            <ListItem
              button
              key={5}
              onClick={() => {
                toggleDrawer(false);
                setActiveTab("tab5");
              }}
              className={`menu ${
                activeTab === "tab5" ? "active" : ""
              }`}
            >
              <ListItemIcon>
                <HiOutlineHeart />
              </ListItemIcon>{" "}
              {/* Icon Added */}
              <ListItemText primary="Favourites" />
            </ListItem>
            <ListItem
              button
              key={6}
              onClick={() => {
                toggleDrawer(false);
                navigate("/");
                localStorage.removeItem("user");
              }}
            >
              <ListItemIcon>
                <HiOutlineLogout />
              </ListItemIcon>{" "}
              {/* Icon Added */}
              <ListItemText primary="Logout" />
            </ListItem>
          </div>
        ) : null}
      </Drawer>

      {activeTab === "tab1" && (
        <>
          <CategorySection title="All Books" filter="" />

          <CategorySection title="SSC Books" filter="SSC" />

          <CategorySection title="XI Books" filter="XI" />

          <CategorySection title="HSC Books" filter="HSC" />
        </>
      )}

      {activeTab === "tab5" && <Favourites />}
    </div>
  );
}
export default Home;
