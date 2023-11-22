import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Cocktail {
  idDrink: string ;
  bookmark: boolean | false;
  visited: boolean | false;
  strDrink: string ;
  strCategory: string ;
  strAlcoholic: string ;
  strInstructions: string ;
  strInstructionsFR: string ;
  strDrinkThumb: string ;
  strIngredient1: string ;
  strIngredient2: string ;
  strIngredient3: string ;
  strIngredient4: string ;
  strIngredient5: string ;
  strMeasure1: string ;
  strMeasure2: string ;
  strMeasure3: string ;
  strMeasure4: string ;
  strMeasure5: string ;
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
      // Recherche dans le tableau l'index du cocktail envoyé via le payload
      // Si l'index est trouvé, mettre à jour la propriété bookmark
      const index = state.value.listCocktails.findIndex(cocktail => cocktail.idDrink === action.payload);

      if (index !== -1) {
        state.value.listCocktails[index].bookmark = true;
      } 
    },
    // question à poser "boolean" Bonne pratique
    delCocktailBookmark: (state, action: PayloadAction<string>) => {
      const index = state.value.listCocktails.findIndex(cocktail => cocktail.idDrink === action.payload);
      if (index !== -1) {
        state.value.listCocktails[index].bookmark = false;
      } 
    },

    addCocktailVisited: (state, action: PayloadAction<string>) => {
      const index = state.value.listCocktails.findIndex(cocktail => cocktail.idDrink === action.payload);
      if (index !== -1) {
        state.value.listCocktails[index].visited = true;
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

  // Ajoute la propriété bookmark et visited définie sur false à l'objet Cocktail
  // et le place au debut du tableau listCocktails
  state.value.listCocktails.unshift({
    ...sanitizedCocktail,
    bookmark: false,
    visited: false,
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
  addCocktailVisited,


} = userSlice.actions;

export default userSlice.reducer;
