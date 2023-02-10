import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import getFilter from '../utils/getFilter';

export default function Contact({contact, handleOpen}) {
  const [photoFilterStyle, photoFilterAmount] = contact?.photoFilter?.split(',') || [];

  return (
    <ListGroup.Item onClick={handleOpen}>
      <Image 
        src={contact.photo} 
        style={{filter: getFilter(photoFilterStyle, photoFilterAmount)}} 
        thumbnail
      />
      {contact.name}
    </ListGroup.Item>
  )
}