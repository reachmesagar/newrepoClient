import { Button, TextField, colors } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Carousel from "react-bootstrap/Carousel";
import { test } from "../methods";

export default function Location() {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const [commentData, setCommentData] = useState([]);
  const [comment, setComment] = useState();
  const [reload, setReload] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const [repliedComment, setRepliedComment] = useState();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/location/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => {
        if (x.data) {
          console.log(">>>", x.data);
          setLocation(x.data);
          setLoading(!loading);
        } else {
          setLoading(!loading);
          setError(!error);
        }
      })
      .catch((y) => {
        setLoading(!loading);
        setError(!error);
      });
  }, [reload]);
  const handleGetComments = () => {
    axios
      .get("http://127.0.0.1:8000/location/" + id + "/comment", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => {
        console.log("CommentDAta", x.data);
        setCommentData(x.data);
      })
      .catch((y) => console.log(y));
  };

  const handleNewMessage = () => {
    console.log("vVVVVV");
    axios
      .post(
        "http://127.0.0.1:8000/location/" + id + "/comment",
        {
          commentText: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => handleGetComments())
      .catch((y) => console.log(y));
  };

  const handleDeleteComment = (commentId) => {
    fetch("http://127.0.0.1:8000/commentlocation/" + commentId + "/delete/", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((x) => {
        if (x.status === 403) {
          alert("No rights to delete");
        } else {
          handleGetComments();
        }
      })
      .catch((y) => alert("You have no rights to delete the comment"));
  };

  const replyCommentHandle = (commentId) => {
    axios
      .post(
        "http://127.0.0.1:8000/replyLocationComment/" + commentId + "/",
        {
          reply: replyComment,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => {
        getRepliedComment(commentId);
      })
      .catch((y) => console.log("Error"));
  };

  const getRepliedComment = (commentId) => {
    console.log("Comment", commentId);
    axios
      .get("http://127.0.0.1:8000/replyLocationComment/" + commentId + "/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => {
        console.log(">>><<<<><><><>", x.data);
        setRepliedComment(x.data);
      })
      .catch((y) => console.log("Error"));
  };

  const handleDeleteRepliedComment = (repliedCommentId) => {
    console.log("DELETING", repliedCommentId);
    axios
      .delete(
        "http://127.0.0.1:8000/replyLocationComment/" +
          repliedCommentId +
          "/delete/",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => {
        console.log("////", x);
        setReload(!reload);
        getRepliedComment(commentData[0].id);
      })
      .catch((y) => alert("no access"));
  };

  return (
    <div
      style={{
        margin: "0px",
        marginTop: "2%",
        marginLeft: "2%",
        marginRight: "2%",
      }}
    >
      {error ? (
        <div>
          <p>Eror Please Check internet</p>
        </div>
      ) : loading ? (
        <p>Loading ...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            backgroundColor: "#f2f2f2",
            paddingTop: "10%",
            paddingBottom: "10%",
            borderRadius: "2%",
            paddingLeft: "2%",
          }}
        >
          <div>
            <Carousel fade>
              {location.images.map((x) => (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={"http://127.0.0.1:8000/" + x.image + "/"}
                    alt="First slide"
                    style={{
                      height: "550px",
                      objectFit: "contain",
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div
            style={{
              marginLeft: "6%",
              backgroundColor: "orange",
              height: "105%",
              padding: "2%",
              borderRadius: "5%",
              width: "20%",
            }}
          >
            <h2>{location.locationName}</h2>
            <h4
              style={{
                fontWeight: "normal",
                color: "white",
                margin: "0px",
              }}
            >
              {location.category}
            </h4>
            <h4
              style={{
                fontWeight: "normal",
                color: "white",
                margin: "0px",
              }}
            >
              {location.locationDescription}
            </h4>
            <h4
              style={{
                fontWeight: "normal",
                color: "white",
                margin: "0px",
              }}
            >
              {location.locationAddress}
            </h4>
          </div>
          <br></br>
        </div>
      )}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "1%",
          marginBottom: "20%",
          marginTop: "20px",
        }}
      >
        <p
          onClick={handleGetComments}
          style={{
            color: "white",
            margin: "10px",
            padding: "2%",
            borderRadius: "10px",
            backgroundColor: "black",
          }}
        >
          Comments
        </p>
        {commentData.map((x) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              paddingLeft: "2%",
              backgroundColor: "gray",
              marginBottom: "10px",
              justifyContent: "space-between",
              borderRadius: "10px",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 0.125,
              }}
            >
              <div
                style={{
                  margin: "0px",
                  backgroundColor: "10px",
                }}
              >
                <p
                  style={{
                    color: "white",
                  }}
                >
                  {x.owner[0]}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <p
                    onClick={() => getRepliedComment(x.id)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "pink",
                      margin: "0px",
                      borderRadius: "5px",
                      fontSize: "15px",
                      padding: "1%",
                      color: "black",
                      marginTop: "2px",
                      marginLeft: "30px",
                      flex: 4,
                    }}
                    key={x.id}
                  >
                    {x.commentText}
                  </p>
                  <Button onClick={() => handleDeleteComment(x.id)}>
                    <DeleteIcon
                      style={{
                        color: "red",
                      }}
                      color="white"
                    ></DeleteIcon>
                  </Button>
                </div>
                {repliedComment
                  ? repliedComment.length > 0
                    ? repliedComment[0].comment
                      ? repliedComment[0].comment.id === x.id
                        ? repliedComment.map((x) => (
                            <div
                              style={{
                                marginLeft: "50px",
                                backgroundColor: "white",
                                padding: "20px",
                                width: "1400px",
                                borderRadius: "10px",
                                marginTop: "10px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <img
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                  }}
                                  src={"http://127.0.0.1:8000/" + x.owner[1]}
                                ></img>
                                <p>{x.owner[0]}</p>
                                <p>{x.reply}</p>
                              </div>
                              <Button
                                onClick={() => handleDeleteRepliedComment(x.id)}
                              >
                                <DeleteIcon
                                  style={{
                                    color: "red",
                                  }}
                                  color="white"
                                ></DeleteIcon>
                              </Button>
                            </div>
                          ))
                        : console.log("NOt mapping")
                      : null
                    : null
                  : null}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "1%",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    onChange={(e) => setReplyComment(e.target.value)}
                    style={{
                      backgroundColor: "white",
                      marginTop: "10px",
                      width: "400px",
                      marginLeft: "100px",
                    }}
                  ></TextField>
                  <Button
                    onClick={() => replyCommentHandle(x.id)}
                    style={{
                      backgroundColor: "white",
                      marginLeft: "10px",
                      height: "50px",
                      marginTop: "14px",
                    }}
                  >
                    Reply
                  </Button>
                </div>
              </div>
              {/* <div
                style={{
                  marginLeft: "650%",
                }}
                onClick={() => handleDeleteComment(x.id)}
              >
                <DeleteIcon></DeleteIcon>
              </div> */}
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            fullWidth
            multiline
            onChange={(e) => setComment(e.target.value)}
            style={{
              backgroundColor: "white",
              marginTop: "10px",
            }}
          ></TextField>
          <Button onClick={handleNewMessage} variant="outlined">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
