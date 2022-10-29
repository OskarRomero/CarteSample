import { lazy } from 'react';

const AnalyticsDashboards = lazy(() => import('../pages/dashboard/Analytics'));
const SubscriptionAdminView = lazy(() => import('../components/newsletter/SubscriptionAdminViews'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const BlogsForm = lazy(() => import('../components/blogs/BlogsForm'));
const Menus = lazy(() => import('../pages/menus/Menus'));
const MenuItemTable = lazy(() => import('../pages/menuitems/MenuItems'));
const MenuItemBuilder = lazy(() => import('../pages/menuitems/MenuItemBuilder'));
const MenuBuilderContainer = lazy(() => import('../pages/menus/MenuBuilderContainer'));

// apps
const Chat = lazy(() => import('../pages/chat/Chat'));

const QRLinksGenerator = lazy(() => import('../components/qr/links/QRLinksGenerator'));
const QRLinksPage = lazy(() => import('../components/qr/links/QRLinksPage'));
// employees
const Employees = lazy(() => import('../components/employee/Employees'));
const EmployeesForm = lazy(() => import('../components/employee/EmployeeForm'));
const EmployeeView = lazy(() => import('../components/employee/EmployeeDetails'));
const OrgWizard = lazy(() => import('../pages/wizard/OrgWizard'));
const OrgInvite = lazy(() => import('../pages/wizard/OrgInvite'));
const LicenseUserPage = lazy(() => import('../components/licenses/LicenseUserPage'));

//tags
const MenuItemTags = lazy(() => import('../components/tags/MenuItemTags'));
const AddTag = lazy(() => import('../components/tags/AddTag'));
//userProfiles
const UserProfileForm = lazy(() => import('../components/userprofile/UserProfileForm'));
const UserProfile = lazy(() => import('../components/userprofile/UserProfileList'));
const UserProfileView = lazy(() => import('../components/userprofile/SingleUserProfile'));

//ingredients
const Ingredients = lazy(() => import('../components/ingredients/Ingredients'));
const IngredientAdd = lazy(() => import('../components/ingredients/IngredientAdd'));
const Cart = lazy(() => import('../pages/cart/Cart'));
const PreCartMenu = lazy(() => import('../pages/cart/PreCartMenu'));

//alternate ingredients
const AlternateIngredientsParentForm = lazy(() =>
    import('../components/alternateingredients/AlternateIngredientsParentForm')
);

//location
const LocationForm = lazy(() => import('../pages/location/LocationFormContainer'));
const UserLocations = lazy(() => import('../pages/location/UserLocations'));

const AdminDashboard = lazy(() => import('../pages/admindashboard/AdminDashboard'));

//dashboard
const Dashboard = lazy(() => import('../pages/dashboard/Analytics/organization/Dashboard'));
const LicensesAdminPage = lazy(() => import('../components/licenses/LicensesAdminPage'));
const MenuEditorDash = lazy(() => import('../components/dashboard/menueditor/MenuEditorDash'));
const OrdersManagement = lazy(() => import('../pages/orders/OrdersManagement'));

const InternalAnalytics = lazy(() => import('../pages/analytics/InternalAnalytics'));
const CheckoutSuccess = lazy(() => import('../checkout/CheckoutSuccessPage'));
const Checkout = lazy(() => import('../checkout/SubscriptionCheckout'));
const ShareStory = lazy(() => import('../components/stories/ShareStory'));
const DragDrop = lazy(() => import('../pages/landing/DragDrop'));
const UserDashboard = lazy(() => import('../pages/userdashboard/UserDashboard'));

//rating
const Rating = lazy(() => import('../components/rating/RatingParent'));

const chat = [
    {
        path: '/chat',
        name: 'Chat',
        element: Chat,
        roles: ['Customer', 'Employee', 'MenuEditor', 'SysAdmin', 'OrgAdmin'],
        exact: true,
        isAnonymous: false,
    },
];
const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboards',
        icon: 'uil-home-alt',
        header: 'Navigation',
        children: [
            {
                path: '/dashboard/analytics',
                name: 'Analytics',
                element: AnalyticsDashboards,
                roles: ['SysAdmin'],
                exact: true,
                isAnonymous: false,
            },
            {
                path: '/dashboards/internalanalytics',
                name: 'InternalAnalytics',
                element: InternalAnalytics,
                roles: ['SysAdmin'],
                exact: true,
                isAnonymous: false,
            },
        ],
    },
    {
        path: `/dashboards/menueditor`,
        name: `Overview`,
        element: MenuEditorDash,
        roles: ['MenuEditor', 'OrgAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/dashboard/organization',
        name: 'Organization Dashboard',
        element: Dashboard,
        roles: ['OrgAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/dashboard',
        name: 'User Dashboard',
        exact: true,
        element: UserDashboard,
        roles: ['Customer', 'Employee'],
        isAnonymous: false,
    },
];

const adminDashboardRoutes = [
    {
        path: '/admin/dashboard/analytics',
        name: 'AdminDashboard',
        element: AdminDashboard,
        roles: ['SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
];

const menuItemsRoutes = [
    {
        path: '/menuitem',
        name: 'MenuItemById',
        element: MenuItemTable,
        roles: ['MenuEditor', 'OrgAdmin', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/menuitem/builder',
        name: 'MenuItemBuilder',
        element: MenuItemBuilder,
        roles: ['SysAdmin', 'Admin', 'MenuEditor', 'OrgAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/menuitem/builder/:id',
        name: 'MenuItemBuilder',
        element: MenuItemBuilder,
        roles: ['MenuEditor', 'OrgAdmin'],
        exact: true,
        isAnonymous: false,
    },
];

const menuRoutes = [
    {
        path: '/menus',
        name: 'Menus',
        element: Menus,
        roles: ['OrgAdmin', 'MenuEditor', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/menus/menubuilder',
        name: 'MenuBuilderContainer',
        element: MenuBuilderContainer,
        roles: ['OrgAdmin', 'MenuEditor', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/dragdrop',
        name: 'DragDrop',
        exact: true,
        element: DragDrop,
        roles: ['OrgAdmin'],
        isAnonymous: true,
        isSimple: false,
    },
];

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
const employeeRoutes = [
    {
        path: '/employeeform',
        name: 'AddEmployee',
        exact: true,
        element: EmployeesForm,
        roles: ['OrgAdmin', 'SysAdmin'],
        isAnonymous: false,
    },
    {
        path: '/employees',
        name: 'Employees',
        exact: true,
        element: Employees,
        roles: ['OrgAdmin', 'SysAdmin'],
        isAnonymous: false,
    },
    {
        path: '/employeeform/edit/:id',
        name: 'Edit Employees',
        exact: false,
        element: EmployeesForm,
        roles: ['OrgAdmin', 'SysAdmin'],
        isAnonymous: false,
    },
    {
        path: '/employees/view/:id',
        name: 'View Employees',
        exact: false,
        element: EmployeeView,
        roles: ['OrgAdmin', 'SysAdmin'],
        isAnonymous: false,
    },
];

const NewsletterAdmin = [
    {
        path: '/admin/newslettersubscription',
        name: 'NewsletterSubscriptionAdmin',
        element: SubscriptionAdminView,
        roles: ['Admin', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
        isSimple: false,
    },
];

const tags = [
    {
        path: '/menuitemtags',
        name: 'Menu Item Tags',
        exact: true,
        element: MenuItemTags,
        roles: ['SysAdmin', 'Admin', 'OrgAdmin', 'MenuEditor'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/menuitemtags/addtag',
        name: 'Add Tag',
        exact: true,
        element: AddTag,
        roles: ['SysAdmin', 'Admin', 'OrgAdmin', 'MenuEditor'],
        isAnonymous: false,
        isSimple: false,
    },
];

const test = [
    {
        path: '/test',
        name: 'Test',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['Fail'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/secured',
        name: 'A Secured Route',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['Fail'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/secured2',
        name: 'A Secured Route',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['SysAdmin'],
        isAnonymous: false,
    },
];

const orgRoutes = [
    {
        path: '/organizations',
        name: 'OrgWizard',
        element: OrgWizard,
        roles: ['OrgAdmin', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/licenses',
        name: 'AddUserLicense',
        exact: true,
        element: LicenseUserPage,
        roles: ['Customer'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/organizations/invite',
        name: 'OrgInvite',
        element: OrgInvite,
        roles: ['OrgAdmin', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/licensesAdmin',
        name: 'licenseAdmin',
        exact: true,
        element: LicensesAdminPage,
        roles: ['OrgAdmin'],
        isAnonymous: false,
        isSimple: false,
    },
];

const blogRoutes = [
    {
        path: '/blogs/admin',
        name: 'Blogs',
        element: BlogsForm,
        roles: ['OrgAdmin', 'SysAdmin'],
        exact: true,
        isAnonymous: false,
    },
    {
        path: '/blogs/admin/:id/edit',
        name: 'Blogs',
        exact: true,
        element: BlogsForm,
        roles: ['OrgAdmin', 'SysAdmin'],
        isAnonymous: false,
    },
];

const errorRoutes = [
    {
        path: '*',
        name: 'Error - 404',
        element: PageNotFound,
        roles: [],
        exact: true,
        isAnonymous: false,
        isSimple: false,
    },
];
const ingredients = [
    {
        path: '/ingredients',
        name: 'Ingredients',
        exact: true,
        element: Ingredients,
        roles: ['OrgAdmin', 'MenuEditor'],
        isAnonymous: false,
    },
    {
        path: '/ingredient/add',
        name: 'Create Ingredients',
        exact: true,
        element: IngredientAdd,
        roles: ['OrgAdmin', 'MenuEditor'],
        isAnonymous: false,
    },
    {
        path: '/ingredient/edit/:id',
        name: 'Ingredient Add',
        exact: true,
        element: IngredientAdd,
        roles: ['OrgAdmin', 'MenuEditor'],
        isAnonymous: false,
    },
];
const alternateIngredients = [
    {
        path: 'menus/items/ingredients/alternates',
        name: 'Alternate Ingredient Add',
        exact: true,
        element: AlternateIngredientsParentForm,
        roles: ['OrgAdmin', 'MenuEditor', 'SysAdmin'],
        isAnonymous: false,
    },
];

const profileRoutes = [
    {
        path: '/users/profiles',
        name: 'UserProfile',
        exact: true,
        element: UserProfile,
        roles: ['SysAdmin'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/users/profiles/add',
        name: 'UserProfileForm',
        exact: true,
        element: UserProfileForm,
        roles: ['Customer', 'SysAdmin'],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/users/profiles/:id/edit',
        name: 'UserProfileForm',
        exact: true,
        element: UserProfileForm,
        roles: [],
        isAnonymous: false,
        isSimple: false,
    },
    {
        path: '/users/profiles/:id',
        name: 'UserProfileView',
        exact: true,
        element: UserProfileView,
        roles: ['SysAdmin', 'Customer', 'OrgAdmin', 'MenuEditor', 'Employee'],
        isAnonymous: false,
        isSimple: false,
    },
];

const locationRoutes = [
    {
        path: '/location/edit/:id',
        name: 'LocationUpdate',
        exact: true,
        element: LocationForm,
        roles: ['SysAdmin', 'Customer', 'OrgAdmin', 'Employee'],
        isAnonymous: false,
    },
    {
        path: '/location/add',
        name: 'LocationForm',
        exact: true,
        element: LocationForm,
        roles: ['SysAdmin', 'Customer', 'OrgAdmin', 'Employee'],
        isAnonymous: true,
    },
    {
        path: '/userlocations',
        name: 'UserLocations',
        exact: true,
        element: UserLocations,
        roles: ['SysAdmin', 'Customer', 'OrgAdmin', 'Employee'],
        isAnonymous: true,
    },
];
const sharestoriesRoutes = [
    {
        path: '/sharestories',
        name: 'ShareStory',
        exact: true,
        element: ShareStory,
        roles: ['OrgAdmin'],
        isAnonymous: true,
    },
];
const subscriptionsRoutes = [
    {
        path: '/subscriptionscheckout',
        name: 'Checkout',
        exact: true,
        element: Checkout,
        roles: ['OrgAdmin'],
        isAnonymous: true,
    },
    {
        path: '/checkout',
        name: 'CheckoutSuccessPage',
        exact: true,
        element: CheckoutSuccess,
        roles: ['OrgAdmin'],
        isAnonymous: true,
    },
];

const stories = [
    {
        path: '/sharestories',
        name: 'ShareStory',
        exact: true,
        element: ShareStory,
        roles: ['OrgAdmin'],
        isAnonymous: true,
        isSimple: false,
    },
];
const qrLinks = [
    {
        path: '/qrlinks/generator',
        name: 'QRLinksGenerator',
        exact: true,
        element: QRLinksGenerator,
        roles: ['OrgAdmin', 'MenuEditor', 'Admin'],
        isAnonymous: true,
    },
    {
        path: '/qrlinks',
        name: 'QRLinksPage',
        exact: true,
        element: QRLinksPage,
        roles: ['OrgAdmin', 'MenuEditor', 'Admin'],
        isAnonymous: true,
    },
];
const ordersManagement = [
    {
        path: '/ordersmanagement',
        name: 'OrdersManagement',
        exact: true,
        element: OrdersManagement,
        roles: ['OrgAdmin', 'Employee'],
        isAnonymous: true,
    },
];

const ratingRoutes = [
    {
        path: '/ratings',
        name: 'RatingModal',
        exact: true,
        element: Rating,
        roles: ['Customer'],
        isAnonymous: false,
    },
];

const allRoutes = [
    ...alternateIngredients,
    ...dashboardRoutes,
    ...test,
    ...menuItemsRoutes,
    ...profileRoutes,
    ...NewsletterAdmin,
    ...cartItemRoutes,
    ...errorRoutes,
    ...employeeRoutes,
    ...orgRoutes,
    ...menuRoutes,
    ...ingredients,
    ...alternateIngredients,
    ...locationRoutes,
    ...tags,
    ...adminDashboardRoutes,
    ...menuRoutes,
    ...chat,
    ...subscriptionsRoutes,
    ...sharestoriesRoutes,
    ...stories,
    ...blogRoutes,
    ...qrLinks,
    ...ordersManagement,
    ...ratingRoutes,
];

export default allRoutes;
