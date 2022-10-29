import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import AddToCart from './AddToCart';

const _logger = debug.extend('MenuCard');

const MenuCard = ({ menuData, change }) => {
    const [menuItems, setMenuItems] = useState({});

    useEffect(() => {
        setMenuItems(menuData);
    }, []);

    //Receives data from child component AddToCart.jsx.
    //Data to be passed into Cart.jsx for conditional rendering
    const onAddToCartClicked = (data, payload, cartUpdate) => {
        const newItemId = data.item;
        const currentUserId = payload.createdBy;
        const currentOrg = cartUpdate.organizationName;
        _logger(currentOrg);
        change(newItemId, currentUserId, currentOrg);
    };
    //invoke change prop to trigger onMenuCardNotification in parent component

    return (
        <Card className="col-md-11">
            <Card.Img
                style={{
                    alignSelf: 'center',
                    height: 200,
                    width: 290,
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                variant="top"
                src={menuItems.imageUrl}
                alt=""
            />

            <Card.Body className={menuItems.imageUrl ? 'position-relative' : ''}>
                <h3>{menuItems.menuItemName}</h3>
                <p className="mb-1">
                    <b>Restaurant: {menuItems.organizationName}</b>
                </p>
                <p className="mb-1">
                    <b>Price: ${menuItems.unitCost}</b>
                </p>
                <p className="mb-1">
                    <b>ItemId: {menuItems.id}</b> <b>OrgId: {menuItems.organizationId}</b>
                </p>
                <div className="d-flex justify-content-center mt-2">
                    <AddToCart cardData={menuItems} notifyMenuCard={onAddToCartClicked}></AddToCart>
                </div>
            </Card.Body>
        </Card>
    );
};
MenuCard.propTypes = {
    menuData: PropTypes.shape([]).isRequired,
    childSummary: PropTypes.shape({}).isRequired,
    change: PropTypes.func.isRequired,
};
export default MenuCard;
