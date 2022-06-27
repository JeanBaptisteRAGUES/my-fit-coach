# My Fit Coach

## Description :
My-Fit-Coach permet à un utilisateur de se créer un compte et de pouvoir ensuite se créer un emploi du temps
dont il pourra programmer ses repas ainsi que ses séances de sport. Il pourra suivre ses progrès sur ses séances
de sport et calculer les valeurs nutritionnelles de ses repas. My-Fit-Coach permet à l'utilisateur de calculer
ses besoins caloriques et nutritionnels et vérifie si les repas de l'utilisateur sont en adéquation avec ses
objectifs.<br/>
Déploiement : Firebase
Base de données : Cloud Firestore
API infos nutritionnelles : https://fr.openfoodfacts.org/data

## Lien du site : 
https://my-fit-coach.web.app/

## Utilisation :
### Inscription/Connexion :
Vous pouvez vous inscrire en cliquant sur "S'inscrire" dans le menu en haut à droite, ou alors en cliqaunt sur le bouton "Commencer" de la page d'accueil.
Il vous sera demandé un nom d'utilisateur, un mail, un mot de passe ainsi que des informations complémentaires qui serviront plus tard pour pouvoir calculer
vos besoins nutritionnels.<br/>
Il n'est pas nécessaire d'entrer une adresse mail réelle du moment que la syntaxe est correcte, exemple : test@test.fr<br/>
Vous pouvez aussi vous connecter avec le compte test prévu à cet effet :<br/>
-Email : test01@test.com <br/>
-Mot de passe : 123456 <br/>

### Créer un repas :
Créer un repas vous permettras d'enregistrer un repas, de calculer ses valeurs nutritionnelles et de l'ajouter à votre emploi du temps pour ensuite pouvoir
calculer automatiquement vos valeurs nutritionnelles sur la journée ou sur la semaine.<br/>
Pour celà, rendez vous dans "Nutrition" depuis le menu.<br/>
Une page s'affiche avec deux panneaux.<br/>
Indiquez sur le panneau de gauche le titre que vous voulez donner à votre repas et cliquez sur "créer".<br/>

### Ajouter un ou des aliment(s) à un repas :
Sur le panneau central, cherchez un aliment en entrant des mots clés, exemple : salade poulet<br/>
Vous pouvez aussi filtrer par nom de marque, exemple : sodebo<br/>
Une fois que vous aurez cliqué sur "Chercher", une liste de résultats va apparaitre.<br/>
Lorsque vous trouvez le produit qui vous convient, cliquez sur "Ajouter" et sélectionnez la quantité (en g).<br/>
Vous devriez voir apparaitre l'aliment dans le panneau de gauche, ainsi que le tableau des valeurs nutritionnelles de votre repas qui se met automatiquement
à jour.<br/>

### Créer un exercice :
Créer un exercice vous permettra de l'ajouter à une session qui elle même pourra être ajoutée à votre emploi du temps.<br/>
Celà vous permettra aussi d'enregistrer vos performances durant vos entrainements pour cet exarcice et d'accéder à l'historique de vos entrainements.<br/>
Attention : un exercice ne peut pas être directement ajouté à l'emploi du temps. Il faudra l'ajouter à une session.<br/>
Pour créer un exercice, rendez-vous sur la page "Sport" depuis le menu.<br/>
Choisissez ensuite "Exercices" en cliquant sur le bouton "Commencer", puis sur "Nouvel exercice".<br/>
Une fois sur la page de création d'un exercice, cliquez sur "Titre" pour modifier le titre de l'exerice.<br/>
Par defaut, un exercice contient au moins un paramètre "commentaire".<br/>
Vous pouvez rajouter d'autres paramètres (ex : temps de course, poids soulevé, vitesse, temps de repos, etc..) en indiquant son nom et en cliquant sur "Ajouter".<br/>
Il ne vous reste plus qu'à ajouter une brève description de l'exercice et à cliquer sur "Enregistrer".<br/>

