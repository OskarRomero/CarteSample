import axios from 'axios';
import logger from 'sabio-debug';
import * as helper from './serviceHelpers';

const _logger = logger.extend('cartService');
const endpoint = `${helper.API_HOST_PREFIX}/api/cart`;

const getById = (id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getAllByCreatedBy = (createdById) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/createdby/${createdById}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const create = (payload) => {
    const config = {
        method: 'POST',
        url: `${endpoint}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteByid = (id) => {
    const config = {
        method: 'DELETE',
        url: `${endpoint}/delete/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteByUserId = () => {
    const config = {
        method: 'DELETE',
        url: `${endpoint}/checkout`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateById = (payload) => {
    _logger('payload:', payload);
    _logger('updateById service called with ID:', payload.id);
    const config = {
        method: 'PUT',
        url: `${endpoint}/${payload.id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getRandomMenuItems = () => {
    _logger('getRandomMenuItems fired');
    const config = {
        method: 'GET',
        url: `${endpoint}/precart`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const cartService = { getById, getAllByCreatedBy, create, deleteByid, deleteByUserId, updateById, getRandomMenuItems };
export default cartService;
