import React from 'react';
import logger from 'sabio-debug';
import { Button, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrFormSubtract } from 'react-icons/gr';
import { FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const _logger = logger.extend('CartTableItem');

const CartTableItem = (props) => {
    const idx = props.idx || {};
    const item = props.item || {};
    const orgItems = props.arr || {};
    const onQtyChange = props.onQtyChange || {};
    const onRemoveItem = props.onRemoveItem || {};

    false && _logger('orgItems:', orgItems);

    const onChildQtyChange = (e) => {
        logger('e:', e, 'orgItems:', orgItems);
        return onQtyChange(e, orgItems, item);
    };

    const onChildRemoveItem = (e) => {
        logger('e:', e, 'item:', item);
        return onRemoveItem(e, item);
    };

    return (
        <tr key={idx}>
            <td>
                <img
                    src={item.imageUrl}
                    alt={item.menuItemName}
                    title="contact-img"
                    className="rounded me-3"
                    height="64"
                    width="64"
                />

                <p className="m-0 d-inline-block align-middle font-16">
                    <small to="#" className="text-body">
                        {item.menuItemName}
                    </small>
                    <br />
                    <small className="me-2">
                        <b>Organization:</b>
                        {item.organizationName}{' '}
                    </small>
                    <small>
                        <b>MenuId:</b> {item.menuItemId}{' '}
                    </small>
                </p>
            </td>
            <td>${item.unitCost.toFixed(2)}</td>
            <td>
                <ButtonGroup className="me-1 my-1">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Add</Tooltip>}>
                        <Button variant="light" id="add" value={item.quantity} onClick={onChildQtyChange}>
                            <AiOutlinePlus />
                        </Button>
                    </OverlayTrigger>
                    <Button variant="light" value={1}>
                        {item.quantity}
                    </Button>

                    <OverlayTrigger key="bottm" placement="bottom" overlay={<Tooltip>Subtract</Tooltip>}>
                        <Button variant="light" id="subtract" value={item.quantity} onClick={onChildQtyChange}>
                            <GrFormSubtract />
                        </Button>
                    </OverlayTrigger>
                </ButtonGroup>
            </td>
            <td>${item.total.toFixed(2)}</td>
            <td>
                <FaTrash to="#" className="action-icon" onClick={onChildRemoveItem}>
                    {' '}
                    <i className="mdi mdi-delete"></i>
                </FaTrash>
            </td>
        </tr>
    );
};

CartTableItem.propTypes = {
    idx: PropTypes.number.isRequired,
    item: PropTypes.shape({
        foodSafeTypes: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(
            PropTypes.shape({
                foodWarningTypes: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired,
                imageUrl: PropTypes.string.isRequired,
                measure: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                purchaseRestrictions: PropTypes.string.isRequired,
            })
        ),
        locationId: PropTypes.number.isRequired,
        locationZip: PropTypes.string.isRequired,
        menuItemDescription: PropTypes.string.isRequired,
        menuItemId: PropTypes.number.isRequired,
        menuItemName: PropTypes.string.isRequired,
        organizationId: PropTypes.number.isRequired,
        organizationName: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        unitCost: PropTypes.number.isRequired,
    }).isRequired,
    arr: PropTypes.arrayOf(
        PropTypes.shape({
            foodSafeTypes: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
            imageUrl: PropTypes.string.isRequired,
            ingredients: PropTypes.arrayOf(
                PropTypes.shape({
                    foodWarningTypes: PropTypes.string.isRequired,
                    id: PropTypes.number.isRequired,
                    imageUrl: PropTypes.string.isRequired,
                    measure: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    purchaseRestrictions: PropTypes.string.isRequired,
                })
            ),
            locationId: PropTypes.number.isRequired,
            locationZip: PropTypes.string.isRequired,
            menuItemDescription: PropTypes.string.isRequired,
            menuItemId: PropTypes.number.isRequired,
            menuItemName: PropTypes.string.isRequired,
            organizationId: PropTypes.number.isRequired,
            organizationName: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired,
            unitCost: PropTypes.number.isRequired,
        })
    ).isRequired,
    onQtyChange: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
};

export default CartTableItem;
