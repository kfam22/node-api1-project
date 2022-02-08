// BUILD YOUR SERVER HERE

// imports
const express = require('express');
const user = require('./users/model');

// instance of express app
const server = express();

// global middleware: by default, express cannot read request bodies, because put and post supply bodies as part of the request, this tells express how to interpret the request body, in this case as json
server.use(express.json());

// endpoints
// GET - /api/users - Returns an array users.
server.get('/api/users', (req, res)=>{
    // pull data(users) from database
    user.find()
    .then(users=>{
        res.json(users);
    })
    .catch(err =>{
        res.status(500).json({
            message: 'The users information could not be retrieved',
            error: err.message
        })
    })
})

// POST - /api/users - Creates a user using the information sent inside the `request body`.  
server.post('/api/users', (req, res)=>{
    let body = req.body;
    if(!body.name){
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else if(!body.bio){
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else{
        user.insert(body)
        .then(user=>{
            res.status(201).json(user)
        })
        .catch(err =>{
            res.status(500).json({ message: 'There was an error while saving the user to the database', error: err.message})
        })
    }
})

// GET - /api/users/:id - Returns the user object with the specified `id`
server.get('/api/users/:id', (req, res)=>{
    let { id } = req.params;
    user.findById(id)
    .then(user =>{
        if(user == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist'});
        } else{
            res.json(user)
        }
    })
    .catch(err =>{
        res.status(500).json({
            message: 'The user information could not be retrieved',
            error: err.message
        })
    })
})

// DELETE - /api/users/:id  - Removes the user with the specified `id` and returns the deleted user. 
server.delete('/api/users/:id', (req, res)=>{
    let { id } = req.params;
    user.remove(id)
    .then(user =>{
        if(user == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist' });
            return;
        }

        res.status(200).json(user);
    })
    .catch(err =>{
        res.status(500).json({ message: 'The user could not be removed', error: err.message})
    })
})

// PUT - /api/users/:id - Updates the user with the specified `id` using data from the `request body`. Returns the modified user

server.put('/api/users/:id', async (req, res)=>{
    const { id } = req.params
    try{
        const actualUser = await user.findById(id)
        if(!actualUser){
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            if (!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: 'Please provide name and bio for the user'
                })
            } else {
                const updatedUser = await user.update(id, req.body)
                res.status(200).json(updatedUser)
            }
        }
    } catch(err){
        res.status(500).json({
            message: 'The user information could not be modified',
            error: err.message
        })

    }

})



module.exports = server; // EXPORT YOUR SERVER instead of {}
