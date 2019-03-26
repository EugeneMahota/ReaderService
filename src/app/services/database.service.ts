import {Injectable} from '@angular/core';
const mysql = (<any>window).require('mysql');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  config = {
    host: '192.168.252.199',
    user: 'user_park',
    password: 'support',
    database: 'rep'
  };

  connection: any;

  constructor() {
    this.connection = mysql.createConnection(this.config);
    this.connection.connect();
  }


  async query(sql: string, data: any) {
    return new Promise<any>((resolve, reject) => {
      this.connection.query(sql, data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0][0]);
        }
      });
    });
  }
}
