import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import MenuCard from './MenuCard';
import cartService from '../../services/cartService';
import { useNavigate } from 'react-router-dom';
import * as toastr from 'toastr';

const _logger = debug.extend('PreCartMenu');

const Menus = () => {
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);
    const [items, setItems] = useState([]);
    const [orgNames, setOrgNames] = useState([]);
    const [summary, setSummary] = useState({
        grossTotal: 0,
        discount: 0,
        shippingCharge: 0,
        tax: 0,
        netTotal: 0,
    });
    const [navData, setNavData] = useState({});

    useEffect(() => {
        cartService.getRandomMenuItems().then(onGetRandomMenuItemsSuccess).catch(onGetRandomMenuItemsErr);
        cartService.getAllByCreatedBy(5).then(onGetByCreatedBy).catch(getAllByCreatedBy);
    }, []);

    const onGetRandomMenuItemsErr = (data) => {
        _logger('onErr fired!: ', data);
        toastr.error('Unable to make that request.');
    };
    const getAllByCreatedBy = (data) => {
        _logger('Error getting users items: ', data);
        toastr.error('Error getting users items');
    };

    const onGetByCreatedBy = (data) => {
        // _logger('data.items: ', data.items);
        const serverItems = data.items;
        for (const item of serverItems) {
            item.total = item.quantity * item.unitCost; //pushes total prop on each record
        }
        setItems((prevState) => {
            let localItems = { ...prevState };
            localItems = serverItems;
            //extract orgNames for dropdown menu
            const orgNamesArray = localItems.map((item) => {
                let listOrgNames = item.organizationName;
                return listOrgNames;
            });
            setOrgNames(...orgNames, orgNamesArray);
            return localItems;
        });

        setSummary((prevState) => {
            let localSummary = { ...prevState };
            const itemsTotalSum = serverItems.reduce((accumulator, item) => {
                return accumulator + item.total;
            }, 0);
            localSummary.grossTotal = itemsTotalSum;
            localSummary.shippingCharge = localSummary.grossTotal * 0.0;
            localSummary.tax = (localSummary.grossTotal + localSummary.shippingCharge) * 0.0;
            localSummary.netTotal =
                localSummary.grossTotal + localSummary.shippingCharge + +localSummary.tax - localSummary.discount;
            return localSummary;
        });
    };

    const onGetRandomMenuItemsSuccess = (data) => {
        let itemsArray = data.items;

        setMenuData((prevState) => {
            const prevData = { ...prevState };
            prevData.itemsArray = itemsArray;
            prevData.menuComponents = itemsArray.map(mapMenus);
            return prevData;
        });
    };
    //Grandchild component addToCart.jsx triggered.Below data for navigation
    const onMenuCardNotification = (newItemId, currentUserId, currentOrg) => {
        _logger('onMenuCardNotification', newItemId, currentUserId, currentOrg);
        setNavData({ itemId: newItemId, userId: currentUserId, org: currentOrg });
    };
    const mapMenus = (menuItem) => {
        return (
            <Col md={2} xxl={4} key={'menuItem-' + menuItem.id}>
                <MenuCard menuData={menuItem} childSummary={summary} change={onMenuCardNotification} />
            </Col>
        );
    };
    //navToCart passes data for the Cart's conditional rendering of items based on the last organization that was last selected
    const navToCart = () => {
        _logger('navigating w/ navData: ', navData);
        navigate('/cart');
    };

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={9}>
                                    <div className="d-flex flex-wrap">{menuData.menuComponents}</div>
                                </Col>
                                <Col lg={3}>
                                    {' '}
                                    <div className="border p-2 mt-4 mt-lg-0 rounded">
                                        <h4 className="header-title mb-3">Cart Preview</h4>
                                        <Table responsive className="mb-0">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <b>Item</b>
                                                    </td>
                                                    <td>
                                                        <b>Qty</b>
                                                    </td>
                                                </tr>
                                                {items.map((item) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>{item.menuItemName}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>
                                                                <FaTrash></FaTrash>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr>
                                                    <th>Total :</th>
                                                    <th>${summary.netTotal.toFixed(2)}</th>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="danger" value="1" onClick={navToCart}>
                                            Go to Cart
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Menus;
