import { deleteProduct, getProductId, getProducts, postProducts, putProducts } from '@/services/productsServices'
import type { Product, ProductRegister } from '@/types/product';
import { useAppDispatch, useAppSelector } from './useStore';
import { cleanProduct, setProduct } from '@/store/Product/productSlice';

export const useProductsStore = () => {
    const productData = useAppSelector(state => state.product);

    const dispatch = useAppDispatch();

    const _getProducts = async (): Promise<Product[]> => {
        const resp = await getProducts();
        return resp;
    };
    
    const _getProductById = async (productId:number) => {
        const resp = await getProductId(productId);
        dispatch(setProduct(resp));
    }
    
    const _createProduct = async (product: ProductRegister) => {
        const resp = await postProducts(product);
        return resp;
    }
    
    const _editProduct = async (product: ProductRegister) => {
        const resp = await putProducts(product);
        return resp;
    }

    const _deleteProduct = async (id:number) => {
        const resp = await deleteProduct(id);
        return resp;
    }
    
    const _cleanProduct = async () => {
        dispatch(cleanProduct());
    }

    return {
        _getProducts,
        _getProductById,
        _createProduct,
        _editProduct,
        _deleteProduct,
        _cleanProduct,
        productData,
    }
}