### Ajouter un entrainement à un exercice :
Une fois un exercice enregistré, vous pouvez enregistrer vos entrainements et voir l'historique de vos entrainements.<br/>
Rendez-vous dans "Sport", puis "Exercices" et sélectionnez un des exercices que vous avez déjà enregistré.<br/>
Cliquez ensuite sur "Ajouter un entrainement", remplissez les paramètres que vous avez prédéfinis pour cet exercice et cliquez sur "Enregistrer".<br/>
Sur votre page consacrée à votre exercice, de base, seul le dernier entrainement s'affiche. Pour voir l'historique complet, rendez-vous dans "Historique".<br/>

### Créer une session :
Créer une session vous permettra de regrouper un ou plusieurs exercice(s) pour ensuite les ajouter à votre emploi du temps.<br/>
Pour créer une session, rendez-vous dans "Sport" depuis le menu puis cliquez sur "Commencer" en dessous de "Sessions".<br/>
Cliquez sur "Nouvelle Session".<br/>
Vous pouvez ensuite renseigner le titre de votre session et y ajouter un ou plusieurs exercice(s) que vous avez enregistrés.<br/>
Finalisez la création de la session en cliquant sur "Enregistrer".<br/>

### Ajouter un repas ou une session de sport à votre emploi du temps :
Vous pouvez planifier votre semaine en y ajoutant vos sessions de sport ainsi que vos repas préalablement enregistrés.<br/>
Celà vous permettra aussi de calculer vos apports nutritionnels sur la journée/semaine.<br/>
Pour celà, cliquez sur "Ajouter un évènement" et choisissez l'évènement que vous voulez ajouter (repas ou session).<br/>
Indiquez ensuite un jour de la semaine, une heure de début et une heure de fin et cliquez sur "Ajouter".<br/>

### Voir ses apports nutritionnels sur la journée/semaine :
Rendez vous dans votre emploi du temps et cliquez sur l'icone vert en haut à droite de chaque jour.<br/>
Un tableau des valeurs nutritionnelles s'affiche ensuite et vous pouvez choisir si vous voulez calculer sur la journée ou sur la semaine.<br/>

### Afficher les conseils nutritionnels :
C'est dans cette zone que vos apports nutritionnels seront analysés et  qu'en fonction de vos objectifs, ils vous sera indiqué quels nutriments vous consommez 
trop ou au contraire pas assez.<br/>
Pour celà, faites comme pour voir vos apports nutritionnels mais cliquez ensuite sur "Avis du coach".<br/>
Il vous sera ensuite demandé de confirmer votre objectif (perdre du gras, gagner du muscle, etc..) et de modifier ou valider l'objectif calorique journalier
calculé automatiquement depuis vos informations rentrées à la création de votre profil.<br/>
Il vous sera ensuite affiché un tableau qui contient vos valeurs nutritionnelles sur la journée, les valeurs nutritionnelles théoriquement idéales pour vous et
enfin votre écart en % entre la valeur réelle et la valeur théorique.<br/>

### Enregistrer sa progression de poids corporel :
Vous pouvez enregistrer régulièrement votre poids corporel en kg pour ensuite afficher l'historique de l'évolution de votre poids au fil du temps.<br/>
Depuis la barre de menu, cliquez sur votre nom d'utilisateur puis cliquez sur "Mon compte".<br/>
Une page avec vos informations personnelles s'affiche, informations que vous pouvez modifier à tout moment.<br/>
A chaque fois que vous modifirez la valeur liée à votre poids, l'application le prendra en compte et ce changement pourra ensuite être affiché en cliquant
sur "Historique des poids" depuis votre page personnelle.<br/>
Une fois sur votre page d'historique des poids, un graphique affichant l'évolution de votre poids au fil des jours s'affiche.<br/>
Vous pouvez isoler une période en particulier en choisissant une date de début et une date de fin.<br/>
Le bouton "interpolation" vous permets de lisser la courbe en calculant les valeurs intermédiaires entre deux mesures.<br/>

## Technologies utilisées :
-React
-Firebase / Cloud Firestore / Firebase Authentication
-Tailwind CSS
-Axios
-chart.js
-react tooltip
-react toastify
-react icons
-moment
