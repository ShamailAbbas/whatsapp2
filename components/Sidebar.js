import { auth, db } from "../firebase";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";

import Chat from "../components/Chats";
import * as EmailValidator from "email-validator";

import styled from "styled-components";

import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";

import { useGlobalContext } from "../pages/context/context";

function Sidebar() {
  const { state, dispatch } = useGlobalContext();

  const user = state.user;
  const email = user.email;
  const router = useRouter();
  const getchats = () => {
    return db.collection("chats").where("users", "array-contains", email);
  };
  const [chatsSnapshot] = useCollection(getchats());

  const createchat = () => {
    const input = prompt(
      "please enter email address for thr user you want to chat with"
    );

    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (receipentEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === receipentEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={async () => {
            await auth.signOut();
            dispatch({ type: "LOGOUT" });
            // router.push("/");
          }}
        />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchOutlined />
        <SearchInput placeholder="Search in chats" />
      </Search>
      <SidebarButton onClick={createchat}>Start a new chat</SidebarButton>
      {chatsSnapshot?.docs.map((chat, index) => {
        return <Chat key={index} id={chat.id} users={chat.data().users} />;
      })}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 2px solid lightgray;

  height: 100vh;
  min-width: 300px;
  max-width: 300px;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  background-color: white;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
