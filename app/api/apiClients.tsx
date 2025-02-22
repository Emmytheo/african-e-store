import axios from "axios";
import ApiRoutes from "./apiRoutes";
import {
    LoginBuyer,
    RegisterBuyerRequest,
} from "../components/models/IRegisterBuyer";
import { RegisterSellerRequest } from "../components/models/IRegisterSeller";

export const API = axios.create({
    baseURL: ApiRoutes.BASE_URL_DEV,
    withCredentials: true,
});

// Api call to create new user(buyer)
export function useRegisterBuyer() {
    /**
     * @returns the response for the api request
     */
    async function registerBuyer(data: RegisterBuyerRequest) {
        //Fetch message
        const response = await API.post(ApiRoutes.RegisterBuyer, data);

        //Return response
        return response;
    }
    return registerBuyer;
}

// Api call to create new user(seller)
export function useRegisterSeller() {
    /**
     * @returns the response for the api request
     */
    async function registerSeller(data: RegisterSellerRequest) {
        //Fetch message
        const response = await API.post(ApiRoutes.RegisterSeller, data);

        //Return response
        return response;
    }
    return registerSeller;
}

// Api call to verify user
export function useVerifyUser() {
    async function verifyUser(data: { id: string; code: string }) {
        // Fire the request
        const response = await API.post(ApiRoutes.VerifyUser, data);

        // Return the response
        return response;
    }

    return verifyUser;
}

// Api call to resend verification code
export function useResendVerificationCode() {
    async function resendVerificationCode(userId: string) {
        // Fire the request
        const response = await API.get(
            `${ApiRoutes.ResendVerificationCode}?id=${userId}`
        );

        // Return the response
        return response;
    }

    return resendVerificationCode;
}

// Api call to login buyer
export function useLoginBuyer() {
    async function loginBuyer(data: LoginBuyer) {
        // Fire the request
        const response = await API.post(ApiRoutes.LoginBuyer, data);

        // Return the response
        return response;
    }

    return loginBuyer;
}

// Api call to check if user is logged in
export function useFetchAccountStatus() {
    async function fetchAccountStatus() {
        // Fire the request
        const response = await API.get(ApiRoutes.AccountStatus);

        // Return the response
        return response;
    }

    return fetchAccountStatus;
}

// Api call to logout
export function useLogout() {
    async function logOut() {
        // Fire the request
        const response = await API.get(ApiRoutes.Logout);

        // Return the response
        return response;
    }

    return logOut;
}

// Api call to fetch categories
export function useFetchCategories() {
    async function categories(page: number, limit: number) {
        // Fire the request
        const response = await API.get(
            `${ApiRoutes.FetchCategories}?_page=${page}&_limit=${limit}`
        );

        // Return the response
        return response;
    }

    return categories;
}

// Api call to fetch all categories
export function useFetchCategoriesWithoutProducts() {
    async function categories() {
        // Fire the request
        const response = await API.get(`${ApiRoutes.FetchAllCategories}`);

        // Return the response
        return response;
    }

    return categories;
}

// Api call to fetch single category
export function useFetchSingleCategory() {
    async function fetchCategory(id: string) {
        // Fire the request
        const response = await API.get(`${ApiRoutes.FetchSingleCategory}/${id}`);

        // Return the response
        return response;
    }

    return fetchCategory;
}

// Api call to fetch all stores
export function useFetchAllStores() {
    async function fetchAllStores() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchAllStores);

        // Return the response
        return response;
    }

    return fetchAllStores;
}

// Api call to fetch a store
export function useFetchAStore() {
    async function fetchStore(id: string) {
        // Fire the request
        const response = await API.get(`${ApiRoutes.FetchAStore}/${id}`);

        // Return the response
        return response;
    }

    return fetchStore;
}

// Api call to fetch categories from a store
export function useStoreCategories() {
    async function fetchStoreCategories(id: string) {
        // Construct the URL with the ID and categories endpoint
        // const url = `${ApiRoutes.FetchCategoriesFromAStore}/${id}/categories`;
        const url = `api/stores/store/id/${id}/categories`;

        // Fire the request
        const response = await API.get(url);
        // Return the response
        return response;
    }

    return fetchStoreCategories;
}

// Api call to fetch products from a store
export function useStoreProducts() {
    async function fetchStoreProducts(id: string) {
        // Construct the URL with the ID and categories endpoint
        const url = `api/stores/store/id/${id}/products`;
        // Fire the request
        const response = await API.get(url);
        // Return the response
        return response;
    }

    return fetchStoreProducts;
}

// Api call to fetch product
export function useFetchProduct() {
    async function fetchProduct(id: string) {
        // Fire the request
        const response = await API.get(`${ApiRoutes.FetchProduct}/${id}`);

        // Return the response
        return response;
    }

    return fetchProduct;
}

