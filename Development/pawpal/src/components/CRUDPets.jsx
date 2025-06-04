import React, { useState } from 'react';
import image from '../resorce/no_photo.png';
import { ActualState } from '../Domain/States/ActualState';

export const CRUDPets = ({ pets, onDelete, onUpdate, onAdd, addState, messegeError }) => {
  const [editingPets, setEditingPets] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', date_birth: '', breed: '', city: '' });

  const handleFieldChange = (id, field, value) => {
    setEditingPets(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSave = (id) => {
    if (editingPets[id]) {
      onUpdate(id, editingPets[id]);
      setEditingPets(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleNewPetChange = (field, value) => {
    setNewPet(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPet = () => {
    if (!newPet.name || !newPet.date_birth || !newPet.breedName || !newPet.city) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    onAdd(newPet);
  };

  return (
    <main className="userpets-main">
      <section className="userpets-list">

        {!showAddForm && (
          <div className="userpets-add-button-container">
            <button
              className="userpets-btn userpets-btn--add"
              onClick={() => setShowAddForm(true)}
            >
              + Добавить питомца
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="userpets-card userpets-card--new">
            <img src={image} alt="новый питомец" className="userpets-photo" />
            <form className="userpets-form" onSubmit={e => e.preventDefault()}>
              {['name', 'date_birth', 'breedName', 'city'].map((field) => (
                <label key={field}>
                  {field === 'name' ? 'Имя:' :
                   field === 'date_birth' ? 'Дата:' :
                   field === 'breedName' ? 'Порода:' : 'Город:'}
                  <input
                    type="text"
                    value={newPet[field]}
                    onChange={(e) => handleNewPetChange(field, e.target.value)}
                  />
                </label>
              ))}
            </form>
            
              {addState == ActualState.Init && <><div className="userpets-actions"><button className="userpets-btn userpets-btn--edit" onClick={handleAddPet}>Добавить</button>
              <button className="userpets-btn userpets-btn--delete" onClick={() => setShowAddForm(false)}>Отмена</button></div></>}
              {addState == ActualState.Error && <><div className="userpets-actions"><button className="userpets-btn userpets-btn--edit" onClick={handleAddPet}>Добавить</button>
              <button className="userpets-btn userpets-btn--delete" onClick={() => setShowAddForm(false)}>Отмена</button> </div> <p>{messegeError}</p> </>}
            </div>
          
        )}

        {pets.map(pet => {
          const editable = editingPets[pet.id] || pet;

          return (
            <div className="userpets-card" key={pet.id}>
              <img src={pet.image || image} alt={pet.name} className="userpets-photo" />
              <form className="userpets-form" onSubmit={e => e.preventDefault()}>
                {['name', 'date_birth', 'breedName', 'city'].map((field) => (
                  <label key={field}>
                    {field === 'name' ? 'Имя:' :
                     field === 'date_birth' ? 'Дата:' :
                     field === 'breedName' ? 'Порода:' : 'Город:'}
                    <input
                      type="text"
                      value={editable[field]}
                      onChange={(e) => handleFieldChange(pet.id, field, e.target.value)}
                    />
                  </label>
                ))}
              </form>
              <div className="userpets-actions">
                <button className="userpets-btn userpets-btn--edit" onClick={() => handleSave(pet.id)}>Сохранить</button>
                <button className="userpets-btn userpets-btn--delete" onClick={() => onDelete(pet.id)}>Удалить</button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};