import { Router } from 'express';
import * as controllers from '../../controllers/users.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .post(controllers.create)
  .get(authenticationMiddleware, controllers.index);

routes
  .route('/:id')
  .put(authenticationMiddleware, controllers.update)
  .get(authenticationMiddleware, controllers.show)
  .delete(authenticationMiddleware, controllers.deleteOne);

routes.route('/authenticate').post(controllers.authenticate);

export default routes;
