'use strict'

const mochaPlugin = require('serverless-mocha-plugin')
const expect = mochaPlugin.chai.expect

const wrappedList = mochaPlugin.getWrapper('listUsers', '/handlers/users.js', 'list')
const wrappedGet = mochaPlugin.getWrapper('getUser', '/handlers/users.js', 'get')
const wrappedAdd = mochaPlugin.getWrapper('addUser', '/handlers/users.js', 'add')
const wrappedUpdate = mochaPlugin.getWrapper('updateUser', '/handlers/users.js', 'update')
const wrappedRemove = mochaPlugin.getWrapper('removeUser', '/handlers/users.js', 'remove')

describe('My API', () => {
  it('listUsers should return an empty list by default', () => {
    return wrappedList.run({}).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const list = JSON.parse(response.body)
      expect(list).to.be.an.instanceOf(Array)
      expect(list).to.deep.equal([])
    })
  })

  it('getUser should return 404 if not found', () => {
    return wrappedGet.run({ pathParameters: { id: "00000f1afa7663142200d252" } }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(404)
      expect(response.body).to.equal("")
    })
  })

  it('updateUser should return 404 if not found', () => {
    return wrappedAdd.run({ pathParameters: { id: "00000f1afa7663142200d252" } }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(404)
      expect(response.body).to.equal("")
    })
  })

  it('removeUser should return 404 if not found', () => {
    return wrappedRemove.run({ pathParameters: { id: "00000f1afa7663142200d252" } }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(404)
      expect(response.body).to.equal("")
    })
  })

  it('addUser should accept and store a new user', () => {
    const payload = {
      name: "John",
      lastName: "Smith",
      email: "user@email.com"
    }
    return wrappedAdd.run({ body: JSON.stringify(payload) }).then(response => {
      expect(response).to.not.be.empty
      expect(response.body).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const result = JSON.parse(response.body)
      expect(result._id).to.have.length.gt(0)

      return wrappedGet.run({ pathParameters: { id: result._id } })
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const remoteUser = JSON.parse(response.body)
      expect(remoteUser).to.be.an.instanceOf(Object)
      expect(remoteUser._id).to.have.length.gt(0)
      expect(remoteUser.name).to.equal(payload.name)
      expect(remoteUser.lastName).to.equal(payload.lastName)
      expect(remoteUser.email).to.equal(payload.email)

      return wrappedList.run({})
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const list = JSON.parse(response.body)
      expect(list).to.be.an.instanceOf(Array)
      expect(list).to.have.lengthOf(1)
    })
  })

  it('updateUser should update existing users', () => {
    const payload = {
      name: "Jane",
      lastName: "Smithee",
      email: "user2@email.com"
    }
    let userId
    return wrappedList.run({}).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const list = JSON.parse(response.body)
      expect(list).to.be.an.instanceOf(Array)
      expect(list).to.have.lengthOf(1)
      expect(list[0]).to.not.be.empty
      expect(list[0]._id).to.not.be.empty

      userId = list[0]._id

      return wrappedUpdate.run({ pathParameters: { id: userId }, body: JSON.stringify(payload) })
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.body).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const result = JSON.parse(response.body)
      expect(result._id).to.have.length.gt(0)

      return wrappedGet.run({ pathParameters: { id: result._id } })
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const remoteUser = JSON.parse(response.body)
      expect(remoteUser).to.be.an.instanceOf(Object)
      expect(remoteUser._id).to.have.length.gt(0)
      expect(remoteUser.name).to.equal(payload.name)
      expect(remoteUser.lastName).to.equal(payload.lastName)
      expect(remoteUser.email).to.equal(payload.email)
    })
  })

  it('removeUser should remove existing users', () => {
    let userId
    return wrappedList.run({}).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const list = JSON.parse(response.body)
      expect(list).to.be.an.instanceOf(Array)
      expect(list).to.have.lengthOf(1)
      expect(list[0]).to.not.be.empty
      expect(list[0]._id).to.not.be.empty

      userId = list[0]._id

      return wrappedRemove.run({ pathParameters: { id: userId } })
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.body).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const result = JSON.parse(response.body)
      expect(result._id).to.have.length.gt(0)

      return wrappedList.run({})
    }).then(response => {
      expect(response).to.not.be.empty
      expect(response.statusCode).to.equal(200)

      const list = JSON.parse(response.body)
      expect(list).to.be.an.instanceOf(Array)
      expect(list).to.deep.equal([])
    })
  })

})
