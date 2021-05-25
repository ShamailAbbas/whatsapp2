import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

import firebase from "firebase";
import { db } from "../firebase";

import { useCollection } from "react-firebase-hooks/firestore";

import Message from "../components/Message";
import getRecepientEmail from "../utils/getReciepentEmail";
import getReceipentEmail from "../utils/getReciepentEmail";

import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { InsertEmoticon, Mic } from "@material-ui/icons";
import moment from "moment";

import { useGlobalContext } from "../pages/context/context";

const ChatScreen = ({ chat, messages }) => {
  const { state } = useGlobalContext();
  const user = state.user;
  const [input, setinput] = useState("");
  const router = useRouter();
  const EndofMessagesref = useRef(null);

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recepientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getReceipentEmail(chat?.users, user))
  );

  const showmessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => {
        <Message key={message.id} user={message.user} message={message} />;
      });
    }
  };

  EndofMessagesref.current.scrollIntoView({
    behaviour: "smooth",
    block: "start",
  });

  const sendmessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setinput("");
  };

  const recepient = recepientSnapshot?.docs?.[0]?.data();
  const receipentemail = getRecepientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recepient ? (
          <Avatar src={recepient?.photoURL} />
        ) : (
          <Avatar>{receipentemail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{receipentemail}</h3>
          {recepientSnapshot ? (
            <p>
              Last active:{" "}
              {recepient?.lastSeen?.toDate()
                ? moment(recepient.lastSeen.toDate().getTime()).format("LT")
                : "Unavailable"}{" "}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showmessages()}
        <EndofMessages ref={EndofMessagesref}>{""}</EndofMessages>
        <InputContainer>
          <InsertEmoticon />
          <Input value={input} onChange={(e) => setinput(e.target.value)} />
          <Button
            hidden={!input}
            disabled={!input}
            type="submit"
            onClick={sendmessage}
          >
            Send Message
          </Button>
          <Mic />
        </InputContainer>
      </MessageContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded3;
  min-height: 90vh;
`;
const EndofMessages = styled.div`
  margin-bottom: 20px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;

  box-shadow: 0px 1px 1px 0px gray;
`;
const Button = styled.button`
  border: none;
  :focus {
    outline: none;
  }
  color: green;
  background-color: transparent;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
`;
