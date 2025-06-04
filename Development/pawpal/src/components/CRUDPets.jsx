import React, { useState } from 'react';
import image from '../resorce/no_photo.png';
import { ActualState } from '../Domain/States/ActualState';
import DatePicker from "react-datepicker";

export const CRUDPets = ({ pets, onDelete, onUpdate, onAdd, addState, messegeError, b }) => {
  const [editingPets, setEditingPets] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', date_birth: '', breedName: 1, city: '' });

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
    console.log('Питомцы с возрастом:', field, value);
    setNewPet(prev => ({ ...prev, [field]: value }));
    console.log('Питомцы с возрастом:', newPet);
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
                  {field !==  'breedName' && field !==  'date_birth' && <input
                    type="text"
                    value={newPet[field]}
                    onChange={(e) => handleNewPetChange(field, e.target.value)}
                  />}
                  {field === 'date_birth' && <>
                  <DatePicker
                  selected={newPet[field]}
                  onChange={(date) => {
                    handleNewPetChange(field, date)
                  }}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Дата рождения"
                   className="userpets-form input"
                  /> 
                   </>}
                  {field === 'breedName' && (
                    <div className="select-wrapper">
                    <select
                    required
                    onChange={(e) => handleNewPetChange(field, e.target.value)}
                    className="userpets-form-input"
                    >
                      <option value="">Выберите породу</option>
                      {b.map(x => (
                        <option key={x.name} value={x.id}>
                          {x.name}
                          </option>
                        ))}
                        </select>
                      </div>
                      )}
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