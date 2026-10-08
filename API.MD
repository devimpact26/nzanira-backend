# 📡 NZANAPP — TOUTES LES API (104 endpoints, 16 groupes)

**Base URL** : `https://tele.nufotec.com//api`
**Format de réponse** : `{ "success": true|false, "message": "...", "data": ... }`

---

## 🚀 Comment tester avec Postman

1. Ouvrir Postman → **New Request**.
2. Choisir la méthode (GET / POST / PUT / DELETE).
3. **Copier la ligne "URL à copier"** ci-dessous et la coller dans le champ URL de Postman.
4. Si l'API dit **Accès : Bearer** → onglet **Headers** :
   `Authorization` → `Bearer VOTRE_TOKEN`
5. Si l'API a un **Body JSON** → onglet **Body** → **raw** → format **JSON** → coller le bloc.
6. `POST /api/documents` est **multipart/form-data** → onglet **Body** → **form-data**.

### Obtenir le token (à faire 1 fois)

```text
POST https://tele.nufotec.com//api/auth/login
```

```json
{
  "phone": "+25779000001",
  "password": "VotreMotDePasse"
}
```

Réponse → copier `data.token` → le coller partout comme `Bearer <token>`.

### Rôles

| Rôle | Qui |
| ---- | --- |
| `proprietaire` | a des marchandises à transporter |
| `chauffeur` | transporte les marchandises |
| `fournisseur` | fournit les marchandises |
| `admin` | vérifie les comptes et les documents |

### Codes HTTP

`200` OK · `201` Créé · `400` données invalides · `401` token manquant · `403` rôle insuffisant · `404` introuvable · `409` conflit · `500` serveur

---

## Sommaire

