import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const defaultTheme = createTheme();

export default function SignUp() {
  const [image, setImage] = React.useState();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [signUpState, setSignUpState] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("INPUT DAta", name, email, password, image);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profile_image", image);
    formData.append("password", password);

    if (confirmpassword === password) {
      if (password.length > 5) {
        axios
          .post("http://127.0.0.1:8000/api/register/", formData, {
            headers: {
              "content-type": "multipart/form-data", // do not forget this
            },
          })
          .then((x) => {
            console.log("STATUS", x.status);
            setSignUpState(true);
            setMessage("SuccessFully done");
          })
          .catch((y) => {
            setSignUpState(false);
            setMessage("Please check your credintal");
          });
      }else{
        alert("password is to short")
      }
    } else {
      alert("Password didn't match");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {signUpState !== null ? (
        signUpState ? (
          <Snackbar open={true} autoHideDuration={2000}>
            <Alert severity="success" sx={{ width: "150%" }}>
              Successly Done
            </Alert>
          </Snackbar>
        ) : (
          <Snackbar open={true} autoHideDuration={2000}>
            <Alert severity="error" sx={{ width: "150%" }}>
              {message}
            </Alert>
          </Snackbar>
        )
      ) : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="UserName"
                  required
                  fullWidth
                  id="User Name"
                  label="User Name"
                  autoFocus
                  style={{
                    marginBottom: "15px",
                  }}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  style={{
                    marginBottom: "15px",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  name="password"
                  label="confirm password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <div
                style={{
                  padding: "1px",
                  backgroundColor: "#f0f2f0",
                  margin: "10px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    paddingLeft: "35px",
                    marginRight: "10px",
                    paddingTop: "10px",
                  }}
                >
                  Your Profile:{" "}
                </p>
                <input
                  type="file"
                  style={{
                    marginLeft: "10px",
                  }}
                  onChange={(event) => {
                    setImage(event.target.files[0]);
                  }}
                ></input>
              </div>
              <Grid item xs={12}>
                <FormControlLabel
                  style={{
                    margin: "15px",
                  }}
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
