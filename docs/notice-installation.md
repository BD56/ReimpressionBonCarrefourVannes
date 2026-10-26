# Réimpression de bons d'achat : installation dans votre magasin

L'application s'installe pour **votre** magasin, sur **votre** compte Google, en une
dizaine de minutes. Un assistant vous guide à l'écran : cette notice le résume.

> Toute installation demande l'**accord écrit préalable de l'auteur** (DESJARDINS Bryan),
> qui vous transmet le lien d'installation.

## Ce qu'il vous faut

- Un **compte Google**, de préférence celui du magasin plutôt que celui d'un salarié :
  l'application tourne sous ce compte, et s'arrête si le compte disparaît.
- Un ordinateur avec **Chrome** ou **Edge**.
- Le **lien d'installation** envoyé par l'auteur.
- Le **nom** et l'**adresse** du magasin, tels qu'ils doivent apparaître sur les bons.

## 1. Faire votre copie

1. Connectez-vous au compte Google du magasin, puis ouvrez le lien d'installation.
2. Google propose de **créer une copie** : cliquez sur **Créer une copie**.
3. Votre copie s'ouvre, sur l'onglet **Démarrer**.

## 2. Lancer l'assistant

1. Cliquez sur le bouton vert **Installer l'application**.
2. Au premier clic, Google demande votre autorisation et affiche « **Google n'a pas validé
   cette application** » : c'est normal, l'application est la vôtre. Cliquez sur
   **Paramètres avancés**, puis **Accéder… (non sécurisé)**, cochez **Tout sélectionner**,
   puis **Continuer**.
3. Si rien ne s'ouvre ensuite, cliquez une seconde fois sur le bouton vert.

## 3. Suivre l'assistant

| Écran | Ce que vous faites |
|---|---|
| **Votre magasin** | Le nom et l'adresse du magasin. Un aperçu montre l'en-tête du bon. |
| **Mise en ligne** | « Ouvrir la page de mise en ligne », puis 7 clics chez Google, guidés à l'écran (**Déployer**, **Nouveau déploiement**, **Application Web**…). À la fin, Google donne l'adresse de l'application : copiez-la et collez-la dans l'assistant. |
| **Les postes** | Le lien à ouvrir sur chaque poste. Vérifiez le nom du magasin, imprimez une page de bons et **passez un code-barres en caisse**. |

À la fin, l'onglet **Application** du Google Sheets rappelle le magasin et le lien.

## 4. Donner le lien aux postes

Sur chaque poste qui imprime des bons, ouvrez le lien et ajoutez-le aux **favoris**. Les
postes n'ont besoin d'aucun compte Google.

Le lien n'est pas protégé par un mot de passe : ne le publiez pas, transmettez-le
seulement aux postes du magasin.

## Plus tard

- **Changer le nom ou l'adresse** : dans le Google Sheets, menu **🚀 APPLICATION →
  Assistant d'installation**. Le changement s'applique dès qu'on recharge la page sur
  les postes.
- **Ne refaites jamais « Nouveau déploiement »** : cela crée un autre lien, et les postes
  resteraient sur l'ancien.
- **Gardez le Google Sheets** : le supprimer arrête l'application.

## En cas de problème

| Ce que vous voyez | Ce qu'il faut faire |
|---|---|
| « Magasin non configuré » | L'assistant n'est pas allé au bout de l'écran « Votre magasin » : relancez-le (menu 🚀 APPLICATION). |
| Une page Google demande de se connecter | « Qui a accès » n'est pas sur « Tout le monde » : dans Extensions → Apps Script, **Déployer**, **Gérer les déploiements**, crayon ✏️, corriger, **Déployer**. |
| « Fenêtre expirée » dans l'assistant | Fermez la fenêtre et relancez l'assistant. |
| Le menu 🚀 APPLICATION n'apparaît pas | Attendez une dizaine de secondes après l'ouverture du Google Sheets, ou rechargez la page. |
| Le code-barres ne passe pas en caisse | Vérifiez le code EAN saisi, puis contactez l'auteur. |
