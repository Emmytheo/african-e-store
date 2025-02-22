'use client'
import React, { useEffect, useState } from 'react'
import styles from './SingleCategory.module.scss'
import AddProductToCart from '@/app/components/AddProductToCart'
import Recommendations from '@/app/components/Recommendations'
import SingleCategoryReviews from './SingleCategoryReviews'
import SingleCategoriesDetails from './SingleCategoriesDetails'
import { useAddProductsToFavorite, useFetchProduct, useRemoveProductFromFavorite } from '@/app/api/apiClients'
import { createCustomErrorMessages } from '@/app/components/constants/catchError'
import { toast } from 'sonner'
import { ProductResponse } from '@/app/components/models/IProduct'
import { useAccountStatus } from '@/app/context/AccountStatusContext'
import { useRouter } from 'next/navigation'

type Props = {
    params: {
        productId: string;
    }
}

const SingleProductPage = ({ params }: Props) => {
    const fetchProduct = useFetchProduct()
    const { accountStatus, fetchAccountStatus } = useAccountStatus();
    const router = useRouter()
    const productId = params.productId;
    const [product, setProduct] = useState<ProductResponse>();
    const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(true);
    console.log({ product })
    const addProductToFavorite = useAddProductsToFavorite();
    const removeProductFromFavorite = useRemoveProductFromFavorite()

    async function handleFetchProduct() {

        // Start loader
        setIsFetchingProduct(true);

        await fetchProduct(productId)
            .then((response) => {
                // console.log("Response: ", response.data.data);
                setProduct(response.data.data);
            })
            .catch((error) => {
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsFetchingProduct(false);
            });
    }

    async function handleAddProductToFavorite(id: string) {

        await addProductToFavorite(id)
            .then((response) => {

                // Log response 
                console.log(response);

                handleFetchProduct()
                // Display success 
                toast.success('Product added to favorite successfully.');
            })
            .catch((error) => {
                // Display error
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage)
            })
            .finally(() => {

                // Close laoder 
                // setIsLoading(false);
            })
    };

    async function handleRemoveProductFromFavorite(id: string) {

        await removeProductFromFavorite(id)
            .then((response) => {

                // Log response 
                // console.log(response);

                handleFetchProduct()
                // Display success 
                toast.success('Product removed from favorite successfully.');
            })
            .catch((error) => {
                // Display error
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage)
            })
            .finally(() => {

                // Close laoder 
                // setIsLoading(false);
            })
    };

    useEffect(() => {
        handleFetchProduct();
    }, []);

    // useEffect(() => {
    //     // Check if accountStatus changes and is falsy (not logged in)
    //     if (router && !accountStatus?.accountType) {
    //         // Redirect to login page immediately if not logged in
    //         router.push(`/login?id=${productId}`);
    //     }
    // }, [accountStatus, router.refresh()]);

    return (
        <div className={styles.main}>
            <AddProductToCart handleAddProductToFavorite={handleAddProductToFavorite}
                product={product}
                handleRemoveProductFromFavorite={handleRemoveProductFromFavorite}
                isFetchingProduct={isFetchingProduct}
            />
            <SingleCategoriesDetails product={product} />
            <SingleCategoryReviews product={product} />
            <Recommendations />
        </div>
    )
}

export default SingleProductPage