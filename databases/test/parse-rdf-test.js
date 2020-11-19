'use strict'

const fs = require('fs')
const expect = require('chai').expect
const parseRDF = require('../lib/parse-rdf')

const rdf = fs.readFileSync(`${__dirname}/../../data/cache/epub/132/pg132.rdf`)

describe('parseRDF', () => {
  it('should be a function', () => {
    expect(parseRDF).to.be.a('function')
  })

  it('should parse RDF content', () => {
    const book = parseRDF(rdf)
    expect(book).to.be.an('object')
    expect(book).to.have.a.property('id', 132)
    expect(book).to.have.a.property('title', 'The Art of War')

    expect(book)
      .to.have.a.property('authors')
      .that.is.an('array')
      .with.lengthOf(2)
      .and.contains('Sunzi, active 6th century B.C.')
      .and.contains('Giles, Lionel')

    expect(book)
      .to.have.a.property('subjects')
      .that.is.an('array')
      .with.lengthOf(2)
      .and.contains('Military art and science -- Early works to 1800')
      .and.contains('War -- Early works to 1800')

    expect(book)
      .to.have.a.property('lcc')
      .that.is.a('string')
      .with.length.of.at.least(1)
      .and.satisfy((str) => str === str.toUpperCase())
      .and.not.satisfy((str) => str.startsWith('I'))
      .and.not.satisfy((str) => str.startsWith('O'))
      .and.not.satisfy((str) => str.startsWith('W'))
      .and.not.satisfy((str) => str.startsWith('X'))
      .and.not.satisfy((str) => str.startsWith('Y'))

    expect(book)
      .to.have.a.property('sources')
      .that.is.an('array')
      .with.length.of.at.least(1)
      .and.satisfy((sources) => {
        return sources.every((source) => source.startsWith('http://'))
      })
  })
})
