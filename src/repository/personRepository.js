const dao = require("../database/dao");

class PersonRepository {

  deleteTable() {

    const createTableQuery = `
        DROP TABLE person;`;

    return dao.run(createTableQuery)
  }

  createTable() {

    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS person(
            id          integer primary key autoincrement, 
            name        text not null, 
            email       text not null, 
            note        text, 
            isStudent   boolean default true, 
            lastUpdated  datetime default current_timestamp)`;


    return dao.run(createTableQuery)
  }

  createsSomeData() {
    dao.run("INSERT INTO person (name, email, note, isStudent ) VALUES('Benny bo', 'benny@email.com' , 'benny kan lide jul', true);");
    dao.run("INSERT INTO person (name, email, note, isStudent ) VALUES('lis nielsen', 'lis@email.com' , 'lis cykler ofte', true)");
    dao.run("INSERT INTO person (name, email, note, isStudent ) VALUES('Lars larsen', 'lars@email.com' , 'lars kan godt lide dyner', true);");
    return dao.run("INSERT INTO person (name, email, isStudent ) VALUES('hanne stål', 'hanne@email.com' ,  true)");
  }

  create(name, email, note, isStudent) {
    return dao.run(
      'INSERT INTO person (name, email, note, isStudent) VALUES (?,?,?,?)',
      [name, email, note, isStudent])
  }

  getById(id) {
    return dao.get(
      `SELECT * FROM person WHERE id = ?`,
      [id])
  }

  getAll() {
    return dao.all(`SELECT * FROM person`)
  }

  update(person) {
    const { id, name, email, note, isStudent, } = person
    return dao.run(
      `UPDATE person
        SET name = ?,
        email = ?, 
        note = ?, 
        isStudent = ?, 
        lastUpdated = current_timestamp
         WHERE id = ?`,
      [name, email, note, isStudent, id]
    )
  }

  delete(id) {
    return dao.run(
      `DELETE FROM person WHERE id = ?`,
      [id]
    )
  }


}

module.exports = new PersonRepository();