import { observer } from "mobx-react";
import MainPageVM from "./MainPageVM";
import { useEffect } from "react";

export const MainPage = observer(() => {
    const { pets, loadPets } = MainPageVM

    useEffect(() => {
        const loading = async () => {
            loadPets()
        }
        loading()
    }, []);

    return (
        <>
            <ul>
                {pets.map(pet => (
                    <div key={pet.id}>
                        <p></p>
                        <img
                            src={pet.image}
                            alt={pet.name}
                            onError={(e) => console.error('Failed to load:', e.target.src)}
                        />
                    </div>
                ))}
            </ul>
        </>
    );
});