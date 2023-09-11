const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
const bodyDataHas = (propertyName) => {
    return (req, res, next) => {
        const { data = {} } = req.body;
        if (data[propertyName] && data[propertyName] !== "") {
            return next();
        }
        next({
            status: 400,
            message: `Order must include a ${propertyName}`
        })
    }
}

const dishesPropertyIsValid = (req, res, next) => {
    const { data: { dishes } = {} } = req.body;
    if (Array.isArray(dishes) && dishes.length > 0) {
        return next();
    }
    next({
        status: 400,
        message: `Order must include one dish`,
    });
}

const dishQuantityPropertyIsValidNumber = (req, res, next) => {
    const { data: { dishes } = {} } = req.body;
    for (let index = 0; index < dishes.length; index++) {
        const quantity = dishes[index].quantity;
        if (quantity && quantity > 0 && Number.isInteger(quantity)) {
            next()
        }
        return next({
            status: 400,
            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        });
    }
}

const orderExists = (req, res, next) => {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next()
    }
    next({
        status: 404,
        message: `Order does not exist: ${orderId}`,
    });
}

const create = (req, res) => {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId,
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

const list = (req, res) => {
    res.json({ data: orders });
}

const read = (req, res) => {
    res.json({ data: res.locals.order });
}

module.exports = {
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        dishesPropertyIsValid,
        dishQuantityPropertyIsValidNumber,
        create
    ],
    list,
    read: [
        orderExists,
        read
    ]
}