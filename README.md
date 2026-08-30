# NZANAPP — API Transport & Logistique

Application de gestion de transport pour le Burundi.
Les proprietaires publient des demandes, les chauffeurs acceptent et livrent, les fournisseurs envoient des marchandises.

---

## Installation

### Pre-requis

- Node.js (version 18+)
- MySQL (version 9.1+)
- npm

### Etapes

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd nzanapp

# 2. Installer les dependances
npm install

# 3. Configurer la base de donnees
cp .env.example .env

# 4. Creer la base de donnees
mysql -u root -e "CREATE DATABASE nzanira;"

# 5. Importer le schema (si disponible)
mysql -u root nzanira < database/schema.sql

# 6. Lancer le serveur
npm run dev
```

Le serveur demarre sur `http://localhost:3000`

---

## Comment fonctionne ce projet ?

Ce projet est une **API REST** — il n'a pas de page web visible.
Il recoit des requetes (JSON) et renvoie des reponses (JSON).

**Exemple simple :**

- Le frontend (application mobile) envoie : `POST /api/auth/login` avec `{ phone, password }`
- L'API verifie et repond : `{ success: true, data: { token: "..." } }`

---

## Structure des fichiers

### Le point d'entree

```
src/
├── server.js          # Lance le serveur
├── app.js             # Configure Express (middlewares + routes)
├── config/
│   └── database.js    # Connexion a MySQL
├── middleware/
│   ├── auth.middleware.js   # Verifie le token JWT
│   └── errorHandler.js     # Gere les erreurs globalement
├── routes/
│   └── index.js       # Point central qui monte tous les modules
└── modules/
    ├── auth/          # Module 1 : Authentification
    ├── users/         # Module 2 : Utilisateurs
    ├── vehicles/      # Module 3 : Vehicules
    ├── drivers/       # Module 4 : Chauffeurs
    ├── transport/     # Module 5 : Demandes de transport
    ├── deliveries/    # Module 6 : Livraisons
    ├── materials/     # Module 7 : Marchandises
    ├── landmarks/     # Module 8 : Points geographiques
    ├── companies/     # Module 9 : Societes
    ├── messaging/     # Module 10 : Messagerie
    ├── notifications/ # Module 11 : Notifications
    ├── payments/      # Module 12 : Paiements
    ├── reviews/       # Module 13 : Avis
    └── documents/     # Module 14 : Documents
```

---

### Role de chaque fichier principal

| Fichier                  | Role                                             | Analogie                        |
| ------------------------ | ------------------------------------------------ | ------------------------------- |
| `server.js`              | Lance le serveur Node.js                         | Le bouton ON d'une machine      |
| `app.js`                 | Configure l'application : middlewares, routes     | Le tableau de bord              |
| `config/database.js`     | Gere la connexion a MySQL                        | Le fil electrique               |
| `middleware/auth.middleware.js` | Verifie que l'utilisateur a un token valide | Le gardien a l'entree           |
| `middleware/errorHandler.js`   | Capture toutes les erreurs et les renvoie    | L'assurance accident            |
| `routes/index.js`        | Connecte chaque module a son URL                 | Le standard telephonique        |

---

### Comment fonctionne un module ?

Chaque module suit la **même structure**. Prenons le module `vehicles` comme exemple :

```
src/modules/vehicles/
├── vehicle.routes.js       # Definit les routes (GET, POST, PUT, DELETE)
├── vehicle.controller.js   # Recoit la requete et renvoie la reponse
├── vehicle.service.js      # Contient la logique metier
├── vehicle.model.js        # Execute les requetes SQL
├── vehicle.validator.js    # Valide les donnees entrantes
└── index.js                # Exporte tout le module
```

**Le flux d'une requete :**

```
Client (mobile) --> routes --> controller --> service --> model --> MySQL
                                                                    |
Client (mobile) <-- routes <-- controller <-- service <-- model <-- resultat
```

#### Exemple concret : `GET /api/vehicles`

1. **routes** : `/api/vehicles` est mappe a `vehicleController.getVehicles`
2. **controller** : appelle `vehicleService.getAllVehicles()`
3. **service** : appelle `vehicleModel.findAll()`
4. **model** : execute `SELECT * FROM vehicles` sur MySQL
5. **model** : renvoie les resultats au service
6. **service** : renvoie au controller
7. **controller** : formatte la reponse JSON et l'envoie au client

**Pourquoi cette separation ?**

