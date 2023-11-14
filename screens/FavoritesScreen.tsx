
import React, {useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Cocktail,} from "../reducers/cocktail";
import GestureRecognizer from 'react-native-swipe-gestures';
import Cocktailscard from "../components/Cocktailscard"


export default function FavoritesScreen({ navigation }) {

  const dispatch = useDispatch(); // non utile pour le moment
  const cocktails = useSelector((state: { cocktail: { value: { listCocktails: Cocktail[] } } }) => state.cocktail.value.listCocktails);
  const [cocktailUp, setCocktailUp] = useState([]); // utile pour des teste avec des donné fixé
  const [shouldUpdate, setShouldUpdate] = useState(false);

  function handleUpdate() {
    setShouldUpdate((prev) => !prev);
  }

  function onSwipeRightHomeToFavorite(){
    navigation.navigate("TabNavigator", { screen: "Home" });
  }

  //chargement des donner du reducer cocktails dans la cocktailscard
  //cela va permetre d'afficher toute les recette qui sont bookmark 
  //via le   if (cocktail.bookmark)...
  const allCocktailUp = cocktails.map((cocktail, i) => {
    if (cocktail.bookmark){
   // console.log("/////////", cocktail.bookmark)
    
    return (
      <Cocktailscard
        onUpdate={handleUpdate}
        key={cocktail.idDrink}
        bookmark= {cocktail.bookmark}
        cocktailName={cocktail.strDrink}
        Category={cocktail.strCategory}
        Alcoholic={cocktail.strAlcoholic}
        instructions={cocktail.strInstructions}
        Ingredient1={cocktail.strIngredient1}
        Ingredient2={cocktail.strIngredient2}
        Ingredient3={cocktail.strIngredient3}
        Ingredient4={cocktail.strIngredient4}
        Ingredient5={cocktail.strIngredient5}
        Measure1={cocktail.strMeasure1}
        Measure2={cocktail.strMeasure2}
        Measure3={cocktail.strMeasure3}
        Measure4={cocktail.strMeasure4}
        Measure5={cocktail.strMeasure5}
        idCocktail={cocktail.idDrink}
        urlDrinkThumb={cocktail.strDrinkThumb}
      />

);
}
  });
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorite</Text>
      <GestureRecognizer style={styles.container} onSwipeRight={onSwipeRightHomeToFavorite}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.viewcard}>{allCocktailUp}</View>
      </ScrollView>
      </GestureRecognizer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
   
    flex: 1,
    width:"100%",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    width: "80%",
    marginTop: 20,
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
    color: "#FF8C00",
  },
  scrollView: {
    alignItems: "center",
    width: "93%",
    //  borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
 
  },

  viewcard: {
    width: "100%",
  },
});
