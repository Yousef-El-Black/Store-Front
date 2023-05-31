import { Router } from 'express';
import * as controllers from '../../controllers/products.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes.route('/').post(authenticationMiddleware, controllers.create);

routes.route('/').get(controllers.index);

routes
  .route('/:id')
  .put(authenticationMiddleware, controllers.update)
  .get(controllers.show)
  .delete(authenticationMiddleware, controllers.deleteOne);

export default routes;
