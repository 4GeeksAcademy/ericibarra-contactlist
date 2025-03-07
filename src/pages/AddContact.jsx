import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = 'https://playground.4geeks.com/contact/agendas';
const slug = 'Asenius';

const AddContact = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const initializeAgenda = async () => {
    try {
      
      const agendaResponse = await fetch(`${API_URL}/${slug}`);

      if (!agendaResponse.ok) {
        const errorData = await agendaResponse.json();
        throw new Error(errorData.detail || 'Failed to initialize agenda');
      }
      console.log('Agenda initialized successfully');

      if (id) {
        const contactResponse = await fetch(`${API_URL}/${slug}/contacts`);
        if (!contactResponse.ok) {
          throw new Error('Failed to fetch contact data');
        }
        const contactData = await contactResponse.json();
        setFormData(contactData);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message });
    } finally {
      setIsInitializing(false);
    }
  };
  
  useEffect(() => {
    initializeAgenda();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {

      const response = await fetch(`${API_URL}/${slug}/contacts/${id ? id : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/\s/g, ''),
          email: formData.email,
          address: formData.address
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.msg || 'Failed to save contact');
      }

      navigate('/', { state: { refresh: true } });
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: error.message });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  if (isInitializing) {
    return <div className="loading">Initializing agenda...</div>;
  }

  return (
    <div className="form-container">
      <div className="contact-header">
        <h1 className="contact-title">{id ? 'Edit Contact' : 'New Contact'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter full name"
          />
          {errors.full_name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            placeholder="Enter phone number"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`form-input ${errors.address ? 'input-error' : ''}`}
            placeholder="Enter address"
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="confirm-btn">
            {id ? 'Update' : 'Save'} Contact
          </button>
          <div className="back-to-contacts">
            <div className="separator-line"></div>
            <Link to="/" className="back-link">
              or get back to contacts
            </Link>
          </div>
        </div>

        {errors.general && (
          <div className="error-message general-error">
            ⚠️ {errors.general}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddContact;