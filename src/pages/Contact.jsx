import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactCard from '../components/ContactCard';

const API_URL = 'https://playground.4geeks.com/contact/agendas';
const slug = 'Asenius'

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const createAgenda = async () => {
    try {
      const agendaResponse = await fetch(`${API_URL}/${slug}`, {method: 'POST'});

      if (!agendaResponse.ok) {
        throw new Error('Failed to initialize agenda');
      }
      console.log('Agenda initialized successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error initializing agenda:', error);
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/${slug}/contacts`);

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();

      setContacts(data.contacts.length > 0 ? data.contacts : [demoContact]);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${slug}/contacts/${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setShowDeleteAlert(false);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  const demoContact = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 555 123 4567',
    address: '123 Main St, New York, USA',
    agenda_slug: slug
  };

  useEffect(() => {
    createAgenda().then(() => fetchContacts());
  }, []);

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Contacts</h1>
        <Link to="/add-contact" className="add-contact-btn">
          <span>+</span>
          Add New Contact
        </Link>
      </div>

      <div>
        {contacts.map(contact => (
          <ContactCard 
            key={contact.id}
            contact={contact}
            onDelete={() => {
              setSelectedContact(contact);
              setShowDeleteAlert(true);
            }}
          />
        ))}
      </div>

      {showDeleteAlert && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h3>Delete Contact</h3>
            <p className="delete-modal-text">Are you sure you want to delete this contact?</p>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={() => setShowDeleteAlert(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(selectedContact.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;