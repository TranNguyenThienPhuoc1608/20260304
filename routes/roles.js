var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2');
let { genID } = require('../utils/idHandler');

// GET all roles
router.get('/', function (req, res, next) {
  res.send(dataRole);
});

// GET all users in a role
router.get('/:id/users', function (req, res, next) {
  let roleId = req.params.id;
  
  // Check if role exists
  let role = dataRole.find(e => e.id == roleId);
  if (!role) {
    res.status(404).send({
      message: "Role not found"
    });
    return;
  }
  
  // Get all users with this role
  let usersInRole = dataUser.filter(e => e.role.id == roleId);
  res.send({
    role: role,
    userCount: usersInRole.length,
    users: usersInRole
  });
});

// GET role by ID
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.find(e => e.id == id);
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({
      message: "Role not found"
    });
  }
});

// CREATE new role
router.post('/', function (req, res, next) {
  let newRole = {
    id: genID(dataRole),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataRole.push(newRole);
  res.status(201).send(newRole);
});

// UPDATE role by ID
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let roleIndex = dataRole.findIndex(e => e.id == id);
  
  if (roleIndex !== -1) {
    dataRole[roleIndex].name = req.body.name || dataRole[roleIndex].name;
    dataRole[roleIndex].description = req.body.description || dataRole[roleIndex].description;
    dataRole[roleIndex].updatedAt = new Date().toISOString();
    res.send(dataRole[roleIndex]);
  } else {
    res.status(404).send({
      message: "Role not found"
    });
  }
});

// DELETE role by ID
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let roleIndex = dataRole.findIndex(e => e.id == id);
  
  if (roleIndex !== -1) {
    let deletedRole = dataRole.splice(roleIndex, 1);
    res.send({
      message: "Role deleted successfully",
      deletedRole: deletedRole[0]
    });
  } else {
    res.status(404).send({
      message: "Role not found"
    });
  }
});

module.exports = router;