// Api call to fetch cart items
export function useFetchCartItems() {
    async function fetchCartItems() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchCartItems);

        // Return the response
        return response;
    }

    return fetchCartItems;
}
// Api call to fetch seller store
export function useFetchSellerStore() {
    async function fetchSellerStore() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchSellerStore);

        // Return the response
        return response;
    }

    return fetchSellerStore;
}

// Api call to fetch seller products
export function useFetchSellerProducts() {
    async function fetchSellerProducts() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchSellerProducts);

        // Return the response
        return response;
    }

    return fetchSellerProducts;
}

// Api call to fetch drafts
export function useFetchDrafts() {
    async function fetchDrafts() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchDrafts);

        // Return the response
        return response;
    }

    return fetchDrafts;
}

// Api call to add product
export function useAddProduct() {
    /**
     * Send request to API server to add product
     * @returns The response for the API request
     */
    async function addProduct(data: FormData) {
        // Send request to add product
        let response = await API.post(ApiRoutes.AddProduct, data);

        // Return response
        return response;
    }

    // Return function to add product
    return addProduct;
}

// Api call to add store to favorite
export function useAddStoreToFavorite() {
    /**
     * Send request to API server to add store to favorite
     * @returns The response for the API request
     */
    async function addStoreToFavorite(id: string) {
        // Send request to add store to favorite
        let response = await API.post(ApiRoutes.AddStoreToFavorite, { id: id });

        // Return response
        return response;
    }

    // Return function to add StoreToFavorite
    return addStoreToFavorite;
}

// Api call to add Product to favorite
export function useAddProductsToFavorite() {
    /**
     * Send request to API server to add Product to favorite
     * @returns The response for the API request
     */
    async function addProductToFavorite(id: string) {
        // Send request to add Product to favorite
        let response = await API.post(ApiRoutes.AddProductsToFavorite, { id: id });

        // Return response
        return response;
    }

    // Return function to add ProductToFavorite
    return addProductToFavorite;
}

// Api call to remove store from favorite
export function useRemoveStoreFromFavorite() {
    /**
     * Send request to API server to removr store from favorite
     * @returns The response for the API request
     */
    async function RemoveFavoriteStore(id: string) {
        // Send request to add store to favorite
        let response = await API.delete(`${ApiRoutes.RemoveFavoriteStore}/${id}`);

        // Return response
        return response;
    }

    // Return function to add StoreToFavorite
    return RemoveFavoriteStore;
}

// Api call to remove product from favorite
export function useRemoveProductFromFavorite() {
    /**
     * Send request to API server to removr Product from favorite
     * @returns The response for the API request
     */
    async function RemoveFavoriteProduct(id: string) {
        // Send request to add Product to favorite
        let response = await API.delete(`${ApiRoutes.RemoveFavoriteProduct}/${id}`);

        // Return response
        return response;
    }

    // Return function to add ProductToFavorite
    return RemoveFavoriteProduct;
}
// Api call to remove product
export function useRemoveProduct() {
    /**
     * Send request to API server to removr Product
     * @returns The response for the API request
     */
    async function RemoveProduct(id: string) {
        // Send request to delete Product
        let response = await API.delete(`${ApiRoutes.RemoveProduct}/${id}`);

        // Return response
        return response;
    }

    // Return function to delete Product
    return RemoveProduct;
}

// Api call to fetch favorite stores
export function useFetchFavoriteStores() {
    async function fetchFavoriteStores() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchFavoriteStores);

        // Return the response
        return response;
    }

    return fetchFavoriteStores;
}

// Api call to fetch favorite products
export function useFetchFavoriteProducts() {
    async function fetchFavoriteProducts() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchFavoriteProducts);

        // Return the response
        return response;
    }

    return fetchFavoriteProducts;
}

// Api call to update profile
export function useUpdateProfile() {
    /**
     * Send request to API server to update a Profile
     * @returns The response for the API request
     */
    async function updateProfile(data: FormData) {
        // Send request to update a Profile
        let response = await API.patch(`${ApiRoutes.UpdateProfile}`, data);

        // Return response
        return response;
    }

    // Return function to update a Profile
    return updateProfile;
}

// Api call to fetch reviews
export function useFetchReviews() {
    async function fetchReviews() {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchReviews);

        // Return the response
        return response;
    }

    return fetchReviews;
}
export function useFetchStoreReview() {
    async function fetchReview(storeId: string) {
        // Fire the request
        const response = await API.get(ApiRoutes.FetchStoreReview(storeId));

        // Return the response
        return response;
    }

    return fetchReview;
}