# Guide de contribution — NZANAPP

## Architecture

Chaque module suit cette structure :

```
src/modules/{moduleName}/
├── {moduleName}.controller.js    # Gère req/res
├── {moduleName}.service.js       # Logique métier
├── {moduleName}.model.js         # Requêtes SQL
├── {moduleName}.routes.js        # Définit les routes
├── {moduleName}.validator.js     # Validation des entrées
└── index.js                      # Barrel export
```

## Conventions de nommage

| Element             | Format                  | Exemple                 |
| ------------------- | ----------------------- | ----------------------- |
| Fichier model       | `{singular}.model.js`   | `vehicle.model.js`      |
| Fichier service     | `{singular}.service.js` | `vehicle.service.js`    |
| Fichier controller  | `{singular}.controller.js` | `vehicle.controller.js` |
| Fichier routes      | `{plural}.routes.js`    | `vehicles.routes.js`    |
| Fichier validator   | `{singular}.validator.js` | `vehicle.validator.js`  |
| Variable model      | `{singular}Model`       | `vehicleModel`          |
| Variable service    | `{singular}Service`     | `vehicleService`        |
| Variable controller | `{singular}Controller`  | `vehicleController`     |
| Fonction model      | verbe + Nom             | `findAll`, `findById`, `create` |
| Fonction controller | verbe + Nom             | `getVehicles`, `createVehicle`  |

## Base de donnees

- DB : `nzanira` (MySQL 9.1)
- Pool partage via `src/config/database.js`
- **NE JAMAIS** creer de 2eme connexion DB
- Colonnes : `full_name` (pas `name`), `phone`, `password_hash`, `role`
- Toutes les FK sont `int unsigned` avec `ON DELETE CASCADE` ou `SET NULL`

## Roles utilisateurs

L'application compte **3 roles** avec des besoins differents :

### `proprietaire` — Celui qui a besoin de transporter

| Besoin                            | Module     | Route(s)                                |
| --------------------------------- | ---------- | --------------------------------------- |
| S'inscrire / se connecter         | auth       | `register`, `login`                     |
| Voir / modifier son profil        | users      | `GET /users/:id`, `PUT /users/:id`      |
| Publier une demande de transport  | transport  | `POST /requests`                        |
| Voir ses demandes                 | transport  | `GET /requests?requester_id=`           |
| Annuler une demande               | transport  | `PUT /requests/:id/cancel`              |
| Voir les chauffeurs disponibles   | drivers    | `GET /drivers/available`                |
| Voir les vehicules disponibles    | vehicles   | `GET /vehicles?is_available=1`          |
| Suivre la livraison               | deliveries | `GET /deliveries/:id`                   |
| Payer le transport                | payments   | `POST /transactions`                    |
| Ajouter un moyen de paiement      | payments   | `POST /payment-methods`                 |
| Laisser un avis au chauffeur      | reviews    | `POST /reviews`                         |
| Envoyer un message au chauffeur   | messaging  | `POST /conversations/:id/messages`      |
| Voir ses notifications            | notifs     | `GET /notifications?user_id=`           |
| Uploader des documents            | documents  | `POST /documents`                       |

### `chauffeur` — Celui qui transporte

| Besoin                                  | Module     | Route(s)                                |
| --------------------------------------- | ---------- | --------------------------------------- |
| S'inscrire / se connecter               | auth       | `register`, `login`                     |
| Voir / modifier son profil              | users      | `GET /users/:id`, `PUT /users/:id`      |
| Creer son profil chauffeur              | drivers    | `POST /drivers`                         |
| Ajouter un vehicule                     | vehicles   | `POST /vehicles`                        |
| Voir ses vehicules                      | vehicles   | `GET /vehicles/driver/:driverId`        |
| Mettre a jour sa position GPS           | drivers    | `PUT /drivers/:id/location`             |
| Voir les demandes disponibles           | transport  | `GET /requests?status=published`        |
| Accepter une demande                    | transport  | `POST /assignments`                     |
| Voir ses assignations                   | transport  | `GET /assignments?driver_id=`           |
| Demarrer une livraison                  | deliveries | `POST /deliveries`                      |
| Mettre a jour le statut livraison       | deliveries | `PUT /deliveries/:id`                   |
| Marquer livree                          | deliveries | `PUT /deliveries/:id/complete`          |
| Voir ses gains                          | payments   | `GET /transactions?user_id=`            |
| Ajouter un moyen de paiement            | payments   | `POST /payment-methods`                 |
| Laisser un avis au proprietaire         | reviews    | `POST /reviews`                         |
| Envoyer un message au proprietaire      | messaging  | `POST /conversations/:id/messages`      |
| Voir ses notifications                  | notifs     | `GET /notifications?user_id=`           |
| Uploader des documents                  | documents  | `POST /documents`                       |

