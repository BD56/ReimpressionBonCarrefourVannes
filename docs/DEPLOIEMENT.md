# Guide technique (auteur)

Les magasins suivent [`notice-installation.md`](notice-installation.md). Ce guide couvre ce
qu'ils ne font pas : le projet modèle et Vannes.

> Ne jamais écrire dans le dépôt le lien du projet modèle ni l'adresse `/exec` d'un
> magasin. Toute installation chez un tiers demande l'accord écrit de l'auteur.

## Organisation

| Où | Quoi |
|---|---|
| GitHub (ce dépôt) | Le code source, la référence |
| Le **projet modèle** | Projet Apps Script **vierge** (sans propriétés), partagé en lecture ; les magasins le copient |
| Les **installations** | Une copie par magasin, sur le compte du magasin, avec ses propriétés et son lien `/exec` |

Seuls `Code.gs`, `index.html` et `appsscript.json` partent vers Apps Script
(`.claspignore`). Une copie emporte le code du moment et ne suit pas les mises à jour.

## Le projet modèle

Le modèle doit rester **distinct du projet de Vannes** et **sans propriétés de script** :
une copie n'hérite ainsi jamais du nom d'un autre magasin (on ne sait pas si Google copie
les propriétés avec le projet ; un modèle vierge rend la question sans objet).

Créer (une fois), dans un dossier à part :

1. `npx clasp create --type standalone --title "MODÈLE — Réimpression de bons (ne pas déployer)"`.
   clasp peut remplacer `appsscript.json` : le remettre avec `git restore appsscript.json`.
2. `npx clasp push`.
3. Ne **pas** ajouter de propriétés, ne **pas** déployer.
4. Partager : **Lecteur**, « Tous les utilisateurs disposant du lien », ou seulement les
   comptes des magasins autorisés.
5. Faire soi-même une copie depuis un autre compte et dérouler la notice une fois, pour
   valider les libellés et le geste de copie (non vérifiés à ce jour).

Mettre à jour le modèle : `git pull`, puis `npx clasp push` dans son dossier.

## Vannes (projet existant, même lien)

À faire **dans cet ordre**, sinon Vannes affiche « Magasin non configuré » :

1. Dans le projet de Vannes : Paramètres du projet → Propriétés du script →
   `NOM_MAGASIN` = « Hypermarché Carrefour Vannes », `ADRESSE_MAGASIN` =
   « 101 avenue de la Marne, 56000 Vannes ».
2. `npx clasp push` depuis la branche voulue.
3. Déployer → **Gérer les déploiements** → crayon ✏️ → Version : **Nouvelle version** →
   Déployer. Jamais « Nouveau déploiement » : l'adresse changerait.
4. Après la version sans mémoire EAN : supprimer, dans le Drive du compte qui déploie, le
   classeur « Réimpression Bon - Mémoire EAN », et la propriété `MEMOIRE_SHEET_ID`.

Retour en arrière : Gérer les déploiements → crayon → une **version antérieure**.
