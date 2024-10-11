
DROP TABLE IF EXISTS Student;
CREATE TABLE Student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastName NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(255) NOT NULL,
    userName VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL
);

INSERT INTO Student (id, lastName, firstName, userName, address)
VALUES (
    :id,
    :lastName,
    :firstName,
    :userName,
    :address
);

INSERT INTO Student (id, lastName, firstName, userName, address)
VALUES (
    3,
    'diep',
    'gia',
    "boomtown",
    "address"
);



UPDATE Student (
    lastName = :lastname,
    firstName = :firstName,
    userName = :userName,
    SET address = :address

    WHERE id = 2
);

UPDATE 'sqlite_sequence' SET seq = 1000 WHERE NAME = "Student"

ALTER TABLE "Student" ADD phone varchar(15);

DROP TABLE IF EXISTS CSTStudent;
create TABLE CSTStudent (
    studentID INTEGER PRIMARY KEY,
    account VARCHAR(4),
    classGroup CHARACTER(1),
    yearInCourse INTEGER,
    CONSTRAINT fk_student FOREIGN KEY (studentID) REFERENCES "Student" (id)
);

// TODO

INSERT INTO CSTStudent (studentID, account, classGroup, yearInCourse)
VALUES (
    1234,
    'student',
    'cosc',
    300
);