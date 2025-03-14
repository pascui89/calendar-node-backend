const { generateJWT } = require('../helpers/jwt');
const Event = require('../models/Event');
const User = require('../models/User');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('user', 'name email');
        const user = await User.findById(req.uid);
        const token = await generateJWT(user.id, user.name);
        res.json({
            result: true,
            events,
            token
        });
    
    } catch (err) {
        console.error(err);
        res.status(500).json({
            result: false,
            msg: 'An error occurred while getting the events list',
            err
        });
    }
}

const createEvent  = async (req, res) => {
    try {
        const event = new Event(req.body);
        const user = await User.findById(req.uid);
        event.user = user.id;
        const eventSaved = await event.save();
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            result: true,
            event: eventSaved,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            result: false,
            msg: 'An error occurred while creating the event',
            err
        });
    }
}

const updateEvent  = async (req, res) => {
    try {
        const newEvent = {
            ...req.body,
            user: req.uid
        }
        const user = await User.findById(req.uid);
        const eventUpdated = await Event
            .findByIdAndUpdate(
                { _id: req.params.id, user: req.uid }, 
                newEvent, 
                { new: true, runValidators: true }
            )
            .populate('user', 'name email');
        if (!eventUpdated) {
            return res.status(404).json({
                result: false,
                msg: 'The event does not exist'
            });
        }
        const token = await generateJWT(user.id, user.name);
        res.json({
            result: true,
            eventUpdated,
            token
        });
    } catch (err) { 
        console.error(err);
        res.status(500).json({
            result: false,
            msg: 'An error occurred while updating the event'
        });
    }
}

const deleteEvent  = async (req, res) => {
    try {
        const user = await User.findById(req.uid);
        const event = await Event.findByIdAndDelete(
            { _id: req.params.id, user: req.uid }, 
            { runValidators: true }
        );
        if (!event) {
            return res.status(404).json({
                result: false,
                msg: 'The event does not exist'
            });
        }
        const token = await generateJWT(user.id, user.name);
        res.json({
            result: true,
            msg: 'Event deleted',
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            result: false,
            msg: 'An error occurred while deleting the event'
        });
    }   
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}