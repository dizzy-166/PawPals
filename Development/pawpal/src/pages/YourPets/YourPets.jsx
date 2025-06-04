import React, { useState } from 'react';
import image from '../../resorce/rttt.jpg';
import { CRUDPets } from '../../components/CRUDPets';

export const YourPets = () => {
  const [pets, setPets] = useState([
    { id: 1, name: 'Барсик', age: '3 года', breed: 'Сфинкс', city: 'Москва', image: image},
    { id: 2, name: 'Шарик', age: '5 лет', breed: 'Немецкая овчарка', city: 'Санкт-Петербург'},
  ]);

  const handleDelete = (id) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
  };

  const handleUpdate = (id, updatedData) => {
    setPets(prev =>
      prev.map(pet => pet.id === id ? { ...pet, ...updatedData } : pet)
    );
  };

  const handleAdd = (newPet) => {
    const newId = pets.length ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    setPets(prev => [...prev, { ...newPet, id: newId }]);
  };

  

  return (
    <>
    <CRUDPets
      pets={pets}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onAdd={handleAdd}
    />
    </>
  );
};