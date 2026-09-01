const path = require('path');
const express = require('express');
const multer  = require('multer');
const { check, checkSchema, validationResult } = require('express-validator');
const tractors = require('./Model/tractors');

const app = express();
const upload = multer();
const port = process.env.PORT || 8080;

app.use(express.static('public'))
app.get(
    '/tractor/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await tractors.getAllTractors();
        } catch (error) {
            return response
                .status(500)
                .json({message: 'Something went wrong with the server.'});

        }
        return response.json({message: 'Success', data: result});
    }
);
app.get(
    '/tractor/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await tractors.getTractorById(request.params.id);
        } catch (error) {
            console.log(error);
            return response
                .status(500)
                .json({message: 'Something went wrong with the server.'});
        }
        return response.json({message: 'Success', data: result});
    }
);
app.post(
    '/tractor/',
    upload.none(),
    check('name', 'Please enter a name.').isLength({min: 1}),
    check('clue', 'Please enter a clue.').isLength({min: 1}),
    check('question', 'Please enter a question.').isLength({min: 1}),
    check('answer', 'Please enter an answer.').isIn(['A', 'B', 'C', 'D']),
    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        try {
            await tractors.addTractor(request.body);
        } catch (error) {
            return response
                .status(500)
                .json({message: 'Something went wrong with the server.'});
        }
        return response.json({message: 'Success'});
    }
);
app.put(
    '/tractor/:id/',
    upload.none(),
    check('name', 'Please enter a name.').isLength({min: 1}),
    check('clue', 'Please enter a clue.').isLength({min: 1}),
    check('question', 'Please enter a question.').isLength({min: 1}),
    check('answer', 'Please enter an answer.').isIn(['A', 'B', 'C', 'D']),
    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({
                    message: 'Request fields or files are invalid.',
                    errors: errors.array(),
                });
        }

        try {
            await tractors.updateTractorById(request.params.id, request.body);
        } catch (error) {
            return response
                .status(500)
                .json({message: 'Something went wrong with the server.'});
        }
        return response.json({message: 'Success'});
    }
);
app.listen(port);