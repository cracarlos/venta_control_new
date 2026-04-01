import { setIsLoading, setModalName, setModalOpen } from "@/store/UI/uiSlices";
import { useAppDispatch, useAppSelector } from "./useStore"

export const useUiStore = () => {
    const dispatch = useAppDispatch();
    
    const { isLoading, modalOpen, modalName } = useAppSelector(state => state.ui);

    const _setIsLoading = (value: boolean) => {
        dispatch(setIsLoading(value));
    };
    
    const _setModalOpen = (value: boolean) => {
        dispatch(setModalOpen(value));
    };
    
    const _setModalName = (value: string) => {
        dispatch(setModalName(value));
    };

    return{
        // Methods
        _setIsLoading,
        _setModalOpen,
        _setModalName,
        
        // Properties
        isLoading,
        modalOpen,
        modalName,
    }
}