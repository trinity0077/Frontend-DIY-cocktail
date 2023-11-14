# Frontend-DIY-cocktail

Petite application mobile ayant pour objectif d'utiliser une API renvoyant des recettes de cocktails. 
Son but est d'afficher des propositions aléatoires de cocktails et de permettre à l'utilisateur de les ajouter en favoris. Redux Persist n'est pas encore activé !

Elle se compose de 2 pages :

Navigation avec la bar de navigation ou via un swip droite ou gauche.

Page des cocktails en miniature :

Des boutons + en haut qui serve a fetch 7 nouveaux cocktails pour remplir la list.
Appuyez longuement sur une miniature pour l'ajouter rapidement aux favoris.
Cliquez sur une miniature pour ouvrir une modal qui se charge en remplissant un composant et affiche les informations complètes de la recette.
Un bouton de suppression est disponible pour faire disparaître la recette à jamais (pas encore de modal de validation).
Un bouton d'ajout aux favoris et un bouton de retour à la page principale sont également présents.


Page des favoris :

Cette page mappe toute la liste des cocktails ajoutés en favoris et les affiche les uns après les autres à l'aide d'un composant de carte, de haut en bas.
Toutes les informations des recettes sont directement visibles sur cette page sans avoir à cliquer dessus. Pratique tant que la liste n'est pas trop longue.
(possibilité de supression des favorie directement)


Prévision pour la suite :

Modification des les size des cards et de la scrowview dans cockatilscreen, redux Persist, ajout de filtres dans les favoris basés soit sur les catégories, soit sur le nom des cocktails. 
La réflexion est en cours sur l'utilisation de boutons pré-filtrés ou d'une barre de recherche. Cependant, cela imposerait au client de connaître ce qu'il recherche, ce qui n'est pas toujours le cas.
Voir aussi pour passé les icons en frontawsome6 et gerer l erreur typescript qu'il y a dessus.
