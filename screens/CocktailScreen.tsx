import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, 
  Pressable, TextInput, Modal, Image, TouchableOpacity, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useIsFocused } from "@react-navigation/native";
import GestureRecognizer from 'react-native-swipe-gestures';
// import { useNavigation } from "@react-navigation/native";
import Cocktailscard from "../components/Cocktailscard"
import { Cocktail, addCocktail, addCocktailBookmark, delCocktailBookmark} from "../reducers/cocktail";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_ADDRESS = "https://thecocktaildb.com/api/json/v1/1/random.php";



export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const cocktails = useSelector((state: { cocktail: { value: { listCocktails: Cocktail[] } } }) => state.cocktail.value.listCocktails);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const isFocused = useIsFocused();
  // const navigation = useNavigation();
  const [fetchCount, setFetchCount] = useState(0);
  const [cocktailMiniature, setCocktailMiniature] = useState([]);
  const [shouldUpdateFromCocktailCard, sethouldUpdateFromCocktailCard] = useState(false);
  const [modalCocktailVisible, setModalCocktailVisible] = useState(false);
  // setter poru bar de recherche et bouton
  const [modalSearch,setModalSearch] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [onSearchByName,setOnSearchByName] = useState(false);
  const [onSearchByCategory,setOnSearchByCategory] = useState(false);
  const [onSearchByIngredient,setOnSearchByIngredient] = useState(false);
  const [searchText, setSearchText] = useState("");

/////////// action en rapport avec la recherche ////////////////////

function handleSearchButtonNom(){
  setOnSearchByName(!onSearchByName)
  setOnSearchByCategory(false)
  setOnSearchByIngredient(false)
  if(onSearchByName){
    setSearchType("name")
    setSearchText(searchText)
  } else {
    setSearchType("")
  }
}
function handleSearchButtonCategory(){
  setOnSearchByName(false)
  setOnSearchByCategory(!onSearchByCategory)
  setOnSearchByIngredient(false)
  if(onSearchByCategory){
    setSearchType("category")
    setSearchText(searchText)
  } else {
    setSearchType("")
  }
}
function handleSearchButtonIngredient(){
  setOnSearchByName(false)
  setOnSearchByCategory(false)
  setOnSearchByIngredient(!onSearchByIngredient)
  if(onSearchByIngredient){
    setSearchType("ingredient")
    setSearchText(searchText)
  } else {
    setSearchType("")
  }
}



////////////////////////////////////////////////////////////////////

// appuie sur l'icone recherche, ouvre les option de recherche
function handleOnSearchIcon(){
  setModalSearch(!modalSearch)
}
// actualise la page "home"
  function handleUpdate() {
    sethouldUpdateFromCocktailCard((prev) => !prev);
    // console.log(idCocktail, cocktails.idDrink)
  }
  // ferme la modal de la recette , quand on suprime la recette,
  // fonction lancer au click sur la supression dans le composant cocktailscard
  //permet de revenir sur la page "home" et de fermer la modal qui est ouverte
  function handleUpdateDelete(){
    setModalCocktailVisible (!modalCocktailVisible);
    setSelectedCocktail(null);
  };
// ouvre la fenetre avec la recette du cocktail quand on click su rl image
  function handlePressCocktail(cocktail: Cocktail) {
    setSelectedCocktail(cocktail);
    setModalCocktailVisible(true);
  }
// check si le cocktail est deja bookmarké et l'ajoute ou le suprime.
  //  pas tres jolie methode pour ajouté un cocktail en favorie dans le reducer
 function handleAddFavorie (cocktail) {
    if(!cocktail.bookmark)
    dispatch(addCocktailBookmark(cocktail.idDrink))
  else(
    dispatch(delCocktailBookmark(cocktail.idDrink))
  )
   
    handleUpdate();
       
  };
  // navigation netre les pages home ver favorites
  function onSwipeLeftHomeToFavorite () {
    navigation.navigate("TabNavigator", { screen: "Favorites" });
  };
