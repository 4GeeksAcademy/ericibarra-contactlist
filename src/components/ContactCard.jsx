import { Link } from 'react-router-dom';

const ContactCard = ({ contact, onDelete }) => {
  return (
    <div className="contact-card">
      <div className="contact-info">
        <h3>{contact.name}</h3>
        <p className="contact-detail">📱 {contact.phone}</p>
        <p className="contact-detail">📧 {contact.email}</p>
        <p className="contact-detail">🏠 {contact.address}</p>
      </div>
      
      <div className="contact-actions">
        <Link to={`/edit-contact/${contact.id}`} className="edit-btn">
          ✏️ Edit
        </Link>
        <button className="delete-btn" onClick={onDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;