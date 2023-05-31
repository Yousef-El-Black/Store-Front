import { Router } from 'express';
import * as controllers from '../../controllers/orders.controllers';
import authenticationMiddleware from '../../middlewares/authentication.middleware';

const routes = Router();

routes
  .route('/')
  .get(authenticationMiddleware, controllers.index)
  .post(controllers.create);

routes
  .route('/:id')
  .get(authenticationMiddleware, controllers.show)
  .put(authenticationMiddleware, controllers.update)
  .delete(authenticationMiddleware, controllers.deleteOne);

routes
  .route('/current-orders/:id')
  .get(authenticationMiddleware, controllers.getCurrentOrders);

routes
  .route('/add-product-to-order/')
  .put(authenticationMiddleware, controllers.addProductToOrder);

export default routes;
