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
        <p className="petDetail">{pet.breedName}, возраст (в годах): {pet.age}</p>
        <p className="petCity">{pet.city}</p>

        <button className="walkButton">
          Позвать на прогулку
        </button>
      </div>
    </div>
  );
};

const NewsItem = ({ news }) => {
  return (
    <div className="newsItem">
      <h3 className="newsTitle">{news.name}</h3>
      <p className="newsDate">{news.date}</p>
      <p className="newsDescription">{news.description}</p>
    </div>
  );
};

const MainPage = observer(() => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    MainPageVM.loadPets();
    MainPageVM.loadNews();
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

  const displayedPets = MainPageVM.pets
  const displayedNews = [...MainPageVM.news].sort((a, b) => {
    const dateA = a.date.split('.').reverse().join('-');
    const dateB = b.date.split('.').reverse().join('-');
    return new Date(dateB) - new Date(dateA); // отсортированная дата
  });

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

      <div className="newsSection">
        <h2 className="sectionTitle">Новости</h2>
        <div className="newsList">
          {displayedNews.map(news => (
            <NewsItem key={news.id} news={news} />
          ))}
        </div>
      </div>

    </div>
  );
});

export default MainPage;