### `fournisseur` — Celui qui fournit les marchandises

| Besoin                            | Module     | Route(s)                                |
| --------------------------------- | ---------- | --------------------------------------- |
| S'inscrire / se connecter         | auth       | `register`, `login`                     |
| Voir / modifier son profil        | users      | `GET /users/:id`, `PUT /users/:id`      |
| Publier une demande de transport  | transport  | `POST /requests`                        |
| Voir ses demandes                 | transport  | `GET /requests?requester_id=`           |
| Annuler une demande               | transport  | `PUT /requests/:id/cancel`              |
| Suivre la livraison               | deliveries | `GET /deliveries/:id`                   |
| Payer le transport                | payments   | `POST /transactions`                    |
| Ajouter un moyen de paiement      | payments   | `POST /payment-methods`                 |
| Laisser un avis                   | reviews    | `POST /reviews`                         |
| Envoyer un message                | messaging  | `POST /conversations/:id/messages`      |
| Voir ses notifications            | notifs     | `GET /notifications?user_id=`           |
| Uploader des documents            | documents  | `POST /documents`                       |

### Modules transversaux (utilises par tous les roles)

| Module             | Route                      | Pourquoi                                              |
| ------------------ | -------------------------- | ----------------------------------------------------- |
| materials          | `GET /materials`           | Selectionner un materiau dans une demande de transport |
| landmarks          | `GET /landmarks`           | Selectionner un point pickup/destination               |
| vehicle-categories | `GET /vehicle-categories`  | Le chauffeur choisit la categorie de son vehicule      |

---

## Tables principales

| Table                | Module              |
| -------------------- | ------------------- |
| users                | auth, users         |
| vehicles             | vehicles            |
| vehicle_categories   | vehicles            |
| driver_profiles      | drivers             |
| driver_locations     | drivers             |
| transport_requests   | transport           |
| request_assignments  | transport           |
| deliveries           | deliveries          |
| materials            | materials           |
| landmarks            | landmarks           |
| companies            | companies           |
| conversations        | messaging           |
| messages             | messaging           |
| notifications        | notifications       |
| payment_methods      | payments            |
| transactions         | payments            |
| reviews              | reviews             |
| user_documents       | documents           |

## Modules et API a developper

---

### Module 1 : `auth` — Table `users`

> Authentification, inscription, gestion de session.
> **Utilise par** : proprietaire, chauffeur, fournisseur (inscription + connexion)

| Methode | Route                      | Description                    | Body / Params                          |
| ------- | -------------------------- | ------------------------------ | -------------------------------------- |
| POST    | `/api/auth/register`       | Inscription                    | `{ full_name, phone, password, role }` |
| POST    | `/api/auth/login`          | Connexion                      | `{ phone, password }`                  |
| POST    | `/api/auth/logout`         | Deconnexion                    | — (JWT blacklist)                      |
| GET     | `/api/auth/me`             | Profil utilisateur connecte    | — (via token)                          |
| POST    | `/api/auth/refresh`        | Rafraichir le token            | `{ refreshToken }`                     |

**Dependances** : `bcryptjs`, `jsonwebtoken`
**Middleware** : `auth.middleware.js` (protege les routes)

---

### Module 2 : `users` — Table `users`

> Gestion des profils et parametres utilisateur.
> **Utilise par** : proprietaire, chauffeur, fournisseur (profil + settings)

| Methode | Route                    | Description          | Body / Params                       | Role(s)   |
| ------- | ------------------------ | -------------------- | ----------------------------------- | --------- |
| GET     | `/api/users`             | Liste utilisateurs   | `?role=&is_active=`                 | tous      |
| GET     | `/api/users/:id`         | Detail utilisateur   | —                                   | tous      |
| PUT     | `/api/users/:id`         | Modifier le profil   | `{ full_name, email, lang, theme }` | tous      |
| PUT     | `/api/users/:id/settings`| Parametres           | `{ gps_enabled, lang, theme }`      | tous      |
| PUT     | `/api/users/:id/verify`  | Verifier (admin)     | `{ is_verified: 1 }`                | admin     |
| DELETE  | `/api/users/:id`         | Desactiver compte    | — (soft delete: `is_active=0`)      | tous      |

