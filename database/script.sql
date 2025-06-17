CREATE TYPE shipment_status AS ENUM ('Pending', 'In Transit', 'Delivered', 'Cancelled');

CREATE TABLE drivers (
  driver_id SERIAL PRIMARY KEY,
  driver_name VARCHAR(255) NOT NULL,
  driver_license_number VARCHAR(50) UNIQUE NOT NULL,
  driver_experience INT CHECK (driver_experience >= 0)
);

CREATE TABLE trucks (
  truck_id SERIAL PRIMARY KEY,
  truck_name VARCHAR(255) NOT NULL,
  truck_capacity INT NOT NULL,
  truck_location VARCHAR(255),
  truck_latitude DECIMAL(10,7),
  truck_longitude DECIMAL(10,7),
  truck_availability BOOLEAN DEFAULT TRUE,
  truck_driver_id INT REFERENCES drivers(driver_id) ON DELETE SET NULL,
  truck_mpg_capacity DECIMAL(5,2) CHECK (truck_mpg_capacity > 0)
);

CREATE TABLE clients (
  client_id SERIAL PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_company VARCHAR(255),
  client_contact_email VARCHAR(255) UNIQUE NOT NULL,
  client_phone VARCHAR(20)
);

CREATE TABLE shipments (
  ship_id SERIAL PRIMARY KEY,
  ship_name TEXT NOT NULL,
  ship_weight INT NOT NULL,
  ship_origin VARCHAR(255) NOT NULL,
  ship_destination VARCHAR(255) NOT NULL,
  ship_latitude DECIMAL(10,7),
  ship_longitude DECIMAL(10,7),
  ship_status shipment_status DEFAULT 'Pending',
  ship_client_id INT REFERENCES clients(client_id) ON DELETE CASCADE,
  ship_truck_id INT REFERENCES trucks(truck_id) ON DELETE SET NULL
);

INSERT INTO drivers (driver_name, driver_license_number, driver_experience) VALUES
('Thabo Nkosi', 'SADC-001', 10), ('Naledi Phiri', 'SADC-002', 8),
('Blessing Ncube', 'SADC-003', 12), ('Leonardo Moyo', 'SADC-004', 7),
('Khumo Molefe', 'SADC-005', 5), ('Lebo Tshabalala', 'SADC-006', 9),
('Tinashe Dube', 'SADC-007', 6), ('Victor Chisale', 'SADC-008', 11),
('Aminata Banda', 'SADC-009', 4), ('Sibusiso Zulu', 'SADC-010', 13),
('Collins Ndlovu', 'SADC-011', 10), ('Ntombi Khumalo', 'SADC-012', 7),
('Mandla Lungu', 'SADC-013', 6), ('Yvonne Mpofu', 'SADC-014', 5),
('Felix Maponya', 'SADC-015', 8), ('Kabelo Simelane', 'SADC-016', 9),
('Zanele Maseko', 'SADC-017', 11), ('Tendai Chuma', 'SADC-018', 4),
('Busisiwe Dhlamini', 'SADC-019', 12), ('Richard Hove', 'SADC-020', 6),
('Jacob Matseke', 'SADC-021', 5), ('Gugu Mthembu', 'SADC-022', 10),
('Lerato Sibanda', 'SADC-023', 9), ('Elijah Mwale', 'SADC-024', 7),
('Sandra Gwambe', 'SADC-025', 8);

