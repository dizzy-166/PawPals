import React, { useEffect, useState } from "react";
import { FindPetVM } from "./FindPetVM";

export default function FindPet() {
  const {
    filters,
    setDesc,
    setBreedName,
    pets,
    loading,
    error,
    searchPets,
  } = FindPetVM();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPets();
  };

  return (
    <div className="containerFindPet">
      <h2 className="titleFindPet">Поиск питомцев</h2>
      <form onSubmit={handleSubmit} className="formFindPet">
        <input
          type="text"
          placeholder="Описание"
          value={filters.desc}
          onChange={(e) => setDesc(e.target.value)}
          className="inputFindPet"
        />

        <input
          type="text"
          placeholder="Порода"
          value={filters.breedName}
          onChange={(e) => setBreedName(e.target.value)}
          className="inputFindPet"
          autoComplete="off"
        />

        <button type="submit" className="buttonFindPet">
          Найти
        </button>
      </form>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      <ul className="listFindPet">
        {pets.map((pet) => (
          <li key={pet.id} className="cardFindPet">
            <div className="petImageContainer">
              {pet.image ? (
                <img src={pet.image} alt={pet.name} className="petImage" />
              ) : (
                <div className="noImagePlaceholder">Нет изображения</div>
              )}
            </div>

            <div className="petInfoContainer">
              <strong className="petName">{pet.name}</strong>
              <p className="petBreed">Порода: {pet.Breeds?.name || "Не указана"}</p>
              <p className="petDesc">Описание: {pet.desc}</p>

              <button className="walkButton">Позвать на прогулку</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
