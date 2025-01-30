import {
    addCocktail,
  } from "../../reducers/cocktail";

const API_ADDRESS = "https://thecocktaildb.com/api/json/v1/1/random.php";

export const getCocktailApi = async (dispatch, cocktails) => {

    try {
      const response = await fetch(API_ADDRESS);
      const data = await response.json();

      if (data.drinks && data.drinks.length > 0) {
        const newCocktail = data.drinks[0];
        const isCocktailExists = cocktails.find(
          (cocktail) => cocktail.idDrink === newCocktail.idDrink
        );

        if (!isCocktailExists) {
          dispatch(addCocktail(newCocktail));
          // return true pour mettre à jour le compteur et indiquer que le fetch à réussi.
          return true
        } else {
          console.log(
            "Cocktail already exists in Redux state restarting fetch"
          );
          return false
        }
      } else {
        console.error("No drinks data found");//
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return false
  };