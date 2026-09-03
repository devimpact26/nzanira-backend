-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 30 août 2026 à 13:34
-- Version du serveur : 9.1.0
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `nzanira`
--

-- --------------------------------------------------------

--
-- Structure de la table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registry_doc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id` int UNSIGNED DEFAULT NULL,
  `driver_id` int UNSIGNED NOT NULL,
  `owner_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_conv` (`request_id`,`driver_id`,`owner_id`),
  KEY `driver_id` (`driver_id`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `request_id`, `driver_id`, `owner_id`, `created_at`) VALUES
(1, 1, 2, 1, '2026-08-14 07:17:56');

-- --------------------------------------------------------

--
-- Structure de la table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` int UNSIGNED NOT NULL,
  `status` enum('accepted','loading','en_route','delivered') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'accepted',
  `progress_pct` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `current_landmark` int UNSIGNED DEFAULT NULL,
  `distance_km` decimal(6,2) DEFAULT NULL,
  `eta_min` smallint UNSIGNED DEFAULT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assignment_id` (`assignment_id`),
  KEY `current_landmark` (`current_landmark`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `deliveries`
--

INSERT INTO `deliveries` (`id`, `assignment_id`, `status`, `progress_pct`, `current_landmark`, `distance_km`, `eta_min`, `started_at`, `delivered_at`) VALUES
(1, 1, 'en_route', 35, NULL, 3.40, 12, '2026-08-14 07:17:55', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `driver_locations`
--

DROP TABLE IF EXISTS `driver_locations`;
CREATE TABLE IF NOT EXISTS `driver_locations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `driver_id` int UNSIGNED NOT NULL,
  `lat` decimal(9,6) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  `speed_kmh` smallint UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_driver_loc` (`driver_id`,`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `driver_profiles`
--

DROP TABLE IF EXISTS `driver_profiles`;
CREATE TABLE IF NOT EXISTS `driver_profiles` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `work_status` enum('independent','company') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'independent',
  `company_id` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `driver_profiles`
--

INSERT INTO `driver_profiles` (`id`, `user_id`, `work_status`, `company_id`, `created_at`) VALUES
(1, 2, 'independent', NULL, '2026-08-14 07:17:55'),
(2, 3, 'independent', NULL, '2026-08-14 07:17:55'),
(3, 4, 'independent', NULL, '2026-08-14 07:17:55'),
(4, 6, 'independent', NULL, '2026-08-14 07:17:55'),
(5, 7, 'independent', NULL, '2026-08-14 07:17:55'),
(6, 8, 'independent', NULL, '2026-08-14 07:17:55'),
(7, 9, 'independent', NULL, '2026-08-14 07:17:55');

-- --------------------------------------------------------

--
-- Structure de la table `landmarks`
--

