import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import checkoutService from '../../services/checkoutService';
import debug from 'sabio-debug';
import Swal from 'sweetalert2';
import cartPayment from '../../assets/images/payment-successful.png';
import messageService from '../../services/messageService';
import cartService from '../../services/cartService';
import PropTypes from 'prop-types';

const _logger = debug.extend('CartCheckoutSuccessPage');

function CartCheckoutSuccessPage({ currentUser }) {
    const search = useLocation().search;
    const url = search.split('=');
    const navigate = useNavigate();
    const [customer, SetCustomer] = useState({
        name: '',
    });
    _logger(search, 'checkout success');
    useEffect(() => {
        checkoutService.getSessionObject(url[1]).then(onSessionObjSuccess).catch(onSessionObjError);
    }, []);

    useEffect(() => {
        cartService.getAllByCreatedBy(currentUser.id).then(onGetCartSuccess).catch(onGetCartError);
    }, [customer]);

    const onSessionObjSuccess = (response) => {
        _logger(response);
        _logger(currentUser);
        var customerName = response.item.customerDetails.name;
        SetCustomer((prevState) => {
            return {
                ...prevState,
                name: customerName,
            };
        });
        _logger('customer', customerName);
    };
    const onGetCartSuccess = (response) => {
        _logger(response);
        let restaurantName = response.items.map((e) => e.organizationName);
        let foodItems = response.items.map((e) => e.menuItemName);
        let foodCosts = response.items.map((e) => e.unitCost);
        let totalCost = foodCosts.reduce((total, amount) => total + amount);
        let automatedMessage = {
            subject: 'Order Placed!',
            message: `Your order has been placed at ${restaurantName[0]}. ${foodItems.length} items for a total of $${totalCost}`,
            senderId: 200,
        };
        messageService.autoAdd(automatedMessage).then(autoMsgSuccess).catch(autoMsgErr);
    };
    const onGetCartError = (err) => {
        _logger(err);
    };

    const autoMsgSuccess = (response) => {
        _logger(response);
        cartService.deleteByUserId().then(delCartSuccess).catch(delCartError);
    };
    const autoMsgErr = (err) => {
        _logger(err);
    };

    const delCartSuccess = (response) => {
        _logger(response);
    };

    const delCartError = (err) => {
        _logger(err);
    };

    const onSessionObjError = (error) => {
        _logger(error);
        Swal.fire({
            title: 'session not found!',
            text: 'Check if payment was successful',
            icon: 'error',
            button: 'Close',
        });
    };
    const goHomeClicked = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <React.Fragment>
            <>
                <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                    <div className="container">
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5} xxl={4}>
                                <Card className="border border-dark">
                                    {/* logo */}
                                    <Card.Header className="text-center bg-light">
                                        <h3 className="text-success">Payment Successful</h3>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <div className="text-center">
                                            <img src={cartPayment} height="120" alt="" />
                                            <h3 className="text-black-85 mt-4">
                                                Thank you {customer.name} for your payment!
                                            </h3>
                                            <h4 className="text-black-85 mt-3">Come back again!</h4>
                                            <Button className="btn btn-info mt-3" type="submit" onClick={goHomeClicked}>
                                                Return to Home
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </>
        </React.Fragment>
    );
}

CartCheckoutSuccessPage.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
        tenantId: PropTypes.string,
    }),
};

export default CartCheckoutSuccessPage;
