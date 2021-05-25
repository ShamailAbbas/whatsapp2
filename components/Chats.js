import { useRouter } from "next/router";

import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

import getReceipentEmail from "../utils/getReciepentEmail";

import styled from "styled-components";
import { Avatar } from "@material-ui/core";

import { useGlobalContext } from "../pages/context/context";

const Chats = ({ id, users }) => {
  const { state } = useGlobalContext();
  const user = state.user;
  const router = useRouter();

  const [reciepentSnapshot] = useCollection(
    db.collection("users").where("email", "==", getReceipentEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recepient = reciepentSnapshot?.docs?.[0]?.data();
  const receipentEmail = getReceipentEmail(users, user);

  return (
    <Container onClick={enterChat}>
      {recepient ? (
        <UserAvatar src={recepient?.photoURL} />
      ) : (
        <UserAvatar>{receipentEmail[0]}</UserAvatar>
      )}

      <p>{receipentEmail}</p>
    </Container>
  );
};

export default Chats;
const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
