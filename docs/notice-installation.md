# Réimpression de bons d'achat : installation dans votre magasin

Cette notice installe l'application pour **votre** magasin, sur **votre** compte Google.
Comptez une quinzaine de minutes. Aucune connaissance technique n'est nécessaire.

> Toute installation demande l'**accord écrit préalable de l'auteur** (DESJARDINS Bryan),
> qui vous transmet le lien du projet à copier.

## Ce qu'il vous faut

- Un **compte Google**, de préférence celui du magasin plutôt que celui d'un salarié :
  l'application tourne sous ce compte, et s'arrête si le compte disparaît.
- Un ordinateur avec **Chrome** ou **Edge**.
- Le **lien du projet** envoyé par l'auteur.
- Le **nom** et l'**adresse** du magasin, tels qu'ils doivent apparaître sur les bons.

Les libellés des écrans Google peuvent varier légèrement selon la langue ou la date :
cherchez le plus proche.

## Étape 1 : copier le projet

1. Connectez-vous au compte Google du magasin, puis ouvrez le lien du projet.
2. Dans la colonne de gauche, cliquez sur **Vue d'ensemble** (icône ⓘ).
3. En haut à droite, cliquez sur **Créer une copie** (icône de deux feuilles).
4. La copie s'ouvre. Cliquez sur son titre, en haut, et renommez-la, par exemple
   « Réimpression de bons – Lorient ».

À partir d'ici, travaillez **uniquement dans votre copie**.

## Étape 2 : indiquer le nom et l'adresse du magasin

1. Dans la colonne de gauche, cliquez sur **Paramètres du projet** (roue dentée).
2. Tout en bas, dans **Propriétés du script**, cliquez sur **Ajouter une propriété de
   script** et créez ces deux propriétés :

   | Propriété | Valeur (exemple) |
   |---|---|
   | `NOM_MAGASIN` | Hypermarché Carrefour Lorient |
   | `ADRESSE_MAGASIN` | 1 rue de l'Exemple, 56100 Lorient |

   Recopiez les noms des propriétés **exactement**, en majuscules, avec le tiret bas.
3. Cliquez sur **Enregistrer les propriétés du script**.

## Étape 3 : mettre l'application en ligne

1. En haut à droite, cliquez sur le bouton bleu **Déployer**, puis
   **Nouveau déploiement**.
2. À côté de « Sélectionner le type », cliquez sur la roue dentée, puis
   **Application Web**.
3. Réglez :
   - **Description** : « Version 1 » ;
   - **Exécuter en tant que** : **Moi** (le compte du magasin) ;
   - **Qui a accès** : **Tout le monde**.
4. Cliquez sur **Déployer**, puis **Autoriser l'accès** et choisissez le compte du
   magasin.
5. Google affiche peut-être « **Google n'a pas validé cette application** ». C'est
   normal : l'application est la vôtre. Cliquez sur **Paramètres avancés**, puis
   **Accéder à … (non sécurisé)**, puis **Autoriser**.
6. Copiez l'**URL de l'application Web** (elle se termine par `/exec`) : c'est le lien
   de l'application.

## Étape 4 : vérifier

1. Ouvrez le lien dans Chrome ou Edge. Le nom du magasin apparaît en haut de la page et
   sur le bon.
2. Préparez un bon complet (montant, date de fin, EAN) et imprimez une page.
3. **Passez le code-barres en caisse** pour vérifier qu'il est bien lu.

## Étape 5 : donner le lien aux postes

Sur chaque poste qui imprime des bons, ouvrez le lien et ajoutez-le aux **favoris**.
Le lien suffit : les postes n'ont besoin d'aucun compte Google.

Le lien n'est pas protégé par un mot de passe : ne le publiez pas, transmettez-le
seulement aux postes du magasin.

## Plus tard

- **Changer le nom ou l'adresse** : modifiez les propriétés (étape 2) et rechargez la
  page. Rien d'autre à faire.
- **Ne refaites jamais « Nouveau déploiement »** : cela crée un autre lien, et les postes
  resteraient sur l'ancien.

## En cas de problème

| Ce que vous voyez | Ce qu'il faut faire |
|---|---|
| « Magasin non configuré » | Une propriété manque ou est mal écrite : revoir l'étape 2, puis recharger. |
| Une page Google demande de se connecter | « Qui a accès » n'est pas sur « Tout le monde » : **Déployer**, **Gérer les déploiements**, crayon ✏️, corriger, **Déployer**. |
| Le bandeau bleu du design 1 ne s'imprime pas | Dans la fenêtre d'impression, cocher « Graphiques d'arrière-plan », ou passer au design 2. |
| Le code-barres ne passe pas en caisse | Vérifier le code EAN saisi, puis contacter l'auteur. |
