'use client';
import React, { useEffect, useState } from 'react';
import styles from '../stores/[storeId]/SellerStore.module.scss';
import useResponsiveness from '../components/hooks/responsiveness-hook';
import SellerProduct from './SellerProduct';
import AddProductModal from './AddProductModal';
import AboutSeller from './AboutSeller';
import SellerPageStoreRating from './SellerStoreRating';
import { useFetchDrafts, useFetchSellerProducts, useFetchSellerStore, useFetchStoreOrders, useRemoveProduct } from '../api/apiClients';
import { DraftResponse, SellerProductsResponse, SellerStoreResponse, StoreOrderResponse } from '../components/models/ISellerStore';
import { toast } from 'sonner';
import { createCustomErrorMessages } from '../components/constants/catchError';
import DraftSection from './DraftSection';
import FeedBack from './FeedBack';
import Orders from './Orders';
import { StorageKeys } from '../components/constants/StorageKeys';
type Props = {};

enum TabIndex {
    Shop = '1',
    Orders = '2',
    About = '3',
    Draft = '4',
    Feedback = '5',
}

const SellerHomePage = (props: Props) => {

    const fetchSellerStore = useFetchSellerStore()
    const fetchSellerProducts = useFetchSellerProducts()
    const removeProduct = useRemoveProduct()
    const fetchDrafts = useFetchDrafts()
    const fetchOrders = useFetchStoreOrders()

    const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.Shop);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof isMobile == 'boolean' && isMobile;

    const [store, setStore] = useState<SellerStoreResponse>()
    const [selectedStore, setSelectedStore] = useState<SellerStoreResponse>();
    const [products, setProducts] = useState<SellerProductsResponse[]>()
    const [selectedProduct, setSelectedProduct] = useState<SellerProductsResponse>()
    const [drafts, setDrafts] = useState<DraftResponse[]>()
    const [orders, setOrders] = useState<StoreOrderResponse[]>()

    const [isFetchingStore, setIsFetchingStore] = useState<boolean>(true);
    const [isFetchingProducts, setIsFetchingProducts] = useState<boolean>(true);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [isFetchingDrafts, setIsFetchingDrafts] = useState<boolean>(true);
    const [isFetchingOrders, setIsFetchingOrders] = useState<boolean>(true);

    async function handleFetchStore() {

        // Start loader
        setIsFetchingStore(true);

        await fetchSellerStore()
            .then((response) => {
                // console.log("Response: ", response.data.data);
                setStore(response.data.data);
            })
            .catch((error) => {
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsFetchingStore(false);
            });
    }
    async function handleFetchProducts({ clearPreviousProducts = false }) {

        // Start loader

        if (clearPreviousProducts) {
            // Clear previous configurations
            setProducts(undefined);
            // Show loader
            setIsFetchingProducts(true);
        }
        await fetchSellerProducts()
            .then((response) => {
                // console.log("Response: ", response.data.data);
                setProducts(response.data.data);
            })
            .catch((error) => {
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsFetchingProducts(false);
            });
    }
    async function handleFetchDrafts({ clearPreviousProducts = false }) {

        // Start loader

        if (clearPreviousProducts) {
            // Clear previous configurations
            setDrafts(undefined);
            // Show loader
            setIsFetchingDrafts(true);
        }
        await fetchDrafts()
            .then((response) => {
                console.log("Response: ", response.data.data);
                setDrafts(response.data.data);
            })
            .catch((error) => {
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsFetchingDrafts(false);
            });
    }
    async function handleFetchOrders() {

        // Show loader
        setIsFetchingOrders(true);
        await fetchOrders()
            .then((response) => {
                console.log("Response: ", response.data.data);
                setOrders(response.data.data);
                sessionStorage.setItem(StorageKeys.OrderId, JSON.stringify(response.data.data));
            })
            .catch((error) => {
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsFetchingOrders(false);
            });
    }

    async function handleRemoveProduct(id: string) {
        setIsDeletingId(id);
        await removeProduct(id)
            .then((response) => {

                handleFetchProducts({ clearPreviousProducts: true });
                handleFetchDrafts({ clearPreviousProducts: true });
                // Display success 
                toast.success('Product Deleted.');

            })
            .catch((error) => {
                // Display error
                const errorMessage = createCustomErrorMessages(error.response?.data)
                toast.error(errorMessage)
            })
            .finally(() => {

                // Close laoder 
                setIsDeletingId(null);
            })
    };

    useEffect(() => {
        handleFetchStore();
        handleFetchProducts({ clearPreviousProducts: true });
        handleFetchDrafts({ clearPreviousProducts: true });
        handleFetchOrders()
    }, []);

    return (
        <div className={styles.main}>
            <SellerPageStoreRating
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                handleFetchStore={handleFetchStore}
                store={store}
                isFetchingStore={isFetchingStore}
            />
            <AddProductModal
                visibility={isAddProductModalVisible}
                setVisibility={setIsAddProductModalVisible}
                handleFetchProducts={handleFetchProducts}
            />

            {onMobile &&
                activeTab === TabIndex.Shop &&
                <div
                    onClick={() => setIsAddProductModalVisible(true)}
                    style={{ color: '#828282', fontSize: '16px', marginBottom: '1rem', width: 'fit-content', backgroundColor: '#ecf8f5', padding: '16px', borderRadius: '13px', height: 'fit-content' }}>
                    <p className='cursor-pointer w-fit'> Add Products to store</p>
                </div>}

            <div className={styles.tab}>
                {
                    activeTab === TabIndex.Shop &&
                    <div
                        style={{ color: '#828282', fontSize: '16px', backgroundColor: '#ecf8f5', padding: '16px', borderRadius: '13px', height: 'fit-content' }}
                        className={styles.lhs}
                        onClick={() => setIsAddProductModalVisible(true)}
                    >
                        <p className='cursor-pointer w-fit whitespace-nowrap'> Add Products to store</p>
                    </div>
                }

                <div className={styles.rhs}>
                    {/* {activeTab === TabIndex.Shop && <div className={styles.search}><SearchIcon /> <input type="text" placeholder='Search items in shop' /></div>} */}
                    <div className={styles.tabSection}>
                        <span
                            onClick={() => setActiveTab(TabIndex.Shop)}
                            className={activeTab === TabIndex.Shop ? styles.active : ''}
                        >
                            My products
                        </span>
                        <span
                            onClick={() => setActiveTab(TabIndex.Orders)}
                            className={activeTab === TabIndex.Orders ? styles.active : ''}
                        >
                            Orders {orders && <span className='!bg-[#2C7865] !text-white font-medium !text-sm !px-[5px] !py-[1px] rounded-full'>{orders?.length}</span>}
                        </span>
                        <span
                            onClick={() => setActiveTab(TabIndex.About)}
                            className={activeTab === TabIndex.About ? styles.active : ''}
                        >
                            About my store
                        </span>
                        <span
                            onClick={() => setActiveTab(TabIndex.Draft)}
                            className={activeTab === TabIndex.Draft ? styles.active : ''}
                        >
                            Draft
                        </span>
                        <span
                            onClick={() => setActiveTab(TabIndex.Feedback)}
                            className={activeTab === TabIndex.Feedback ? styles.active : ''}
                        >
                            Customer Feedbacks
                        </span>
                    </div>

                    {
                        activeTab === TabIndex.Shop &&
                        <SellerProduct
                            products={products}
                            isFetchingProducts={isFetchingProducts}
                            setIsAddProductModalVisible={setIsAddProductModalVisible}
                            isDeletingId={isDeletingId}
                            handleRemoveProduct={handleRemoveProduct}
                            handleFetchProducts={handleFetchProducts}
                            selectedProduct={selectedProduct}
                            setSelectedProduct={setSelectedProduct}
                        />
                    }

                    {
                        activeTab === TabIndex.Orders &&
                        <Orders
                            orders={orders}
                            isFetchingOrders={isFetchingOrders}
                        />
                    }

                    {
                        activeTab === TabIndex.About &&
                        <AboutSeller
                            store={store}
                            isFetchingStore={isFetchingStore}
                        />
                    }

                    {
                        activeTab === TabIndex.Draft && <DraftSection
                            isDeletingId={isDeletingId}
                            handleRemoveProduct={handleRemoveProduct}
                            drafts={drafts}
                            isFetchingDrafts={isFetchingDrafts}
                        />
                    }

                    {
                        activeTab === TabIndex.Feedback &&
                        <FeedBack />
                    }
                </div>
            </div>
        </div>
    );
};

export default SellerHomePage;
