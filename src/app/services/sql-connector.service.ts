import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {
  createForm,
  createFormAnswers,
  createTables,
  createTags,
  createUserTags
} from '../../assets/createTableVariables';
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {isEmpty} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SqlConnectorService {
  databaseObj: SQLiteObject;
  tableForm = "form";
  readonly tableName: string = 'tags';
  private databaseReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, private sqlite: SQLite, private http: HttpClient) {
    this.createDatabase();
  }

  /**
   * Funció de creació de la base de dades, aquesta crida a la funció de creació de les taules.
   */
  async createDatabase() {
    await this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'calendar_mood.db',
        location: 'default'
      })
        .then(async (db: SQLiteObject) => {
          this.databaseObj = db;
          console.log("database created")
          await this.createTable();
        }).catch((e) => {
        console.log("ERROR CREATING DATABASE");
      });
    });
  }

  /**
   * Funció de creació de les taules, aquesta també crida a les funcions d'inserció dels primers elements de la bdd
   * en cas d'estar buida.
   */
  async createTable() {
    let tablesVariables = [createForm, createFormAnswers, createTags, createUserTags]
    for (const table of tablesVariables) {
      await this.databaseObj.executeSql(table, [])
        .catch((e) => {
          console.log("ERROR CREATING TABLE: " + table)
          console.log(e)
        });
    }

    console.log("TABLES CREATED")

    //Si no hi ha cap pregunta se'n creen de bàsiques
    if (this.isEmpty(await this.getLastQuestions())) {
      this.insertBasicForm()
      console.log("BASIC FORMS INSERTED")
    }
    //Si no hi ha cap tag se'n creen de bàsics
    if (this.isEmpty(await this.getLastTag())) {
      this.insertBasicTag()
      console.log("BASIC TAG INSERTED")
    }
  }

  /**
   * Funció que retorna totes les files de la taula 'form_answers'
   * @returns array[json]
   */
  async getAllRows() {
    return this.databaseObj.executeSql('SELECT * FROM form_answers;', [])
      .then((data) => {

        let jsonResult = [] //Creació array on aniran tots els resultats amb JSON
        for (let i = 0; i < data.rows.length; i++) { //Agafem tots els resultats
          jsonResult.push(data.rows.item(i))
        }

        return jsonResult;
      }).catch((e) => {
        console.log("ERROR GETTING ALL ROWS")
        console.log(e)
        return JSON.stringify(e);
      });
  }

  /**
   * Funció que retorna l'última fila de preguntes de la taula 'form'
   * @returns array[json]
   */
  async getLastQuestions() {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM form
      WHERE id =
            (
              SELECT MAX(id)
              FROM form
            )
      ;
    `, [])
      .then((data) => {
        const questions = [];
        if (data.rows.length > 0) {
          questions.push(data.rows.item(0));
        }

        return questions;
      }).catch((e) => {
        console.log("ERROR GETTING LAST FORM")
        console.log(e)
      });
  }

  /**
   * Funció que retorna l'última fila de tags de l'usuari de la taula 'user_tags'
   * @returns array[json]
   */
  async getLastUserTags() {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM user_tags
      WHERE id =
            (
              SELECT MAX(id)
              FROM user_tags
            )
      ;
    `, [])
      .then((data) => {
        const tags = [];
        if (data.rows.length > 0) {
          tags.push(data.rows.item(0));
        }

        return tags;
      }).catch((e) => {
        console.log("ERROR GETTING LAST TAG")
        console.log(e)
      });
  }

  /**
   * Funció que retorna l'últim tag de la taula 'tags'
   * @returns array[json]
   */
  async getLastTag() {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM tags
      WHERE id =
            (
              SELECT MAX(id)
              FROM tags
            )
      ;
    `, [])
      .then((data) => {
        const tags = [];
        if (data.rows.length > 0) {
          tags.push(data.rows.item(0));
        }

        return tags;
      }).catch((e) => {
        console.log("ERROR GETTING LAST TAG")
        console.log(e)
      });
  }

  /**
   * Funció que retorna tots els tags de la taula 'tags'
   * @returns array[json]
   */
  async getAllTags() {
    return this.databaseObj.executeSql(`
        SELECT *
        FROM tags;`
      , [])
      .then((data) => {
        let jsonResult = [] //Creació array on aniran tots els resultats amb JSON
        for (let i = 0; i < data.rows.length; i++) { //Agafem tots els resultats
          jsonResult.push(data.rows.item(i))
        }

        return jsonResult;
      }).catch((e) => {
        console.log("ERROR GETTING ALL ROWS")
        console.log(e)
        return JSON.stringify(e);
      });
  }

  /**
   * Funció que donada una ID retorna les preguntes de la taula 'form'
   * @param id number
   * @returns array[json]
   */
  async getQuestionsFromId(id: number) {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM form
      WHERE id = ?
      ;
    `, [id])
      .then((data) => {
        const questions = [];
        if (data.rows.length > 0) {
          questions.push(data.rows.item(0));
        }

        return questions;
      }).catch((e) => {
        console.log("ERROR GETTING QUESTION FROM ID")
        console.log(e)
      });
  }

  /**
   * Funció que donada una ID retorna els tags de la taula 'user_tags'
   * @param id number
   * @returns array[json]
   */
  async getUserTagFromId(id: number) {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM user_tags
      WHERE id = ?
      ;
    `, [id])
      .then((data) => {
        const tag = [];
        if (data.rows.length > 0) {
          tag.push(data.rows.item(0));
        }

        return tag;
      }).catch((e) => {
        console.log("ERROR GETTING TAG FROM ID")
        console.log(e)
      });
  }

  /**
   * Funció que donada una data retorna les respostes de la taula 'form_answers'
   * @param date string
   * @returns array[json]
   */
  async getAnswersFromDate(date: string) {
    return this.databaseObj.executeSql(`
      SELECT *
      FROM form_answers
      WHERE date LIKE ?
      ;
    `, [date])
      .then(async (data) => {
        const answers = [];
        if (!this.isEmpty(data.rows)) {
          for (let i = 0; i < data.rows.length; i++) {
            answers.push(data.rows.item(i));
          }
        }

        return answers;
      }).catch((e) => {
        console.log("ERROR GETTING ANSWER FROM DATE")
        console.log(e)
      });
  }

  /**
   * Funció que donada una data retorna les el tant percent del mood de la taula 'form_answers'
   * @param date string
   * @returns array[json]
   */
  async getMoodFromDate(date: string) {
    let answersFromDate: any;
    let moods = []
    answersFromDate = await this.getAnswersFromDate(date);
    if (!answersFromDate.isEmpty) {
      for (const answer of answersFromDate) {
        moods.push({date: answer.date, mood: answer.percentage})
      }
    }
    return moods;
  }

  /**
   * Funció que donats una data i un tag retorna la quantitat de resultats amb el tag determinat
   * @param date string, tag string
   * @returns number
   */
  async getTagQuantFromDate(date: string, tag: string) {
    //todo: recibir cantidad de veces que se repite un tag a partir de una fecha
    let answersFromDate: any;
    let count = 0
    answersFromDate = await this.getAnswersFromDate(date);

    for (const answer of answersFromDate) {
      await this.databaseObj.executeSql(`
        SELECT id
        FROM user_tags
        WHERE id = ?
          AND (tag1 LIKE ? OR tag2 = ? OR tag3 = ? OR tag4 = ? OR tag5 = ?)
        ;
      `, [answer.user_tags_id, tag, tag, tag, tag, tag])
        .then((data) => {
          if (data.rows.length > 0) count++;

        }).catch((e) => {
          console.log("ERROR GETTING TAG QUANTITY")
          console.log(e)
        });
    }
    return count
  }


  /**
   * Funció que donat un array de JSON amb les respostes, les inserta a la taula 'form_answers'
   * @param answers array[json]
   */
  async insertAnswer(answers) {
    const lastForm = await this.getLastQuestions();
    const formId = lastForm[0].id;

    await this.insertUserTags(answers.tags) //todo: hacer insert de los tags del usuario

    const lastTag = await this.getLastUserTags();
    const userTagId = lastTag[0].id;

    //En cas d'existir una resposta al mateix dia fa un update sino un instert
    if (await this.isThereAnAnswerFromDate(answers.date)) {
      this.databaseObj.executeSql(
        `
          UPDATE 'form_answers'
          SET form_id = ?,
              user_tags_id = ?,
              date = ?,
              percentage = ?,
              answer1 = ?,
              answer2 = ?,
              answer3 = ?,
              answer4      = ?,
              answer5      = ?
          WHERE date = ?;
        `, [formId, userTagId, answers.date, answers.percentage, answers.a1, answers.a2, answers.a3, answers.a4,
          answers.a5, answers.date])
    } else {
      this.databaseObj.executeSql(
        `
          INSERT INTO 'form_answers'(form_id, user_tags_id, date, percentage, answer1, answer2, answer3, answer4,
                                     answer5)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [formId, userTagId, answers.date, answers.percentage, answers.a1, answers.a2, answers.a3, answers.a4,
          answers.a5]);
    }
  }

  /**
   * Funció que donat un JSON amb els tags, els inserta a la taula 'user_tags'
   * @param tags json
   */
  async insertUserTags(tags) {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'user_tags'(tag1, tag2, tag3, tag4, tag5)
        values (?, ?, ?, ?, ?);
      `, [tags.t1, tags.t2, tags.t3, tags.t4, tags.t5]).catch((e) => {
      console.log("ERROR:", e)
    });
  }

  /**
   * Funció que donat un JSON amb les preguntes, les inserta a la taula 'form'
   * @param questions json
   */
  async insertQuestions(questions) {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'form'(question1, question2, question3, question4, question5)
        values (?, ?, ?, ?, ?);
      `, [questions.q1, questions.q2, questions.q3, questions.q4, questions.q5]);
  }

  /**
   * Funció que donat un tag l'inserta a la taula 'tags'
   * @param tag string
   */
  async insertTag(tag: string) {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'tags'(name)
        values (?);`
      , [tag]
    ).then(() => {
      console.log("INSTERT TAG WORKING")
    }).catch((e) => {
      console.log("ERROR INSTERTING TAG")
      console.log(e)
    });
  }

  /**
   * Funció que inserta les preguntes bàsiques a la taula 'form'
   */
  async insertBasicForm() {
    this.databaseObj.executeSql(
      `
        INSERT INTO 'form'(question1, question2, question3, question4, question5)
        values (?, ?, ?, ?, ?);
      `, ["Què has fet avui?", "Què t'ha fet sentir així?", "Què sents que has fet bé?", "Què creus que pots millorar?",
        "Canviaries alguna cosa?"]
    );
  }

  /**
   * Funció que inserta els tags bàsiques a la taula 'tags'
   */
  async insertBasicTag() {
    let tagNames = ["tristesa", "alegria", "serenitat", "calidesa", "distanciament", "orgull", "amor", "fúria",
      "remordiment", "por", "confiança", "fàstic"]

    for (const name of tagNames) {
      this.databaseObj.executeSql(
        `
          INSERT INTO 'tags'(name)
          values (?);
        `, [name]
      );
    }
  }

  /**
   * Funció que donat un tag l'elimina a la taula 'tags'
   * @param tag string
   */
  async deleteTag(tag: string) {
    this.databaseObj.executeSql(
      `
        DELETE
        FROM 'tags'
        WHERE name = (?);
      `,
      [tag]
    ).then(() => {
      console.log("DELETE TAG WORKING")
    }).catch((e) => {
      console.log("ERROR DELETING TAG")
      console.log(e)
    });
  }

  /**
   * Funció que donada una data busca si existeix una resposta amb aquesta data
   * @param date string
   * @return boolean
   */
  async isThereAnAnswerFromDate(date: string) {
    if (this.isEmpty(await this.getAnswersFromDate(date))) return false;
    else return true;
  }

  /**
   * Funció que donat un element determina si esta buit, es null o es undefined
   * @param x any
   * @return boolean
   */
  isEmpty(x: any) {
    if (x == undefined) {
      return true;
    }
    if (x == null) {
      return true;
    }
    if (x == '') {
      return true;
    }

    return false;
  }
}