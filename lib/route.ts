import { Request, Response } from "express";
import  StreakRouter from './routes/streak';
import  UserRouter  from './routes/user';

export class Routes {

    public routes(app): void {
        /*
        USER ROUTES
        */
        app.route('/users').get(UserRouter.getAllUsers).post(UserRouter.post);
        app.route('/user/:userID').get(UserRouter.getById).delete(UserRouter.delete).put(UserRouter.update)
        app.route('/user/login').post(UserRouter.login)
        app.route('/user/register').post(UserRouter.post)
        /*
        STREAK ROUTES
        */
        app.route('/streak').get(StreakRouter.get).post(StreakRouter.post)
        app.route('/streak/:id').get(StreakRouter.getById).delete(StreakRouter.delete).put(StreakRouter.update)
    }
}