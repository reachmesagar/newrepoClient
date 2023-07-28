import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// apiKey: "AIzaSyDaZ7pRFF2WIkaV0vaRcgViiz9SKFu2474",
export default function TransitionsModal(props) {
  const [locationName, setlocationName] = React.useState();
  const [lcoationDescription, setLocationDescription] = React.useState();
  const [locationCategory, setLocationCategory] = React.useState("Cultural");
  const [selectedimages, setselectedimages] = React.useState([]);
  const [value, setValue] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState();
  const [price, setPrice] = React.useState();

  const handleChange = (event) => {
    setLocationCategory(event.target.value);
  };

  // Posting Location Data
  const handleUploadLocationData = () => {
    if (
      locationName &&
      lcoationDescription &&
      locationCategory &&
      selectedimages &&
      coordinates &&
      price
    ) {
      console.log("SELECTED IMAGE", selectedimages, selectedimages.len);
      const formData = new FormData();
      formData.append("locationName", locationName);
      formData.append("locationDescription", lcoationDescription);
      formData.append("category", locationCategory);
      formData.append("latitude", coordinates.lat);
      formData.append("Longitude", coordinates.long);
      formData.append("price", price);

      for (let i = 0; i < selectedimages.length; i++) {
        console.log("Image size ", selectedimages[i]);
        formData.append("uploaded_images", selectedimages[i]);
      }

      axios
        .post("http://127.0.0.1:8000/locations/", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "content-type": "multipart/form-data", // do not forget this
          },
        })
        .then((x) => {
          console.log("STATUS", x.status);
          if (x.status === 201) {
            alert("Successfully done ");
            props.reloadAction();
            props.action();
          } else {
            alert("Please check your credential");
          }
        })
        .catch((y) => {
          alert("Please check your credential", y);
        });
    } else {
      alert("Please complete the form");
    }
  };

  console.log("Value", value);

  const getCordinates = (locationName) => {
    geocodeByAddress(locationName)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setCoordinates({
          lat: lat,
          long: lng,
        })
      );
  };

  return (
    <div>
      <Modal
        open={props.isModal}
        // onClose={handleClose}
        closeAfterTransition
      >
        <div
          style={{
            backgroundColor: "white",
            marginTop: "2%",
            alignContent: "center",
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingTop: "5%",
            paddingBottom: "5%",
            marginRight: "5%",
            marginLeft: "5%",
          }}
        >
          <div onClick={props.action}>
            <CloseIcon
              fontSize={"20"}
              style={{
                right: "12%",
                marginRight: "-20%",
              }}
            ></CloseIcon>
          </div>

          <h3
            style={{
              marginBottom: "4%",
            }}
          >
            Please pos the hidden lcoation You visited!
          </h3>
          <div
            style={{
              marginTop: "20px",
              width: "75%",
              zIndex: "22",
            }}
          >
            <GooglePlacesAutocomplete
              selectProps={{
                value,
                onChange: (e) => {
                  setValue(e);
                  setlocationName(e.label);
                  getCordinates(e.label);
                },
              }}
              apiKey="AIzaSyDaZ7pRFF2WIkaV0vaRcgViiz9SKFu2474"
            />
          </div>

          <br></br>
          <TextField
            onChange={(e) => {
              setLocationDescription(e.target.value);
            }}
            id="outlined-basic"
            style={{
              marginBottom: "30px",
              width: "75%",
            }}
            label="About Location"
            variant="outlined"
          />
          <br></br>
          <TextField
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            id="outlined-basic"
            style={{
              marginBottom: "30px",
              width: "75%",
            }}
            label="Entry Price"
            variant="outlined"
            type="number"
            

          />
          <br></br>
          <FormControl
            style={{
              width: "75%",
            }}
          >
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={locationCategory}
              label="Age"
              onChange={handleChange}
              style={{
                marginBottom: "20px",
              }}
            >
              <MenuItem value={"Cultural"}>Cultural</MenuItem>
              <MenuItem value={"Street"}>Street</MenuItem>
              <MenuItem value={"Nature"}>Nature</MenuItem>
              <MenuItem value={"Clubs&Bar"}>Clubs&Bar</MenuItem>
              <MenuItem value={"Mountains"}>Mountains</MenuItem>
              <MenuItem value={"Historical"}>Historical</MenuItem>
              <MenuItem value={"Others"}>Others</MenuItem>
            </Select>
            <div>
              <input
                type="file"
                multiple
                onChange={(e) => setselectedimages(e.target.files)}
              ></input>
            </div>

            <Button
              style={{
                marginTop: "20px",
              }}
              variant="outlined"
              onClick={() => handleUploadLocationData()}
            >
              {" "}
              Submit
            </Button>
          </FormControl>
        </div>
      </Modal>
    </div>
  );
}
