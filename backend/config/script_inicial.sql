-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS students_db
CHARACTER SET utf8 
COLLATE utf8_unicode_ci;

-- Crear usuario de la base de datos
CREATE USER 'students_user'@'localhost' IDENTIFIED BY '12345';

-- Otorgar todos los permisos sobre la base de datos
GRANT ALL PRIVILEGES ON students_db.* TO 'students_user'@'localhost';

-- Aplicar los cambios en los permisos​
FLUSH PRIVILEGES;​

-- Usar la base de datos​
USE students_db;

-- Crear la tabla students
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INT NOT NULL
) ENGINE=INNODB;

-- Insertar algunos datos de prueba
INSERT INTO students (fullname, email, age) VALUES
('Ana García', 'ana@example.com', 21),
('Lucas Torres', 'lucas@example.com', 24),
('Marina Díaz', 'marina@example.com', 22);


--VOLVER TODO A CERO, BORRAR BASE DE DATOS Y USUARIO
--REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'students_user'@'localhost';
--DROP USER 'students_user'@'localhost';
--DROP DATABASE students_db;