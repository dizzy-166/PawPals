import { useState } from "react";
import supabase from '../../Domain/Utils/Constant';

export function FindPetVM() {
  const [filters, setFilters] = useState({ desc: "", breedName: "" });
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setDesc = (value) =>
    setFilters((prev) => ({ ...prev, desc: value }));

  const setBreedName = (value) =>
    setFilters((prev) => ({ ...prev, breedName: value }));

  const searchPets = async () => {
  setLoading(true);
  setError(null);

  try {
    let breedIds = [];

    // Если фильтр по породе задан — ищем id пород с таким именем
    if (filters.breedName) {
      const { data: breeds, error: breedError } = await supabase
        .from('Breeds')
        .select('id')
        .ilike('name', `%${filters.breedName}%`);

      if (breedError) throw breedError;

      breedIds = breeds.map(b => b.id);

      if (breedIds.length === 0) {
        // Нет пород, подходящих под фильтр — сразу очистить список питомцев
        setPets([]);
        setLoading(false);
        return;
      }
    }

    // Формируем запрос к питомцам
    let query = supabase
      .from("Pets")
      .select("*, Breeds(name)");

    if (filters.desc) {
      query = query.ilike("desc", `%${filters.desc}%`);
    }

    if (filters.breedName) {
      // Фильтруем питомцев по найденным id пород
      query = query.in('breed_id', breedIds);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setPets([]);
    } else {
      setPets(data);
    }
  } catch (e) {
    setError(e.message);
    setPets([]);
  } finally {
    setLoading(false);
  }
};

  return {
    filters,
    setDesc,
    setBreedName,
    pets,
    loading,
    error,
    searchPets,
  };
}
