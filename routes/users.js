var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../utils/data2');
let { genID } = require('../utils/idHandler');

// GET all users
router.get('/', function(req, res, next) {
  res.send(dataUser);
});

// GET user by ID (username)
router.get('/:username', function(req, res, next) {
  let username = req.params.username;
  let result = dataUser.find(e => e.username == username);
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({
      message: "User not found"
    });
  }
});

// CREATE new user
router.post('/', function(req, res, next) {
  // Validate required fields
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).send({
      message: "Username, password, and email are required"
    });
    return;
  }

  // Check if user already exists
  let existingUser = dataUser.find(e => e.username == req.body.username);
  if (existingUser) {
    res.status(400).send({
      message: "Username already exists"
    });
    return;
  }

  // Get role info
  let role = dataRole.find(e => e.id == req.body.roleId);
  if (!role) {
    res.status(400).send({
      message: "Role not found"
    });
    return;
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName || '',
    avatarUrl: req.body.avatarUrl || '',
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataUser.push(newUser);
  res.status(201).send(newUser);
});

// UPDATE user by username
router.put('/:username', function(req, res, next) {
  let username = req.params.username;
  let userIndex = dataUser.findIndex(e => e.username == username);
  
  if (userIndex !== -1) {
    // Update allowed fields
    if (req.body.password) dataUser[userIndex].password = req.body.password;
    if (req.body.email) dataUser[userIndex].email = req.body.email;
    if (req.body.fullName) dataUser[userIndex].fullName = req.body.fullName;
    if (req.body.avatarUrl) dataUser[userIndex].avatarUrl = req.body.avatarUrl;
    if (req.body.status !== undefined) dataUser[userIndex].status = req.body.status;
    if (req.body.loginCount !== undefined) dataUser[userIndex].loginCount = req.body.loginCount;
    
    // Update role if provided
    if (req.body.roleId) {
      let role = dataRole.find(e => e.id == req.body.roleId);
      if (role) {
        dataUser[userIndex].role = {
          id: role.id,
          name: role.name,
          description: role.description
        };
      } else {
        res.status(400).send({
          message: "Role not found"
        });
        return;
      }
    }
    
    dataUser[userIndex].updatedAt = new Date().toISOString();
    res.send(dataUser[userIndex]);
  } else {
    res.status(404).send({
      message: "User not found"
    });
  }
});

// DELETE user by username
router.delete('/:username', function(req, res, next) {
  let username = req.params.username;
  let userIndex = dataUser.findIndex(e => e.username == username);
  
  if (userIndex !== -1) {
    let deletedUser = dataUser.splice(userIndex, 1);
    res.send({
      message: "User deleted successfully",
      deletedUser: deletedUser[0]
    });
  } else {
    res.status(404).send({
      message: "User not found"
    });
  }
});

module.exports = router;
