import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/userdetail/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => {
        if (x.data) {
          setData(x.data);
        } else {
          console.log("Error");
        }
      })
      .catch((y) => {
        console.log("Errir");
      });
  }, []);

  return (
    <>
      {data.length > 0 ? (
        <div
          style={{
            margin: "10%",
            backgroundColor: "pink",
            padding: "5%",
            borderRadius: "1%",
          }}
        >
          <img
            style={{
              height: "100px",
              width: "100px",
              marginBottom: "40px",
            }}
            src={"http://127.0.0.1:8000/" + data[0].profile_image}
          ></img>
          <p    
            style={{
              color: "black",
            }}
          >
            {" "}
            Name: {data[0].name}
          </p>

          <p
            style={{
              color: "black",
            }}
          >
            Email: {data[0].email}
          </p>
        </div>
      ) : <p>Loading.....</p>}
    </>
  );
}
