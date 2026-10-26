# Guide technique (auteur)

Les magasins suivent [`notice-installation.md`](notice-installation.md) et l'assistant. Ce
guide couvre ce qu'ils ne font pas : le Google Sheets modèle et Vannes.

> Ne jamais écrire dans le dépôt le lien du modèle ni l'adresse `/exec` d'un magasin.
> Toute installation chez un tiers demande l'accord écrit de l'auteur.

## Organisation

| Où | Quoi |
|---|---|
| GitHub (ce dépôt) | Le code source, la référence |
| Le **modèle** | Google Sheets vierge qui porte le code ; donné par son lien `/copy` |
| Les **installations** | Une copie du modèle par magasin : son Google Sheets, son projet Apps Script, son lien `/exec` |
| **Vannes** | Projet Apps Script autonome historique (sans Google Sheets), même lien qu'avant |

- Seuls `Code.gs`, `Installation.gs`, `index.html`, `Assistant.html` et `appsscript.json`
  partent vers Apps Script (`.claspignore`). Docs, tests et outils restent sur GitHub.
- Une copie emporte le code du moment et ne suit pas les mises à jour du modèle.
- Le magasin (nom, adresse, lien) est dans les **propriétés du document**, marquées avec
  l'identifiant du script : une copie a un autre identifiant et repart vierge.
- Les fonctions de l'assistant exigent un **jeton** remis à la seule fenêtre ouverte depuis
  le Google Sheets : un visiteur de l'application Web ne peut pas changer le magasin.
- Avant d'envoyer du code : `node tests/serveur.test.js`.

## Le modèle

### Le créer (une fois)

Dans un dossier à part (son propre `.clasp.json`, jamais sur GitHub) :

1. `npx clasp create --type sheets --title "MODÈLE — Réimpression de bons (ne pas utiliser)"`.
   clasp peut remplacer `appsscript.json` : le remettre avec `git restore appsscript.json`.
2. `npx clasp push`.
3. Ouvrir le Google Sheets → Extensions → Apps Script → fonction **`preparerModele`**
   (`Installation.gs`) → **Exécuter** → autorisations. Elle vide les propriétés et pose
   l'onglet « Démarrer » avec son bouton vert.
4. **Recharger** le Google Sheets (le bouton et le menu n'apparaissent qu'après).
5. Renommer le **projet** Apps Script (titre en haut de l'éditeur), par exemple
   « Réimpression de bons » : c'est ce nom qu'affichent les écrans d'autorisation de
   Google, dans toutes les copies.
6. Partager : Accès général → « Tous les utilisateurs disposant du lien » → **Lecteur**
   (ou seulement les comptes des magasins autorisés).
7. Lien à donner : l'adresse du Google Sheets, fin `/edit…` remplacée par `/copy`.
8. Faire soi-même une copie depuis un autre compte et dérouler l'assistant une fois.

### Le mettre à jour

`git pull`, `npx clasp push`, relancer **`preparerModele`**, recharger.

### Ne jamais

Le déployer, cliquer sur son bouton vert, y lancer l'assistant. (`preparerModele` refuse de
vider un Google Sheets déjà installé.) Pour essayer : faire une copie.

## Mettre à jour une installation (on a accès au projet)

1. Dans le dossier relié à ce projet : `git pull`, `npx clasp push`.
2. Extensions → Apps Script → Déployer → **Gérer les déploiements** → crayon ✏️ →
   Version : **Nouvelle version** → Déployer. Jamais « Nouveau déploiement » : l'adresse
   changerait.

Sans accès au projet : le magasin refait une copie du modèle à jour et relance
l'assistant (nouveau lien pour les postes).

## Vannes (projet autonome, même lien)

Vannes n'a pas de Google Sheets : l'application y lit les **propriétés du script**. À
faire **dans cet ordre**, sinon Vannes affiche « Magasin non configuré » :

1. Dans le projet de Vannes : Paramètres du projet → Propriétés du script →
   `NOM_MAGASIN` = « Hypermarché Carrefour Vannes », `ADRESSE_MAGASIN` =
   « 101 avenue de la Marne, 56000 Vannes ».
2. `npx clasp push` depuis la branche voulue.
3. Gérer les déploiements → crayon ✏️ → **Nouvelle version** → Déployer.
4. Après la version sans mémoire EAN : supprimer, dans le Drive du compte qui déploie, le
   classeur « Réimpression Bon - Mémoire EAN », et la propriété `MEMOIRE_SHEET_ID`.

Retour en arrière : Gérer les déploiements → crayon → une **version antérieure**.

Plus tard, Vannes peut aussi passer par le modèle et l'assistant comme les autres magasins
(nouveau lien pour les postes).
