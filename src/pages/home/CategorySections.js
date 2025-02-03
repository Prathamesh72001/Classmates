import {
  IconButton,
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { AiFillHeart } from "react-icons/ai";
import {
  fetchDataByField,
  fetchDataByPath,
  addDataByPath,
  removeDataByPath,
} from "../../realtimedatabase";
import { getFileUrl } from "../../storage";
import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CategorySection({ title, filter }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [books, setBooks] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  function getDividedValue(screenWidth) {
    if (screenWidth > 1150) return 2;
    if (screenWidth > 900) return 3;
    if (screenWidth > 750) return 4;
    if (screenWidth > 500) return 5;
    return 6;
  }

  // Fetch books only once when the component mounts
  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        if (filter === "") {
          const data = await fetchDataByPath("Book"); // Specify the path to fetch data from
          const booksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setBooks(booksArray); // Set filtered data to state
        } else {
          const data = await fetchDataByField("Book", "fieldNm", filter); // Specify the path to fetch data from
          const booksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setBooks(booksArray); // Set filtered data to state
        }
      } catch (error) {
        setBooks([]);
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };
    getBooks();
  }, []);

  useEffect(() => {
    const getFavourites = async () => {
      setLoading(true);
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
      setLoading(false);
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

  const handleClick = () => {
    // Passing the list via state
    navigate("/viewall", {
      state: books,
    });
  };

  return (
    <div>
      <Box
        sx={{
          position: "sticky",
          top: screenWidth > 1000 ? 64 : 46, // Keeps it below the AppBar
          background: "white",
          display: "flex",
          zIndex: 1000,
          padding: "10px",
          marginLeft: screenWidth > 1000 ? "200px" : "0px",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Button variant="text" onClick={handleClick}>
          View All
        </Button>
      </Box>
      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: screenWidth > 1000 ? "200px" : "0px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            display: "flex",
            marginLeft: screenWidth > 1000 ? "200px" : "0px",
            marginTop: filter === "" ? "64px" : "0px",
            whiteSpace: "nowrap",
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            msOverflowStyle: "none", // Hide scrollbar for IE & Edge
          }}
        >
          {books.length !== 0 ? (
            screenWidth > 1000 ? (
              <Grid container spacing={2} direction="row" wrap="nowrap">
                {books.slice(0, 10).map((book) => (
                  <Grid item key={book.booknm}>
                    <Card
                      sx={{
                        width: "150px",
                        height: "250px",
                        borderRadius: 5,
                        position: "relative",
                        padding: "10px",
                        marginLeft: "5px",
                        marginRight: "5px",
                        marginTop: "2px",
                        marginBottom: "2px",
                        cursor: "pointer",
                      }}
                    >
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
                            toast.error(
                              "Please Login to open book",
                              {
                                position: "top-right",
                                autoClose: 3000,
                              }
                            );
                          }
                        }}
                      />
                      {/* Heart Icon */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: "5px",
                          transform: "translateX(-50%)",
                          width: "25px",
                          height: "40px",
                          backgroundColor: "#fefcc1",
                          borderBottomLeftRadius: "25px",
                          borderBottomRightRadius: "25px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                      </div>
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
              <Box
                sx={{
                  overflow: "hidden", // Ensures no scrollbars appear
                }}
              >
                <Grid container spacing={2}>
                  {books.slice(0, 4).map((book, index) => (
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
                          height="80%"
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
                            onClick={() => toggleFavorite(book)}
                            sx={{
                              color: favourites.find(
                                (item) => item.booknm === book.booknm
                              )
                                ? "red"
                                : "grey",
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
              </Box>
            )
          ) : null}
        </Box>
      )}
    </div>
  );
}
export default CategorySection;
