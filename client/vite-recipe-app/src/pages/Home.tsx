import { useEffect, useState } from 'react';
import axios from "axios";
import { Recipe } from '../types/Recipe';
import { useGetUserId } from '../hooks/useGetUserId';

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {

  const [recipes, setRecipes] = useState([]);
  const userId = useGetUserId();

  useEffect(() => {

    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);        
      } catch (error) {
        console.error(error);
        
      }
    }

    fetchRecipe()
  }, []);

  const saveRecipe = async (recipeId: number) => {

    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeId,
        userId,
      });
      console.log(response);
      
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => saveRecipe(recipe._id)}>Save Recipe</button>
            </div>
            <div className='instructions'>
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} mins </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