---

### Module 3 : `vehicles` — Tables `vehicles`, `vehicle_categories`

> CRUD vehicules et categories.
> **Utilise par** : chauffeur (ses vehicules), proprietaire (voir vehicules disponibles)

**vehicle_categories :**

| Methode | Route                              | Description          | Body / Params                                      |
| ------- | ---------------------------------- | -------------------- | -------------------------------------------------- |
| GET     | `/api/vehicle-categories`          | Liste categories     | —                                                  |
| GET     | `/api/vehicle-categories/:id`      | Detail categorie     | —                                                  |
| POST    | `/api/vehicle-categories`          | Creer categorie      | `{ code, label, capacity_min, capacity_max }`      |
| PUT     | `/api/vehicle-categories/:id`      | Modifier categorie   | `{ code, label, capacity_min, capacity_max }`      |
| DELETE  | `/api/vehicle-categories/:id`      | Supprimer categorie  | —                                                  |

**vehicles :**

| Methode | Route                                | Description                  | Body / Params                                  | Role(s)     |
| ------- | ------------------------------------ | ---------------------------- | ---------------------------------------------- | ----------- |
| GET     | `/api/vehicles`                      | Liste vehicules              | `?driver_id=&category_id=&is_available=`       | tous        |
| GET     | `/api/vehicles/:id`                  | Detail vehicule              | —                                              | tous        |
| GET     | `/api/vehicles/driver/:driverId`     | Vehicules d'un chauffeur     | —                                              | chauffeur   |
| POST    | `/api/vehicles`                      | Creer vehicule               | `{ driver_id, category_id, plate }`            | chauffeur   |
| PUT     | `/api/vehicles/:id`                  | Modifier vehicule            | `{ category_id, plate, is_available }`         | chauffeur   |
| DELETE  | `/api/vehicles/:id`                  | Supprimer vehicule           | —                                              | chauffeur   |

---

### Module 4 : `drivers` — Tables `driver_profiles`, `driver_locations`

> Profils chauffeurs et suivi GPS en temps reel.
> **Utilise par** : chauffeur (son profil + GPS), proprietaire (trouver des chauffeurs)

**driver_profiles :**

| Methode | Route                        | Description                                | Body / Params                                  | Role(s)     |
| ------- | ---------------------------- | ------------------------------------------ | ---------------------------------------------- | ----------- |
| GET     | `/api/drivers`               | Liste chauffeurs                           | `?work_status=&company_id=`                    | proprietaire|
| GET     | `/api/drivers/:id`           | Profil chauffeur                           | —                                              | tous        |
| GET     | `/api/drivers/:id/full`      | Profil complet (user + vehicle + company)  | —                                              | proprietaire|
| POST    | `/api/drivers`               | Creer profil chauffeur                     | `{ user_id, work_status, company_id? }`        | chauffeur   |
| PUT     | `/api/drivers/:id`           | Modifier profil                            | `{ work_status, company_id }`                  | chauffeur   |
| DELETE  | `/api/drivers/:id`           | Supprimer profil                           | —                                              | chauffeur   |

**driver_locations :**

| Methode | Route                          | Description                              | Body / Params                    | Role(s)     |
| ------- | ------------------------------ | ---------------------------------------- | -------------------------------- | ----------- |
| GET     | `/api/drivers/:id/location`    | Position actuelle                        | —                                | proprietaire|
| PUT     | `/api/drivers/:id/location`    | Mettre a jour position                   | `{ lat, lng, speed_kmh? }`       | chauffeur   |
| GET     | `/api/drivers/available`       | Chauffeurs disponibles a proximite       | `?lat=&lng=&radius_km=`          | proprietaire|

---

### Module 5 : `transport` — Tables `transport_requests`, `request_assignments`

> Demande de transport et assignation de chauffeurs.
> **Utilise par** : proprietaire (publie), fournisseur (publie), chauffeur (accepte)

**transport_requests :**

