import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useGetUserId } from '../hooks/useGetUserId';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export interface ICreateRecipeProps {
}

export default function CreateRecipe () {

  const userId = useGetUserId();
  const [cookies, ] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userId,
  });

  const handleChange = (event: { target: { name: string; value: string[] | string | number; }; }) => {
    const {name, value} = event.target;
    setRecipe({...recipe, [name]: value});
  }

  const addIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]});
  }

  const handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { value} = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({...recipe, ingredients});    
  }

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/recipes", recipe, 
      {headers: {authorization: cookies.access_token},
    });

      if (response.data.errors) {
        alert("Please complete all fields!");
      } else {
        alert("Recipe Created!");
        navigate("/");
      }      
      
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className='create-recipe'>
      <h2>Create Recipes</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor='name'>Name</label>
        <input type="text" id="name" name='name' onChange={handleChange}/>
        <label htmlFor='description'>Description</label>
        <textarea id="description" name='description' onChange={handleChange}></textarea>

        <label htmlFor='ingredients'>Ingredients</label>
        {recipe.ingredients.map((ingredient, idx) => (
          <input 
            key={idx} 
            type="text" 
            name="ingredients" 
            value={ingredient} 
            onChange={(event) => handleIngredientChange(event, idx)}/>
        ))}
        <button onClick={addIngredient} type="button">
          Add ingredient
        </button>
        <label htmlFor='instructions'>Instructions</label>
        <textarea id="instructions" name='instructions' onChange={handleChange}></textarea>
        <label htmlFor='imageUrl'>Image URL</label>
        <input type="text" id="imageUrl" name='imageUrl' onChange={handleChange}/>
        <label htmlFor='cookingTime'>Cooking Time (minutes)</label>
        <input type="number" id="cookingTime" name='cookingTime' onChange={handleChange}/>
        <button type="submit">
          Create Recipe
        </button>
      </form>
    </div>
  );
}
