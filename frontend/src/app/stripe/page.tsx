'use client';

import React, { useState, useEffect } from 'react';
import './page.css';
import { ProductDisplay } from '@/components/ProductDisplay';
import { SuccessDisplay } from '@/components/SucessDisplay';

const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function Checkout() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    console.log('current location:', window.location.search);
    console.log('sessionId:', query.get('session_id'));

    if (query.get('success')) {
      console.log('current location:', window.location.search);
      console.log('querying session id on success:', query.get('session_id'));
      setSuccess(true);
      setSessionId(query.get('session_id') || '');
    }

    if (query.get('canceled')) {
      setSuccess(false);
      // setMessage(
      //   "Order canceled -- continue to shop around and checkout when you're ready."
      // );
    }
  }, []);

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}