INSERT INTO trucks (truck_name, truck_capacity, truck_location, truck_latitude, truck_longitude, truck_availability, truck_driver_id, truck_mpg_capacity) VALUES
('Mercedes Actros', 30000, 'Johannesburg, South Africa', -26.2041, 28.0473, FALSE, 1, 6.5),
('Volvo FH', 26000, 'Gaborone, Botswana', -24.6282, 25.9231, FALSE, 2, 7.2),
('Scania R500', 28000, 'Harare, Zimbabwe', -17.8292, 31.0522, FALSE, 3, 6.8),
('MAN TGX', 25000, 'Maputo, Mozambique', -25.9663, 32.5700, FALSE, 4, 7.0),
('DAF XF', 27000, 'Lusaka, Zambia', -15.3875, 28.3228, TRUE, 5, 6.9),
('Isuzu Giga', 29000, 'Lilongwe, Malawi', -13.9833, 33.7833, FALSE, 6, 6.7),
('Hino 700', 24000, 'Windhoek, Namibia', -22.5597, 17.0836, TRUE, 7, 7.3),
('Freightliner Cascadia', 31000, 'Mbabane, Eswatini', -26.3054, 31.1367, TRUE, 8, 6.4),
('Iveco Stralis', 26500, 'Kinshasa, DRC', -4.4419, 15.2663, FALSE, 9, 7.1),
('Kenworth T680', 28500, 'Luanda, Angola', -8.8383, 13.2344, TRUE, 10, 6.6),
('Peterbilt 579', 29500, 'Dodoma, Tanzania', -6.1722, 35.7395, FALSE, 11, 6.5),
('Mack Anthem', 25000, 'Maseru, Lesotho', -29.3167, 27.4833, FALSE, 12, 7.0),
('Renault Magnum', 27500, 'Blantyre, Malawi', -15.7861, 35.0058, TRUE, 13, 6.8),
('Western Star 4900', 32000, 'Pretoria, South Africa', -25.7464, 28.1881, TRUE, 14, 6.3),
('Hyundai Xcient', 27000, 'Francistown, Botswana', -21.1596, 27.5032, FALSE, 15, 7.1),
('UD Quon', 26000, 'Bulawayo, Zimbabwe', -20.1539, 28.6178, FALSE, 16, 7.0),
('Ford Cargo', 25500, 'Beira, Mozambique', -19.8233, 34.8383, TRUE, 17, 6.9),
('Volvo VNL', 28000, 'Kitwe, Zambia', -12.8031, 28.2132, FALSE, 18, 6.7),
('Scania S730', 27500, 'Tete, Mozambique', -16.1564, 33.5867, FALSE, 19, 6.8),
('MAN TGS', 26500, 'Lubumbashi, DRC', -11.6696, 27.4793, TRUE, 20, 7.2),
('Iveco Eurocargo', 24500, 'Dodoma, Tanzania', -6.1722, 35.7395, TRUE, 21, 7.3),
('Mercedes-Benz Arocs', 31000, 'Mbabane, Eswatini', -26.3054, 31.1367, FALSE, 22, 6.4),
('Volvo FMX', 28500, 'Kinshasa, DRC', -4.4419, 15.2663, FALSE, 23, 6.9),
('Hino Profia', 27000, 'Johannesburg, South Africa', -26.2041, 28.0473, TRUE, 24, 7.0),
('DAF CF', 26000, 'Lusaka, Zambia', -15.3875, 28.3228, TRUE, 25, 7.1);




INSERT INTO clients (client_name, client_company, client_contact_email, client_phone) VALUES
('Lerato Dlamini', 'Dlamini Logistics', 'lerato@dlaminilogistics.co.za', '+27 72 123 4567'),
('Kudzai Nyoni', 'Nyoni Enterprises', 'kudzai@nyonienterprises.co.zw', '+263 77 456 7890'),
('Henrique Almeida', 'Almeida Transport', 'henrique@almeidatransport.ao', '+244 923 567 890'),
('Samkeliso Banda', 'Banda Freight', 'samkeliso@bandafreight.zm', '+260 96 456 789'),
('Pelagia Radebe', 'Radebe Distributors', 'pelagia@radebedistributors.co.bw', '+267 71 234 567'),
('Fatima Ibrahim', 'Ibrahim Cargo', 'fatima@ibrahimcargo.com', '+255 78 345 6789'),
('Charles Mthethwa', 'Mthethwa Holdings', 'charles@mthethwaholdings.co.za', '+27 81 234 5678'),
('Julius Mutale', 'Mutale Freight', 'julius@mutalefreight.com', '+260 97 987 6543'),
('Grace Nkomo', 'Nkomo Logistics', 'grace@nkomologistics.co.zw', '+263 78 345 6789'),
('Edgar Mavuso', 'Mavuso Freight', 'edgar@mavusofreight.com', '+27 82 567 8901');

