import { useEffect, useState } from 'react';
import axios from "axios";
import { Recipe } from '../types/Recipe';
import { useGetUserId } from '../hooks/useGetUserId';
import { useCookies } from 'react-cookie';

export interface IHomeProps {
}

export default function Home (props: IHomeProps) {

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([{}]);
  const [cookies, ] = useCookies(["access_token"]);

  const userId = useGetUserId();

  useEffect(() => {

    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);        
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userId}`
        );
        setSavedRecipes(response.data.savedRecipes);              
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();

    if (cookies.access_token) {
      fetchSavedRecipes();
    }

  }, []);

  const saveRecipe = async (recipeId: number) => {

    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeId,
        userId,
      }, {headers: {authorization: cookies.access_token}});
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.error(error);
    }
  }

  const isRecipeSaved = (id: number) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe: Recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button 
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}  
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
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