DROP TABLE IF EXISTS `landmarks`;
CREATE TABLE IF NOT EXISTS `landmarks` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` decimal(9,6) DEFAULT NULL,
  `lng` decimal(9,6) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `landmarks`
--

INSERT INTO `landmarks` (`id`, `name`, `zone`, `lat`, `lng`, `is_active`) VALUES
(1, 'Marché Central', 'Bujumbura Centre', NULL, NULL, 1),
(2, 'Campus Mutanga', 'Mutanga', NULL, NULL, 1),
(3, 'Hôpital Prince Régent', 'Rohero', NULL, NULL, 1),
(4, 'Rohero', 'Rohero', NULL, NULL, 1),
(5, 'Kinindo', 'Kinindo', NULL, NULL, 1),
(6, 'Kanyosha', 'Kanyosha', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `materials`
--

DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `materials`
--

INSERT INTO `materials` (`id`, `name`) VALUES
(4, 'Acier'),
(5, 'Briques'),
(1, 'Ciment'),
(3, 'Gravier'),
(2, 'Sable');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` int UNSIGNED NOT NULL,
  `sender_id` int UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `idx_msg_conv` (`conversation_id`,`sent_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `is_read`, `sent_at`) VALUES
(1, 1, 2, 'Bonjour, je suis à 10 minutes du Marché Central.', 1, '2026-08-14 07:17:56'),
(2, 1, 1, 'Parfait, je vous attends près de l\'entrée principale.', 1, '2026-08-14 07:17:56'),
(3, 1, 2, 'Reçu ✅ J\'arrive bientôt.', 0, '2026-08-14 07:17:56');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `type` enum('new_offer','offer_accepted','delivery_update','message','payment','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`,`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `body`, `is_read`, `created_at`) VALUES
(1, 1, 'delivery_update', 'Votre camion est en route', 'Jean Bosco livre vos briques — ETA 12 min.', 0, '2026-08-14 07:17:56');

-- --------------------------------------------------------

--
-- Structure de la table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `provider` enum('lumicash','leo','bancobu','bcb','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `user_id`, `provider`, `phone`, `bank_name`, `account_number`, `is_default`, `created_at`) VALUES
(1, 1, 'lumicash', '+257 79 000 000', NULL, NULL, 1, '2026-08-14 07:17:56'),
(2, 2, 'leo', '+257 79 111 111', NULL, NULL, 1, '2026-08-14 07:17:56');

-- --------------------------------------------------------

--
-- Structure de la table `request_assignments`
--

DROP TABLE IF EXISTS `request_assignments`;
CREATE TABLE IF NOT EXISTS `request_assignments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id` int UNSIGNED NOT NULL,
  `driver_id` int UNSIGNED NOT NULL,
  `vehicle_id` int UNSIGNED NOT NULL,
  `accepted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  KEY `driver_id` (`driver_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `request_assignments`
--

INSERT INTO `request_assignments` (`id`, `request_id`, `driver_id`, `vehicle_id`, `accepted_at`) VALUES
(1, 1, 2, 1, '2026-08-14 07:17:55');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_id` int UNSIGNED NOT NULL,
  `rater_id` int UNSIGNED NOT NULL,
  `rated_id` int UNSIGNED NOT NULL,
  `score` tinyint UNSIGNED NOT NULL DEFAULT '5',
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_review` (`request_id`,`rater_id`,`rated_id`),
  KEY `rater_id` (`rater_id`),
  KEY `rated_id` (`rated_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reviews`
--

INSERT INTO `reviews` (`id`, `request_id`, `rater_id`, `rated_id`, `score`, `comment`, `created_at`) VALUES
(1, 1, 1, 2, 5, NULL, '2026-08-14 07:17:56');

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `request_id` int UNSIGNED DEFAULT NULL,
  `method_id` int UNSIGNED DEFAULT NULL,
  `type` enum('publish_fee','driver_fee','refund') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_fbu` decimal(12,2) NOT NULL,
  `status` enum('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reference` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `request_id` (`request_id`),
  KEY `method_id` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `transport_requests`
--

DROP TABLE IF EXISTS `transport_requests`;
CREATE TABLE IF NOT EXISTS `transport_requests` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `requester_id` int UNSIGNED NOT NULL,
  `material_id` int UNSIGNED NOT NULL,
  `pickup_landmark_id` int UNSIGNED DEFAULT NULL,
  `dest_landmark_id` int UNSIGNED DEFAULT NULL,
  `pickup_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dest_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity_tons` decimal(6,2) NOT NULL,
  `status` enum('published','accepted','in_progress','delivered','cancelled','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `published_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requester_id` (`requester_id`),
  KEY `material_id` (`material_id`),
  KEY `dest_landmark_id` (`dest_landmark_id`),
  KEY `idx_requests_status` (`status`),
  KEY `idx_requests_zone` (`pickup_landmark_id`,`dest_landmark_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `transport_requests`
--

INSERT INTO `transport_requests` (`id`, `requester_id`, `material_id`, `pickup_landmark_id`, `dest_landmark_id`, `pickup_address`, `dest_address`, `quantity_tons`, `status`, `published_at`, `expires_at`) VALUES
(1, 1, 5, 1, 2, NULL, NULL, 4.20, 'accepted', '2026-08-14 07:17:55', NULL),
(2, 5, 3, 6, 3, NULL, NULL, 6.00, 'published', '2026-08-14 07:17:55', NULL),
(3, 1, 4, 4, 5, NULL, NULL, 2.80, 'published', '2026-08-14 07:17:55', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('chauffeur','proprietaire','fournisseur') COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('fr','en','sw','rw','rn') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fr',
  `theme` enum('dark','light') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dark',
  `gps_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `password_hash`, `role`, `lang`, `theme`, `gps_enabled`, `is_verified`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Éric Ndayishimiye', '+257 79 000 000', NULL, '$2y$10$demo', 'proprietaire', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(2, 'Jean Bosco N.', '+257 79 111 111', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(3, 'Diomède H.', '+257 79 222 222', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(4, 'Aline K.', '+257 79 333 333', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(5, 'MUSUMBA Steel', '+257 79 444 444', NULL, '$2y$10$demo', 'fournisseur', 'fr', 'dark', 0, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(6, 'Salvator I.', '+257 79 555 555', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(7, 'Providence M.', '+257 79 666 666', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(8, 'Léonce B.', '+257 79 777 777', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55'),
(9, 'Espérance N.', '+257 79 888 888', NULL, '$2y$10$demo', 'chauffeur', 'fr', 'dark', 1, 1, 1, '2026-08-14 07:17:55', '2026-08-14 07:17:55');

-- --------------------------------------------------------

--
-- Structure de la table `user_documents`
--

DROP TABLE IF EXISTS `user_documents`;
CREATE TABLE IF NOT EXISTS `user_documents` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `doc_type` enum('id_card','passport','driver_license','registry') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `driver_id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `plate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plate` (`plate`),
  KEY `driver_id` (`driver_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `vehicles`
--

INSERT INTO `vehicles` (`id`, `driver_id`, `category_id`, `plate`, `is_available`, `created_at`) VALUES
(1, 2, 2, 'B 1187 D', 1, '2026-08-14 07:17:55'),
(2, 3, 1, 'B 2290 C', 1, '2026-08-14 07:17:55'),
(3, 4, 1, 'B 7715 B', 1, '2026-08-14 07:17:55'),
(4, 6, 2, 'B 9042 A', 1, '2026-08-14 07:17:55'),
(5, 7, 2, 'B 3358 E', 1, '2026-08-14 07:17:55'),
(6, 8, 3, 'B 5567 F', 1, '2026-08-14 07:17:55'),
(7, 9, 3, 'B 6620 G', 1, '2026-08-14 07:17:55');

-- --------------------------------------------------------

--
-- Structure de la table `vehicle_categories`
--

DROP TABLE IF EXISTS `vehicle_categories`;
CREATE TABLE IF NOT EXISTS `vehicle_categories` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity_min` decimal(6,2) NOT NULL,
  `capacity_max` decimal(6,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `vehicle_categories`
--

INSERT INTO `vehicle_categories` (`id`, `code`, `label`, `capacity_min`, `capacity_max`) VALUES
(1, 'pickup', 'Pick-up', 1.00, 2.00),
(2, 'medium', 'Camion moyen', 4.00, 6.00),
(3, 'semi', 'Semi-remorque', 10.00, 25.00);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `transport_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `request_assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`current_landmark`) REFERENCES `landmarks` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `driver_locations`
--
ALTER TABLE `driver_locations`
  ADD CONSTRAINT `driver_locations_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `driver_profiles`
--
ALTER TABLE `driver_profiles`
  ADD CONSTRAINT `driver_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `driver_profiles_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `request_assignments`
--
ALTER TABLE `request_assignments`
  ADD CONSTRAINT `request_assignments_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `transport_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `request_assignments_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `request_assignments_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `transport_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`rater_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`rated_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `transport_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `transport_requests`
--
ALTER TABLE `transport_requests`
  ADD CONSTRAINT `transport_requests_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transport_requests_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `transport_requests_ibfk_3` FOREIGN KEY (`pickup_landmark_id`) REFERENCES `landmarks` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transport_requests_ibfk_4` FOREIGN KEY (`dest_landmark_id`) REFERENCES `landmarks` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `user_documents`
--
ALTER TABLE `user_documents`
  ADD CONSTRAINT `user_documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `vehicle_categories` (`id`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
