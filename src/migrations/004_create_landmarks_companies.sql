CREATE TABLE IF NOT EXISTS landmarks (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    category   VARCHAR(100) DEFAULT NULL,
    commune    VARCHAR(100) DEFAULT NULL,
    latitude   DOUBLE NOT NULL,
    longitude  DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_landmark_commune  (commune),
    INDEX idx_landmark_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO landmarks (name, category, commune, latitude, longitude) VALUES
('Marché Central de Bujumbura',   'marché',     'Bujumbura Centre', -3.3864, 29.3615),
('Hôpital Prince Régent Charles', 'hôpital',    'Rohero',           -3.3849, 29.3711),
('Campus Mutanga',                'université', 'Mutanga',          -3.4053, 29.3534),
('Quartier Kinindo',              'quartier',   'Kinindo',          -3.4321, 29.3502),
('Quartier Kanyosha',             'quartier',   'Kanyosha',         -3.4512, 29.3714),
('BANCOBU Siège',                 'banque',     'Rohero',           -3.3858, 29.3688),
('BCB Siège',                     'banque',     'Centre',           -3.3901, 29.3622);
