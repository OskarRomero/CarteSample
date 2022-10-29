import React, { useState } from 'react';
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrFormSubtract } from 'react-icons/gr';
import { MdShoppingCart } from 'react-icons/md';
import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import cartService from '../../services/cartService';
import * as toastr from 'toastr';

const _logger = debug.extend('MenuCard');

const AddToCart = ({ cardData, notifyMenuCard }) => {
    setTimeout(() => {
        setCartUpdate(cardData);
    }, 500);

    const [cartUpdate, setCartUpdate] = useState({});
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [plural, setPlural] = useState('');

    //If multiple items added, say itemS as plural on toastr
    const ifPlural = () => {
        let result = '';
        if (orderQuantity >= 1) {
            result = 's';
            setPlural(result);
        } else return result;
    };

    const onAddToCart = (e, cartUpdate) => {
        const payload = { menuItemId: cartUpdate.id, quantity: orderQuantity, createdBy: 164, modifiedBy: 164 };

        cartService.create(payload).then(onAddToCartSuccess).catch(onAddToCartErr);
        _logger(payload);
        function onAddToCartSuccess(data) {
            notifyMenuCard(data, payload, cartUpdate);
            toastr.success(`${orderQuantity} item${plural} added to Cart`);
        }
        function onAddToCartErr(data) {
            _logger('error Updating', data);
            toastr.error('Unable to add to Cart');
        }
    };

    const increment = () => {
        // _logger('ingrement, e: ', e);
        ifPlural();
        setOrderQuantity((prevState) => {
            let qty = prevState;
            if (qty < 100) {
                let newQty = qty + 1;
                return newQty;
            } else return qty;
        });
    };

    const decrement = () => {
        ifPlural();
        setOrderQuantity((prevState) => {
            let qty = prevState;
            if (qty > 1) {
                let newQty = qty - 1;
                return newQty;
            } else return qty;
        });
    };

    return (
        <div className="buttons">
            <ButtonGroup className="me-1 my-1">
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Add</Tooltip>}>
                    <Button variant="light" onClick={increment}>
                        <AiOutlinePlus />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip>Quantity</Tooltip>}>
                    <Button variant="light" value={orderQuantity}>
                        {orderQuantity}
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger key="bottm" placement="bottom" overlay={<Tooltip>Subtract</Tooltip>}>
                    <Button variant="light" onClick={decrement}>
                        <GrFormSubtract />
                    </Button>
                </OverlayTrigger>
            </ButtonGroup>

            <Button
                variant="primary"
                value={cartUpdate.id}
                onClick={(e) => {
                    onAddToCart(e, cartUpdate);
                }}>
                <MdShoppingCart className="font-20" />
                Add To Cart
            </Button>
            {/* <button onClick={notifyMenuCard}>notifyMenuCard</button> */}
        </div>
    );
};
AddToCart.propTypes = {
    cardData: PropTypes.shape({}).isRequired,
    notifyMenuCard: PropTypes.func.isRequired,
};
export default AddToCart;