- Si on change la base de donnees, on modifie uniquement le **model**
- Si on change la logique (ex: filtrer par categorie), on modifie le **service**
- Si on change le format de la reponse, on modifie le **controller**
- Chaque personne de l'equipe travaille sur son module sans casser les autres

---

## Exemple complet : Module `vehicles`

Le module `vehicles` est le **module de reference**. Tous les autres modules doivent suivre la meme logique.

### Les 6 fichiers du module

```
src/modules/vehicles/
├── vehicle.validator.js    # Valide les donnees AVANT le controller
├── vehicle.model.js        # Fait les requetes SQL
├── vehicle.service.js      # Contient la logique metier
├── vehicle.controller.js   # Recoit la requete HTTP, renvoie la reponse
├── vehicle.routes.js       # Mappe les URLs aux controllers
└── index.js                # Exporte tout le module
```

### Flux detaille : `POST /api/vehicles`

Quand le client envoie `{ driver_id: 1, category_id: 2, plate: "A 123 BC" }` :

```
1. ROUTES (vehicle.routes.js)
   │  Recoit : POST /api/vehicles
   │  Verifie : est-ce que les donnees sont valides ?
   │  Appelle : validate(createVehicleSchema)
   │
   ├─ Si invalides → reponse 400 { success: false, errors: [...] }
   │
   └─ Si valides → passe au controller

2. CONTROLLER (vehicle.controller.js)
   │  Recoit : req.body = { driver_id: 1, category_id: 2, plate: "A 123 BC" }
   │  Appelle : vehicleService.createVehicle(req.body)
   │  Attend le resultat
   │
   └─ Envoie : res.status(201).json({ success: true, data: {...} })

3. SERVICE (vehicle.service.js)
   │  Recoit : { driver_id: 1, category_id: 2, plate: "A 123 BC" }
   │  Verifie : est-ce que la plaque "A 123 BC" existe deja ?
   │
   ├─ Si oui → lance une erreur { statusCode: 409 }
   │           Le controller l'attrape et renvoie 409
   │
   └─ Si non → appelle vehicleModel.createVehicle(data)

4. MODEL (vehicle.model.js)
   │  Recoit : { driver_id: 1, category_id: 2, plate: "A 123 BC" }
   │  Execute : INSERT INTO vehicles (driver_id, category_id, plate)
   │            VALUES (?, ?, ?)
   │  Renvoie : { id: 8, driver_id: 1, plate: "A 123 BC" }

5. Retour dans le CONTROLLER
   │  Recoit le vehicule cree
   │  Formate : { success: true, message: "Vehicule cree", data: {...} }
   │
   └─ Envoie au client (HTTP 201 Created)
```

### Flux detaille : `GET /api/vehicles?category_id=1&is_available=1`

```
1. ROUTES
   │  Validate les query parameters
   │  Appelle : vehicleController.getVehicles
   │
2. CONTROLLER
   │  Extrait : req.query = { category_id: "1", is_available: "1" }
   │  Appelle : vehicleService.getAllVehicles(filters)
   │
3. SERVICE
   │  Appelle : vehicleModel.findVehicles(filters)
   │
4. MODEL
   │  Construit dynamiquement :
   │  SELECT v.*, c.label FROM vehicles v
   │  LEFT JOIN vehicle_categories c ON v.category_id = c.id
   │  WHERE v.category_id = ? AND v.is_available = ?
   │  ORDER BY v.created_at DESC
   │
   └─ Renvoie : [{ id: 3, plate: "B 456 CD", ... }, ...]
```

### Ce que chaque fichier contient

| Fichier                 | Contient                                                    | Ne contient PAS                    |
| ----------------------- | ----------------------------------------------------------- | ---------------------------------- |
| `vehicle.validator.js`  | Schemas Joi, fonction middleware validate()                 | SQL, logique metier, req/res       |
| `vehicle.model.js`      | SELECT, INSERT, UPDATE, DELETE avec pool.query              | Logique metier, req/res            |
| `vehicle.service.js`    | Verifications (plaque unique, 404), regles metier          | SQL, req/res                       |
| `vehicle.controller.js` | req.params, req.body, req.query, res.json(), next(error)   | SQL, logique metier                |
| `vehicle.routes.js`     | router.get(), router.post(), middlewares                    | SQL, logique metier, req/res       |
| `index.js`              | Re-exporte tout le module                                   | Logique                            |

### Regles a retenir