| # | Groupe | Endpoints |
| - | ------ | :-------: |
| 1 | [Auth](#1-auth--authentification) | 5 |
| 2 | [Users](#2-users--utilisateurs) | 7 |
| 3 | [Drivers](#3-drivers--chauffeurs) | 9 |
| 4 | [Vehicle categories](#4-vehicle-categories--catégories-de-véhicules) | 5 |
| 5 | [Vehicles](#5-vehicles--véhicules) | 6 |
| 6 | [Transport requests](#6-transport--demandes-de-transport) | 6 |
| 7 | [Assignments](#7-transport--assignations) | 3 |
| 8 | [Deliveries](#8-deliveries--livraisons) | 7 |
| 9 | [Materials](#9-materials--marchandises) | 5 |
| 10 | [Landmarks](#10-landmarks--repères-géographiques) | 7 |
| 11 | [Companies](#11-companies--sociétés) | 7 |
| 12 | [Messaging](#12-messaging--messagerie) | 7 |
| 13 | [Notifications](#13-notifications--notifications) | 6 |
| 14 | [Payments](#14-payments--paiements) | 10 |
| 15 | [Reviews](#15-reviews--avis) | 8 |
| 16 | [Documents](#16-documents--documents) | 6 |
| | **TOTAL** | **104** |

---
---

# 1. AUTH — Authentification

## 1.1 `POST /api/auth/register` — Inscription

**Accès :** public (pas de token)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/auth/register
```

**Body → raw → JSON :**
```json
{
  "full_name": "Jean NZAMBE",
  "phone": "+25779111222",
  "password": "secret123",
  "role": "proprietaire"
}
```
> `role` = `chauffeur` | `proprietaire` | `fournisseur` (obligatoire)
> `email` est optionnel.

**Réponse :** `201` → `data.user`, `data.token`, `data.refreshToken`

---

## 1.2 `POST /api/auth/login` — Connexion

**Accès :** public (pas de token)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/auth/login
```

**Body → raw → JSON :**
```json
{
  "phone": "+25779111222",
  "password": "secret123"
}
```

**Réponse :** `200` → `data.user`, `data.token`, `data.refreshToken`

---

## 1.3 `GET /api/auth/me` — Profil du connecté

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/auth/me
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` → `data` = profil de l'utilisateur

---

## 1.4 `POST /api/auth/refresh` — Rafraîchir le token

**Accès :** public

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/auth/refresh
```

**Body → raw → JSON :**
```json
{
  "refreshToken": "COLLER_ICI_LE_refreshToken_RECU_AU_LOGIN"
}
```

**Réponse :** `200` → `data.token`, `data.refreshToken`

---

## 1.5 `POST /api/auth/logout` — Déconnexion

**Accès :** Bearer

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/auth/logout
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Body → raw → JSON :**
```json
{
  "refreshToken": "COLLER_ICI_LE_refreshToken"
}
```
> Le refreshToken envoyé est blacklisté (utilisable pour tester la révocation).

**Réponse :** `200`

---
---

# 2. USERS — Utilisateurs

## 2.1 `POST /api/users` — Créer un utilisateur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/users
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Body → raw → JSON :**
```json
{
  "full_name": "Aline UWASE",
  "phone": "+25779222333",
  "password": "secret123",
  "role": "chauffeur",
  "lang": "fr",
  "theme": "dark"
}
```

**Réponse :** `201`

---

## 2.2 `GET /api/users` — Liste des utilisateurs

**Accès :** Bearer

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/users?role=chauffeur&limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `role`, `phone`, `full_name`, `is_active`, `limit` (max 100), `offset`

**Réponse :** `200` → `data` (tableau)

---

## 2.3 `GET /api/users/:id` — Un utilisateur

**Accès :** Bearer — propriétaire du compte ou `admin`

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/users/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` · `403` si ce n'est pas votre compte

---

## 2.4 `PUT /api/users/:id` — Modifier son profil

**Accès :** Bearer — propriétaire du compte ou `admin`

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/users/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "full_name": "Jean NZAMBE",
  "email": "jean@example.com",
  "lang": "fr",
  "theme": "light"
}
```
> `role`, `is_verified`, `is_active` sont **interdits** ici (sécurité).

**Réponse :** `200`

---

## 2.5 `PUT /api/users/:id/settings` — Paramètres (GPS, langue, thème)

**Accès :** Bearer — propriétaire du compte ou `admin`

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/users/1/settings
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "gps_enabled": true,
  "lang": "sw",
  "theme": "dark"
}
```
> Au moins 1 champ.

**Réponse :** `200`

---

## 2.6 `PUT /api/users/:id/verify` — Vérifier un compte

**Accès :** Bearer + rôle **admin**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/users/2/verify
```

**Headers :**
```text
Authorization: Bearer {{token_admin}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "is_verified": 1
}
```

**Réponse :** `200` · `403` si pas admin

---

## 2.7 `DELETE /api/users/:id` — Supprimer / désactiver

**Accès :** Bearer — propriétaire du compte ou `admin`

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/users/47
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 3. DRIVERS — Chauffeurs

## 3.1 `GET /api/drivers/available` — Chauffeurs disponibles (geo)

**Accès :** Bearer + rôle **proprietaire**

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/drivers/available?lat=-3.373&lng=29.918&radius_km=50
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> `lat` et `lng` obligatoires, `radius_km` optionnel.

**Réponse :** `200`

---

## 3.2 `GET /api/drivers` — Liste des chauffeurs

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/drivers?work_status=independent
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 3.3 `GET /api/drivers/:id` — Un chauffeur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/drivers/2
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` · `404` si inexistant

---

## 3.4 `GET /api/drivers/:id/full` — Fiche complète d'un chauffeur

**Accès :** Bearer + rôle **proprietaire**

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/drivers/2/full
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 3.5 `GET /api/drivers/:id/location` — Position GPS d'un chauffeur

**Accès :** Bearer + rôle **proprietaire**

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/drivers/2/location
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 3.6 `POST /api/drivers` — Créer son profil chauffeur

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/drivers
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "user_id": 2,
  "work_status": "independent"
}
```
> `work_status` = `independent` | `company` (défaut `independent`).
> Si `company` → ajouter `"company_id": 1`.

**Réponse :** `201`

---

## 3.7 `PUT /api/drivers/:id` — Modifier son profil chauffeur

**Accès :** Bearer + rôle **chauffeur** + **soi-même** (`:id` = son user id)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/drivers/2
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "work_status": "company",
  "company_id": 1
}
```

**Réponse :** `200` · `403` si ce n'est pas votre profil

---

## 3.8 `PUT /api/drivers/:id/location` — Mettre à jour sa position

**Accès :** Bearer + rôle **chauffeur** + **soi-même**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/drivers/2/location
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "lat": -3.3731,
  "lng": 29.9189,
  "speed_kmh": 42
}
```

**Réponse :** `200`

---

## 3.9 `DELETE /api/drivers/:id` — Supprimer son profil chauffeur

**Accès :** Bearer + rôle **chauffeur** + **soi-même**

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/drivers/2
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
```

**Réponse :** `200`

---
---

# 4. VEHICLE CATEGORIES — Catégories de véhicules

## 4.1 `GET /api/vehicle-categories` — Liste des catégories

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/vehicle-categories
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 4.2 `GET /api/vehicle-categories/:id` — Une catégorie

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/vehicle-categories/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 4.3 `POST /api/vehicle-categories` — Créer une catégorie

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/vehicle-categories
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "code": "PICKUP",
  "label": "Pick-up",
  "capacity_min": 1,
  "capacity_max": 3
}
```

**Réponse :** `201`

---

## 4.4 `PUT /api/vehicle-categories/:id` — Modifier une catégorie

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/vehicle-categories/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "label": "Pick-up (modifié)",
  "capacity_max": 5
}
```
> Au moins 1 champ.

**Réponse :** `200`

---

## 4.5 `DELETE /api/vehicle-categories/:id` — Supprimer une catégorie

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/vehicle-categories/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 5. VEHICLES — Véhicules

## 5.1 `GET /api/vehicles` — Liste des véhicules (filtres)

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/vehicles?is_available=1&category_id=1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `driver_id`, `category_id`, `is_available` (0 ou 1)

**Réponse :** `200`

---

## 5.2 `GET /api/vehicles/driver/:driverId` — Véhicules d'un chauffeur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/vehicles/driver/2
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 5.3 `GET /api/vehicles/:id` — Un véhicule

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/vehicles/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 5.4 `POST /api/vehicles` — Créer un véhicule

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/vehicles
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "driver_id": 2,
  "category_id": 1,
  "plate": "A 123 BC"
}
```

**Réponse :** `201`

---

## 5.5 `PUT /api/vehicles/:id` — Modifier un véhicule

**Accès :** Bearer + rôle **chauffeur** + propriétaire du véhicule (ou `admin`)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/vehicles/1
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "plate": "B 456 CD",
  "is_available": 1
}
```
> `is_available` = `0` | `1`

**Réponse :** `200` · `403` si ce n'est pas votre véhicule

---

## 5.6 `DELETE /api/vehicles/:id` — Supprimer un véhicule

**Accès :** Bearer + rôle **chauffeur** + propriétaire du véhicule (ou `admin`)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/vehicles/1
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
```

**Réponse :** `200`

---
---

# 6. TRANSPORT — Demandes de transport

## 6.1 `GET /api/requests` — Liste des demandes

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/requests?status=published
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `status` (published, accepted, in_progress, delivered, cancelled, expired), `requester_id`, `material_id`

**Réponse :** `200`

---

## 6.2 `GET /api/requests/:id` — Une demande

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/requests/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 6.3 `POST /api/requests` — Publier une demande

**Accès :** Bearer + rôle **proprietaire** ou **fournisseur**

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/requests
```

**Headers :**
```text
Authorization: Bearer {{token_proprietaire}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "material_id": 1,
  "pickup_landmark_id": 1,
  "dest_landmark_id": 2,
  "pickup_address": "Bujumbura - Plateau",
  "dest_address": "Bujumbura - Cibitoke",
  "quantity_tons": 5
}
```
> `material_id` et `quantity_tons` obligatoires.
> `requester_id` est pris automatiquement sur le token (jamais dans le body).

**Réponse :** `201`

---

## 6.4 `PUT /api/requests/:id` — Modifier une demande

**Accès :** Bearer + rôle **proprietaire** ou **fournisseur** + **auteur de la demande**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/requests/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "status": "in_progress",
  "dest_address": "Nouvelle adresse"
}
```
> `status` = published | accepted | in_progress | delivered | cancelled | expired
> Impossible si la demande est déjà `delivered` ou `cancelled`.

**Réponse :** `200` · `403` si pas votre demande

---

## 6.5 `PUT /api/requests/:id/cancel` — Annuler une demande

**Accès :** Bearer + rôle **proprietaire** ou **fournisseur** + auteur

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/requests/1/cancel
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> **Aucun body.**

**Réponse :** `200`

---

## 6.6 `DELETE /api/requests/:id` — Supprimer une demande

**Accès :** Bearer + rôle **proprietaire** ou **fournisseur** + auteur

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/requests/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Seulement si `status = published` sinon `409`.

**Réponse :** `200`

---
---

# 7. TRANSPORT — Assignations

## 7.1 `GET /api/assignments` — Liste des assignations

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/assignments?driver_id=2
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `driver_id`, `request_id`

**Réponse :** `200`

---

## 7.2 `GET /api/assignments/:id` — Une assignation

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/assignments/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 7.3 `POST /api/assignments` — Accepter une demande (chauffeur)

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/assignments
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "request_id": 1,
  "vehicle_id": 1
}
```
> La demande doit être `published`, sinon `409`.
> `driver_id` vient du token (jamais du body).

**Réponse :** `201`

---
---

# 8. DELIVERIES — Livraisons

## 8.1 `GET /api/deliveries` — Liste des livraisons

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/deliveries?status=en_route
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `status` (accepted, loading, en_route, delivered), `assignment_id`

**Réponse :** `200`

---

## 8.2 `GET /api/deliveries/active/:driverId` — Livraison active d'un chauffeur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/deliveries/active/2
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` → `data` = objet ou `null`

---

## 8.3 `GET /api/deliveries/:id` — Une livraison

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/deliveries/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 8.4 `POST /api/deliveries` — Démarrer une livraison

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/deliveries
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "assignment_id": 1
}
```

**Réponse :** `201`

---

## 8.5 `PUT /api/deliveries/:id` — Mettre à jour l'avancement

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/deliveries/1
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "status": "en_route",
  "progress_pct": 60,
  "distance_km": 12.5,
  "eta_min": 25
}
```
> `status` = accepted | loading | en_route | delivered
> `progress_pct` = 0 à 100 · Au moins 1 champ.

**Réponse :** `200`

---

## 8.6 `PUT /api/deliveries/:id/complete` — Terminer la livraison

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/deliveries/1/complete
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
```
> **Aucun body.**

**Réponse :** `200`

---

## 8.7 `DELETE /api/deliveries/:id` — Supprimer une livraison

**Accès :** Bearer + rôle **chauffeur**

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/deliveries/1
```

**Headers :**
```text
Authorization: Bearer {{token_chauffeur}}
```

**Réponse :** `200`

---
---

# 9. MATERIALS — Marchandises

## 9.1 `GET /api/materials` — Liste des marchandises

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/materials
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 9.2 `GET /api/materials/:id` — Une marchandise

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/materials/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 9.3 `POST /api/materials` — Créer une marchandise

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/materials
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "name": "Ciment"
}
```

**Réponse :** `201`

---

## 9.4 `PUT /api/materials/:id` — Modifier une marchandise

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/materials/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "name": "Ciment CPJ 45"
}
```
> Au moins 1 champ.

**Réponse :** `200`

---

## 9.5 `DELETE /api/materials/:id` — Supprimer une marchandise

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/materials/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 10. LANDMARKS — Repères géographiques

## 10.1 `GET /api/landmarks` — Liste des repères

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/landmarks?zone=Bujumbura&limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `zone`, `is_active` (0/1), `limit` (max 100), `offset`

**Réponse :** `200`

---

## 10.2 `GET /api/landmarks/search` — Recherche par nom

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/landmarks/search?q=port
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> `q` obligatoire, min. 2 caractères.

**Réponse :** `200`

---

## 10.3 `GET /api/landmarks/nearby` — Repères proches (geo)

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/landmarks/nearby?lat=-3.38&lng=29.36&radius_km=10
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> `lat` et `lng` obligatoires · `radius_km` défaut 5 (max 500) · `limit` défaut 10

**Réponse :** `200`

---

## 10.4 `GET /api/landmarks/:id` — Un repère

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/landmarks/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 10.5 `POST /api/landmarks` — Créer un repère

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/landmarks
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "name": "Port fluvial",
  "zone": "Bujumbura",
  "lat": -3.3822,
  "lng": 29.3644,
  "is_active": true
}
```

**Réponse :** `201`

---

## 10.6 `PUT /api/landmarks/:id` — Modifier un repère

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/landmarks/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "zone": "Bujumbura Nord",
  "is_active": false
}
```
> Au moins 1 champ.

**Réponse :** `200`

---

## 10.7 `DELETE /api/landmarks/:id` — Supprimer un repère

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/landmarks/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 11. COMPANIES — Sociétés

## 11.1 `GET /api/companies` — Liste des sociétés

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/companies?limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `search`, `limit`, `offset`

**Réponse :** `200`

---

## 11.2 `GET /api/companies/search` — Recherche par nom

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/companies/search?q=SARL
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 11.3 `GET /api/companies/:id` — Une société

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/companies/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 11.4 `GET /api/companies/:id/drivers` — Chauffeurs d'une société

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/companies/1/drivers
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 11.5 `POST /api/companies` — Créer une société

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/companies
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "name": "SARL Transport Pro",
  "registry_doc": "Reg-12345"
}
```

**Réponse :** `201`

---

## 11.6 `PUT /api/companies/:id` — Modifier une société

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/companies/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "name": "SARL Transport Plus"
}
```

**Réponse :** `200`

---

## 11.7 `DELETE /api/companies/:id` — Supprimer une société

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/companies/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 12. MESSAGING — Messagerie

## 12.1 `GET /api/conversations` — Mes conversations

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/conversations
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 12.2 `POST /api/conversations` — Créer / obtenir une conversation

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/conversations
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "request_id": 1,
  "driver_id": 2,
  "owner_id": 3
}
```
> `driver_id` et `owner_id` obligatoires · `request_id` optionnel (ou `null`)

**Réponse :** `201`

---

## 12.3 `GET /api/conversations/:id` — Détails d'une conversation

**Accès :** Bearer — participant de la conversation

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/conversations/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 12.4 `GET /api/conversations/:id/messages` — Historique des messages

**Accès :** Bearer — participant

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/conversations/1/messages?limit=50&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> `limit` max 100 (défaut 50) · `offset` défaut 0

**Réponse :** `200`

---

## 12.5 `POST /api/conversations/:id/messages` — Envoyer un message

**Accès :** Bearer — participant

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/conversations/1/messages
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "content": "Bonjour, la marchandise est prête ?"
}
```
> `content` obligatoire (non vide) · `sender_id` vient du token.

**Réponse :** `201`

---

## 12.6 `PUT /api/conversations/:id/read` — Marquer la conversation comme lue

**Accès :** Bearer — participant

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/conversations/1/read
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> **Aucun body.**

**Réponse :** `200`

---

## 12.7 `PUT /api/messages/:id/read` — Marquer un message comme lu

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/messages/1/read
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> Ici `:id` = **id du MESSAGE** (pas de la conversation).
> **Aucun body.**

**Réponse :** `200`

---
---

# 13. NOTIFICATIONS — Notifications

## 13.1 `GET /api/notifications` — Mes notifications

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/notifications?is_read=0&limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `user_id`, `is_read` (0/1), `limit` (max 100), `offset`
> Liste toujours filtrée sur l'utilisateur connecté.

**Réponse :** `200`

---

## 13.2 `GET /api/notifications/unread/count` — Nombre non lues

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/notifications/unread/count
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` → `data` = compteur

---

## 13.3 `POST /api/notifications` — Créer une notification

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/notifications
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "user_id": 3,
  "type": "message",
  "title": "Nouveau message",
  "body": "Vous avez reçu un message du chauffeur"
}
```
> `type` = `new_offer` | `offer_accepted` | `delivery_update` | `message` | `payment` | `system`
> `body` optionnel (max 500 car.)

**Réponse :** `201`

---

## 13.4 `PUT /api/notifications/read-all` — Tout marquer comme lu

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/notifications/read-all
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> **Aucun body.** Route fixe (avant `/:id/read`).

**Réponse :** `200`

---

## 13.5 `PUT /api/notifications/:id/read` — Marquer une comme lue

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/notifications/1/read
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> **Aucun body.**

**Réponse :** `200`

---

## 13.6 `DELETE /api/notifications/:id` — Supprimer une notification

**Accès :** Bearer (propriétaire de la notification)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/notifications/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 14. PAYMENTS — Paiements

## 14.1 `GET /api/payment-methods` — Liste des moyens de paiement

**Accès :** Bearer (les siens, ou `admin` pour tout voir)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/payment-methods?limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `user_id`, `limit`, `offset`

**Réponse :** `200` → `data` + `pagination`

---

## 14.2 `GET /api/payment-methods/:id` — Un moyen de paiement

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/payment-methods/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` · `403` si pas le propriétaire

---

## 14.3 `POST /api/payment-methods` — Ajouter un moyen de paiement

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/payment-methods
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "provider": "lumicash",
  "phone": "+25779111222",
  "is_default": true
}
```
> `provider` = `lumicash` | `leo` | `bancobu` | `bcb` | `bank`
> Pour `bcb`/`bank` : utiliser `bank_name` + `account_number` au lieu de `phone`.

**Réponse :** `201`

---

## 14.4 `PUT /api/payment-methods/:id` — Modifier un moyen de paiement

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/payment-methods/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "phone": "+25779555666"
}
```
> Au moins 1 champ.

**Réponse :** `200`

---

## 14.5 `PUT /api/payment-methods/:id/default` — Définir par défaut

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/payment-methods/1/default
```

**Headers :**
```text
Authorization: Bearer {{token}}
```
> **Aucun body.**

**Réponse :** `200`

---

## 14.6 `DELETE /api/payment-methods/:id` — Supprimer un moyen de paiement

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/payment-methods/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 14.7 `GET /api/transactions` — Liste des transactions

**Accès :** Bearer (les siennes, ou `admin`)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/transactions?status=pending&limit=5
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `user_id`, `type`, `status`, `limit`, `offset`

**Réponse :** `200` → `data` + `pagination`

---

## 14.8 `GET /api/transactions/:id` — Une transaction

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/transactions/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` · `403` si pas le propriétaire

---

## 14.9 `POST /api/transactions` — Créer une transaction

**Accès :** Bearer (tout rôle connecté)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/transactions
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "type": "publish_fee",
  "amount_fbu": 1000,
  "method_id": 1,
  "request_id": 1,
  "reference": "REF-001"
}
```
> `type` = `publish_fee` | `driver_fee` | `refund` (obligatoire)
> `amount_fbu` > 0 (obligatoire) · `status` défaut `pending`

**Réponse :** `201`

---

## 14.10 `PUT /api/transactions/:id/status` — Changer le statut

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/transactions/1/status
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "status": "completed",
  "reference": "LUMI-998877"
}
```
> `status` = `pending` | `completed` | `failed` | `cancelled` (obligatoire)

**Réponse :** `200`

---
---

# 15. REVIEWS — Avis

## 15.1 `POST /api/reviews` — Créer un avis

**Accès :** Bearer — participant à la livraison (demandeur ou chauffeur)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/reviews
```

**Headers :**
```text
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body → raw → JSON :**
```json
{
  "delivery_id": 1,
  "rating": 5,
  "comment": "Excellent chauffeur, très ponctuel"
}
```
> Il faut **une livraison/demande** (`delivery_id` ou `request_id`) **ET une note** (`rating` ou `score`, 1 à 5).
> La livraison doit être `delivered`, sinon `400`.

**Réponse :** `201`

---

## 15.2 `GET /api/reviews` — Liste des avis

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews?limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `rated_id`, `rater_id`, `request_id`, `limit`, `offset`

**Réponse :** `200`

---

## 15.3 `GET /api/reviews/me` — Avis que j'ai laissés

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews/me
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 15.4 `GET /api/reviews/my-reviews` — Alias de `/me`

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews/my-reviews
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 15.5 `GET /api/reviews/user/:userId/stats` — Note moyenne d'un utilisateur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews/user/2/stats
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` → moyenne + nombre d'avis

---

## 15.6 `GET /api/reviews/user/:userId` — Avis reçus par un utilisateur

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews/user/2?limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 15.7 `GET /api/reviews/delivery/:deliveryId` — Avis d'une livraison

**Accès :** Bearer (tout rôle)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/reviews/delivery/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 15.8 `DELETE /api/reviews/:id` — Supprimer un avis

**Accès :** Bearer — auteur de l'avis ou `admin`

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/reviews/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200` · `403` si pas l'auteur

---
---

# 16. DOCUMENTS — Documents

## 16.1 `GET /api/documents` — Liste des documents

**Accès :** Bearer (les siens, ou `admin` pour tout voir)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/documents?status=pending&limit=5&offset=0
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

> Filtres : `user_id`, `status` (pending/approved/rejected), `doc_type`, `limit`, `offset`

**Réponse :** `200` → `data` + `pagination`

---

## 16.2 `GET /api/documents/:id` — Un document

**Accès :** Bearer (propriétaire ou `admin`)

**URL à copier (Postman) :**
```text
GET https://tele.nufotec.com//api/documents/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---

## 16.3 `POST /api/documents` — Téléverser un document

**Accès :** Bearer (pour soi-même, ou `admin` pour un autre)

**URL à copier (Postman) :**
```text
POST https://tele.nufotec.com//api/documents
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Body → form-data :**

| Clé | Type | Valeur |
| --- | ---- | ------ |
| `doc_type` | Text | `driver_license` |
| `file` | **File** | choisir une image ou PDF |

> `doc_type` = `id_card` | `passport` | `driver_license` | `registry`
> Fichiers acceptés : `.jpg .jpeg .png .webp .pdf` · max 5 Mo
> (Ne pas mettre Content-Type manuellement, Postman le fait.)

**Réponse :** `201`

---

## 16.4 `PUT /api/documents/:id/approve` — Approuver

**Accès :** Bearer + rôle **admin**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/documents/1/approve
```

**Headers :**
```text
Authorization: Bearer {{token_admin}}
```
> **Aucun body.**

**Réponse :** `200` · `403` si pas admin

---

## 16.5 `PUT /api/documents/:id/reject` — Rejeter

**Accès :** Bearer + rôle **admin**

**URL à copier (Postman) :**
```text
PUT https://tele.nufotec.com//api/documents/1/reject
```

**Headers :**
```text
Authorization: Bearer {{token_admin}}
```
> **Aucun body.**

**Réponse :** `200` · `403` si pas admin

---

## 16.6 `DELETE /api/documents/:id` — Supprimer un document

**Accès :** Bearer — propriétaire du document ou `admin`

**URL à copier (Postman) :**
```text
DELETE https://tele.nufotec.com//api/documents/1
```

**Headers :**
```text
Authorization: Bearer {{token}}
```

**Réponse :** `200`

---
---

# 📌 Notes utiles

- **Serveur** : `npm run dev` (port `30003` défini dans `.env`).
- **Base URL publique** : `https://ai.tele.nufotec.com/api`
- **Compte admin** : `node scripts/create-admin.js` (après migration `src/migrations/005_add_admin_role.sql`).
- Toutes les routes sont protégées sauf `POST /auth/register`, `POST /auth/login` et `POST /auth/refresh`.
- Les blocs `GET`/`PUT`/`DELETE` marqués **« Aucun body »** doivent être envoyés sans body (ou `Body → none`).

## Ordre de test recommandé (chaîne complète)

1. `POST /api/auth/register` → `POST /api/auth/login` (récupérer `token`)
2. `POST /api/materials` → `POST /api/landmarks` (×2)
3. `POST /api/requests` (proprietaire)
4. `POST /api/vehicle-categories` → `POST /api/vehicles` (chauffeur)
5. `POST /api/assignments` (chauffeur) → la demande passe en `accepted`
6. `POST /api/deliveries` → `PUT /api/deliveries/:id` → `PUT /api/deliveries/:id/complete`
7. `POST /api/reviews` (livraison `delivered`)
8. `POST /api/conversations` → `POST /api/conversations/:id/messages`
