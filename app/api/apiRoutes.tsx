export default class ApiRoutes {
      static BASE_URL_DEV: string = "https://rayvvin.onrender.com";
    // static BASE_URL_DEV: string = "http://localhost:3000";

    /**
     * Api routes to register new user(buyer)
     */
    static RegisterBuyer: string = "api/auth/register";

    /**
     * Api routes to register new user(buyer)
     */
    static RegisterSeller: string = "api/auth/register/seller";

    /**
     * Api routes to check if user is logged in
     */
    static AccountStatus: string = "api/auth/account/status";

    /**
     * Api routes to login buyer and seller
     */
    static LoginBuyer: string = "api/auth/login";

    /**
     * Api routes to login buyer using google
     */
    static LoginWithGoogle: string = "api/auth/google";

    /**
     * Api routes to verify user
     */
    static VerifyUser: string = "api/auth/verify";

    /**
     * Api routes to resend verification code
     */
    static ResendVerificationCode: string = "api/auth/resend";

    /**
     * Api routes to logout
     */
    static Logout: string = "api/auth/logout";

    /**
     * Api routes to fetch categories
     */
    static FetchCategories: string = "api/categories";

    static FetchAllCategories: string = "api/categories/all";

    /**
     * Api routes to fetch category
     */
    static FetchSingleCategory: string = "api/categories/category";

    /**
     * Api routes to fetch all stores
     */
    static FetchAllStores: string = "api/stores/all";

    /**
     * Api routes to fetch a store
     */
    static FetchAStore: string = "api/stores/store/id";

    /**
     * Api routes to fetch product
     */
    static FetchProduct: string = "api/products/product";

    /**
     * Api routes to fetch cart
     */
    static FetchCartItems: string = "api/cart";

    /**
     * Api routes to fetch seller store
     */
    static FetchSellerStore: string = "api/stores/store";

    /**
     * Api routes to add product
     */
    static AddProduct: string = "api/products/product";

    /**
     * Api routes to add store to favorite
     */
    static AddStoreToFavorite: string = "api/stores/favourite";

    static AddProductsToFavorite: string = "api/products/favourite";

    static RemoveFavoriteStore: string = "api/stores/favourite";

    static RemoveFavoriteProduct: string = "api/products/favourite";

    static RemoveProduct: string = "api/products/product";

    static UpdateProfile: string = "api/stores/store/profile";

    /**
     * Api routes to fetch favorite stores
     */
    static FetchFavoriteStores: string = "api/stores/favourite";

    static FetchFavoriteProducts: string = "api/products/favourite";

    static FetchSellerProducts: string = "api/stores/store/products";

    static FetchDrafts: string = "api/stores/store/products/draft";

    static productImages: string = "images/product";

    static storeImages: string = "images/store";

    static userImages: string = "images/user";

    static FetchReviews: string = "api/stores/store/reviews";

    static FetchStoreReview: (storeId: string) => string = (storeId: string) =>
        `api/stores/store/id/${storeId}/reviews`;
}
