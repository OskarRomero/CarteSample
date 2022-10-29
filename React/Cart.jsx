import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Table, Col, Row, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import logger from 'sabio-debug';
import cartService from '../../services/cartService';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { Formik, Field } from 'formik';
import CartSummary from './CartSummary';
import checkoutService from '../../services/checkoutService';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import * as toastr from 'toastr';
import CartTableItem from './CartTableItem';
import MobileCard from './MobileCard';
import PropTypes from 'prop-types';

const _logger = logger.extend('Cart');
const stripePubKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const Cart = ({ currentUser }) => {
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState([]);
    const [items, setItems] = useState({
        orgItems: [],
        qtyItems: [],
        qtyItemsSum: 0,
    });
    const [cartLists, setcartLists] = useState({
        targetOrgItems: [],
        tableList: [],
        cardList: [],
    });
    const [summary, setSummary] = useState({
        grossTotal: 0,
        discount: 0,
        shippingCharge: 0,
        tax: 0,
        netTotal: 0,
    });
    const [dropdown, setDropdown] = useState({ dropdownArr: [], dropDownMenu: [] });
    const [selectedOrg, setSelectedOrg] = useState(`Lucca's`);
    const location = useLocation();
    useEffect(() => {
        //if cart preview passed payload, getAllByCreatedBy Id passed in else, get createdAllBy Id 5
        if (location?.state?.type === 'order_Data' && location?.state?.payload && location?.state?.payload?.userId) {
            _logger('location.state.payload:', location.state.payload);
            cartService.getAllByCreatedBy(location.state.payload.userId).then(onGetAllSuccess).catch(onGetAllErr);
        } else if (location.state === null) {
            cartService.getAllByCreatedBy(currentUser.id).then(onGetAllSuccess).catch(onGetAllErr);
        }
    }, [items.qtyItemsSum, selectedOrg]);

    const onGetAllErr = (data) => {
        toastr.error('Error getting all car items by user id', data);
    };

    const onGetAllSuccess = (data) => {
        const serverItems = data.items;
        for (const item of serverItems) {
            item.total = item.quantity * item.unitCost; //pushes total prop on each record
        }
        // get serverItems into allItems state, filter serverItems into selectedOrgItems that match selectedOrg state
        setAllItems(serverItems);
        _logger('serverItems: ', serverItems, 'allItems: ', allItems);
        const selectedOrgItems = serverItems.filter(itemFilter);
        function itemFilter(item) {
            return item.organizationName === selectedOrg;
        }

        setItems((prevState) => {
            let newItems = { ...prevState };
            newItems.orgItems = selectedOrgItems;
            const itemQtyMapper = (item) => {
                return item.quantity;
            };
            const itemQtyArr = newItems.orgItems.map(itemQtyMapper);
            newItems.qtyItems = itemQtyArr;
            newItems.qtyItemsSum = newItems.qtyItems.reduce((prevVal, currentVal) => prevVal + currentVal, 0);
            setcartLists((prevState) => {
                let newList = { ...prevState };
                newList.targetOrgItems = newItems.orgItems;
                const tableRowMapper = (item, idx, arr) => {
                    return (
                        <CartTableItem
                            key={idx}
                            idx={idx}
                            item={item}
                            arr={arr}
                            onQtyChange={onQtyChange}
                            onRemoveItem={onRemoveItem}
                        />
                    );
                };
                newList.tableList = newItems.orgItems.map((item, idx, arr) => {
                    return tableRowMapper(item, idx, arr);
                });
                const cardMapper = (item, idx, arr) => {
                    return (
                        <MobileCard
                            key={idx}
                            idx={idx}
                            item={item}
                            arr={arr}
                            onQtyChange={onQtyChange}
                            onRemoveItem={onRemoveItem}
                        />
                    );
                };
                newList.cardList = newItems.orgItems.map((item, idx, arr) => {
                    return cardMapper(item, idx, arr);
                });

                return newList;
            });

            //filter out duplicate orgNames for dropdown menu
            const uniqueItemsArr = serverItems.filter(itemIdNameFilter);
            function itemIdNameFilter(item, index, arr) {
                return (
                    index ===
                    arr.findIndex(
                        (currentItem) =>
                            currentItem.organizationId === item.organizationId &&
                            currentItem.organizationName === item.organizationName
                    )
                );
            }
            const orgNamesMapper = (item) => {
                return item.organizationName;
            };
            const uniqueOrgNamesArr = uniqueItemsArr.map(orgNamesMapper);
            setDropdown((prevState) => {
                let newDropdown = { ...prevState };
                newDropdown.dropdownArr = uniqueOrgNamesArr;
                const dropdownMapper = (orgName) => {
                    const targetValue = orgName;
                    return (
                        <option value={targetValue} key={`org-${targetValue}`}>
                            {' '}
                            {orgName}
                        </option>
                    );
                };
                newDropdown.dropDownMenu = uniqueOrgNamesArr.map(dropdownMapper);

                return newDropdown;
            });
            return newItems;
        });

        setSummary((prevState) => {
            let localSummary = { ...prevState };
            const itemsTotalSum = selectedOrgItems.reduce((accumulator, item) => {
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

    const onQtyChange = (e, selectedOrgItems, item) => {
        let targetValue = parseInt(e.currentTarget.value);
        let targetIdx = selectedOrgItems.findIndex((i) => i.id === item.id);
        let newQty = 1;
        if (e.currentTarget.id === 'subtract' && targetValue >= 2) {
            newQty = targetValue - 1;
            updateCartQty(newQty, selectedOrgItems, targetIdx, currentUser.id);
        } else if (e.currentTarget.id === 'add') {
            newQty = targetValue + 1;
            updateCartQty(newQty, selectedOrgItems, targetIdx, currentUser.id);
        } else return;
        let newTotal = selectedOrgItems[targetIdx].unitCost * newQty;
        selectedOrgItems[targetIdx] = { ...item, quantity: newQty, total: newTotal };
        _logger('Local items', selectedOrgItems);
        adjustCart(selectedOrgItems);
    };

    const updateCartQty = (newQty, selectedOrgItems, targetIdx, userId) => {
        const payload = {
            menuItemId: selectedOrgItems[targetIdx].menuItemId,
            quantity: newQty,
            createdBy: userId,
            modifiedBy: userId,
            id: selectedOrgItems[targetIdx].id,
        };
        cartService.updateById(payload).then(onUpdateQtySuccess).catch(onUpdateQtySuccessErr);
    };

    const onUpdateQtySuccess = () => {
        toastr.success('Cart updated');
    };
    const onUpdateQtySuccessErr = (data) => {
        toastr.error('Error updating cart', data);
    };

    const onRemoveItem = (e, item) => {
        _logger('onRemove Item Id: ', item.id);
        e.preventDefault();
        var localItems = items.orgItems.filter((i) => i.id !== item.id);
        adjustCart(localItems);
        cartService.deleteByid(item.id).then(onUpdateQtySuccess).catch(onUpdateQtySuccessErr);
    };

    const adjustCart = (adjustedOrgItems) => {
        let newGrossTotal = 0;
        for (const item of adjustedOrgItems) {
            newGrossTotal += item.total;
        }
        let newNetTotal = newGrossTotal - summary.discount + summary.shippingCharge + summary.tax;
        let newTax = (newNetTotal + summary.shippingCharge) * 0.0; //
        setItems((prevState) => {
            let newItems = { ...prevState };
            newItems.orgItems = adjustedOrgItems;
            const orgItemQtyMapper = (item) => {
                return item.quantity;
            };
            newItems.qtyItems = newItems.orgItems.map(orgItemQtyMapper);
            newItems.qtyItemsSum = newItems.qtyItems.reduce((prevVal, currentVal) => prevVal + currentVal, 0);
            return newItems;
        });

        setSummary({
            ...summary,
            grossTotal: newGrossTotal,
            shippingCharge: newGrossTotal * 0.0,
            tax: newTax,
            netTotal: newNetTotal,
        });
    };
    //forms payload for stripe
    const mapItems = (items) => {
        var itemString = items.unitCost.toFixed(2).toString();
        var itString = itemString.split('.');
        var cartString = `${itString[0]}${itString[1]}`;
        var stripeCart = parseInt(cartString);
        var newItems = {
            menuItemName: items.menuItemName,
            menuItemDescription: items.menuItemDescription,
            unitCost: stripeCart,
            quantity: items.quantity,
        };
        return newItems;
    };
    const onCheckoutClicked = (e) => {
        e.preventDefault();
        var cartItems = items.orgItems.map(mapItems);
        _logger('checkoutClicked', cartItems);
        checkoutService.createCartCheckout(cartItems).then(onCartCheckoutSuccess).catch(onCartCheckoutError);
    };
    const onCartCheckoutSuccess = async (response) => {
        _logger('checkout success', response);
        var sId = response.item;
        _logger(sId, stripePubKey);
        const stripe = await loadStripe(stripePubKey);
        _logger(stripe, 'stripe object');
        await stripe.redirectToCheckout({ sessionId: sId });
    };
    const onCartCheckoutError = (error) => {
        _logger('checkout success', error);
        Swal.fire({
            title: 'Checkout session failed!',
            text: 'Click on plan to try again',
            icon: 'error',
            button: 'Close',
        });
    };
    const navToShopping = () => {
        _logger('navToShopping');
        navigate(`../orgs/8/menus/mobile`);
    };

    const onDropDownChange = (e) => {
        e.preventDefault();
        let orgIdSelected = e.currentTarget.value;
        setSelectedOrg(orgIdSelected);
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="page-title-box">
                        <div className="page-title-right"></div>
                        <h2>Shopping Cart - {selectedOrg}</h2>
                        <Row>
                            <Col xs={5}>
                                <label>Choose by Restaurant</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={3}>
                                <Formik>
                                    <Field
                                        component="select"
                                        name="orgNames"
                                        className="form-control"
                                        onChange={onDropDownChange}>
                                        <option value="">Click Here</option>
                                        {dropdown.dropDownMenu}
                                    </Field>
                                </Formik>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={8} className="d-none d-sm-block">
                                    <Table responsive borderless className="table-centered table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th style={{ width: '50px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>{cartLists.tableList}</tbody>
                                    </Table>
                                </Col>
                                <Col lg={4} className="d-block d-sm-none">
                                    {cartLists.cardList}
                                </Col>
                                <Col lg={4}>
                                    <CartSummary summary={summary} />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={8}>
                                    <div className="mt-3">
                                        <label className="form-label" htmlFor="example-textarea">
                                            Add a Note:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="example-textarea"
                                            rows="3"
                                            placeholder="Write some note.."></textarea>
                                    </div>

                                    <Row className="mt-4">
                                        <Col sm={6}>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip>Navigate to Cart</Tooltip>}>
                                                <Button variant="secondary" value="1" onClick={navToShopping}>
                                                    <FaArrowCircleLeft />
                                                    Continue Shopping
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="text-sm-end mt-2">
                                                <Button onClick={onCheckoutClicked} className="btn btn-danger">
                                                    <i className="mdi me-1">
                                                        <BsFillBagCheckFill />
                                                    </i>
                                                    Checkout{' '}
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

Cart.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        organizationId: PropTypes.number.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
};
export default Cart;
