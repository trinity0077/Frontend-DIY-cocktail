import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, 
  Pressable, 
  Modal,
  Image, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useIsFocused } from "@react-navigation/native";
import GestureRecognizer from 'react-native-swipe-gestures';
// import { useNavigation } from "@react-navigation/native";
import Cocktailscard from "../components/Cocktailscard"
import { Cocktail, addCocktail, addCocktailBookmark, delCocktailBookmark} from "../reducers/cocktail";

const API_ADDRESS = "https://thecocktaildb.com/api/json/v1/1/random.php";



export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const cocktails = useSelector((state: { cocktail: { value: { listCocktails: Cocktail[] } } }) => state.cocktail.value.listCocktails);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const isFocused = useIsFocused();
  // const navigation = useNavigation();
  const [fetchCount, setFetchCount] = useState(0);
  const [cocktailMiniature, setCocktailMiniature] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [modalCocktailVisible, setModalCocktailVisible] = useState(false);

  


  function handleUpdate() {
    setShouldUpdate((prev) => !prev);
    // console.log(idCocktail, cocktails.idDrink)
  }
  function handleUpdateDelete(){
    setModalCocktailVisible (!modalCocktailVisible);
    setSelectedCocktail(null);
  };

  function handlePressCocktail(cocktail: Cocktail) {
    setSelectedCocktail(cocktail);
    setModalCocktailVisible(true);
  }

 function handleAddFavorie (cocktail) {
    if(!cocktail.bookmark)
    dispatch(addCocktailBookmark(cocktail.idDrink))
  else(
    dispatch(delCocktailBookmark(cocktail.idDrink))
  )
   
    handleUpdate();
       
  };
  function onSwipeLeftHomeToFavorite () {
    navigation.navigate("TabNavigator", { screen: "Favorites" });
  };

  const handleFetchSixMore = () => {
    setFetchCount(0);
  };

  // usefeect qui permet quand on revient sur la page 'isFocused' de fech  les course add par l utilisateur
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
  }, [fetchCount]); // isFocused, shouldUpdate



  useEffect(() => {
    const allCocktailMiniature = cocktails.map((cocktail) => (

    <GestureRecognizer key={cocktail.idDrink}
    //  onSwipeDown={handleFetchSixMore} trop de fetch a testé plus tard
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

            <Text style={styles.nameunderpic}>{cocktail.strDrink}  {cocktail.bookmark ?(<FontAwesome5 name="heart" size={20} color="#FF8C00" solid />): null}</Text>
          </View>
        </View>
      </Pressable>
      </GestureRecognizer>
    ));
    setCocktailMiniature(allCocktailMiniature);
  }, [cocktails, shouldUpdate]);
   


  return (
    <SafeAreaView style={styles.container}>

           
      <View style={styles.containerTitle}>
       
         <Pressable
           
            style={styles.ButtonFetchMini}
            onPress={() => {
              handleFetchSixMore()
            }}
            >
          <FontAwesome5 name="plus" size={30} color="#FF8C00" />
         
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
      
      <GestureRecognizer onSwipeLeft={onSwipeLeftHomeToFavorite}>
      <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.viewcard}>{cocktailMiniature}</View>
            {/* <View style={styles.viewcard}>{cocktailUp}</View> */}
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

    zIndex: 2, // Assurer que le titre reste au-dessus du contenu défilant
    justifyContent: "center",
    alignItems: "center",
    gap:3,
  },

  title: {
    // borderColor: "#000CC2", // ajout test centrage div
    // borderWidth: 1,   // ajout test centrage div
    height:50,
    width: "50%",
    marginTop: 20,
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
    marginTop: 20,
    height:50,
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
    marginTop: 55,
    alignItems: "center",
    width: "93%",
  },

  viewcard: {
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

});
