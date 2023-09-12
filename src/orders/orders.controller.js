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
        if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
            return next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`,
            });
        }
    }
    next();
}

const idPropertyIsValid = (req, res, next) => {
    const { orderId } = req.params;
    const { data: { id } } = req.body;
    if (id && orderId !== id) {
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
        });
    }
    return next();
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

const statusPropertyIsValid = (req, res, next) => {
    const { data: { status } = {} } = req.body;
    const validStatus = ["pending", "preparing", "out-for-delivery"];
    if (validStatus.includes(status)) {
        return next();
    } else if (status === "delivered") {
        return next({
            status: 400,
            message: `A delivered order cannot be changed`,
        });
    }
    next({
        status: 400,
        message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
    });
}

const create = (req, res) => {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

const destroy = (req, res, next) => {
    const { orderId } = req.params;
    const order = res.locals.order;
    if (order.status === "pending") {
        const index = orders.indexOf((order) => order.id === orderId)
        const deletedOrders = orders.splice(index, 1);
        res.sendStatus(204);
    }
    next({
        status: 400,
        message: `An order cannot be deleted unless it is pending.`,
    });
}

const list = (req, res) => {
    res.json({ data: orders });
}

const read = (req, res) => {
    res.json({ data: res.locals.order });
}

const update = (req, res) => {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const order = res.locals.order;

    //Update the order
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({ data: order });
}

module.exports = {
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        dishesPropertyIsValid,
        dishQuantityPropertyIsValidNumber,
        create
    ],
    delete: [
        orderExists,
        destroy
    ],
    list,
    read: [
        orderExists,
        read
    ],
    update: [
        orderExists,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        idPropertyIsValid,
        dishQuantityPropertyIsValidNumber,
        statusPropertyIsValid,
        update
    ]
}