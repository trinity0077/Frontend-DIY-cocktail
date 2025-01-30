L'application mobile a pour objectif d'utiliser une API renvoyant des recettes de cocktails. Son but est d'afficher des propositions aléatoires de cocktails et de permettre à l'utilisateur de les ajouter en favoris, ainsi que d'effectuer une recherche dans les données du reducer. Redux Persist n'est pas encore activé !

Elle se compose de 2 pages :

Possibilité de naviguer avec la barre de navigation ou via un swipe droit ou gauche.

Page des cocktails en miniature "Home" :

1 icône loupe en haut qui ouvre une modal contenant la barre de recherche et des filtres.
1 bouton + en haut qui récupère 7 nouveaux cocktails pour remplir la liste.
Appuyez longuement sur une miniature pour l'ajouter rapidement aux favoris.
Cliquez sur une miniature pour ouvrir une modal qui se charge en remplissant un composant et affiche les informations complètes de la recette.
Un bouton de suppression est disponible pour faire disparaître la recette à jamais (pas encore de modal de validation).
Un bouton d'ajout aux favoris et un bouton de retour à la page principale sont également présents.


Page des favoris :

Cette page mappe toute la liste des cocktails ajoutés en favoris et les affiche les uns après les autres à l'aide du composant Cocktailscard, de haut en bas. Toutes les informations des recettes sont directement visibles sur cette page sans avoir à cliquer dessus. Pratique tant que la liste n'est pas trop longue. (possibilité de suppression des favoris directement)

Prévision pour la suite :

Rendre la box de description des Cocktailscard scrollable dans la modal de la page Home.
Remplacement des icone par lucide.
Affiner le typage des variables, et refactorisé le système de recherche
