import { Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataByField } from "../realtimedatabase";

function Category() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const categories = [
    {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      image_url: "./images/studying.png",
      title: "SSC",
      filter: "SSC",
    },
    {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      image_url: "./images/school.png",
      title: "XI",
      filter: "XI",
    },
    {
      backgroundColor: "#00C08D",
      textColor: "#ffffff",
      image_url: "./images/graduation.png",
      title: "HSC",
      filter: "HSC",
    },
    {
      backgroundColor: "#887BF1",
      textColor: "#ffffff",
      image_url: "./images/graduation.png",
      title: "BSc IT",
      filter: "BSc IT",
    },
    {
      backgroundColor: "#70B9FF",
      textColor: "#ffffff",
      image_url: "./images/graduation.png",
      title: "BSc CS",
      filter: "BSc CS",
    },
    {
      backgroundColor: "#102348",
      textColor: "#ffffff",
      image_url: "./images/graduation.png",
      title: "NEET",
      filter: "NEET",
    },
    {
      backgroundColor: "#EDF2FF",
      textColor: "#000000",
      image_url: "./images/graduation.png",
      title: "JEE",
      filter: "JEE",
    },
  ];

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

  const handleClick = async (filter) => {
    const data = await fetchDataByField("Book", "fieldNm", filter); // Specify the path to fetch data from
    const books = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    navigate("/viewall", {
      state: books,
    });
  };

  return (
    <div className="App">
      {categories.length !== 0 ? (
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid
              item
              xs={15}
              key={category.title}
              sx={{
                marginLeft: screenWidth > 1000 ? "200px" : "0px",
                marginTop: index === 0 ? "75px" : "25px",
              }} // Add space after first 2 cards
              onClick={() => {
                handleClick(category.filter);
              }}
            >
              <Card
                sx={{
                  height: "calc(15px + 25vmin)",
                  borderRadius: 5,
                  padding: "10px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  position: "relative", // Ensures absolute positioning of Heart Icon works
                  cursor: "pointer",
                  backgroundColor: category.backgroundColor,
                }}
              >
                {/* Book Image */}
                <CardMedia
                  component="img"
                  image={category.image_url}
                  alt={category.title}
                  sx={{
                    position: "absolute",
                    right: 25,
                    width: "calc(15px + 25vmin)",
                  }}
                  onClick={async () => {}}
                />

                {/* Book Name */}
                <CardContent sx={{ height: "100%" }}>
                  <Typography
                    variant="body2"
                    fontSize="calc(15px + 10vmin)"
                    color={category.textColor}
                    sx={{
                      position: "absolute",
                      left: 25,
                      top: 25,
                      bottom: 25,
                    }}
                  >
                    {category.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <p>No Data Found</p>
      )}
    </div>
  );
}
export default Category;
