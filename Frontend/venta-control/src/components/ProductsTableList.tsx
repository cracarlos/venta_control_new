import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useProductsStore } from "@/hooks/useProductsStore";
import type { Product } from "@/types/product";
import { ProductsTabletCard } from "./ProductsTabletCard";
import { useUiStore } from "@/hooks/useUiStore";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useTasa } from "@/hooks/useTasa";

const getImageUrl = (image: string | null): string | undefined => {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000${image}`;
};

export const ProductsTableList = () => {
    const { _getProducts, _getProductById, _deleteProduct } = useProductsStore();
    const { _setModalOpen, _setModalName, isLoading } = useUiStore();
    const { formatPrice } = useTasa();

    const [products, setProducts] = useState<Product[]>([]);

    const getProductList = async () => {
        const resp = await _getProducts();
        setProducts(resp);
        return resp;
    };

    const getProductById = (productId: number) => {
        _getProductById(productId);
        return productId;
    };

    const handleModal = () => {
        _setModalName('product');
        _setModalOpen(true);
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            await _deleteProduct(id);
            getProductList();
        }
    }

    useEffect(() => {
        getProductList();
    }, [isLoading]);
    
  return (
    <ProductsTabletCard>
        <Table>
            <TableCaption>Productos del sistema</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>
                            {product.image && (
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.product_name}
                                    className="w-12 h-12 object-cover rounded-md"
                                />
                            )}
                        </TableCell>
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell>{product.product_description}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                            <span className="text-green-600 font-medium">${formatPrice(product.price).usd}</span>
                            <span className="text-muted-foreground text-xs ml-1">({formatPrice(product.price).bs} Bs)</span>
                        </TableCell>
                        <TableCell onClick={() => getProductById(product.id)}>
                            <Button variant="outline" onClick={handleModal}>
                                <Pencil />
                            </Button>
                            <Button className="ml-2" variant="destructive" onClick={() => handleDelete(product.id)} title="Eliminar">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </ProductsTabletCard>
  )
}
