import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { Button } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { distance } from "../methods";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { distanceCalculator } from "./ResponsiveDrawer";

const geolib = require("geolib");

// const GioLibdistanceCalculator = (lat1, lon1, lat2, lon2) =>
//   ;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// const handlePriceRangeChange = (event, newValue) => {
//   setValue(newValue);
// };


export default function RecipeReviewCard(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [isAlreadyLiked, setIsAlreadyLiked] = React.useState(false);
  const [longitude, setLongitude] = React.useState();
  const [latitude, setLatitude] = React.useState();
  

  const navigation = useNavigate();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavourites = (id) => {
    axios
      .post(
        "http://127.0.0.1:8000/favorites/" + id + "/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => console.log(x))
      .catch((y) => console.log(y));
  };

  const handleLike = (id) => {
    axios
      .post(
        "http://127.0.0.1:8000/postlike/" + id + "/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => {
        console.log(x);
        props.reload();
      })
      .catch((y) => console.log(y));
  };

  React.useEffect(() => {
    const successCallback = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      console.log("latitude", position.coords);
      console.log("longitude", position.coords);
    };

    const errorCallback = (error) => {
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  return (
    <div>
      <Card
        sx={{ maxWidth: 345 }}
        style={{
          marginTop: "2%",
          backgroundColor: "#f2f3f5",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "10px",
          }}
        >
          <div>
            <img
              src={"http://127.0.0.1:8000" + props.location.owner[1]}
              style={{
                height: "40px",
                borderRadius: "55%",
              }}
            ></img>
          </div>
          <CardHeader avatar={props.location.owner[0]} />
        </div>
        <img
          onClick={() => {
            navigation("/" + props.location.id);
          }}
          style={{
            height: "200px",
            width: "350px",
          }}
          src={"http://127.0.0.1:8000" + props.location.images[0].image}
        ></img>
        <CardContent>
          <Typography
            style={{
              fontWeight: "bold",
            }}
            variant="body1"
            color="text.secondary"
          >
            {props.location.locationName}
          </Typography>
          <Typography
            style={{
              fontWeight: "bolder",
              fontFamily: "cursive",
              color: "green",
            }}
            variant="body1"
            color="text.secondary"
          >
            {props.location.category}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Rs.{props.location.price}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {props.location.time_stamp.split("T")[0]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {distanceCalculator(
              latitude,
              longitude,
              props.location.latitude,
              props.location.Longitude
            )} km far
          </Typography>
        </CardContent>
        
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <CardActions disableSpacing>
            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                handleFavourites(props.location.id);
              }}
            >
              <FavoriteIcon />
            </IconButton>
            <CardActions disableSpacing>
              <Button
                onClick={() => handleLike(props.location.id)}
                style={{
                  color: `${
                    props.location.likedCount.like > 0 ? "green" : "gray"
                  }`,
                }}
              >
                <Typography
                  style={{
                    marginTop: "12px",
                    marginRight: "2px",
                  }}
                >
                  {props.location.likedCount.like}
                </Typography>{" "}
                <ThumbUpIcon></ThumbUpIcon>
              </Button>
            </CardActions>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        </div>

        <Collapse
          in={expanded}
          style={{
            marginLeft: "40px",
          }}
          timeout="auto"
          unmountOnExit
        >
          <CardContent>
            <Typography paragraph>
              {props.location.locationDescription}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
