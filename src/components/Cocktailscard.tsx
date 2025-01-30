import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import {
  Cocktail,
  addCocktailBookmark,
  delCocktailBookmark,
  removeCocktail,
} from "../../reducers/cocktail";

// modif a prevoir pour passé de font awesome a lucide
// verifier les modification apporté a l'api
export default function Cocktailscard(props) {
  const dispatch = useDispatch();
  const cocktails = useSelector(
    (state: { cocktail: { value: { listCocktails: Cocktail[] } } }) =>
      state.cocktail.value.listCocktails
  );
  const [isBookmark, setIsBookmark] = useState(false);

  // useEffect pour recuperer l'information du bookmark afin d'afficher ou non le menu dans la modal cocktail selected
  useEffect(() => {
    const cocktail = cocktails.find((e) => e.idDrink === props.idCocktail);
    if (cocktail) {
      setIsBookmark(cocktail.bookmark);
    }
  }, [cocktails, props.idCocktail]);

  const handleDeleteCocktail = (idCocktail) => {
    dispatch(removeCocktail(idCocktail));
    props.onUpdateDelete();
  };

  const handleAddFavorie = (idCocktail) => {
    dispatch(addCocktailBookmark(idCocktail));
     props.onUpdate(idCocktail);
  };

  const handleLeaveFavorie = (idCocktail) => {
    dispatch(delCocktailBookmark(idCocktail));
    props.onUpdate(idCocktail);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containertop}>
        <View style={styles.containertopleft}>
          <Image style={styles.photo} source={{ uri: props.urlDrinkThumb }} />
          <Text style={styles.nameunderpic}>{props.cocktailName}</Text>
        </View>

        <View style={styles.containertopright}>
          <Text style={styles.txtdescription} numberOfLines={undefined}>
            {props.instructions}
          </Text>
        </View>
      </View>

      <View style={styles.ContainerMidCardTxt}>

        <View style={styles.MidCardTxtRightAndLeft}>
          <Text style={styles.textInfosHeader}>{props.Category}</Text>
          <Text style={styles.textInfosBigger}>Ingredients</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Ingredient1}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Ingredient2}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Ingredient3}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Ingredient4}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Ingredient5}</Text>
        </View>

        <View style={styles.MidCardTxtRightAndLeft}>
          <Text style={styles.textInfosHeader}>{props.Alcoholic}</Text>
          <Text style={styles.textInfosBigger}>Dosage</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Measure1}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Measure2}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Measure3}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Measure4}</Text>
          <Text style={styles.textIngredientOrMeasure}>{props.Measure5}</Text>
        </View>
      </View>

      <View style={styles.containerButtonFavorie}>
        {!isBookmark ? (
          <View style={styles.containerButtonAddFavoriAndDelete}>
            <TouchableOpacity
              onPress={() => handleDeleteCocktail(props.idCocktail)}
              style={styles.buttonDeleteCocktail}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="trash" size={30} color="#474CCC" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAddFavorie(props.idCocktail)}
              style={styles.buttonAddFavorie}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>ajouter aux favories</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.containerButtonDeleteFavorie}>
            <TouchableOpacity
              onPress={() => handleLeaveFavorie(props.idCocktail)}
              style={styles.buttonDeleteFavorie}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>supprimer des favories</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 15,
    paddingHorizontal: 30,
    borderColor: "#474CCC",
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: "#F0F7FF",
  },

  containertop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  containertopleft: {
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  containertopright: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    width: 200,
  },
  txtdescription: {
    width: 190,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#e2e2f3",
    borderColor: "#FF8C00",
    fontSize: 16,
    padding: 10,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "column", 
  },

  nameunderpic: {
    width: "100%",
    fontSize: 20,
    paddingTop: 5,
    fontWeight: "600",
    color: "#474CCC",
    textAlign: "center",
    flexWrap: "wrap",
    flexDirection: "column",
  },

  photo: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderColor: "#FF8C00",
    borderWidth: 1,
  },

  ContainerMidCardTxt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    marginleft: 10,
  },

  MidCardTxtRightAndLeft: {
    flexDirection: "column",
    width: "50%",
  },

  textInfosHeader: {
    color: "#FF8C00",
    marginBottom: 1,
    height: 50,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 22,
  },
  textInfosBigger: {
    color: "#474CCC",
    marginBottom: 7,
    height: 45,
    fontSize: 20,
    paddingLeft: 10,
  },
  textIngredientOrMeasure: {
    marginBottom: 7,
    paddingLeft: 10,
    fontSize: 16,
    flexWrap: "wrap", 
    flexDirection: "column", 
  },

  textButton: {
    color: "#ffffff",
    height: 30,
    fontSize: 16,
  },

  containerButtonFavorie: {
    justifyContent: "space-between",
  },
  containerButtonDeleteFavorie: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDeleteFavorie: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#474CCC",
    width: "60%",
    paddingTop: 8,
    borderRadius: 50,
  },
  containerButtonAddFavoriAndDelete: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buttonAddFavorie: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FF8C00",
    width: "60%",
    paddingTop: 8,
    borderRadius: 50,
  },
  buttonDeleteCocktail: {
    justifyContent: "center",
    alignItems: "center",
  },
});