| Methode | Route                      | Description              | Body / Params                                                           | Role(s)                     |
| ------- | -------------------------- | ------------------------ | ----------------------------------------------------------------------- | --------------------------- |
| GET     | `/api/requests`            | Liste demandes           | `?status=&requester_id=&material_id=`                                   | tous                        |
| GET     | `/api/requests/:id`        | Detail demande           | —                                                                       | tous                        |
| POST    | `/api/requests`            | Publier une demande      | `{ material_id, quantity_tons, pickup_address?, dest_address?, ... }`    | proprietaire, fournisseur   |
| PUT     | `/api/requests/:id`        | Modifier demande         | `{ status, pickup_address, dest_address }`                              | proprietaire, fournisseur   |
| PUT     | `/api/requests/:id/cancel` | Annuler demande          | —                                                                       | proprietaire, fournisseur   |
| DELETE  | `/api/requests/:id`        | Supprimer demande        | — (seulement status=`published`)                                        | proprietaire, fournisseur   |

**request_assignments :**

| Methode | Route                    | Description              | Body / Params                           | Role(s)   |
| ------- | ------------------------ | ------------------------ | --------------------------------------- | --------- |
| GET     | `/api/assignments`       | Liste assignations       | `?driver_id=&request_id=`               | tous      |
| GET     | `/api/assignments/:id`   | Detail assignation       | —                                       | tous      |
| POST    | `/api/assignments`       | Accepter une demande     | `{ request_id, driver_id, vehicle_id }` | chauffeur |
| PUT     | `/api/assignments/:id`   | Mettre a jour assignation| —                                       | chauffeur |

---

### Module 6 : `deliveries` — Table `deliveries`

> Suivi de livraison en temps reel.
> **Utilise par** : chauffeur (met a jour), proprietaire/fournisseur (suit)

| Methode | Route                                   | Description                          | Body / Params                                                                 | Role(s)   |
| ------- | --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------- | --------- |
| GET     | `/api/deliveries`                       | Liste livraisons                     | `?status=&assignment_id=`                                                     | tous      |
| GET     | `/api/deliveries/:id`                   | Detail livraison                     | —                                                                             | tous      |
| GET     | `/api/deliveries/active/:driverId`      | Livraison active d'un chauffeur      | —                                                                             | chauffeur |
| POST    | `/api/deliveries`                       | Demarrer livraison                   | `{ assignment_id }`                                                           | chauffeur |
| PUT     | `/api/deliveries/:id`                   | Mettre a jour statut                 | `{ status, progress_pct, current_landmark?, distance_km?, eta_min? }`         | chauffeur |
| PUT     | `/api/deliveries/:id/complete`          | Marquer livree                       | —                                                                             | chauffeur |

---

### Module 7 : `materials` — Table `materials`

> Catalogue des marchandises transportables.
> **Utilise par** : proprietaire, fournisseur (selectionner un materiau)

| Methode | Route                  | Description              | Body / Params |
| ------- | ---------------------- | ------------------------ | ------------- |
| GET     | `/api/materials`       | Liste materiaux          | —             |
| GET     | `/api/materials/:id`   | Detail materiau          | —             |
| POST    | `/api/materials`       | Creer materiau           | `{ name }`    |
| PUT     | `/api/materials/:id`   | Modifier materiau        | `{ name }`    |
| DELETE  | `/api/materials/:id`   | Supprimer materiau       | —             |

---

### Module 8 : `landmarks` — Table `landmarks`

> Points geographiques (quartiers, villes, zones de depot).
> **Utilise par** : proprietaire, fournisseur (selectionner pickup/dest)

| Methode | Route                    | Description              | Body / Params                                |
| ------- | ------------------------ | ------------------------ | -------------------------------------------- |
| GET     | `/api/landmarks`         | Liste points             | `?zone=&is_active=`                          |
| GET     | `/api/landmarks/:id`     | Detail point             | —                                            |
| POST    | `/api/landmarks`         | Creer point              | `{ name, zone, lat?, lng? }`                 |
| PUT     | `/api/landmarks/:id`     | Modifier point           | `{ name, zone, lat, lng, is_active }`        |
| DELETE  | `/api/landmarks/:id`     | Supprimer point          | —                                            |

---

### Module 9 : `companies` — Table `companies`

> Societes de transport.
> **Utilise par** : chauffeur (societe), admin

| Methode | Route                        | Description                | Body / Params                  |
| ------- | ---------------------------- | -------------------------- | ------------------------------ |
| GET     | `/api/companies`             | Liste societes             | —                              |
| GET     | `/api/companies/:id`         | Detail societe             | —                              |
| GET     | `/api/companies/:id/drivers` | Chauffeurs d'une societe   | —                              |
| POST    | `/api/companies`             | Creer societe              | `{ name, registry_doc? }`      |
| PUT     | `/api/companies/:id`         | Modifier societe           | `{ name, registry_doc }`       |
| DELETE  | `/api/companies/:id`         | Supprimer societe          | —                              |

