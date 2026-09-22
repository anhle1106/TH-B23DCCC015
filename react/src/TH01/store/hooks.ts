import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * ============================================================================
 * TYPED REDUX HOOKS (BUỔI 3)
 * Sử dụng thay thế cho plain useDispatch và useSelector trong toàn ứng dụng
 * ============================================================================
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
