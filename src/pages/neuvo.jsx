import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import contactImage from '../../img/contactImage.png'
import { Spinner } from '../component/Spinner.jsx';

export const ContactListForm = () => {
    const { store, actions } = useContext(Context);
    
    const [contact, setContact] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });

    const [dataToSend, setDataToSend] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });
    const params = useParams();
    const navigate = useNavigate();

    const handleInput = (event) => {
        setDataToSend({ ...dataToSend, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (params.type == 'new') {
            await actions.createAgendaContact(params.agendaName, dataToSend).then((contacts) => {
                navigate(`/contact-list/${params.agendaName}`)
            });
        } else {
            await actions.updateAgendaContact(params.agendaName, params.id, dataToSend).then((contacts) => {
                navigate(`/contact-list/${params.agendaName}`)
            });
        }
    };

    useEffect(() => {
        if (params.type == 'new'){
            setDataToSend({name: '', phone: '', address: '', email: '' });
        } else {
            if (params.id) {
                actions.getAgendaContacts(params.agendaName).then((contact) => {
                    const currentContact = contact.contacts.find((c) => c.id === parseInt(params.id)) || {}
                    !currentContact && navigate(`/contact-list/${params.agendaName}`);
                    setContact(currentContact);
                    setDataToSend(currentContact);
                });
            }
        }
    }, []);
    return (
        !dataToSend ? div className="container d-flex justify-content-center align-items-center"Spinner color="black" //div :
        div className='container'
            form onSubmit={(event) = handleSubmit(event)}>
                h1{params.type == 'new' ? `Add new contact` : `Edit ${contact.name}'s information`}/h1
                div className="row"
                    div className="col-12 col-lg-2 d-flex justify-content-center"
                        img className='img-fluid p-0' style={{ maxWidth: 100 }} src={contactImage} /
                    /div
                    div className='form-group col-12 col-lg-4'
                        label htmlFor='name'Name span className='text-danger'*/span/label
                        input type='text' className='bg-secondary-subtle form-control' id='name' value={dataToSend.name} onChange={handleInput} required /
                    /div
                    div className='form-group col-12 col-lg-2'
                        label htmlFor='name'Phone/label
                        input type='text' className='bg-secondary-subtle form-control' id='phone' value={dataToSend.phone} onChange={handleInput} /
                    /div
                    div className='form-group col-12 col-lg-4'
                        label htmlFor='name'Email/label
                        input type='text' className='bg-secondary-subtle form-control' id='email' value={dataToSend.email} onChange={handleInput} /
                    /div
                /div
                div className="row mt-2"
                    div className='form-group col-12'
                        label htmlFor='name'Address/label
                        input type='text' className='bg-secondary-subtle form-control' id='address' value={dataToSend.address} onChange={handleInput} /
                    /div
                /div
                div className="row mt-4"
                    div className="d-flex justify-content-end"
                        button type='submit' className='btn btn-success col-12 col-lg-1 p-4 p-lg-1'Save/button
                    /div
                /div
            /form
        /div
    )
}