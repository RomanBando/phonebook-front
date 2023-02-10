import { gql } from "@apollo/client";

const CREATE_CONTACT = gql`
  mutation createContact($input: CreateContactDto!) {
    createContact(input: $input)
  }
`;

const UPDATE_CONTACT = gql`
  mutation updateContact($input: UpdateContactDto!) {
    updateContact(input: $input)
  }
`;

const REMOVE_CONTACT = gql`
  mutation removeContact($id: String!) {
    removeContact(id: $id)
  }
`;

const GET_UPLOAD_URL = gql`
  mutation getUploadUrl {
    getUploadUrl
  }
`;

const GET_CONTACTS = gql`
  query findContacts($search: String){
    findContacts(search: $search){
      id
      firstName
      lastName
      nickname
      name
      phoneNumber
      address
      photo
      photoFilter
    }
  }
`; 

export { CREATE_CONTACT, UPDATE_CONTACT, REMOVE_CONTACT, GET_CONTACTS, GET_UPLOAD_URL };