---

### Module 10 : `messaging` — Tables `conversations`, `messages`

> Messagerie privee entre proprietaires et chauffeurs.
> **Utilise par** : proprietaire, chauffeur, fournisseur

**conversations :**

| Methode | Route                    | Description                                    | Body / Params                            |
| ------- | ------------------------ | ---------------------------------------------- | ---------------------------------------- |
| GET     | `/api/conversations`     | Liste conversations                            | `?user_id=`                              |
| GET     | `/api/conversations/:id` | Detail conversation + derniers messages        | —                                        |
| POST    | `/api/conversations`     | Creer/obtenir conversation                     | `{ request_id?, driver_id, owner_id }`   |

**messages :**

| Methode | Route                            | Description                    | Body / Params      |
| ------- | -------------------------------- | ------------------------------ | ------------------ |
| GET     | `/api/conversations/:id/messages`| Messages d'une conversation    | `?limit=&offset=`  |
| POST    | `/api/conversations/:id/messages`| Envoyer message                | `{ content }`      |
| PUT     | `/api/messages/:id/read`         | Marquer comme lu               | —                  |

---

### Module 11 : `notifications` — Table `notifications`

> Notifications push / in-app.
> **Utilise par** : tous les roles

| Methode | Route                              | Description              | Body / Params                       |
| ------- | ---------------------------------- | ------------------------ | ----------------------------------- |
| GET     | `/api/notifications`               | Liste notifications      | `?user_id=&is_read=`                |
| GET     | `/api/notifications/unread/count`  | Nombre non lues          | `?user_id=`                         |
| POST    | `/api/notifications`               | Creer notification       | `{ user_id, type, title, body? }`   |
| PUT     | `/api/notifications/:id/read`      | Marquer comme lu         | —                                   |
| PUT     | `/api/notifications/read-all`      | Tout marquer lu          | `?user_id=`                         |
| DELETE  | `/api/notifications/:id`           | Supprimer notification   | —                                   |

---

### Module 12 : `payments` — Tables `payment_methods`, `transactions`

> Modes de paiement et transactions financieres.
> **Utilise par** : proprietaire, fournisseur (payer), chauffeur (recevoir)

**payment_methods :**

| Methode | Route                              | Description              | Body / Params                                                       |
| ------- | ---------------------------------- | ------------------------ | ------------------------------------------------------------------- |
| GET     | `/api/payment-methods`             | Liste methodes           | `?user_id=`                                                         |
| GET     | `/api/payment-methods/:id`         | Detail methode           | —                                                                   |
| POST    | `/api/payment-methods`             | Ajouter methode          | `{ user_id, provider, phone?, bank_name?, account_number? }`        |
| PUT     | `/api/payment-methods/:id`         | Modifier methode         | `{ provider, phone, is_default }`                                   |
| PUT     | `/api/payment-methods/:id/default` | Definir par defaut       | —                                                                   |
| DELETE  | `/api/payment-methods/:id`         | Supprimer methode        | —                                                                   |

**transactions :**

| Methode | Route                          | Description              | Body / Params                                           |
| ------- | ------------------------------ | ------------------------ | ------------------------------------------------------- |
| GET     | `/api/transactions`            | Liste transactions       | `?user_id=&type=&status=`                               |
| GET     | `/api/transactions/:id`        | Detail transaction       | —                                                       |
| POST    | `/api/transactions`            | Creer transaction        | `{ user_id, request_id?, method_id?, type, amount_fbu }`|
| PUT     | `/api/transactions/:id/status` | Mettre a jour statut     | `{ status, reference? }`                                |

---

### Module 13 : `reviews` — Table `reviews`

> Evaluations entre utilisateurs.
> **Utilise par** : proprietaire (evalue chauffeur), chauffeur (evalue proprietaire)

| Methode | Route                      | Description              | Body / Params                                    |
| ------- | -------------------------- | ------------------------ | ------------------------------------------------ |
| GET     | `/api/reviews`             | Liste avis               | `?rated_id=&rater_id=`                           |
| GET     | `/api/reviews/:id`         | Detail avis              | —                                                |
| GET     | `/api/reviews/user/:userId`| Avis d'un utilisateur    | — (moyenne + avis)                               |
| POST    | `/api/reviews`             | Creer avis               | `{ request_id, rated_id, score, comment? }`      |
| DELETE  | `/api/reviews/:id`         | Supprimer avis           | —                                                |

