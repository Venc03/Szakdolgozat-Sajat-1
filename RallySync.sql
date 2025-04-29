-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2025 at 07:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `versenyek`
--

-- --------------------------------------------------------

--
-- Table structure for table `brandtypes`
--

CREATE TABLE `brandtypes` (
  `bt_id` bigint(20) UNSIGNED NOT NULL,
  `brandtype` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brandtypes`
--

INSERT INTO `brandtypes` (`bt_id`, `brandtype`, `created_at`, `updated_at`) VALUES
(1, 'Skoda Fabia', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(2, 'Skoda Fabia RS', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(3, 'Citroen C3', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(4, 'Ford Puma', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(5, 'Peugeot 208', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(6, 'Hyundai i20 N', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(7, 'Ford Fiesta', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(8, 'Renault Clio', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(9, 'Volkswagen Polo', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(10, 'Toyota GR Yaris', '2025-04-29 15:25:34', '2025-04-29 15:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `cid` bigint(20) UNSIGNED NOT NULL,
  `brandtype` bigint(20) UNSIGNED NOT NULL,
  `category` bigint(20) UNSIGNED NOT NULL,
  `status` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categ_id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categ_id`, `category`, `created_at`, `updated_at`) VALUES
(1, 'Rally1', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(2, 'Rally2', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(3, 'Rally3', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(4, 'Rally4', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(5, 'Rally5', '2025-04-29 15:25:34', '2025-04-29 15:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `compcategs`
--

CREATE TABLE `compcategs` (
  `coca_id` bigint(20) UNSIGNED NOT NULL,
  `competition` bigint(20) UNSIGNED NOT NULL,
  `category` bigint(20) UNSIGNED NOT NULL,
  `min_entry` int(11) NOT NULL,
  `max_entry` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `compeets`
--

CREATE TABLE `compeets` (
  `competitor` bigint(20) UNSIGNED NOT NULL,
  `competition` bigint(20) UNSIGNED NOT NULL,
  `car` bigint(20) UNSIGNED NOT NULL,
  `arrives_at` datetime NOT NULL,
  `start_date` datetime NOT NULL,
  `finish_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `competitions`
--

CREATE TABLE `competitions` (
  `comp_id` bigint(20) UNSIGNED NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `place` bigint(20) UNSIGNED NOT NULL,
  `organiser` bigint(20) UNSIGNED NOT NULL,
  `description` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enlistments`
--

CREATE TABLE `enlistments` (
  `competitor` bigint(20) UNSIGNED NOT NULL,
  `competition` bigint(20) UNSIGNED NOT NULL,
  `category` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `perm_id` bigint(20) UNSIGNED NOT NULL,
  `permission` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`perm_id`, `permission`, `created_at`, `updated_at`) VALUES
(1, 'versenyző', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(2, 'szervező', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(3, 'adminisztrátor', '2025-04-29 15:25:34', '2025-04-29 15:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `plac_id` bigint(20) UNSIGNED NOT NULL,
  `place` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `stat_id` bigint(20) UNSIGNED NOT NULL,
  `statsus` char(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`stat_id`, `statsus`, `created_at`, `updated_at`) VALUES
(1, 'Szabad', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(2, 'Foglalt', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(3, 'Pályán', '2025-04-29 15:25:34', '2025-04-29 15:25:34'),
(4, 'Szervízelés alatt', '2025-04-29 15:25:34', '2025-04-29 15:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `permission` bigint(20) UNSIGNED NOT NULL DEFAULT 1,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `permission`, `password`, `image`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@mamail.eu', NULL, 3, '$2y$12$cj6WSiUzsr72rMq8arvE9ek5R8UZdbAnD4vmtm5QhhoTpS9o/8NiC', NULL, NULL, '2025-04-29 15:25:35', '2025-04-29 15:25:35'),
(2, 'felhasznalo', 'felh@mamail.eu', NULL, 1, '$2y$12$Q0G.DvUnQBxb4VlbYueL/eQJjv/GfJBUZn.cnZmWsvL2o3ZyFCOGG', NULL, NULL, '2025-04-29 15:25:35', '2025-04-29 15:25:35'),
(3, 'szervezo', 'szerv@mamail.eu', NULL, 2, '$2y$12$atm4CDi5jHfgwE07CyM2F.eB8z3G5Z.SbduptiEApF0e9eSkLkz.K', NULL, NULL, '2025-04-29 15:25:35', '2025-04-29 15:25:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brandtypes`
--
ALTER TABLE `brandtypes`
  ADD PRIMARY KEY (`bt_id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `cars_brandtype_foreign` (`brandtype`),
  ADD KEY `cars_category_foreign` (`category`),
  ADD KEY `cars_status_foreign` (`status`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categ_id`);

--
-- Indexes for table `compcategs`
--
ALTER TABLE `compcategs`
  ADD PRIMARY KEY (`coca_id`),
  ADD KEY `compcategs_competition_foreign` (`competition`),
  ADD KEY `compcategs_category_foreign` (`category`);

--
-- Indexes for table `compeets`
--
ALTER TABLE `compeets`
  ADD KEY `compeets_competitor_foreign` (`competitor`),
  ADD KEY `compeets_competition_foreign` (`competition`),
  ADD KEY `compeets_car_foreign` (`car`);

--
-- Indexes for table `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`comp_id`),
  ADD KEY `competitions_place_foreign` (`place`),
  ADD KEY `competitions_organiser_foreign` (`organiser`);

--
-- Indexes for table `enlistments`
--
ALTER TABLE `enlistments`
  ADD KEY `enlistments_competitor_foreign` (`competitor`),
  ADD KEY `enlistments_competition_foreign` (`competition`),
  ADD KEY `enlistments_category_foreign` (`category`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`perm_id`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`plac_id`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`stat_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_permission_foreign` (`permission`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brandtypes`
--
ALTER TABLE `brandtypes`
  MODIFY `bt_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `cid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categ_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `compcategs`
--
ALTER TABLE `compcategs`
  MODIFY `coca_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `competitions`
--
ALTER TABLE `competitions`
  MODIFY `comp_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `perm_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `plac_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `stat_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_brandtype_foreign` FOREIGN KEY (`brandtype`) REFERENCES `brandtypes` (`bt_id`),
  ADD CONSTRAINT `cars_category_foreign` FOREIGN KEY (`category`) REFERENCES `categories` (`categ_id`),
  ADD CONSTRAINT `cars_status_foreign` FOREIGN KEY (`status`) REFERENCES `statuses` (`stat_id`);

--
-- Constraints for table `compcategs`
--
ALTER TABLE `compcategs`
  ADD CONSTRAINT `compcategs_category_foreign` FOREIGN KEY (`category`) REFERENCES `categories` (`categ_id`),
  ADD CONSTRAINT `compcategs_competition_foreign` FOREIGN KEY (`competition`) REFERENCES `competitions` (`comp_id`);

--
-- Constraints for table `compeets`
--
ALTER TABLE `compeets`
  ADD CONSTRAINT `compeets_car_foreign` FOREIGN KEY (`car`) REFERENCES `cars` (`cid`) ON DELETE CASCADE,
  ADD CONSTRAINT `compeets_competition_foreign` FOREIGN KEY (`competition`) REFERENCES `enlistments` (`competition`) ON DELETE CASCADE,
  ADD CONSTRAINT `compeets_competitor_foreign` FOREIGN KEY (`competitor`) REFERENCES `enlistments` (`competitor`) ON DELETE CASCADE;

--
-- Constraints for table `competitions`
--
ALTER TABLE `competitions`
  ADD CONSTRAINT `competitions_organiser_foreign` FOREIGN KEY (`organiser`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `competitions_place_foreign` FOREIGN KEY (`place`) REFERENCES `places` (`plac_id`);

--
-- Constraints for table `enlistments`
--
ALTER TABLE `enlistments`
  ADD CONSTRAINT `enlistments_category_foreign` FOREIGN KEY (`category`) REFERENCES `compcategs` (`category`) ON DELETE CASCADE,
  ADD CONSTRAINT `enlistments_competition_foreign` FOREIGN KEY (`competition`) REFERENCES `compcategs` (`competition`) ON DELETE CASCADE,
  ADD CONSTRAINT `enlistments_competitor_foreign` FOREIGN KEY (`competitor`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_permission_foreign` FOREIGN KEY (`permission`) REFERENCES `permissions` (`perm_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
