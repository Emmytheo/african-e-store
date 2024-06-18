import { Router } from "express";
import {
  addStoreToFavourite,
  createStore,
  getAllStores,
  getCategoriesOfStoreById,
  getProductByIdOfStoreById,
  getStoreById,
  getStoreByUserLogged,
  getStoreCategories,
  getStoreProduct,
  searchForStore,
  searchStoreProducts,
  updateStoreDescription,
} from "../../controllers/store";
import { rootErrorHandler } from "../../root-error-handler";
import { checkStore, sellerRoleCheck } from "../../middlewares/roles";

const router = Router();
router.get("/all", getAllStores);
router.get("/store/id/:id", getStoreById);
router.get("/store/id/:id/categories", getCategoriesOfStoreById);
router.get("/store/id/:storeId/product/:productId", getProductByIdOfStoreById);
router.get("/search", searchForStore);
router.route("/store/favourite").post(rootErrorHandler(addStoreToFavourite));
router
  .route("/store")
  .get(sellerRoleCheck, rootErrorHandler(getStoreByUserLogged))
  .post(sellerRoleCheck, rootErrorHandler(createStore));

router.get(
  "/store/categories",
  [sellerRoleCheck, checkStore],
  rootErrorHandler(getStoreCategories)
);
router.get(
  "/store/product/:id",
  [sellerRoleCheck, checkStore],
  rootErrorHandler(getStoreProduct)
);
router.get(
  "/store/search",
  [sellerRoleCheck, checkStore],
  rootErrorHandler(searchStoreProducts)
);
router.patch(
  "/store/description",
  [sellerRoleCheck, checkStore],
  rootErrorHandler(updateStoreDescription)
);
export { router as storeRoutes };
