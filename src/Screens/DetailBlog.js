import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import DeleteIcon from "@mui/icons-material/Delete";
export default function DetailBlog() {
  const [data, setData] = useState();
  const { id } = useParams();
  const [comments, setcomments] = useState([]);
  const [index, setIndex] = useState(0);
  const [comment, setComment] = useState();
  const [replyComment, setReplyComment] = useState();
  const [isVisible, setVisible] = useState(false);
  const [repliedComment, setRepliedComment] = useState();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/blog/" + id + "/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => {
        setData(x.data);
      })
      .catch((y) => console.log("Error"));
  }, [reload]);

  const handleGetComments = () => {
    console.log(">>>>");
    axios("http://127.0.0.1:8000/blog/" + id + "/comment/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((x) => {
        setcomments(x.data);
      })
      .catch((y) => console.log(y));
  };

  const handleDelete = (commentId) => {
    console.log("DELETED", id);
    axios
      .delete("http://127.0.0.1:8000/blogcomment/" + commentId + "/delete/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((x) => handleGetComments())
      .catch((y) => console.log("Error "));
  };

  const handlePostComment = () => {
    axios
      .post(
        "http://127.0.0.1:8000/blog/" + id + "/comment/",
        {
          commentText: comment,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => handleGetComments())
      .catch((y) => console.log("Error"));
  };

  const handleReplyBlogComment = (commentID) => {
    axios
      .post(
        "http://127.0.0.1:8000/replyBlogComment/" + commentID + "/",
        {
          replyCommmentText: replyComment,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => {
        handleGetComments();
        getRepliedComment(commentID);
      })
      .catch((y) => console.log("Error"));
  };

  const getRepliedComment = (commentId) => {
    axios
      .get("http://127.0.0.1:8000/replyBlogComment/" + commentId + "/", {
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
    console.log("KLKLKL")
    axios
      .delete(
        "http://127.0.0.1:8000/replyBlogComment/" +
          repliedCommentId +
          "/delete/",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((x) => {
        setReload(!reload);
      })
      .catch((y) => console.log("Error"));
  };

  return (
    <div>
      {data ? (
        <div
          style={{
            padding: "4%",
          }}
        >
          <h1
            style={{
              margin: "0px",
            }}
          >
            {" "}
            {data.blogTitle}
          </h1>
          <p
            style={{
              color: "blue",
              margin: "0px",
            }}
          >
            {data.tagS}
          </p>
          <p
            style={{
              color: "#86878a",
            }}
          >
            {data.blogDescription}
          </p>
          <Carousel>
            {data.images.map((x) => (
              <Carousel.Item interval={1000}>
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
          <p
            onClick={() => handleGetComments()}
            style={{
              padding: "1%",
              backgroundColor: "black",
              marginTop: "20px",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Comments
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "2%",
            }}
          >
            <TextField
              multiline
              fullWidth
              id="outlined-basic"
              label="comment"
              variant="outlined"
              onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="outlined" onClick={handlePostComment}>
              Post
            </Button>
          </div>
          <div>
            {comments.map((x) => (
              <div
                style={{
                  backgroundColor: "pink",
                  paddingBottom: "10px",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    background: "gray",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "gray",
                      paddingTop: "20px",
                      borderRadius: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {x.owner[1] ? (
                        <img
                          src={"http://127.0.0.1:8000/" + x.owner[1]}
                          style={{
                            height: "25px",
                            width: "30px",
                          }}
                        ></img>
                      ) : null}
                      <h5
                        style={{
                          color: "white",
                          margin: "1px",
                        }}
                      >
                        {x.owner[0]}
                      </h5>
                    </div>

                    <p
                      onClick={() => getRepliedComment(x.id)}
                      style={{
                        color: "white",
                        marginLeft: "20px",
                      }}
                    >
                      {x.commentText}
                    </p>
                  </div>

                  <Button onClick={() => handleDelete(x.id)}>
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
                                <p>{x.replyCommmentText}</p>
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
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    onChange={(e) => setReplyComment(e.target.value)}
                    style={{
                      backgroundColor: "white",
                      marginTop: "10px",
                      width: "1400px",
                      marginLeft: "50px",
                    }}
                  ></TextField>
                  <Button
                    onClick={() => handleReplyBlogComment(x.id)}
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
            ))}
          </div>
        </div>
      ) : (
        <CircularProgress
          style={{
            marginLeft: "50%",
            marginTop: "10%",
          }}
        />
      )}
    </div>
  );
}
