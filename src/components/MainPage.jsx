import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CONTACT, GET_CONTACTS, GET_UPLOAD_URL, REMOVE_CONTACT, UPDATE_CONTACT } from "../graphql/contacts";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ContactForm from "./ContactForm";
import { useCallback, useMemo, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import LoadingButton from "./LoadingButton";
import ListGroup from 'react-bootstrap/ListGroup';
import Contact from "./Contact";
import debounce from 'lodash.debounce';


export default function MainPage() {
  const [search, setSearchImmediate] = useState();
  const setSearch = useMemo(() => debounce(setSearchImmediate, 1000), [setSearchImmediate]);
  const { loading: isLoadingContacts, data, refetch } = useQuery(
    GET_CONTACTS, 
    { variables: {search} }
  );
  const [createContact, { loading: isCreatingContact }] = useMutation(CREATE_CONTACT);
  const [updateContact, { loading: isUpdatingContact }] = useMutation(UPDATE_CONTACT);
  const [removeContact, { loading: isRemovingContact }] = useMutation(REMOVE_CONTACT);
  const [getUploadUrl] = useMutation(GET_UPLOAD_URL);
  const [currentContact, setCurrentContact] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, [setSearch]);

  const handleClose = useCallback(() => {
    setCurrentContact(undefined);
    setIsModalOpen(false);
  }, []);

  const handleOpen = useCallback((contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  }, []);

  const handleRemove = useCallback(async () => {
    const variables =  { id: currentContact?.id };
  
    await removeContact({ variables });

    handleClose();
    refetch();
  }, [currentContact, handleClose, refetch, removeContact]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const nickname = formData.get('nickname');
    const photoFilterStyle = formData.get('photoFilterStyle');
    const photoFilterAmount = formData.get('photoFilterAmount');
    const photoFile = formData.get('photoFile');
    let photo = currentContact?.photo;

    if (photoFile?.name) {
      const url = await getUploadUrl();
      await fetch(url.data.getUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: photoFile
      });
      photo = url.data?.getUploadUrl.split('?')[0];
    };

    const variables =  {
      input: {
        id: currentContact?.id, 
        firstName, 
        lastName,
        nickname,
        name: nickname || `${firstName} ${lastName}`,
        phoneNumber: formData.getAll('phoneNumber'),
        photo,
        photoFilter: [photoFilterStyle, photoFilterAmount].join()
      }
    };
    
    if (!currentContact?.id) {
      await createContact({ variables });
    } else {
      await updateContact({ variables });
    }
    
    handleClose();
    refetch();
  }, [createContact, currentContact?.id, currentContact?.photo, getUploadUrl, handleClose, refetch, updateContact]);

  return (
    <div>
      <Form.Control placeholder="Search Contact" onChange={handleSearch} />
      {isLoadingContacts && <Spinner animation="border" role="status" />}
      <ListGroup as="ul">
      {data?.findContacts.map((contact) => (
        <Contact 
          handleOpen={() => handleOpen(contact)}
          key={contact.id}
          contact={contact}
        />
      ))}
      </ListGroup>
      
      <Button variant="primary" onClick={handleOpen}>
        Add New Contact
      </Button>

      <Modal show={isModalOpen} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
            {currentContact?.id ? 'Update Contact' : 'Add Contact'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContactForm contact={currentContact} />
            {currentContact?.id
              ? 
              <LoadingButton
                onClick={handleRemove}
                variant="danger" 
                type="button" 
                loading={isRemovingContact}
              >
                Remove Contact
              </LoadingButton> 
              : 
              null
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <LoadingButton 
              variant="primary" 
              type="submit" 
              loading={isCreatingContact || isUpdatingContact}
            >
              {currentContact?.id ? 'Update Contact' : 'Add Contact'}
            </LoadingButton>
          </Modal.Footer>
        </Form>
      </Modal>
    
    </div>
  )
}