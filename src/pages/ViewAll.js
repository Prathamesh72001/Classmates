import {
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { AiFillHeart } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFileUrl } from "../storage";
import {
  fetchDataByPath,
  addDataByPath,
  removeDataByPath,
} from "../realtimedatabase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewAll() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [favourites, setFavourites] = useState([]);
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

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

  useEffect(() => {
    const getFavourites = async () => {
      try {
        if (localStorage.getItem("user")) {
          const parsedData = JSON.parse(localStorage.getItem("user"));
          const phoneNumber = `+${parsedData.countryCode}${parsedData.phone}`;
          const data = await fetchDataByPath(`Favourite Books/${phoneNumber}`); // Specify the path to fetch data from
          const booksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFavourites(booksArray); // Set filtered data to state
        }
      } catch (error) {
        setFavourites([]);
        console.error("Error fetching books:", error);
      }
    };
    getFavourites();
  }, []);

  useEffect(() => {
    const getFavourites = async () => {
      try {
        if (localStorage.getItem("user")) {
          const parsedData = JSON.parse(localStorage.getItem("user"));
          const phoneNumber = `+${parsedData.countryCode}${parsedData.phone}`;
          const data = await fetchDataByPath(`Favourite Books/${phoneNumber}`); // Specify the path to fetch data from
          const booksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFavourites(booksArray); // Set filtered data to state
        }
      } catch (error) {
        setFavourites([]);
        console.error("Error fetching books:", error);
      }
    };
    getFavourites();
  }, []);

  const toggleFavorite = async (book) => {
    if (localStorage.getItem("user")) {
      const parsedData = JSON.parse(localStorage.getItem("user"));
      const phoneNumber = `+${parsedData.countryCode}${parsedData.phone}`;
      setFavourites((prevFavourites) => {
        if (prevFavourites.includes(book)) {
          removeDataByPath(`Favourite Books/${phoneNumber}/${book.booknm}`);
        } else {
          addDataByPath(`Favourite Books/${phoneNumber}/${book.booknm}`, book);
        }
        return prevFavourites.includes(book)
          ? prevFavourites.filter((fav) => fav !== book)
          : [...prevFavourites, book];
      });
    } else {
      toast.error("Please Login to add books to Favourite", {
        position: "top-right",
        autoClose: 3000,
      });
    }
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
                  cursor: "pointer",
                }}
              >
                {/* Book Image */}
                <CardMedia
                  component="img"
                  height="75%"
                  image={book.bookimg}
                  alt={book.booknm}
                  sx={{ borderRadius: 5 }}
                  onClick={async () => {
                    if (localStorage.getItem("user")) {
                      // Passing the list via state
                      const data = await getFileUrl(
                        "Books",
                        `${book.booknm}.${book.bookfrmt}`
                      );
                      if (data !== null) {
                        navigate("/pdfviewer", {
                          state: data,
                        });
                      }
                    } else {
                      toast.error("Please Login to open book", {
                        position: "top-right",
                        autoClose: 3000,
                      });
                    }
                  }}
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
                    onClick={() => toggleFavorite(book)}
                    sx={{
                      color: favourites.find(
                        (item) => item.booknm === book.booknm
                      )
                        ? "red"
                        : "#D3D3D3",
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
