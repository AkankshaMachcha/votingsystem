import React, { useState } from 'react';
import { database, ref, set } from '../../firebase/firebase'; // Import ref from Firebase
import { push } from 'firebase/database';

const CreateDatabase = () => {
  const [message, setMessage] = useState('');

  const createTable = () => {
    // Hardcoded data for demonstration purposes
    const data = {
      name: 'John Doe',
      address: '123 Main St',
      adharNo: '123456789012',
      phoneNo: '123-456-7890',
      age: 30,
      // Add more fields as needed
    };

    // Get a reference to the 'adhardetails' table in the database
    const adharDetailsRef = ref(database, 'adhardetails');

    // Generate a new unique ID for the entry and set data under it
    const newEntryRef = push(adharDetailsRef); // <-- Use push() method on the reference

    // Set data under the newly generated ID
    set(newEntryRef, data)
      .then(() => {
        setMessage('Data inserted successfully.');
      })
      .catch((error) => {
        setMessage('Error inserting data: ' + error.message);
      });
  };

  return (
    <div>
      <button onClick={createTable}>Create Table and Insert Data</button>
      <p>{message}</p>
    </div>
  );
};

export default CreateDatabase;