---

### Module 14 : `documents` — Table `user_documents`

> Documents d'identite et justificatifs.
> **Utilise par** : tous les roles (CI, passeport, permis, registre de commerce)

| Methode | Route                        | Description              | Body / Params                         |
| ------- | ---------------------------- | ------------------------ | ------------------------------------- |
| GET     | `/api/documents`             | Liste documents          | `?user_id=&status=&doc_type=`         |
| GET     | `/api/documents/:id`         | Detail document          | —                                     |
| POST    | `/api/documents`             | Uploader document        | `multipart: { doc_type, file }`       |
| PUT     | `/api/documents/:id/approve` | Approuver document       | — (admin)                             |
| PUT     | `/api/documents/:id/reject`  | Rejeter document         | — (admin)                             |
| DELETE  | `/api/documents/:id`         | Supprimer document       | —                                     |

---

## Middlewares

### `auth.middleware.js` — Authentification JWT

Protege les routes. Verifie que l'utilisateur a un token valide.

```javascript
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token manquant"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token invalide ou expire"
        });
    }
}

module.exports = { authenticate };
```

### `role.middleware.js` — Controle des roles

Verifie que l'utilisateur a le bon role pour acceder a la route.

```javascript
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifie"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Acces interdit — role insuffisant"
            });
        }

        next();
    };
}

module.exports = { authorize };
```

### Dependances

```bash
npm install jsonwebtoken
```

### Utilisation dans les routes

```javascript
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");

// Route publique
router.get("/", vehicleController.getVehicles);

// Route protegee — authentification + role verifie
router.post("/", authenticate, authorize("chauffeur"), vehicleController.createVehicle);
```

### Tableau des permissions par role

**Module auth :**

| Route                | proprietaire | chauffeur | fournisseur | admin |
| -------------------- | :----------: | :-------: | :---------: | :---: |
| `POST /auth/register`|      OUI     |    OUI    |     OUI     |   —   |
| `POST /auth/login`   |      OUI     |    OUI    |     OUI     |   —   |

**Module users :**

| Route                  | proprietaire     | chauffeur        | fournisseur      | admin      |
| ---------------------- | :--------------: | :--------------: | :--------------: | :--------: |
| `GET /users`           |       —          |        —         |        —         |    OUI     |
| `GET /users/:id`       | son profil       | son profil       | son profil       | tous       |
| `PUT /users/:id`       | son profil       | son profil       | son profil       | tous       |
| `PUT /users/:id/verify`|       —          |        —         |        —         |    OUI     |
| `DELETE /users/:id`    | son compte       | son compte       | son compte       | tous       |

**Module vehicles :**

| Route                      | proprietaire | chauffeur        | fournisseur | admin |
| -------------------------- | :----------: | :--------------: | :---------: | :---: |
| `GET /vehicles`            |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /vehicles`           |      —       |       OUI        |      —      |   —   |
| `PUT /vehicles/:id`        |      —       | son vehicule     |      —      |   —   |
| `DELETE /vehicles/:id`     |      —       | son vehicule     |      —      |   —   |
| `GET /vehicle-categories`  |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /vehicle-categories` |      —       |        —         |      —      |  OUI  |

**Module drivers :**

| Route                        | proprietaire | chauffeur        | fournisseur | admin |
| ---------------------------- | :----------: | :--------------: | :---------: | :---: |
| `GET /drivers`               |     OUI      |       OUI        |     OUI     |  OUI  |
| `GET /drivers/available`     |     OUI      |        —         |      —      |   —   |
| `POST /drivers`              |      —       |       OUI        |      —      |   —   |
| `PUT /drivers/:id`           |      —       | son profil       |      —      |   —   |
| `PUT /drivers/:id/location`  |      —       | sa position      |      —      |   —   |

**Module transport :**

