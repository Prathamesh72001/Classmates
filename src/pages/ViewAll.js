import {
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { AiFillHeart } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ViewAll() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [favourites, setFavourites] = useState([]);
  const location = useLocation();
  const data = location.state;

  function getDividedValue(screenWidth) {
    if (screenWidth > 1150) return 2;
    if (screenWidth > 900) return 3;
    if (screenWidth > 750) return 4;
    if (screenWidth > 500) return 5;
    return 6;
  }

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

  const toggleFavorite = (id) => {
    setFavourites((prevFavourites) =>
      prevFavourites.includes(id)
        ? prevFavourites.filter((fav) => fav !== id)
        : [...prevFavourites, id]
    );
  };

  return (
    <div className="App">
      {data.length !== 0 ? (
        <Grid container spacing={2}>
          {data.map((book, index) => (
            <Grid
              item
              xs={getDividedValue(screenWidth)}
              key={book.booknm}
              sx={{ marginBottom: "20px", paddingBottom: "5px" }} // Add space after first 2 cards
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 5,
                  padding: "10px",
                  marginLeft: "5px",
                  marginRight: "5px",
                  position: "relative", // Ensures absolute positioning of Heart Icon works
                }}
              >
                {/* Book Image */}
                <CardMedia
                  component="img"
                  height="75%"
                  image={book.bookimg}
                  alt={book.booknm}
                  sx={{ borderRadius: 5 }}
                />

                {/* Favorite Heart Icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: "5px",
                    width: "25px",
                    height: "40px",
                    backgroundColor: "#fefcc1",
                    borderBottomLeftRadius: "25px",
                    borderBottomRightRadius: "25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.3)", // Adds elevation
                  }}
                >
                  <IconButton
                    onClick={() => toggleFavorite(book.booknm)}
                    sx={{
                      color: favourites.includes(book.booknm) ? "red" : "grey",
                    }}
                  >
                    <AiFillHeart fontSize="medium" />
                  </IconButton>
                </Box>

                {/* Book Name */}
                <CardContent sx={{ height: "40%" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.booknm}
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
export default ViewAll;
