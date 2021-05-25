const getReceipentEmail = (users, userLoggedIn) => {
  const recepient = users?.filter(
    (userToFilter) => userToFilter !== userLoggedIn?.email
  );

  return recepient[0];
};

export default getReceipentEmail;