//compteur retourne a 0 quand l'utilisateur demande  un +
  const handleFetchSixMore = () => {
    setFetchCount(0);
  };

  // usefeect qui permet  de fech  les cocktails et se relance si le conteur reviens a 0
  // ce qui arrive quand l'utilisateur demande plus de cocktails
  useEffect(() => {
    const getCocktailApi = async () => {
      try {
        const response = await fetch(API_ADDRESS);
        const data = await response.json();

        if (data.drinks && data.drinks.length > 0) {
          const newCocktail = data.drinks[0];
          const isCocktailExists = cocktails.find(
            (cocktail) => cocktail.idDrink === newCocktail.idDrink
          );

          if (!isCocktailExists) {
            //console.logg('data du fetch api', newCocktail)
            // Dispatchez uniquement si le cocktail n'existe pas encore dans la 
            // liste utilisation possible futur
            dispatch(addCocktail(newCocktail));
            // Ajoute ce cocktail pour l'affichage directement à l'écran
            setFetchCount((prev) => prev + 1)
          } else {
            console.log( 
              "Cocktail already exists in Redux state restarting fetch"
            ); 
          }
        } else {
          console.error("No drinks data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    if (isFocused && fetchCount < 7) {
      
      const delay = 160;
      setTimeout(() => {
        getCocktailApi();
      }, delay);
    }
  }, [fetchCount]); // isFocused, shouldUpdateFromCocktailCard


///  mes a jour les mini card dans le scrolling view soit soit sur toute les cards
/// ou sur la recherche qui a etait tapé.
  useEffect(() => {
    const filteredCocktails = cocktails.filter((cocktail) => {
    const nameMatch = cocktail.strDrink.toLowerCase().includes(searchText.toLowerCase());
    const categoryMatch = cocktail.strAlcoholic.toLowerCase().includes(searchText.toLowerCase());
    const ingredientMatch = (
      cocktail.strIngredient1.toLowerCase().includes(searchText.toLowerCase()) ||
      cocktail.strIngredient2.toLowerCase().includes(searchText.toLowerCase()) ||
      cocktail.strIngredient3.toLowerCase().includes(searchText.toLowerCase()) ||
      cocktail.strIngredient4.toLowerCase().includes(searchText.toLowerCase()) ||
      cocktail.strIngredient5.toLowerCase().includes(searchText.toLowerCase()) 
    
    )
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
  const allCocktailMiniature = filteredCocktails.map((cocktail) => (

    <GestureRecognizer key={cocktail.idDrink}
     >
      <Pressable
        // style={styles.buttonProfileModale}
        onPress={() => handlePressCocktail(cocktail)}
        onLongPress={() => handleAddFavorie(cocktail)} // Ajout de l'appui long pour le bookmark
      
      >
        <View style={styles.containertop}>
          <View style={styles.containerCocktailMiniature}>
          {cocktail.bookmark ? // condition pour affichage du bookmark
          (<Image style={styles.photoBookmark} source={{ uri: cocktail.strDrinkThumb }}/> ) : 
          (<Image style={styles.photo} source={{ uri: cocktail.strDrinkThumb }}/>) }

            <Text style={styles.nameunderpic}>
              {cocktail.bookmark ?
              (<><FontAwesome5 name="heart" size={20} color="#FF8C00" solid />{' '}</>):
                null}
              {cocktail.strDrink}
            </Text>
          </View>
        </View>
      </Pressable>
      </GestureRecognizer>
    ));
    setCocktailMiniature(allCocktailMiniature);
  }, [cocktails, shouldUpdateFromCocktailCard, searchText, searchType]);
   


  return (
    <SafeAreaView style={styles.container}>

           
      <View style={styles.containerTitle}>
       
         <Pressable       
            style={styles.ButtonFetchMini}
            onPress={() => {
              handleOnSearchIcon() // ouvre la modal de recherche
            }}
            >
          <FontAwesome5 name="search" size={30} color="#FF8C00" />
         
          </Pressable>

        <Text style={styles.title}>cocktail</Text>
        <Pressable
            style={styles.ButtonFetchMini}
            onPress={() => {
              handleFetchSixMore()
            }}
            >
          <FontAwesome5 name="plus" size={30} color="#FF8C00" />
         
          </Pressable>
           
      </View>
      {modalSearch ?
              
          <View style={styles.containerModalSearchbar}>
           <View style={styles.containerSearchbar}>
            <View>
              <View style={styles.containerButtonSearchInModalSearch} >
                {/* <View> */}
                {/* <View style={styles.containerButtonDeleteFavorie} > */}
                  <Pressable
                    onPress={() => handleSearchButtonNom()}
                    style={[
                      styles.buttonSearchInModalSearch,
                      onSearchByName && styles.activeButton,
                    ]}
                  >
                    <Text style={styles.textSearchButton}>Nom</Text>
                  </Pressable>
                  {/* </View> */}
                {/* </View> */}
                {/* <View>  */}
                {/* <View style={styles.containerButtonSearchInModalSearch} > */}
                  <Pressable
                    onPress={() => handleSearchButtonIngredient()}
                    style={[
                      styles.buttonSearchInModalSearch,
                      onSearchByIngredient && styles.activeButton,
                    ]}
                  >
                    <Text style={styles.textSearchButton}>ingredient</Text>
                  </Pressable>
                  {/* </View> */}
                {/* </View> */}
                {/* <View> */}
                {/* <View style={styles.containerButtonSearchInModalSearch} > */}
                  <Pressable
                    onPress={() => handleSearchButtonCategory()}
                    style={[
                      styles.buttonSearchInModalSearch,
                      onSearchByCategory && styles.activeButton,
                    ]}
                  >
                    <Text style={styles.textSearchButton}>catégorie</Text>
                  </Pressable>
                  {/* </View> */}
                {/* </View> */}
              </View>
            </View>
              <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un cocktail dans le reducer"
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
            </View>
          </View>

              
              :
                null}
      <GestureRecognizer onSwipeLeft={onSwipeLeftHomeToFavorite}>
      <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.viewcard}>{cocktailMiniature}</View>
        {/* test a faire sur les margin bot ou padding bot */}
      </ScrollView>
      </GestureRecognizer>

            {/* Modal */}
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
              setModalCocktailVisible (!modalCocktailVisible);
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
  containerTitle:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap:3,
  },

  title: {
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div 
    width: "50%",
    justifyContent:"center", 
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
    color: "#FF8C00",
  },
  ButtonFetchMini:{
    // marginLeft:30,
    // width: "10%",
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
    marginTop: 10,
    justifyContent:"center",
    alignContent:"center",
     color: "#FF8C00",
   
    borderRadius: 5,
  },
  closeButtonTextMini:{
    color: "#fff",
    textAlign: "center",
    fontSize: 38,
    fontWeight: "600",
  },
  scrollView: {
    alignItems: "center",
    width: "93%",
  },

  viewcard: {
    marginBottom:"17%",
    width: "100%",
    flexDirection: "row", // Pour organiser les éléments en ligne
    flexWrap: "wrap", // Permet au contenu de passer à la ligne en cas de manque d'espace
    justifyContent: "space-around", //
  },
  containerCocktailMiniature: {
    marginLeft:12,
     maxWidth: 150,
     justifyContent: "center",
     alignItems: "center",
     // borderColor: "#000CC2", // ajout test centrage div
     // borderWidth: 1,   // ajout test centrage div
   },


  ////////////////////////////////////

  // Ajout des css pour modal et cocktail

  // Photo et description
  containertop: {
    flexDirection: "row",
    justifyContent:"space-between" ,
    padding: 5,
    alignItems: "flex-start",
    marginBottom: 10,
    // borderColor: 'red',
    // borderWidth: 1,
  },
 
  containertopleft: {
    // borderColor: 'green',
    // borderWidth: 3,
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
  },
  containertopright: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    marginLeft: 20,

  },
  txtdescription: {
    
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#e2e2f3",
    borderColor: "#FF8C00",
    fontSize: 16,
    padding: 10,
    flex: 1,
    flexWrap: "wrap", // Permet au texte de passer à la ligne
    flexDirection: "column", // Disposition verticale des éléments
  },

  nameunderpic: {
    width: "100%",
    fontSize: 20,
    paddingTop: 5,
    fontWeight: "600",
    color: "#474CCC",
    textAlign: "center",
    //     borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
    flexWrap: "wrap", // Permet au texte de passer à la ligne
    flexDirection: "column", // Disposition verticale des éléments
  },

  photo: {
    // margin: 5,
    width: 130,
    height: 130,
    borderRadius: 100,
    borderColor: "#FF8C00",
    borderWidth: 1,
  },
  photoBookmark: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderColor: "#FF8C00",
    borderWidth: 4,
  },
  /////////////////// MODAL MODAL COCKTAIL MODAL ///////
  ////////////                                        ////////
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#474CCC",
    borderRadius: 5,
  },

  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },



/////////// MODAL SEARCH BAR //////
                                  ///////////////////

containerModalSearchbar:{
width:"100%",
borderColor: "#000CC2", // ajout test centrage div
borderWidth: 1,   // ajout test centrage div
},
containerSearchbar:{
  flexDirection:"column",
  justifyContent: "center",
  alignItems: "center",
},
searchInput: {
  height: 40,
  borderColor: '#FF8C00',
  borderWidth: 1,
  borderRadius: 50,
  margin: 10,
  padding: 10,
  color:"#474CCC",
},
containerButtonSearchInModalSearch:{
  flexDirection:"row",
  justifyContent: "space-between",
  width:"80%",
  // borderColor: "#000CC2", // ajout test centrage div
// borderWidth: 1,   // ajout test centrage div
},
buttonSearchInModalSearch:{
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  borderColor: "#FF8C00",
  borderWidth: 1,
  width: 100,
  paddingTop: 4,
  borderRadius: 50,
},


textSearchButton:{
  color: "#474CCC",
  height: 30,
  fontSize: 16,
},
activeButton: {
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  backgroundColor: "#FF8C00",
  width: 100,
  paddingTop: 4,
  borderRadius: 50,
},
});