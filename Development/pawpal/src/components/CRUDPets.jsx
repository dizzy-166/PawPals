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

  const handleAddPet = async () => {
    if (!newPet.name || !newPet.date_birth || !newPet.breedName || !newPet.city) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    await onAdd(newPet);
    setShowAddForm(false);
    setNewPet({ name: '', date_birth: '', breedName: 1, city: '' });
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
            {/* Отображение выбранного изображения */}
            {newPet.imageFile ? (
              <img
                src={URL.createObjectURL(newPet.imageFile)}
                alt="новый питомец"
                className="userpets-photo"
              />
            ) : (
              <img src={image} alt="новый питомец" className="userpets-photo" />
            )}

            <form className="userpets-form" onSubmit={e => e.preventDefault()}>
              {['name', 'date_birth', 'breedName', 'city'].map((field) => (
                <label key={field}>
                  {field === 'name' ? 'Имя:' :
                    field === 'date_birth' ? 'Дата:' :
                      field === 'breedName' ? 'Порода:' : 'Город:'}

                  {field !== 'breedName' && field !== 'date_birth' && (
                    <input
                      type="text"
                      value={newPet[field]}
                      onChange={(e) => handleNewPetChange(field, e.target.value)}
                    />
                  )}

                  {field === 'date_birth' && (
                    <DatePicker
                      selected={newPet[field]}
                      onChange={(date) => handleNewPetChange(field, date)}
                      dateFormat="dd.MM.yyyy"
                      placeholderText="Дата рождения"
                      className="userpets-form input"
                    />
                  )}

                  {field === 'breedName' && (
                    <div className="select-wrapper">
                      <select
                        required
                        onChange={(e) => handleNewPetChange(field, e.target.value)}
                        className="userpets-form-input"
                      >
                        <option value="">Выберите породу</option>
                        {b.map(x => (
                          <option key={x.name} value={x.id}>{x.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </label>
              ))}

              {/* Input для выбора изображения */}
              <label>
                Фото:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleNewPetChange('imageFile', file);
                    }
                  }}
                />
              </label>
            </form>

            {/* Кнопки и состояния */}
            {addState === ActualState.Init && (
              <div className="userpets-actions">
                <button className="userpets-btn userpets-btn--edit" onClick={handleAddPet}>Добавить</button>
                <button className="userpets-btn userpets-btn--delete" onClick={() => setShowAddForm(false)}>Отмена</button>
              </div>
            )}

            {addState === ActualState.Error && (
              <>
                <div className="userpets-actions">
                  <button className="userpets-btn userpets-btn--edit" onClick={handleAddPet}>Добавить</button>
                  <button className="userpets-btn userpets-btn--delete" onClick={() => setShowAddForm(false)}>Отмена</button>
                </div>
                <p>{messegeError}</p>
              </>
            )}
          </div>
        )}

        {pets.map(pet => {
          const editable = editingPets[pet.id] || pet;

          return (
            <div className="userpets-card" key={pet.id}>
              <img src={editable.image || image} alt={editable.name} className="userpets-photo" />
              <form className="userpets-form" onSubmit={e => e.preventDefault()}>
                {['name', 'date_birth', 'breedName', 'city'].map((field) => (
                  <label key={field}>
                    {field === 'name' ? 'Имя:' :
                      field === 'date_birth' ? 'Дата:' :
                        field === 'breedName' ? 'Порода:' : 'Город:'}

                    {/* Поля: name и city */}
                    {(field !== 'breedName' && field !== 'date_birth') && (
                      <input
                        type="text"
                        value={editable[field]}
                        onChange={(e) => handleFieldChange(pet.id, field, e.target.value)}
                      />
                    )}

                    {/* Поле: date_birth */}
                    {field === 'date_birth' && (
                      <DatePicker
                        selected={new Date(editable[field])}
                        onChange={(date) => handleFieldChange(pet.id, field, date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Дата рождения"
                        className="userpets-form input"
                      />
                    )}

                    {/* Поле: breedName */}
                    {field === 'breedName' && (
                      <div className="select-wrapper">
                        <select
                          required
                          value={editable[field]}
                          onChange={(e) => handleFieldChange(pet.id, field, e.target.value)}
                          className="userpets-form-input"
                        >
                          <option value="">{editable[field]}</option>
                          {b.map(x => (
                            <option key={x.id} value={x.id}>{x.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </label>
                ))}

                {/* Фото-поле, если хочешь разрешить редактировать фото */}
                <label>
                  Фото:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFieldChange(pet.id, 'imageFile', file);
                      }
                    }}
                  />
                </label>
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