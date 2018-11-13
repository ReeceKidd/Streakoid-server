import { Document } from "mongoose";
import UserModel from "../models/User";
import { resolve } from "url";
import { reject } from "bcrypt/promises";

const DELETE_USER_MESSAGE = '"Successfully deleted user" ';

export class UserDatabaseHelper {
  public static saveUserToDatabase(newUser: Document) {
    return new Promise((resolve, reject) => {
      newUser.save(async (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  public static deleteUser(_id: string) {
    return new Promise((resolve, reject) => {
      UserModel.remove({ _id }, err => {
        if (err) reject(err);
        resolve({ message: DELETE_USER_MESSAGE });
      });
    });
  }

  public static updateUser(_id: string, updateObject: object) {
    return new Promise((resolve, reject) => {
      UserModel.findOneAndUpdate(
        { _id },
        updateObject,
        { new: true },
        (err, user) => {
          reject(err);
          resolve(user);
        }
      );
    });
  }
}
