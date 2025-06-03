import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { ActualState } from "../../Domain/States/ActualState";
import MainPageVM from './MainPageVM';

const PetCard = ({ pet }) => {
  return (
    <div className="petCard">
      <div className="petImageContainer">
        {pet.image ? (
          <img 
            src={pet.image} 
            alt={pet.name}
            className="petImage"
          />
        ) : (
          <div className="noImagePlaceholder">Нет изображения</div>
        )}
      </div>
      
      <div className="petInfoContainer">
        <h3 className="petName">{pet.name}</h3>
        <p className="petDetail">{pet.breedName}, {pet.date_birth} года</p>
        <p className="petLocation">{pet.location}</p>
        
        <button className="walkButton">
          Позвать на прогулку
        </button>
      </div>
    </div>
  );
};

const MainPage = observer(() => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    MainPageVM.loadPets();
  }, []);
  

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setShowLeftButton(container.scrollLeft > 0);
        setShowRightButton(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      };
      
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [MainPageVM.pets]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (MainPageVM.actualState === ActualState.Loading) {
    return <div className="loadingState">Загрузка...</div>;
  }

  if (MainPageVM.actualState === ActualState.Error) {
    return <div className="errorState">Ошибка: {MainPageVM.messageError}</div>;
  }

  const displayedPets = MainPageVM.pets.length > 0 
    ? MainPageVM.pets.map(pet => ({
        ...pet,
        date_birth: pet.date_birth || 2,
        location: pet.location || 'Москва',
        image: pet.image || null
      }))
    : [
        { id: 1, name: 'Барсик', category: 'Ретривер', age: 2, location: 'Москва', image: null },
        { id: 2, name: 'Мурзик', category: 'Британский', age: 3, location: 'Санкт-Петербург', image: null },
        { id: 3, name: 'Шарик', category: 'Дворняга', age: 4, location: 'Казань', image: null },
        { id: 4, name: 'Рекс', category: 'Овчарка', age: 1, location: 'Новосибирск', image: null }
      ];

  return (
    <div className="mainPageContainer">
      <div 
        ref={scrollContainerRef}
        className="scrollContainer"
      >
        <div className="petsRow">
          {displayedPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>

      <div className="navigationButtons">
        <button
          onClick={() => scroll('left')}
          disabled={!showLeftButton}
          className="navButton"
        >
          ← Назад
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!showRightButton}
          className="navButton"
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
});

export default MainPage;