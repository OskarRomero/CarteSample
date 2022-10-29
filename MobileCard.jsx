import React from 'react';
import logger from 'sabio-debug';
import { Button, OverlayTrigger, Tooltip, ButtonGroup, Card, Row, Col } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrFormSubtract } from 'react-icons/gr';
import { FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './cart.css';

const _logger = logger.extend('MobileCard');

const MobileCard = (props) => {
    _logger(props);
    const idx = props.idx || {};
    const item = props.item || {};
    const orgItems = props.arr || {};
    const onQtyChange = props.onQtyChange || {};
    const onRemoveItem = props.onRemoveItem || {};

    _logger('idx:', idx, 'item:', item, 'orgItems:', orgItems, 'onQtyChange:', onQtyChange);
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
        <Card className="col-md-11" key={item.id}>
            <Row>
                <Col>
                    <Card.Img variant="top" src={item.imageUrl} alt="" className="cart-card-img" />
                </Col>
                <Col className="justify-content-center">
                    <h4>{item.menuItemName}</h4>
                    <small className="me-2">
                        <b>{item.organizationName} </b>
                    </small>
                </Col>
            </Row>

            <Card.Body className={item.imageUrl ? 'position-relative' : ''}>
                <Row>
                    <Col xs={5}>
                        <small>
                            <b>Price:</b> ${item.unitCost.toFixed(2)}
                        </small>
                        <br />
                        <small>-</small>
                        <br />
                        <small>
                            <b>Total:</b> ${(item.unitCost * item.quantity).toFixed(2)}
                        </small>
                    </Col>
                    <Col xs={7}>
                        <Row>
                            <ButtonGroup className="me-1 my-1">
                                <OverlayTrigger placement="bottom" overlay={<Tooltip>Add</Tooltip>}>
                                    <Button variant="light" id="add" value={item.quantity} onClick={onChildQtyChange}>
                                        <AiOutlinePlus />
                                    </Button>
                                </OverlayTrigger>
                                {/* Quantity Button */}
                                <Button variant="light" value={item.quantity}>
                                    {item.quantity}
                                </Button>

                                <OverlayTrigger key="bottm" placement="bottom" overlay={<Tooltip>Subtract</Tooltip>}>
                                    <Button
                                        variant="light"
                                        id="subtract"
                                        value={item.quantity}
                                        onClick={onChildQtyChange}>
                                        <GrFormSubtract />
                                    </Button>
                                </OverlayTrigger>
                            </ButtonGroup>
                        </Row>
                        <br />
                        <Row>
                            <FaTrash to="#" className="action-icon" onClick={onChildRemoveItem}>
                                {' '}
                                <i className="mdi mdi-delete"></i>
                            </FaTrash>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

MobileCard.propTypes = {
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

export default MobileCard;
