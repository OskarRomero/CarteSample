import { lazy } from 'react';

const Cart = lazy(() => import('../pages/cart/Cart'));
const PreCartMenu = lazy(() => import('../pages/cart/PreCartMenu'));

const cartItemRoutes = [
    {
        path: '/cart',
        name: 'cart',
        exact: true,
        element: Cart,
        roles: ['Customer'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/precart',
        name: 'precart',
        exact: true,
        element: PreCartMenu,
        roles: ['Customer'],
        isAnonymous: false,
        isSimple: false,
    },
];

const allRoutes = [
    ...cartItemRoutes,
export default allRoutes;
