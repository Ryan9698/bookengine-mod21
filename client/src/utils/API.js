import { GET_ME } from "./queries";
import { ADD_USER } from "./mutations";
import { LOGIN_USER } from "./mutations";
import { SAVE_BOOK, REMOVE_BOOK } from "./mutations";
// import { ApolloClient } from "@apollo/client";

export const getMe = async (apolloClient) => {
  try {
    const { data } = await apolloClient.query({ query: GET_ME });
    return data.me;
  } catch (error) {
    console.error(error);
    console.log("Error returning GET_ME Query");
  }
};

export const createUser = async (apolloClient, userData) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_USER,
      variables: userData,
    });
    return data.addUser;
  } catch (error) {
    console.error(error);
    console.log("Failure to Create User");
  }
};

export const loginUser = async (apolloClient, userData) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_USER,
      variables: userData,
    });
    return data.login;
  } catch (error) {
    console.error(error);
    console.log("Failure to Login User");
  }
};

export const saveBook = async (apolloClient, bookData) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SAVE_BOOK,
      variables: { input: bookData },
    });
    return data.saveBook;
  } catch (error) {
    console.error(error);
    console.log("Failure to add Book: API.js saveBook line 43")
  }
};

export const deleteBook = async (apolloClient, bookId) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_BOOK,
      variables: { bookId },
    });
    return data.removeBook;
  } catch (error) {
    console.error(error);
    console.log("Failure to remove book. API.js deleteBook line 56")
  }
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
