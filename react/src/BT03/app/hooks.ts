import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * ============================================================================
 * TYPED REDUX HOOKS - BT03
 * Thư mục chuẩn: app/hooks.ts
 * Sử dụng toàn bộ trong components thay cho plain useDispatch/useSelector
 * ============================================================================
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
