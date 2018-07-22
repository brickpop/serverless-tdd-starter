'use strict'

const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const UserSchema = require("../models/user.js")

const uri = process.env.MONGODB_URL
const poolSize = process.env.POOL_SIZE || 30

///////////////////////////////////////////////////////////////////////////////
// DATABASE
///////////////////////////////////////////////////////////////////////////////

let dbConnection = null
let User

async function ensureDbConnected() {
  // Connect if not already connected
  if (!dbConnection) {
    dbConnection = await mongoose.createConnection(uri, {
      // With serverless, better to fail fast if not connected
      poolSize,
      bufferCommands: false,
      bufferMaxEntries: 0
    })
    // Register the DB models here
    User = dbConnection.model("User", UserSchema)
  }
}

///////////////////////////////////////////////////////////////////////////////
// HANDLERS
///////////////////////////////////////////////////////////////////////////////

exports.list = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    await ensureDbConnected()

    const users = await User.find().lean()
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    }
  }
}

exports.get = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  if (!event || !event.pathParameters || !event.pathParameters.id) {
    return { statusCode: 404, body: "" }
  }
  else if (!ObjectId.isValid(event.pathParameters.id)) {
    return { statusCode: 404, body: "" }
  }

  try {
    await ensureDbConnected()

    const user = await User.findById(event.pathParameters.id).lean()

    if (!user) {
      return { statusCode: 404, body: "" }
    }
    else {
      return {
        statusCode: 200,
        body: JSON.stringify(user)
      }
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    }
  }
}

exports.add = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  if (!event || !event.body) {
    return { statusCode: 404, body: "" }
  }

  try {
    let body = JSON.parse(event.body)
    await ensureDbConnected()

    const result = await User.create(body)
    return {
      statusCode: 200,
      body: JSON.stringify({ _id: result._id })
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    }
  }
}

exports.update = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  if (!event || !event.pathParameters || !event.pathParameters.id) {
    return { statusCode: 404, body: "" }
  }
  else if (!ObjectId.isValid(event.pathParameters.id)) {
    return { statusCode: 404, body: "" }
  }

  try {
    let body = JSON.parse(event.body)
    await ensureDbConnected()

    const result = await User.findByIdAndUpdate(event.pathParameters.id, body).lean()
    if (!result) {
      return { statusCode: 404, body: "" }
    }
    else {
      return {
        statusCode: 200,
        body: JSON.stringify({ _id: result._id })
      }
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    }
  }
}

exports.remove = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  if (!event || !event.pathParameters || !event.pathParameters.id) {
    return { statusCode: 404, body: "" }
  }
  else if (!ObjectId.isValid(event.pathParameters.id)) {
    return { statusCode: 404, body: "" }
  }

  try {
    await ensureDbConnected()

    const result = await User.findByIdAndRemove(event.pathParameters.id).lean()
    if (!result) {
      return { statusCode: 404, body: "" }
    }
    else {
      return {
        statusCode: 200,
        body: JSON.stringify({ _id: result._id })
      }
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    }
  }
}
