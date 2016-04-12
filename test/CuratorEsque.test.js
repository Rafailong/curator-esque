var mocha = require('mocha')
var mockery = require('mockery')
var should = require('chai').should()

var CuratorEsque = require('..').CuratorEsque

describe('CuratorEsque', function () {
  beforeEach(function () {
    curatorEsque = CuratorEsque.newClient('127.0.0.1:2181')
  })

  it('should create an instance of Zoologist when calling newClient()', function () {
    curatorEsque.should.be.a('object')
  })

  it('should start the framework when calling start()', function () {
    curatorEsque.start()
  })

  it('should be classified as started once start() has been called', function () {
    curatorEsque.start()
  })

  it('should be classified as not started if the start() function has not been called', function () {
    curatorEsque.getStarted().should.equal(false)
  })

  it('should be classified as not started if the close() function has been called', function (done) {
    curatorEsque.start()
    curatorEsque.once('connected', function () {
      curatorEsque.close()

      curatorEsque.once('disconnected', function () {
        curatorEsque.getStarted().should.equal(false)
        done()
      })
    })
  })

  it('should be classified as not started if the isConnected() function has been called', function (done) {
    curatorEsque.start()

    curatorEsque.once('connected', function () {
      curatorEsque.isConnected().should.equal(true)
      done()
    })
  })

  it('should close the framework when calling close()', function (done) {
    curatorEsque.start()

    curatorEsque.once('connected', function () {
      curatorEsque.close()
      curatorEsque.once('disconnected', function () {
        curatorEsque.isConnected().should.be.false()
        done()
      })
    })
  })
})
