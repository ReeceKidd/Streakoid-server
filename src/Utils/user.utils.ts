import UserModel from "./../Models/User";

export class UserUtils {

    public static createUserFromRequest(userName: string, email: string, hashedPassword: string){
        return new UserModel({userName, email, password: hashedPassword})
      }
}