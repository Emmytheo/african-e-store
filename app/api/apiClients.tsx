import axios from "axios";
import ApiRoutes from "./apiRoutes";
import { LoginBuyer, RegisterBuyerRequest } from "../components/models/IRegisterBuyer";
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
        const response = await API.get(`${ApiRoutes.FetchCategories}?_page=${page}&_limit=${limit}`);

        // Return the response
        return response;
    }

    return categories;
}

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