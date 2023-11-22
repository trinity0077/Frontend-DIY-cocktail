import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Cocktail } from "../reducers/cocktail";
import GestureRecognizer from "react-native-swipe-gestures";
import Cocktailscard from "../src/components/Cocktailscard";

export default function FavoritesScreen({ navigation }) {
  const cocktails = useSelector(
    (state: { cocktail: { value: { listCocktails: Cocktail[] } } }) =>
      state.cocktail.value.listCocktails
  );
  const [shouldUpdate, setShouldUpdate] = useState(false);

  function handleUpdate() {
    setShouldUpdate((prev) => !prev);
  }

  function onSwipeRightHomeToFavorite() {
    navigation.navigate("TabNavigator", { screen: "Home" });
  }

  // map pour afficher seulement les cocktail bookmark true
  // Question à poser sur l'utilité d'une clé "i" lorsque l'on peut utiliser un identifiant unique. 
  const allCocktailUp = cocktails.map((cocktail, i) => {
    if (cocktail.bookmark) {

      return (
        <Cocktailscard
          onUpdate={handleUpdate}
          key={cocktail.idDrink}
          bookmark={cocktail.bookmark}
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
      <Text style={styles.title}>Favorites</Text>
      <GestureRecognizer
        style={styles.containerScrollView}
        onSwipeRight={onSwipeRightHomeToFavorite}
      >
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
    width: "100%",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    width: "80%",
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
    color: "#FF8C00",
  },
  containerScrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  scrollView: {
    alignItems: "center",
    width: "93%",
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
  },

  viewcard: {
    width: "100%",
  },
});
