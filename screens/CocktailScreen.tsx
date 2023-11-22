import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GestureRecognizer from "react-native-swipe-gestures";
import Cocktailscard from "../src/components/Cocktailscard";
import { getCocktailApi } from "../src/modules/getCocktailApi";
import {
  Cocktail,
  addCocktailBookmark,
  delCocktailBookmark,
  addCocktailVisited,
} from "../reducers/cocktail";



export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const cocktails = useSelector(
    (state: { cocktail: { value: { listCocktails: Cocktail[] } } }) =>
      state.cocktail.value.listCocktails
  );
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(
    null
  );
  const [fetchCount, setFetchCount] = useState(0);
  const [cocktailMiniature, setCocktailMiniature] = useState([]);
  const [shouldUpdateFromCocktailCard, sethouldUpdateFromCocktailCard] =
    useState(false);
  const [modalCocktailVisible, setModalCocktailVisible] = useState(false);
  // setter pour la bar et les boutons relative à la recherche
  const [modalSearch, setModalSearch] = useState(false);
  const [onSearchByName, setOnSearchByName] = useState(false);
  const [onSearchByCategory, setOnSearchByCategory] = useState(false);
  const [onSearchByIngredient, setOnSearchByIngredient] = useState(false);
  const [searchText, setSearchText] = useState("");

  /////////// action en rapport avec la recherche ////////////////////

  function handleSearchButtonNom() {
    setOnSearchByName(!onSearchByName);
    setOnSearchByCategory(false);
    setOnSearchByIngredient(false);
    setSearchText(searchText);
  }
  function handleSearchButtonCategory() {
    setOnSearchByName(false);
    setOnSearchByCategory(!onSearchByCategory);
    setOnSearchByIngredient(false);
    setSearchText(searchText);
  }
  function handleSearchButtonIngredient() {
    setOnSearchByName(false);
    setOnSearchByCategory(false);
    setOnSearchByIngredient(!onSearchByIngredient);
    setSearchText(searchText);
  }
  // ouvre "la modal" en rapport avec la recherche
  function handleOnSearchIcon() {
    setModalSearch(!modalSearch);
  }

  ////////////////////////////////////////////////////////////////////

  // actualise la page "home" quand on met a jour la cardcocktail
  function handleUpdate() {
    sethouldUpdateFromCocktailCard((prev) => !prev);
    // console.log(idCocktail, cocktails.idDrink)
  }

  // ouvre la modal avec la recette du cocktail au click sur la miniature
  // charge les informations du cocktail dans le setter et ajoute visited true dans le reducer
  function handlePressCocktail(cocktail: Cocktail) {
    setSelectedCocktail(cocktail);
    setModalCocktailVisible(true);
    dispatch(addCocktailVisited(cocktail.idDrink));
  }
  // ferme la modal de la recette et clean le setter
  function handleUpdateDelete() {
    setModalCocktailVisible(!modalCocktailVisible);
    setSelectedCocktail(null);
  }

  // Ajouté ou suprime un cocktail en favorie dans le reducer j'aurais du le crée avec boolean
  // Puis actualise
  function handleAddFavorie(cocktail) {
    if (!cocktail.bookmark) dispatch(addCocktailBookmark(cocktail.idDrink));
    else dispatch(delCocktailBookmark(cocktail.idDrink));

    handleUpdate();
  }

  // navigation vers la page favorites au swipe
  function onSwipeLeftHomeToFavorite() {
    navigation.navigate("TabNavigator", { screen: "Favorites" });
  }

  // compté qui relance l' useEffect fetchDataWithModuleGetCocktailApi();
  const handleFetchSixMore = () => {
    setFetchCount(0);
  };

  // Fetch data from Api and dispatch in reducer cocktail
  useEffect(() => {
    const fetchDataWithModuleGetCocktailApi = async () => {
      try {
        const addedSuccessfully = await getCocktailApi(dispatch, cocktails);
        if (addedSuccessfully) {
          setFetchCount((prev) => prev + 1);
        } else {
          fetchDataWithModuleGetCocktailApi();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };   
      if (fetchCount < 7) {
        const delay = 160;
        setTimeout(() => {
          fetchDataWithModuleGetCocktailApi();
        }, delay); 
      }
  }, [fetchCount]),
  

  // Met à jour les miniatures en corrélation avec la recherche.
  // Applique également le style des images en fonction de leur statut : bookmark, visited ou jamais vu.
  useEffect(() => {
    const filteredCocktails = cocktails.filter((cocktail) => {
      const nameMatch = cocktail.strDrink
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const categoryMatch = cocktail.strAlcoholic
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const ingredientMatch =
        cocktail.strIngredient1
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        cocktail.strIngredient2
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        cocktail.strIngredient3
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        cocktail.strIngredient4
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        cocktail.strIngredient5
          .toLowerCase()
          .includes(searchText.toLowerCase());
      if (onSearchByName && nameMatch) {
        return true;
      }

      if (onSearchByCategory && categoryMatch) {
        return true;
      }

      if (onSearchByIngredient && ingredientMatch) {
        return true;
      }

      // Si aucun bouton n'est activé, recherche partout
      if (!onSearchByName && !onSearchByCategory && !onSearchByIngredient) {
        return nameMatch || categoryMatch || ingredientMatch;
      }

      return false;
    });

    const selectImageBorderPhotoStyle = (bookmark, visited) => {
      if (bookmark) {
        return {
          width: 130,
          height: 130,
          borderRadius: 100,
          borderColor: "#FF8C00",
          borderWidth: 4,
        };
      } else if (visited) {
        return {
          width: 130,
          height: 130,
          borderRadius: 100,
          borderColor: "#FF8C00",
          borderWidth: 2,
        };
      } else {
        return {
          width: 130,
          height: 130,
          borderRadius: 100,
          borderColor: "#474CCC",
          borderWidth: 1,
        };
      }
    };
    const allCocktailMiniature = filteredCocktails.map((cocktail) => (
      <GestureRecognizer key={cocktail.idDrink}>
        <Pressable
          onPress={() => handlePressCocktail(cocktail)}
          onLongPress={() => handleAddFavorie(cocktail)} // Ajout de l'appui long pour bookmarked true or false
        >
          <View style={styles.containertop}>
            <View style={styles.containerCocktailMiniature}>
              <Image
                style={[
                  selectImageBorderPhotoStyle(
                    cocktail.bookmark,
                    cocktail.visited
                  ),
                ]}
                source={{ uri: cocktail.strDrinkThumb }}
              />
              <Text style={styles.nameunderpic}>
                {cocktail.bookmark ? (
                  <>
                    <FontAwesome5
                      name="heart"
                      size={20}
                      color="#FF8C00"
                      solid
                    />{" "}
                  </>
                ) : null}
                {cocktail.strDrink}
              </Text>
            </View>
          </View>
        </Pressable>
      </GestureRecognizer>
    ));
    console.log(allCocktailMiniature.length);
    setCocktailMiniature(allCocktailMiniature);
  }, [
    cocktails,
    shouldUpdateFromCocktailCard,
    searchText,
    onSearchByName,
    onSearchByCategory,
    onSearchByIngredient,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTitle}>
        <Pressable
          style={styles.ButtonFetchMini}
          onPress={() => {
            handleOnSearchIcon(); // ouvre la modal de recherche
          }}
        >
          <FontAwesome5 name="search" size={30} color="#FF8C00" />
        </Pressable>

        <Text style={styles.title}>cocktail</Text>
        <Pressable
          style={styles.ButtonFetchMini}
          onPress={() => {
            handleFetchSixMore(); 
          }}
        >
          <FontAwesome5 name="plus" size={30} color="#FF8C00" />
        </Pressable>
      </View>

     {/* Modal de la barre de recherche qui s'ouvre au click sur l'icone loupe*/}
      {modalSearch ? (
        <View style={styles.containerModalSearchbar}>
          <View style={styles.containerSearchbar}>
            <View>
              <View style={styles.containerButtonSearchInModalSearch}>
                <Pressable
                  onPress={() => handleSearchButtonNom()}
                  style={[
                    styles.buttonSearchInModalSearch,
                    onSearchByName && styles.activeButton,
                  ]}
                >
                  <Text style={styles.textSearchButton}>Nom</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleSearchButtonIngredient()}
                  style={[
                    styles.buttonSearchInModalSearch,
                    onSearchByIngredient && styles.activeButton,
                  ]}
                >
                  <Text style={styles.textSearchButton}>Ingredient</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleSearchButtonCategory()}
                  style={[
                    styles.buttonSearchInModalSearch,
                    onSearchByCategory && styles.activeButton,
                  ]}
                >
                  <Text style={styles.textSearchButton}>Catégorie</Text>
                </Pressable>
              </View>
            </View>
            <Pressable
              style={styles.ContainerpressablesearchInput}
            >
              <View style={styles.searchInput}>
                <TextInput
                  placeholder="Rechercher un cocktail dans le reducer"
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}

      <GestureRecognizer onSwipeLeft={onSwipeLeftHomeToFavorite}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.viewcard}>{cocktailMiniature}</View>  
        </ScrollView>
      </GestureRecognizer>

      {/* Modal qui s'ouvre au click sur une miniature*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalCocktailVisible}
        onRequestClose={() => {
          setModalCocktailVisible(!modalCocktailVisible);
        }}
      >
        <View style={styles.modalContainer}>
          {selectedCocktail && (
            <Cocktailscard
              onUpdate={handleUpdate}
              onUpdateDelete={handleUpdateDelete}
              bookmark={selectedCocktail.bookmark}
              cocktailName={selectedCocktail.strDrink}
              Category={selectedCocktail.strCategory}
              Alcoholic={selectedCocktail.strAlcoholic}
              instructions={selectedCocktail.strInstructions}
              Ingredient1={selectedCocktail.strIngredient1}
              Ingredient2={selectedCocktail.strIngredient2}
              Ingredient3={selectedCocktail.strIngredient3}
              Ingredient4={selectedCocktail.strIngredient4}
              Ingredient5={selectedCocktail.strIngredient5}
              Measure1={selectedCocktail.strMeasure1}
              Measure2={selectedCocktail.strMeasure2}
              Measure3={selectedCocktail.strMeasure3}
              Measure4={selectedCocktail.strMeasure4}
              Measure5={selectedCocktail.strMeasure5}
              idCocktail={selectedCocktail.idDrink}
              urlDrinkThumb={selectedCocktail.strDrinkThumb}
            />
          )}
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setModalCocktailVisible(!modalCocktailVisible);
              setSelectedCocktail(null);
            }}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    paddingTop: 20,
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },

  title: {
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
    width: "50%",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
    color: "#FF8C00",
  },
  ButtonFetchMini: {
    marginTop: 10,
    justifyContent: "center",
    alignContent: "center",
    color: "#FF8C00",

    borderRadius: 5,
  },
  closeButtonTextMini: {
    color: "#fff",
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
  },
  scrollView: {
    alignItems: "center",
    width: "100%",
  },

  viewcard: {
    marginBottom: "17%",
    width: "100%",
    flexDirection: "row", // Organise les éléments en ligne
    flexWrap: "wrap", // Permet au contenu de passer à la ligne en cas de manque d'espace "agrandit la box"
    justifyContent: "space-around", 
  },
  containerCocktailMiniature: {
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
  },

 
  /////////////////// MODAL COCKTAIL selected


  containertop: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
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


  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  closeButton: {
    marginTop: 0,
    padding: 10,
    backgroundColor: "#474CCC",
    borderRadius: 5,
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  /////////// MODAL SEARCH BAR 


  containerModalSearchbar: {
    width: "100%",
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
    marginTop: 5,
    marginBottom: 5,
  },
  containerSearchbar: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  ContainerpressablesearchInput: {
    flexDirection: "row",
    width: "65%",
    paddingTop: 5,
    marginTop: 5,
  },
  searchInput: {
    height: 35,
    width: "100%",
    borderColor: "#FF8C00",
    borderWidth: 1,
    borderRadius: 50,
    color: "#474CCC",
    justifyContent: "center",
    paddingLeft: 10,
  },
  containerButtonSearchInModalSearch: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  buttonSearchInModalSearch: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF8C00",
    borderWidth: 1,
    width: "30%",
    marginTop: 6,
    borderRadius: 50,
  },
  activeButton: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
    marginTop: 6,
    borderRadius: 50,
  },

  textSearchButton: {
    color: "#474CCC",
    fontSize: 16,
  },
});