1. **Le validator** verifie les donnees AVANT tout
2. **Le model** fait le SQL avec des requetes parametrees (`?`)
3. **Le service** verifie les regles (unicite, existence, etc.)
4. **Le controller** ne fait que recevoir et repondre
5. **Les routes** connectent les URLs aux fonctions
6. **En cas d'erreur** : on appelle `next(error)` — c'est le middleware global qui gere

### Pourquoi分离 (separer) ?

| Si on change...                  | On modifie UNIQUEMENT... |
| -------------------------------- | ------------------------ |
| La base de donnees               | Le model                 |
| Les regles metier                | Le service               |
| Le format de la reponse HTTP     | Le controller            |
| Les URLs de l'API                | Les routes               |
| Les regles de validation         | Le validator             |

Chaque personne de l'equipe peut travailler sur son fichier sans casser les autres.

---

## Les 3 roles utilisateurs

| Role          | Qui est-ce ?                                    | Besoins principaux                                    |
| ------------- | ----------------------------------------------- | ----------------------------------------------------- |
| `proprietaire`| Celui qui a des marchandises a transporter      | Publier des demandes, trouver des chauffeurs, payer   |
| `chauffeur`   | Celui qui transporte les marchandises           | Ajouter son vehicule, accepter des demandes, livrer   |
| `fournisseur` | Celui qui fournit les marchandises              | Publier des demandes, suivre les livraisons, payer    |

---

## Comment ajouter un nouveau module ?

### Etape 1 : Creer le dossier et les fichiers

```bash
mkdir src/modules/mamodule
touch src/modules/mamodule/mamodule.routes.js
touch src/modules/mamodule/mamodule.controller.js
touch src/modules/mamodule/mamodule.service.js
touch src/modules/mamodule/mamodule.model.js
touch src/modules/mamodule/mamodule.validator.js
touch src/modules/mamodule/index.js
```

### Etape 2 : Remplir chaque fichier

**mamodule.model.js** — Les requetes SQL :

```javascript
const { pool } = require("../../config/database");

async function findAll() {
    const [rows] = await pool.query("SELECT * FROM ma_table");
    return rows;
}

module.exports = { findAll };
```

**mamodule.service.js** — La logique metier :

```javascript
const mamoduleModel = require("./mamodule.model");

async function getAll() {
    return await mamoduleModel.findAll();
}

module.exports = { getAll };
```

**mamodule.controller.js** — La gestion req/res :

```javascript
const mamoduleService = require("./mamodule.service");

async function getAll(req, res, next) {
    try {
        const data = await mamoduleService.getAll();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAll };
```

**mamodule.routes.js** — Les routes :

```javascript
const express = require("express");
const router = express.Router();
const mamoduleController = require("./mamodule.controller");

router.get("/", mamoduleController.getAll);

module.exports = router;
```

**index.js** — L'export :

```javascript
const mamoduleRoutes = require("./mamodule.routes");

module.exports = { mamoduleRoutes };
```

### Etape 3 : Monter le module dans routes/index.js

```javascript
const mamoduleRoutes = require("../modules/mamodule").mamoduleRoutes;

router.use("/mamodule", mamoduleRoutes);
```

C'est fait. Le module est accessible via `/api/mamodule`.

---

## Comment lancer le projet

| Commande       | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| `npm install`  | Installe toutes les dependances                                   |
| `npm run dev`  | Lance le serveur en mode developpement (se relance automatiquement)|
| `npm start`    | Lance le serveur en mode production                               |
| `npm test`     | Lance les tests                                                   |

---

## Variables d'environnement (.env)

| Variable       | Description                        | Valeur par defaut |
| -------------- | ---------------------------------- | ----------------- |
| `PORT`         | Port du serveur                    | 3000              |
| `NODE_ENV`     | Environnement                      | development       |
| `DB_HOST`      | Host MySQL                         | localhost         |
| `DB_PORT`      | Port MySQL                         | 3306              |
| `DB_USER`      | Utilisateur MySQL                  | root              |
| `DB_PASSWORD`  | Mot de passe MySQL                 | (vide)            |
| `DB_NAME`      | Nom de la base                     | nzanira           |
| `JWT_SECRET`   | Secret pour les tokens JWT         | (a definir)       |

---

## Aide

- Lire `AGENTS.md` pour les conventions de code
- En cas de bug, verifier les logs dans le terminal
- Le serveur doit toujours etre lance avec `npm run dev`
