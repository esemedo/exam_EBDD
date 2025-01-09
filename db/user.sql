CREATE USER "aeromodel"@"%" IDENTIFIED BY "password";
GRANT SELECT , UPDATE, DELETE, INSERT ON aeromodel.* TO "aeromodel"@"%";
FLUSH PRIVILEGES;