| Route                        | proprietaire     | chauffeur | fournisseur      | admin |
| ---------------------------- | :--------------: | :-------: | :--------------: | :---: |
| `GET /requests`              |       OUI        |    OUI    |       OUI        |  OUI  |
| `POST /requests`             |       OUI        |     —     |       OUI        |   —   |
| `PUT /requests/:id`          | sa demande       |     —     | sa demande       |   —   |
| `PUT /requests/:id/cancel`   | sa demande       |     —     | sa demande       |   —   |
| `DELETE /requests/:id`       | sa demande       |     —     | sa demande       |   —   |
| `POST /assignments`          |        —         |    OUI    |        —         |   —   |
| `GET /assignments`           |       OUI        |    OUI    |       OUI        |  OUI  |

**Module deliveries :**

| Route                          | proprietaire | chauffeur        | fournisseur | admin |
| ------------------------------ | :----------: | :--------------: | :---------: | :---: |
| `GET /deliveries`              |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /deliveries`             |      —       |       OUI        |      —      |   —   |
| `PUT /deliveries/:id`          |      —       | sa livraison     |      —      |   —   |
| `PUT /deliveries/:id/complete` |      —       | sa livraison     |      —      |   —   |

**Module materials / landmarks / companies :**

| Route                          | proprietaire | chauffeur        | fournisseur | admin |
| ------------------------------ | :----------: | :--------------: | :---------: | :---: |
| `GET /materials`               |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /materials`              |      —       |        —         |      —      |  OUI  |
| `GET /landmarks`               |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /landmarks`              |      —       |        —         |      —      |  OUI  |
| `GET /companies`               |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /companies`              |      —       |       OUI        |      —      |   —   |
| `PUT /companies/:id`           |      —       | sa societe       |      —      |   —   |
| `DELETE /companies/:id`        |      —       |        —         |      —      |  OUI  |

**Module messaging / notifications :**

| Route                                | proprietaire     | chauffeur        | fournisseur      | admin      |
| ------------------------------------ | :--------------: | :--------------: | :--------------: | :--------: |
| `GET /conversations`                 |       OUI        |       OUI        |       OUI        |    OUI     |
| `POST /conversations`                |       OUI        |       OUI        |       OUI        |     —      |
| `POST /conversations/:id/messages`   |       OUI        |       OUI        |       OUI        |     —      |
| `GET /notifications`                 | ses notifs       | ses notifs       | ses notifs       | toutes     |

**Module payments :**

| Route                          | proprietaire         | chauffeur            | fournisseur         | admin      |
| ------------------------------ | :------------------: | :------------------: | :------------------: | :--------: |
| `GET /payment-methods`         | ses methodes         | ses methodes         | ses methodes         |    OUI     |
| `POST /payment-methods`        |         OUI          |         OUI          |         OUI          |     —      |
| `GET /transactions`            | ses transactions     | ses transactions     | ses transactions     | toutes     |
| `POST /transactions`           |         OUI          |         OUI          |         OUI          |     —      |

**Module reviews / documents :**

| Route                          | proprietaire | chauffeur        | fournisseur | admin |
| ------------------------------ | :----------: | :--------------: | :---------: | :---: |
| `GET /reviews`                 |     OUI      |       OUI        |     OUI     |  OUI  |
| `POST /reviews`                |     OUI      |       OUI        |     OUI     |   —   |
| `DELETE /reviews/:id`          | son avis     | son avis         | son avis    | tous  |
| `GET /documents`               | ses docs     | ses docs         | ses docs    | tous  |
| `POST /documents`              |     OUI      |       OUI        |     OUI     |   —   |
| `PUT /documents/:id/approve`   |      —       |        —         |      —      |  OUI  |
| `PUT /documents/:id/reject`    |      —       |        —         |      —      |  OUI  |

---

## Regles d'or

1. **Un module ne importe JAMAIS directement un model d'un autre module**
   - Toujours passer par le service du module concerne
2. **Validation** dans `{moduleName}.validator.js` (joi)
3. **Erreurs** : `next(error)` → le middleware global les gere
4. **Une PR = un module** + ajout d'1 ligne dans `routes/index.js`
5. **Pas de code mort** : commenter les routes non pretes
6. **Tests** dans `tests/{moduleName}/` avant chaque merge
7. **Commit** : type(scope): message — ex: `feat(vehicles): add CRUD`
8. **Auth** : toutes les routes sauf `register` et `login` necessitent un JWT valide
9. **Pagination** : les listes supportent `?limit=20&offset=0` par defaut
10. **Reponse standardisee** : `{ success: boolean, data?, message? }`

## Scripts

- `npm start` → lance le serveur
- `npm run dev` → lance avec nodemon
- `npm test` → lance les tests
