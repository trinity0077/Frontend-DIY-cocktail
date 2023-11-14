import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Cocktail {
  idDrink: string | "" ;
  bookmark: boolean | false;
  strDrink: string | "" ;
  strCategory: string | "" ;
  strAlcoholic: string | "" ;
  strInstructions: string | "" ;
  strInstructionsFR: string | "" ;
  strDrinkThumb: string | "" ;
  strIngredient1: string | "" ;
  strIngredient2: string | "" ;
  strIngredient3: string | "" ;
  strIngredient4: string | "" ;
  strIngredient5: string | "" ;
  strMeasure1: string | "" ;
  strMeasure2: string | "" ;
  strMeasure3: string | "" ;
  strMeasure4: string | "" ;
  strMeasure5: string | "" ;
}

export interface UserState {
  value: {
    listCocktails: Cocktail[];
  };
}

const initialState: UserState = {
  value: {
    listCocktails: [],
  },
};


export const userSlice = createSlice({
  name: 'cocktail',
  initialState,
  reducers: {

    addCocktailBookmark: (state, action: PayloadAction<string>) => {
      // Trouver l'index du cocktail dans le tableau
      const index = state.value.listCocktails.findIndex(cocktail => cocktail.idDrink === action.payload);

      // Si l'index est trouvé, mettre à jour la propriété bookmark
      if (index !== -1) {
        state.value.listCocktails[index].bookmark = true;
      } else {

      }
    },

    delCocktailBookmark: (state, action: PayloadAction<string>) => {
      // Trouver l'index du cocktail dans le tableau
      const index = state.value.listCocktails.findIndex(cocktail => cocktail.idDrink === action.payload);

      // Si l'index est trouvé, mettre à jour la propriété bookmark
      if (index !== -1) {
        state.value.listCocktails[index].bookmark = false;
      } else {

      }
    },

    addCocktail: (state, action : PayloadAction<Cocktail> ) => {
      // Remplacer les valeurs null par des chaînes vides
  const sanitizedCocktail: Cocktail = {
    ...action.payload,
    strDrink: action.payload.strDrink || "",
    strCategory: action.payload.strCategory || "",
    strAlcoholic: action.payload.strAlcoholic || "",
    strInstructions: action.payload.strInstructions || "",
    strInstructionsFR: action.payload.strInstructionsFR || "",
    strDrinkThumb: action.payload.strDrinkThumb || "",
    strIngredient1: action.payload.strIngredient1 || "",
    strIngredient2: action.payload.strIngredient2 || "",
    strIngredient3: action.payload.strIngredient3 || "",
    strIngredient4: action.payload.strIngredient4 || "",
    strIngredient5: action.payload.strIngredient5 || "",
    strMeasure1: action.payload.strMeasure1 || "",
    strMeasure2: action.payload.strMeasure2 || "",
    strMeasure3: action.payload.strMeasure3 || "",
    strMeasure4: action.payload.strMeasure4 || "",
    strMeasure5: action.payload.strMeasure5 || "",
  };

  // Ajouter le cocktail avec la propriété bookmark définie sur false
  state.value.listCocktails.unshift({
    ...sanitizedCocktail,
    bookmark: false,
  });
      //console.logg('reducer a addCocktail',action.payload)
    },
    removeCocktail: (state, action: PayloadAction<string>) => {
      state.value.listCocktails = state.value.listCocktails.filter((cocktail) => cocktail.idDrink !== action.payload);
    },
  },
});

export const {
  addCocktail,
  removeCocktail,
  addCocktailBookmark,
  delCocktailBookmark,


} = userSlice.actions;

export default userSlice.reducer;
