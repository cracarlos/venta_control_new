import { useEffect, useState, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "./ui/spinner"
import { toast } from "sonner"

import type { ProductRegister } from "@/types/product"
import { useProductsStore } from "@/hooks/useProductsStore"
import { useUiStore } from "@/hooks/useUiStore"
import { setIsLoading } from "@/store/UI/uiSlices"
import { AlertPerson } from "./AlertPerson"

export const ProductModal = () => {
    const {register, handleSubmit, setValue, getValues, reset, formState: {isValid}} = useForm<ProductRegister>({
        mode: "onChange"
    });

    useEffect(() => {
        register("image");
    }, [register]);

    const { modalOpen, _setModalOpen, isLoading } = useUiStore();

    const { productData, _cleanProduct, _createProduct, _editProduct } = useProductsStore();

    const inputRef = useRef<HTMLButtonElement>(null);

    const { _setIsLoading } = useUiStore();

    const [apiResp, setApiResp] = useState<any>(null)

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        reset();
        setApiResp(null);
        setIsLoading(false);
        _cleanProduct();
        setImagePreview(null);
    };

    const onSubmit: SubmitHandler<ProductRegister> = async () => {
        _setIsLoading(true);

        const dataNew = getValues();
        console.log(dataNew);

        if (productData.id == 0) {
            console.log('created')
            const resp = await _createProduct(dataNew);
            console.log(resp);
            setApiResp(resp)
        
            if (resp.status == 201) {
                toast.success("Producto creado exitosamente.", { position: "bottom-right" })
                _setIsLoading(false);
                _setModalOpen(false);
                reset();
            } else {
                _setIsLoading(false);
            }
            
        } else {
            console.log('edit-guardado');
            setValue("id", productData.id);
            const dataEdit = getValues();
            const resp = await _editProduct(dataEdit);
            setApiResp(resp);

            if (resp.status == 200) {
                toast.success("Producto editado exitosamente.", { position: "bottom-right" })
                _setIsLoading(false);
                _setModalOpen(false);
                reset();
            } else {
                _setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        setValue("product_name", productData.product_name);
        setValue("product_description", productData.product_description);
        setValue("quantity", productData.quantity);
        setValue("price", productData.price);
        if (productData.image) {
            setImagePreview(productData.image);
        }
    }, [productData])

    useEffect(() => {
        handleCancel();
    }, [modalOpen])
    
  return (
    <Dialog open={modalOpen} onOpenChange={_setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>{productData.id == 0 ? "Agregar producto" : "Editar producto"}</DialogTitle>
                <DialogDescription>
                    Campos con <span className="text-red-500">*</span> son obligatorios.
                </DialogDescription>
                {
                    apiResp?.status == 400 || apiResp?.status == 500 ?
                        <AlertPerson ok={false} message={apiResp?.data} title={apiResp?.statusText} />
                    : ''
                }
            </DialogHeader>
            <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pr-2 py-4">
                <div className="grid gap-4 py-4">
                    <Field>
                        <Label htmlFor="product_name"> <span className="text-red-500">*</span>Nombre del producto</Label>
                        <Input 
                            id="product_name" 
                            {... register("product_name", { required: true, minLength: 2, maxLength: 40 })} 
                            placeholder="Nombre del producto"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="product_description"> <span className="text-red-500">*</span>Descripción</Label>
                        <Input 
                            id="product_description" 
                            {... register("product_description", { required: true, minLength: 5, maxLength: 200 })} 
                            placeholder="Descripción del producto"
                        />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="quantity"> <span className="text-red-500">*</span>Cantidad</Label>
                            <Input 
                                id="quantity" 
                                {... register("quantity", { required: true, min: 1, valueAsNumber: true })} 
                                type="number"
                                min="1"
                                placeholder="0"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="price"> <span className="text-red-500">*</span>Precio</Label>
                            <Input 
                                id="price" 
                                {... register("price", { required: true })} 
                                type="text"
                                placeholder="0.00"
                            />
                        </Field>
                    </div>

                    <Field>
                        <Label htmlFor="image">Imagen del producto</Label>
                        <Input 
                            id="image" 
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2 relative w-32 h-32">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6"
                                    onClick={() => { setImagePreview(null); setValue('image', null); }}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                        {!imagePreview && productData.image && (
                            <div className="mt-2 relative w-32 h-32">
                                <img src={productData.image} alt="Producto" className="w-full h-full object-cover rounded-lg border" />
                            </div>
                        )}
                    </Field>
                </div>
            </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={inputRef} variant="outline" onClick={handleCancel}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="product-form" disabled={isLoading || !isValid}>
                {isLoading ? <Spinner /> : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
