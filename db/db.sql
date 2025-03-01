DROP DATABASE IF EXISTS AeroModel;
CREATE DATABASE AeroModel;
USE AeroModel;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Providers;
DROP TABLE IF EXISTS Providers_Products;
DROP TABLE IF EXISTS Clients;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Orders_Products;

CREATE TABLE IF NOT EXISTS Categories(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name_category VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Products (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name_product VARCHAR(50) NOT NULL,
    references_product VARCHAR(10) NOT NULL UNIQUE,
    stock INT NOT NULL,
    price FLOAT NOT NULL,
    id_category INT NOT NULL,
    FOREIGN KEY (id_category) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Providers (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name_provider VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Providers_Products (
	id_provider INT NOT NULL,
    id_product INT NOT NULL,
    PRIMARY KEY (id_provider, id_product),
    FOREIGN KEY (id_provider) REFERENCES Providers(id) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES Products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Clients (
	id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Orders (
	id INT PRIMARY KEY AUTO_INCREMENT,
    number_order VARCHAR(10) NOT NULL UNIQUE,
    date_order DATETIME DEFAULT current_timestamp,
    total_price FLOAT,
    id_client INT NOT NULL,
    FOREIGN KEY (id_client) REFERENCES Clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Orders_Products (
	id_order INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id_order, id_product),
    FOREIGN KEY (id_order) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES Products(id) ON DELETE CASCADE
);

-- Insertion de données

-- Table Clients
INSERT INTO Clients (firstname, lastname, email, address) VALUES
("Jean", "Valjean", "jean.valjean@gmail.com", "34 Avenue Francin 87550 Cornay sur marne"),
("Marie", "Curie", "marie.curie@gmail.com", "12 Rue des Lilas 75016 Paris"),
("Paul", "Durand", "paul.durand@gmail.com", "25 Rue des Fleurs 69007 Lyon"),
("Claire", "Martin", "claire.martin@gmail.com", "10 Rue de la Gare 33000 Bordeaux"),
("Alice", "Bernard", "alice.bernard@gmail.com", "5 Avenue des Champs 75008 Paris"),
("Lucas", "Roux", "lucas.roux@gmail.com", "15 Impasse des Roses 67000 Strasbourg"),
("Emma", "Blanc", "emma.blanc@gmail.com", "20 Rue Verte 13001 Marseille"),
("Noah", "Morel", "noah.morel@gmail.com", "30 Allée des Platanes 31000 Toulouse"),
("Sophia", "Garcia", "sophia.garcia@gmail.com", "40 Boulevard des Oliviers 59000 Lille"),
("Ethan", "Petit", "ethan.petit@gmail.com", "50 Place des Érables 21000 Dijon"),
("Mia", "Legrand", "mia.legrand@gmail.com", "60 Rue des Marronniers 45000 Orléans"),
("Louis", "Dupont", "louis.dupont@gmail.com", "70 Avenue des Peupliers 14000 Caen"),
("Olivia", "Fontaine", "olivia.fontaine@gmail.com", "80 Rue des Ormes 72000 Le Mans"),
("Gabriel", "Lambert", "gabriel.lambert@gmail.com", "90 Impasse des Tilleuls 37000 Tours"),
("Isabella", "Benoit", "isabella.benoit@gmail.com", "100 Rue des Sapins 76000 Rouen"),
("Hugo", "Renaud", "hugo.renaud@gmail.com", "110 Boulevard des Pins 38000 Grenoble"),
("Chloe", "Arnaud", "chloe.arnaud@gmail.com", "120 Avenue des Cèdres 80000 Amiens"),
("Leo", "Perrin", "leo.perrin@gmail.com", "130 Place des Bouleaux 25000 Besançon"),
("Emma", "Marchand", "emma.marchand@gmail.com", "140 Rue des Saules 63000 Clermont-Ferrand"),
("Nathan", "Charpentier", "nathan.charpentier@gmail.com", "150 Allée des Peupliers 76000 Rouen"),
("Léa", "Renard", "lea.renard@gmail.com", "160 Rue des Acacias 75020 Paris"),
("Arthur", "Moreau", "arthur.moreau@gmail.com", "170 Boulevard des Chênes 31000 Toulouse"),
("Camille", "Garnier", "camille.garnier@gmail.com", "180 Avenue des Lilas 44000 Nantes"),
("Lucas", "Faure", "lucas.faure@gmail.com", "190 Rue des Églantiers 69003 Lyon"),
("Manon", "Guillaume", "manon.guillaume@gmail.com", "200 Place des Cerisiers 33000 Bordeaux"),
("Jules", "Fabre", "jules.fabre@gmail.com", "210 Rue des Cyprès 13009 Marseille"),
("Nina", "Lemoine", "nina.lemoine@gmail.com", "220 Allée des Bougainvilliers 75015 Paris"),
("Victor", "Royer", "victor.royer@gmail.com", "230 Boulevard des Magnolias 21000 Dijon"),
("Sarah", "Brun", "sarah.brun@gmail.com", "240 Avenue des Hortensias 59000 Lille"),
("Tom", "Girard", "tom.girard@gmail.com", "250 Rue des Azalées 13005 Marseille"),
("Clara", "Poulain", "clara.poulain@gmail.com", "260 Place des Jonquilles 72000 Le Mans"),
("Liam", "Dumont", "liam.dumont@gmail.com", "270 Boulevard des Pivoines 38000 Grenoble"),
("Eva", "Gauthier", "eva.gauthier@gmail.com", "280 Rue des Lilas 80000 Amiens"),
("Adam", "Vidal", "adam.vidal@gmail.com", "290 Allée des Jacarandas 25000 Besançon"),
("Sophie", "Perrot", "sophie.perrot@gmail.com", "300 Rue des Mimosas 63000 Clermont-Ferrand"),
("Oscar", "Bertrand", "oscar.bertrand@gmail.com", "310 Avenue des Sapins 76000 Rouen"),
("Anna", "Colin", "anna.colin@gmail.com", "320 Rue des Cyprès 45000 Orléans"),
("Elliot", "Germain", "elliot.germain@gmail.com", "330 Boulevard des Oliviers 14000 Caen"),
("Lila", "Bailly", "lila.bailly@gmail.com", "340 Allée des Peupliers 75016 Paris"),
("Mathis", "Leger", "mathis.leger@gmail.com", "350 Rue des Érables 31000 Toulouse"),
("Zoé", "Blot", "zoe.blot@gmail.com", "360 Place des Marronniers 59000 Lille"),
("Axel", "Lucas", "axel.lucas@gmail.com", "370 Avenue des Peupliers 75008 Paris"),
("Léna", "Maillard", "lena.maillard@gmail.com", "380 Boulevard des Bouleaux 69007 Lyon"),
("Maxime", "Masson", "maxime.masson@gmail.com", "390 Rue des Pins 33000 Bordeaux"),
("Ava", "Devaux", "ava.devaux@gmail.com", "400 Allée des Tilleuls 13001 Marseille"),
("Théo", "Denis", "theo.denis@gmail.com", "410 Place des Ormes 37000 Tours"),
("Élise", "Robin", "elise.robin@gmail.com", "420 Rue des Sapins 44000 Nantes"),
("Charles", "Baudelaire", "charles.baudelaire@gmail.com", "78 Rue des Fleurs, 13001 Marseille"),
("Victor", "Hugo", "victor.hugo@gmail.com", "12 Place des Poètes, 75004 Paris"),
("Gustave", "Flaubert", "gustave.flaubert@gmail.com", "45 Avenue de la Littérature, 76000 Rouen");
-- Table Categories
INSERT INTO Categories (name_category) VALUES
("Avion de chasse"),
("Avion de ligne"),
("Planeur"),
("Avion historique"),
("Drone"),
("Avion expérimental"),
("Avion de voltige"),
("Avion d'entraînement"),
("Hydravion"),
("Avion civil"),
("Avion militaire"),
("Avion cargo"),
("Avion supersonique"),
("Avion subsonique"),
("Avion de reconnaissance"),
("Avion à hélice"),
("Avion à réaction"),
("Avion de transport"),
("Avion de tourisme"),
("Avion prototype"),
("Avion agricole"),
("Avion ultra-léger"),
("Avion d'observation"),
("Avion de patrouille"),
("Avion amphibie"),
("Avion à long rayon d'action"),
("Avion intercepteur"),
("Avion biplan"),
("Avion triplan"),
("Avion de recherche"),
("Avion cargo lourd"),
("Avion commercial"),
("Avion de liaison"),
("Avion solaire"),
("Avion furtif"),
("Avion supersonique civil"),
("Avion supersonique militaire"),
("Avion supersonique expérimental"),
("Avion de bombardement"),
("Avion d'espionnage"),
("Avion de transport militaire"),
("Avion civil léger"),
("Avion civil moyen-courrier"),
("Avion civil long-courrier"),
("Avion cargo moyen"),
("Avion cargo léger"),
("Avion cargo civil"),
("Avion cargo militaire"),
("Avion drone"),
("Avion d'attaque"),
("Avion supersonique furtif");

-- Table Products
INSERT INTO Products (name_product, references_product, stock, price, id_category) VALUES
("Mirage F1", "1234652025", 45, 12.5, 1),
("Airbus A380", "5432167890", 30, 22.0, 2),
("Super Étendard", "6789012345", 15, 15.0, 1),
("Planeur Albatros", "0987612345", 50, 8.0, 3),
("Boeing 747", "4561237890", 10, 35.0, 2),
("Concorde", "9876543210", 20, 25.0, 4),
("F-16 Fighting Falcon", "4567891230", 40, 18.0, 1),
("Dassault Rafale", "1230984567", 35, 20.0, 1),
("Lockheed SR-71", "7896541230", 5, 50.0, 4),
("Airbus A320", "3216549870", 25, 18.0, 2),
("Boeing 737", "9873214560", 30, 19.0, 2),
("Cessna 172", "6547893210", 60, 10.0, 5),
("Piper PA-28", "1597534560", 40, 9.5, 5),
("B-2 Spirit", "3579514560", 2, 60.0, 6),
("Eurofighter Typhoon", "9517538520", 15, 25.0, 1),
("Antonov An-225", "7891234560", 1, 100.0, 2),
("Embraer E190", "8529513570", 25, 21.0, 2),
("Pilatus PC-12", "1478523690", 50, 12.0, 5),
("Beechcraft Bonanza", "2589631470", 45, 10.0, 5),
("Bombardier Global 7500", "9514567530", 10, 45.0, 2),
("Sukhoi Su-57", "1237894560", 20, 30.0, 1),
("Mikoyan MiG-29", "6543217890", 25, 22.5, 1),
("Douglas DC-3", "8524569510", 15, 18.5, 3),
("Vulcan Bomber", "3574569510", 3, 40.0, 4),
("Lockheed C-130", "2587413690", 18, 25.0, 2),
("Grumman F-14 Tomcat", "1479632580", 12, 30.0, 1),
("Aérospatiale/BAC Concorde", "6548521470", 8, 50.0, 4),
("Learjet 75", "3571594860", 20, 28.0, 2),
("Dassault Falcon 7X", "1592583570", 18, 35.0, 2),
("Gulfstream G700", "7539514560", 15, 40.0, 2),
("Fokker F28", "3574561590", 25, 22.0, 3),
("Spitfire", "6541597530", 5, 45.0, 4),
("Hawker Hurricane", "9513574560", 7, 42.0, 4),
("North American P-51 Mustang", "8523579510", 8, 40.0, 4),
("Boeing 777", "9518523570", 18, 38.0, 2),
("Airbus A350", "6547539510", 20, 39.0, 2),
("Cessna Citation CJ4", "8529517530", 30, 27.0, 5),
("Antonov An-148", "1472583690", 25, 20.0, 2),
("McDonnell Douglas F/A-18 Hornet", "7536549510", 12, 28.0, 1),
("Sukhoi Su-35", "3578521590", 15, 31.0, 1),
("Douglas DC-8", "9513578520", 10, 36.0, 2),
("Bombardier CRJ900", "4567531590", 20, 23.0, 2),
("Piper PA-46", "2581597530", 35, 15.0, 5),
("Diamond DA62", "7539518520", 25, 16.0, 5),
("Cirrus SR22", "9514562580", 30, 18.0, 5),
("Airbus Beluga XL", "6548523570", 5, 50.0, 2),
("Boeing Dreamlifter", "3571599510", 3, 60.0, 2),
("Lockheed Martin F-35", "2583576540", 25, 35.0, 1),
("Dassault Falcon 10X", "7534569510", 8, 50.0, 2),
("Ouragan", "7820457422", 88, 40.0, 2);
-- Table Providers
INSERT INTO Providers (name_provider) VALUES
("SYLVAMO FRANCE"),
("PAPERJET INC"),
("MAQUETTES PRO"),
("AIRCRAFT PAPER"),
("PROJET 3D"),
("AVIONIQUE DESIGN"),
("AEROCREATIONS"),
("PAPERCRAFT FACTORY"),
("MODELS IN PAPER"),
("FLYING DREAMS"),
("HIGH FLY PAPER"),
("PAPER PLANES UNLIMITED"),
("BLUEPRINT MODELS"),
("PAPER WINGS CO"),
("JETCRAFT PAPER"),
("SUPERSONIC MODELS"),
("AEROPLANE DESIGNS"),
("AIRCRAFT MODELS"),
("GLIDER WORKS"),
("HISTORICAL PLANES"),
("VINTAGE CRAFT"),
("AVION ET PAPIER"),
("ULTRALIGHT DESIGN"),
("FIGHTER MODELS"),
("DRONE WORKS"),
("CONCORDE PAPERCRAFT"),
("AVIATION DREAMS"),
("FLIGHT SIM MODELS"),
("PAPER JETS INC"),
("CARGO PAPERCRAFT"),
("COMMERCIAL MODELS"),
("STEALTH DESIGNS"),
("AEROSPACE CRAFT"),
("BIPLANE PAPER"),
("PAPERCRAFT HEAVEN"),
("PAPERJET DREAM"),
("WARBIRD CRAFT"),
("AMAZING MODELS"),
("FALCON DESIGN"),
("SKY PAPER DESIGNS"),
("PAPER PLANET"),
("PAPER AERO DESIGN"),
("FLIGHT MODEL WORKS"),
("PAPERCRAFT SUPREME"),
("JET DESIGNS"),
("FUTURE CRAFT"),
("EXPERIMENTAL DESIGN"),
("INNOVATIVE PAPER"),
("FLIGHT VISION"),
("FLYCRAFT MODELS");


-- Table Providers_Products
INSERT INTO Providers_Products (id_provider, id_product) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(31, 31),
(32, 32),
(33, 33),
(34, 34),
(35, 35),
(36, 36),
(37, 37),
(38, 38),
(39, 39),
(40, 40),
(41, 41),
(42, 42),
(43, 43),
(44, 44),
(45, 45),
(46, 46),
(47, 47),
(48, 48),
(49, 49),
(50, 50);

-- Table Orders
INSERT INTO Orders (number_order, date_order, total_price, id_client) VALUES
("0000000001", "2024-01-01 10:00:00", 100.0, 1),
("0000000002", "2024-01-02 11:00:00", 200.0, 2),
("0000000003", "2024-01-03 12:00:00", 300.0, 3),
("0000000004", "2024-01-04 13:00:00", 400.0, 4),
("0000000005", "2024-01-05 14:00:00", 500.0, 5),
("0000000006", "2024-01-06 15:00:00", 600.0, 6),
("0000000007", "2024-01-07 16:00:00", 700.0, 7),
("0000000008", "2024-01-08 17:00:00", 800.0, 8),
("0000000009", "2024-01-09 18:00:00", 900.0, 9),
("0000000010", "2024-01-10 19:00:00", 1000.0, 10),
("0000000011", "2024-01-11 10:00:00", 1100.0, 11),
("0000000012", "2024-01-12 11:00:00", 1200.0, 12),
("0000000013", "2024-01-13 12:00:00", 1300.0, 13),
("0000000014", "2024-01-14 13:00:00", 1400.0, 14),
("0000000015", "2024-01-15 14:00:00", 1500.0, 15),
("0000000016", "2024-01-16 15:00:00", 1600.0, 16),
("0000000017", "2024-01-17 16:00:00", 1700.0, 17),
("0000000018", "2024-01-18 17:00:00", 1800.0, 18),
("0000000019", "2024-01-19 18:00:00", 1900.0, 19),
("0000000020", "2024-01-20 19:00:00", 2000.0, 20),
("0000000021", "2024-01-21 10:00:00", 2100.0, 21),
("0000000022", "2024-01-22 11:00:00", 2200.0, 22),
("0000000023", "2024-01-23 12:00:00", 2300.0, 23),
("0000000024", "2024-01-24 13:00:00", 2400.0, 24),
("0000000025", "2024-01-25 14:00:00", 2500.0, 25),
("0000000026", "2024-01-26 15:00:00", 2600.0, 26),
("0000000027", "2024-01-27 16:00:00", 2700.0, 27),
("0000000028", "2024-01-28 17:00:00", 2800.0, 28),
("0000000029", "2024-01-29 18:00:00", 2900.0, 29),
("0000000030", "2024-01-30 19:00:00", 3000.0, 30),
("0000000031", "2024-01-31 10:00:00", 3100.0, 31),
("0000000032", "2024-02-01 11:00:00", 3200.0, 32),
("0000000033", "2024-02-02 12:00:00", 3300.0, 33),
("0000000034", "2024-02-03 13:00:00", 3400.0, 34),
("0000000035", "2024-02-04 14:00:00", 3500.0, 35),
("0000000036", "2024-02-05 15:00:00", 3600.0, 36),
("0000000037", "2024-02-06 16:00:00", 3700.0, 37),
("0000000038", "2024-02-07 17:00:00", 3800.0, 38),
("0000000039", "2024-02-08 18:00:00", 3900.0, 39),
("0000000040", "2024-02-09 19:00:00", 4000.0, 40),
("0000000041", "2024-02-10 10:00:00", 4100.0, 41),
("0000000042", "2024-02-11 11:00:00", 4200.0, 42),
("0000000043", "2024-02-12 12:00:00", 4300.0, 43),
("0000000044", "2024-02-13 13:00:00", 4400.0, 44),
("0000000045", "2024-02-14 14:00:00", 4500.0, 45),
("0000000046", "2024-02-15 15:00:00", 4600.0, 46),
("0000000047", "2024-02-16 16:00:00", 4700.0, 47),
("0000000048", "2024-02-17 17:00:00", 4800.0, 48),
("0000000049", "2024-02-18 18:00:00", 4900.0, 49),
("0000000050", "2024-02-19 19:00:00", 5000.0, 50);

-- Table Orders_Products
INSERT INTO Orders_Products (id_order, id_product, quantity) VALUES
(1, 1, 2),
(2, 2, 4),
(3, 3, 6),
(4, 4, 8),
(5, 5, 10),
(6, 6, 12),
(7, 7, 14),
(8, 8, 16),
(9, 9, 18),
(10, 10, 20),
(11, 11, 22),
(12, 12, 24),
(13, 13, 26),
(14, 14, 28),
(15, 15, 30),
(16, 16, 32),
(17, 17, 34),
(18, 18, 36),
(19, 19, 38),
(20, 20, 40),
(21, 21, 42),
(22, 22, 44),
(23, 23, 46),
(24, 24, 48),
(25, 25, 50),
(26, 26, 52),
(27, 27, 54),
(28, 28, 56),
(29, 29, 58),
(30, 30, 60),
(31, 31, 62),
(32, 32, 64),
(33, 33, 66),
(34, 34, 68),
(35, 35, 70),
(36, 36, 72),
(37, 37, 74),
(38, 38, 76),
(39, 39, 78),
(40, 40, 80),
(41, 41, 82),
(42, 42, 84),
(43, 43, 86),
(44, 44, 88),
(45, 45, 90),
(46, 46, 92),
(47, 47, 94),
(48, 48, 96),
(49, 49, 98),
(50, 50, 100);