INSERT INTO shipments (ship_name, ship_weight, ship_origin, ship_destination, ship_latitude, ship_longitude, ship_status, ship_client_id, ship_truck_id) VALUES
('Fresh fruits delivery', 5000, 'Johannesburg, South Africa', 'Lusaka, Zambia', -26.2041, 28.0473, 'Pending', 1, 5),
('Industrial equipment', 20000, 'Harare, Zimbabwe', 'Maputo, Mozambique', -17.8292, 31.0522, 'In Transit', 2, NULL),
('Frozen seafood', 12000, 'Windhoek, Namibia', 'Gaborone, Botswana', -22.5597, 17.0836, 'Pending', 3, 15),
('Electronic goods', 8000, 'Luanda, Angola', 'Kinshasa, DRC', -8.8383, 13.2344, 'Pending', 4, NULL),
('Mining machinery', 25000, 'Dodoma, Tanzania', 'Blantyre, Malawi', -6.1722, 35.7395, 'Delivered', 5, 25),
('Pharmaceuticals', 4000, 'Pretoria, South Africa', 'Mbabane, Eswatini', -25.7464, 28.1881, 'Pending', 6, NULL),
('Textiles', 9000, 'Francistown, Botswana', 'Bulawayo, Zimbabwe', -21.1596, 27.5032, 'Pending', 7, 8),
('Automobile parts', 18000, 'Maputo, Mozambique', 'Lubumbashi, DRC', -25.9663, 32.5700, 'In Transit', 8, 14),
('Construction materials', 22000, 'Luanda, Angola', 'Dodoma, Tanzania', -8.8383, 13.2344, 'Delivered', 9, NULL),
('Retail goods', 6000, 'Lilongwe, Malawi', 'Harare, Zimbabwe', -13.9833, 33.7833, 'Pending', 10, 19),
('Chemicals', 7000, 'Maseru, Lesotho', 'Beira, Mozambique', -29.3167, 27.4833, 'Pending', 1, NULL),
('Clothing and fashion', 5500, 'Kitwe, Zambia', 'Beira, Mozambique', -12.8031, 28.2132, 'Delivered', 2, 16),
('Heavy machinery', 23000, 'Windhoek, Namibia', 'Tete, Mozambique', -22.5597, 17.0836, 'In Transit', 3, 11),
('Medical supplies', 3000, 'Lubumbashi, DRC', 'Harare, Zimbabwe', -4.4419, 15.2663, 'Pending', 4, 1),
('Plastic goods', 7800, 'Gaborone, Botswana', 'Dar es Salaam, Tanzania', -24.6282, 25.9231, 'Delivered', 5, 6),
('Electronics', 8200, 'Johannesburg, South Africa', 'Gaborone, Botswana', -26.2041, 28.0473, 'Pending', 6, 13),
('Tyres and wheels', 15000, 'Beira, Mozambique', 'Bulawayo, Zimbabwe', -19.8233, 34.8383, 'In Transit', 7, 18),
('Glassware and ceramics', 4900, 'Harare, Zimbabwe', 'Lubumbashi, DRC', -17.8292, 31.0522, 'Delivered', 8, 21),
('Frozen meat', 11200, 'Lusaka, Zambia', 'Francistown, Botswana', -15.3875, 28.3228, 'Pending', 9, 9),
('Consumer electronics', 9100, 'Pretoria, South Africa', 'Maputo, Mozambique', -25.7464, 28.1881, 'Pending', 10, NULL),
('Bulk grain', 19000, 'Kinshasa, DRC', 'Lusaka, Zambia', -4.4419, 15.2663, 'Pending', 1, 3),
('Furniture', 14400, 'Blantyre, Malawi', 'Johannesburg, South Africa', -15.7861, 35.0058, 'Delivered', 2, 23),
('Stationery & office supplies', 5600, 'Dar es Salaam, Tanzania', 'Dodoma, Tanzania', -6.1722, 35.7395, 'Pending', 3, 12),
('Petroleum products', 22500, 'Tete, Mozambique', 'Kitwe, Zambia', -16.1564, 33.5867, 'In Transit', 4, NULL),
('Sanitary products', 7200, 'Mbabane, Eswatini', 'Windhoek, Namibia', -26.3054, 31.1367, 'Pending', 5, 24);
