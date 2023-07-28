import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { Rings } from "react-loader-spinner";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { width } from "@mui/system";
import { Button } from "@mui/material";
import axios from "axios";
// import TinderCard from 'react-tinder-card'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export let distanceCalculator = (lat1, lon1, lat2, lon2) => {
  console.log("REsult", lat1, lon1, lat2, lon2);
  const r = 6371; // km
  const p = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;

  return 2.71 * r * Math.asin(Math.sqrt(a));
};

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [category, setAge] = React.useState("");
  const [value, setValue] = React.useState([20, 37]);
  const [longitude, setLongitude] = React.useState();
  const [latitude, setLatitude] = React.useState();
  const [isloading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  const onSwipe = (direction) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + " left the screen");
  };
  const navigate = useNavigate()
  const handlePostData = () => {
    console.log("Handluing post");
    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("category", category);



    console.log("Form DAta", formData, latitude, longitude);
    axios
      .post("http://127.0.0.1:8000/aigenerator/", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "content-type": "multipart/form-data", // do not forget this
        },
      })
      .then((x) => {
        console.log("STATUS", x.status);
        if (x.status === 200) {
          console.log(x.data);
          setData(x.data);
          setIsLoading(false);
        } else {
          alert("Please check your credential");
        }
      })
      .catch((y) => {
        alert("Please check your credential", y);
      });
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const successCallback = (position) => {
      console.log("POSITIONS", position.coords.latitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const errorCallback = (error) => {
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  const drawer = (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h4>Filter</h4>
      <Toolbar />

      <Divider />
      <List>
        <Box sx={{ minWidth: 120, marginTop: "30px" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="category"
              onChange={handleChange}
            >
              <MenuItem value={"Cultural"}>Cultural</MenuItem>
              <MenuItem value={"Street"}>Street</MenuItem>
              <MenuItem value={"Nature"}>Nature</MenuItem>
              <MenuItem value={"club&Bar"}>Club & Bar</MenuItem>
              <MenuItem value={"Mountains"}>Mountains</MenuItem>
              <MenuItem value={"Historical"}>Historical</MenuItem>
              <MenuItem value={"Others"}>Others</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </List>

      <Divider />
      <List></List>
      <Button
        variant="outlined"
        style={{
          width: "20px",
        }}
        onClick={handlePostData}
      >
        {" "}
        save
      </Button>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <div
        style={{
          marginLeft: "15%",
          height: "20%",
          marginTop: "2%",
        }}
      >
        {isloading ? (
          <Rings
            wrapperStyle={{
              width: "401px",
              marginLeft: "160%",
              height: "20%",
              marginTop: "64%",
            }}
          ></Rings>
        ) : data.length > 0 ? (
          data.map((x) => (
            <div
              key={x.id}
              style={{
                background: "#e6e5e3",
                borderRadius: "10px",
                borderWidth: "10px",
                borderColor: "gray",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                padding: "2%",
                width:"1400px"
              }}
            >
              <div>
                <img
                  onClick={()=>navigate(`/${x.id}/`)}
                  style={{
                    height: "150px",
                    width: "150px",
                    margin: "10px",
                  }}
                  src={"http://127.0.0.1:8000/" + x.images[0].image}
                ></img>
              </div>
              <div>
                <h5
                  style={{
                    marginTop: "12px",
                    color: "green",
                  }}
                >
                  {x.locationName}
                </h5>
                <p
                  style={{
                    margin: "0px",
                    color:"orangeRed"
                    
                  }}
                >
                  Entry Price: Rs.{x.price}
                </p>
                <p
                  style={{
                    margin: "0px",
                  }}
                >
                  {x.locationDescription}
                </p>
                <p><ThumbUpIcon style={{
                  color:"green"
                }}></ThumbUpIcon> {x.likedCount.like}</p>
                <p style={{
                  color:"gray"
                }}> {distanceCalculator(x.latitude,x.Longitude,longitude,latitude)} km far away</p>
                
              </div>
            </div>
          ))
        ) : (
          <p>No any Matching Data found</p>
        )}
      </div>
      {/* <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['right', 'left']}>Hello, World!</TinderCard> */}
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
