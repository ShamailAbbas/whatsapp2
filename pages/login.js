import Head from "next/head";
import { auth, db, provider } from "../firebase";
import firebase from "firebase";

import styled from "styled-components";
import { Button } from "@material-ui/core";
import { WhatsApp } from "@material-ui/icons/WhatsApp";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import { useGlobalContext } from "./context/context";

function Login() {
  const { state, dispatch } = useGlobalContext();
  const error = state.loginerror;
  if (error) {
    console.log(error);
    alert(error);
  }

  const signin = async () => {
    let user = {};

    try {
      const loginresponse = await auth.signInWithPopup(provider);

      if (loginresponse) {
        try {
          await db.collection("users").doc(loginresponse?.user?.uid).set(
            {
              email: loginresponse?.user?.email,
              lastseen: firebase.firestore.FieldValue.serverTimestamp(),
              photoURL: loginresponse.user.photoURL,
            },
            { merge: true }
          );

          user.email = await loginresponse?.user?.email;
          user.photoURL = await loginresponse?.user?.photoURL;
          user.uid = await loginresponse?.user?.uid;
          dispatch({ type: "LOGIN", payload: user });
        } catch (error) {
          dispatch({ type: "LOGINERROR" });
          return;
        }
      }
    } catch (err) {
      dispatch({ type: "LOGINERROR" });
      return;
    }
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo />

        <Button variant="outlined" onClick={signin}>
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled(WhatsAppIcon)`
  margin-bottom: 50px;
  color: green;
  &&& {
    font-size: 100px;
    font-weight: 700;
  }
`;
