import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { v4 as uuid } from 'uuid';

export default function ContactForm({contact}) {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [photoFilterStyle, photoFilterAmount=0] = contact?.photoFilter?.split(',') || [];

  useEffect(() => {
    setPhoneNumbers(contact?.phoneNumber?.map((number) => ({number, id: uuid()})) || []);
  }, [contact]);

  const handleAddNumber = (() => {
    setPhoneNumbers([...phoneNumbers, {id: uuid()}]);
  });

  const handleRemoveNumber = ((index) => {
    const newNumbers = [...phoneNumbers];
    newNumbers.splice(index, 1);
    setPhoneNumbers(newNumbers);
  });

  return (
    <>
      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control type='text' name='firstName' defaultValue={contact?.firstName}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control type='text' name='lastName' defaultValue={contact?.lastName}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Nickname</Form.Label>
        <Form.Control type='text' name='nickname' defaultValue={contact?.nickname}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control type='text' name='address' defaultValue={contact?.address}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Upload new photo</Form.Label>
        <Form.Control type="file" name='photoFile' defaultValue=''/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Photo Style</Form.Label>
        <Form.Select name='photoFilterStyle' defaultValue={photoFilterStyle}>
          <option value='grayscale'>Gray Scale</option>
          <option value='blur'>Blur</option>
          <option value='saturate'>Saturation</option>
          <option value=''>No Filter</option>
        </Form.Select>
      </Form.Group>
      <Form.Group>
        <Form.Label>Filter Amount</Form.Label>
        <Form.Range min={0} max={100} name='photoFilterAmount' defaultValue={photoFilterAmount}/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Phone Number</Form.Label>
        {phoneNumbers.map((item, i) => (
          <InputGroup key={item.id}>
            <Form.Control type='text' name='phoneNumber' defaultValue={item.number}/>
            <Button onClick={() => handleRemoveNumber(i)}>Remove</Button>
          </InputGroup>
          
        ))}
        <Button onClick={handleAddNumber}>
          Add
        </Button>
      </Form.Group>
    </>
  )
}