const { app } = require("../app")
const request = require("supertest")
const { sequelize } = require("../models")
const { queryInterface } = sequelize
const bcrypt = require("bcryptjs")
const { getToken } = require("../helpers/jwt")
const { User, Product } = require("../models/index")
let access_token = {}

afterAll((done) => {
    queryInterface.bulkDelete('Users')
        .then(() => {
            return queryInterface.bulkDelete('Products')
        })
        .then(() => {
            console.log('All database restored')
            return done()
        }).catch(err => done(err))
})

const firstUser = {
    email: 'user@mail.com',
    password: '12345'
}

const firstProduct = {
    name: 'Xiaomi Note 10',
    image_url: 'www.exampe.com/image.jpg',
    price: 7000000,
    stock: 15
}


beforeAll(done => {
    const salt = bcrypt.genSaltSync(10)
    const firstUserHashedPassword = bcrypt.hashSync(firstUser.password, salt)
    queryInterface
        .bulkInsert('Users', [
            {
                email: firstUser.email,
                password: firstUserHashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
        .then(() => {
            // console.log('RESULT:::', result)
            // console.log('New user created: ' + result.email)

            return queryInterface.bulkInsert('Products', [
                {
                    name: firstProduct.name,
                    image_url: firstProduct.image_url,
                    price: firstProduct.price,
                    stock: firstProduct.stock,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        })
        .then(() => {
            return queryInterface.bulkInsert('Products', [
                {
                    name: 'laptop',
                    image_url: 'laptop.img',
                    price: '5000000',
                    stock: '2',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        })
        .then(() => done())
        .catch(err => done(err))
})
let id = ''
describe('OVERALL TEST', () => {

    //*USER SERVICE///
    describe('User service', () => {
        describe('POST /register', () => {
            describe('success register', () => {
                test('This should return object with id and email and status 201', (done) => {
                    const inputRegister = {
                        email: 'mymail@mail.com',
                        password: '$2y$12$x9jnH0PcnMUSo9t72GL/u.9z4mR8hWCoYJscgzHWMf5dhwl8Xfua.' //hashed from bcrypt-generator.com
                    }
                    request(app)
                        .post('/register')
                        .send(inputRegister)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                expect(res.status).toBe(201)
                                expect(res.body).toHaveProperty('id', expect.any(Number))
                                expect(res.body).toHaveProperty('email', inputRegister.email)
                                expect(res.body).not.toHaveProperty('password')
                                return done()
                            }
                        })
                })
            })
            describe('error register', () => {
                test('should return error with status 400 because of email or password is missing', (done) => {
                    const errors = [{
                        message: 'Password is required',
                        message: 'Email is required',
                    }, {
                        message: 'Email is required',
                        message: 'Password is required'
                    }
                    ]
                    const inputNull = {
                        email: null,
                        password: null
                    }

                    request(app)
                        .post('/register')
                        .send(inputNull)
                        .end((err, res) => {
                            if (err) {
                                // console.log('ERROR', err)
                                return done(err)
                            } else {
                                const { body } = res
                                // console.log('INI', body)
                                expect(res.status).toBe(400)
                                expect(res.body).toHaveProperty('errors', errors)
                                return done()
                            }
                        })
                })
                test('should send error and status 400 because password is empty string', done => {
                    const userInput = {
                        email: '',
                        password: ''
                    }
                    const errors = [

                        {
                            message: 'Email must be not an empty string'
                        },
                        {
                            message: 'Password must be not an empty string'
                        }
                    ]
                    request(app)
                        .post('/register')
                        .send(userInput)
                        .end((err, res) => {
                            if (err) {
                                // console.log('There is some error: ', err);
                                return done(err);
                            } else {
                                // console.log('INI EMPTY:', res.body)
                                expect(res.status).toBe(400);
                                expect(res.body).toHaveProperty('errors', errors);
                                return done();
                            }
                        });
                })

            })
        })
        describe('POST /login', () => {
            describe('success login', () => {
                test('should return object with id, email and access_token with status 200', (done) => {
                    const inputLogin = {
                        email: 'user@mail.com',
                        password: '12345'
                    }
                    request(app)
                        .post('/login')
                        .send(inputLogin)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                expect(res.status).toBe(200)
                                // console.log(res.body, 'INI')
                                access_token = res.body.access_token
                                expect(res.body).toHaveProperty('id', expect.any(Number))
                                expect(res.body).toHaveProperty('email', inputLogin.email)
                                expect(res.body).toHaveProperty('access_token', access_token)
                                expect(res.body).not.toHaveProperty('password')
                                return done()
                            }
                        })
                })
            })
            describe('error invalid login', () => {
                test('should return error with status 400', done => {
                    const invalidLogin = {
                        email: 'user@mail.com',
                        password: '1234'
                    }
                    const errorLogin = { msg: 'Invalid email/password', type: 'Bad Request' }
                    request(app)
                        .post('/login')
                        .send(invalidLogin)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                // console.log('INI', res.body)
                                expect(res.status).toBe(400)
                                expect(res.body).toHaveProperty('errors', errorLogin);
                                return done()
                            }
                        })
                })
            })
            describe('error invalid login "email"', () => {
                test('should return error with status 400', done => {
                    const invalidEmail = {
                        email: 'userrr@mail.com',
                        password: '12345'
                    }
                    const errorLogin = { msg: 'Invalid email/password', type: 'Bad Request' }
                    request(app)
                        .post('/login')
                        .send(invalidEmail)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                expect(res.status).toBe(400)
                                // console.log('INI', res.body)
                                expect(res.body).toHaveProperty('errors', errorLogin);
                                return done()
                            }
                        })
                })
            })
        })
    })
    //*END OF USER SERVICE//

    //* PRODUCT SERVICE
    describe('product service', () => {
        describe('POST /products', () => {
            describe('success create', () => {
                test('should return object with id and data of products and status 201', done => {
                    const inputProducts = {
                        name: 'samsung galaxy flip z',
                        image_url: 'https://images.samsung.com/id/smartphones/galaxy-z-flip/buy/0-bloom-black-purple-family-1-pc-img.jpg',
                        price: 22000000,
                        stock: 1
                    }
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .send(inputProducts)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('CREATE', res.body)
                                    expect(res.status).toBe(201)
                                    expect(res.body).toHaveProperty('id', expect.any(Number))
                                    expect(res.body).toHaveProperty('name', inputProducts.name)
                                    expect(res.body).toHaveProperty('image_url', inputProducts.image_url)
                                    expect(res.body).toHaveProperty('price', inputProducts.price)
                                    expect(res.body).toHaveProperty('stock', inputProducts.stock)
                                    return done()
                                }
                            })
                    })
                    // .catch(err => done(err))
                })
            })
            describe('error auth', () => {
                test('should return error invalid token, not authorized', done => {
                    const inputProductNull = {
                        name: 'sepatu nike',
                        image_url: 'img.jpg',
                        price: 1000000,
                        stock: 5
                    }
                    const errorToken = "invalid token"
                    request(app)
                        .post('/products')
                        .send(inputProductNull)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                expect(res.status).toBe(401)
                                // console.log('INI', res.body)
                                expect(res.body).toHaveProperty('errors', errorToken);
                                return done()
                            }
                        })
                })
            })
            describe('error validation null', () => {
                test('should return error validation not null with status 400', done => {
                    const errorNull = [
                        {
                            "message": "The name of products is required"
                        },
                        {
                            "message": "The image_url is required",
                        },
                        {
                            "message": "price is required",
                        },
                        {
                            "message": "stock is required"
                        }]
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            // .send(inputProductNull)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('INI', res.body)
                                    expect(res.status).toBe(400)
                                    expect(res.body).toHaveProperty('errors', errorNull);
                                    return done()
                                }
                            })
                    })
                })
            })
            describe('error validation empty', () => {
                test('should return error validation not null with status 400', done => {
                    const errorEmpty = [
                        { "message": "price is required" },
                        {
                            "message": "stock is required"
                        },
                        {
                            "message": "The name of products must not be an empty string",
                        },
                        { message: 'The image_url must not be an empty string' }
                    ]
                    const inputProductEmpty = {
                        name: '',
                        image_url: ''
                    }
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .send(inputProductEmpty)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('ITU', res.body)
                                    expect(res.status).toBe(400)
                                    expect(res.body).toHaveProperty('errors', errorEmpty);
                                    return done()
                                }
                            })
                    })
                })
            })
            describe('error minimum price', () => {
                test('should return error validation minimum price with status 400', done => {
                    const errorPrice = [
                        {
                            "message": "price must be IDR 2000 or higher",
                        }
                    ]
                    const inputPriceError = {
                        name: 'iphone',
                        image_url: 'iphone.jpg',
                        price: 1000,
                        stock: 10
                    }
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .send(inputPriceError)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('APA', res.body)
                                    expect(res.status).toBe(400)
                                    expect(res.body).toHaveProperty('errors', errorPrice);
                                    return done()
                                }
                            })
                    })
                })
            })
            describe('error maximum price', () => {
                test('should return error validation maximum price with status 400', done => {
                    const errorMaxPrice = [
                        {
                            message: 'price maximum is IDR 25000000'
                        }
                    ]
                    const inputPriceMaxError = {
                        name: 'iphone',
                        image_url: 'iphone.jpg',
                        price: 100000000000000,
                        stock: 10
                    }
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .send(inputPriceMaxError)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('OPO', res.body)
                                    expect(res.status).toBe(400)
                                    expect(res.body).toHaveProperty('errors', errorMaxPrice);
                                    return done()
                                }
                            })
                    })
                })
            })
            describe('error negative stock', () => {
                test('should return error validation maximum price with status 400', done => {
                    const errorStock = [{ message: 'stock must be positive' }]
                    const inputStockErr = {
                        name: 'iphone',
                        image_url: 'iphone.jpg',
                        price: 100000,
                        stock: -1
                    }
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .post('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .send(inputStockErr)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    // console.log('YO', res.body)
                                    expect(res.status).toBe(400)
                                    expect(res.body).toHaveProperty('errors', errorStock);
                                    return done()
                                }
                            })
                    })
                })
            })
        })
        describe('GET /products', () => {
            describe('success get products', () => {
                test('should return object with status 200 and id, name, image_url, price, stock', done => {
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .get('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    const { products } = res.body
                                    // console.log(products)
                                    expect(res.status).toBe(200)
                                    expect(products[0]).toHaveProperty('id', expect.any(Number))
                                    expect(products[1]).toHaveProperty('id', expect.any(Number))
                                    expect(products[0]).toHaveProperty('name', firstProduct.name)
                                    expect(products[0]).toHaveProperty('image_url', firstProduct.image_url)
                                    expect(products[0]).toHaveProperty('price', firstProduct.price)
                                    expect(products[0]).toHaveProperty('stock', firstProduct.stock)

                                    return done()
                                }
                            })
                    })
                })
            })
            describe('error invalid auth token to get products', () => {
                test('should return object with status 401', done => {
                    const errors = 'invalid token'
                    request(app)
                        .get('/products')
                        .end((err, res) => {
                            if (err) {
                                console.log(err)
                                return done(err)
                            } else {
                                expect(res.status).toBe(401)
                                expect(res.body).toHaveProperty('type', 'Unauthorized')
                                expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
                                expect(res.body).toHaveProperty('errors', errors)
                                // console.log('BODY', res.body)
                                return done()
                            }
                        })

                })
            })

        })
        describe('GET /products/:id', () => {
            describe('succes get products with specific id', () => {
                test('should return object with status 200 and single id, name, image_url, price, stock with specific id', done => {
                    Product.findOne({
                        where: {
                            name: firstProduct.name
                        }
                    }).then(data => {
                        let id = data.id
                        return User.findOne({
                            where: {
                                'email': 'user@mail.com'
                            }
                        }).then(result => {
                            let payload = {
                                id: result.id,
                                email: result.email
                            }
                            access_token = getToken(payload)
                            request(app)
                                .get('/products/' + id)
                                .set({ 'access_token': access_token, Accept: 'application/json' })
                                .end((err, res) => {
                                    if (err) {
                                        return done(err)
                                    } else {
                                        expect(res.status).toBe(200)
                                        expect(res.body).toHaveProperty('id', id)
                                        expect(res.body).toHaveProperty('name', firstProduct.name)
                                        expect(res.body).toHaveProperty('image_url', firstProduct.image_url)
                                        expect(res.body).toHaveProperty('price', firstProduct.price)
                                        expect(res.body).toHaveProperty('stock', firstProduct.stock)

                                        return done()
                                    }
                                })
                        })
                    })
                })
            })
            describe('error invalid auth token to get products with specific id', () => {
                test('should return object with status 401', done => {
                    const errors = 'invalid token'
                    Product.findOne({
                        where: {
                            name: firstProduct.name
                        }
                    }).then(data => {
                        let id = data.id
                        request(app)
                            .get('/products/' + id)
                            .end((err, res) => {
                                if (err) {
                                    console.log(err)
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(401)
                                    expect(res.body).toHaveProperty('type', 'Unauthorized')
                                    expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
                                    expect(res.body).toHaveProperty('errors', errors)
                                    // console.log('BODY', res.body)
                                    return done()
                                }
                            })


                    })

                })
            })
            describe('error not found id', () => {
                test('should return object with result Not Found', done => {

                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }
                        access_token = getToken(payload)
                        request(app)
                            .get('/products/' + 1000)
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(404)
                                    expect(res.body).toHaveProperty('type', 'Not Found')
                                    return done()
                                }
                            })
                    })

                })
            })
        })
        describe('UPDATE /products/id', () => {
            describe('error update invalid token', () => {
                test('should return object with status 401', done => {
                    const errors = 'invalid token'
                    Product.findOne({
                        where: {
                            name: firstProduct.name
                        }
                    }).then(data => {
                        let id = data.id
                        request(app)
                            .put('/products/' + id)
                            .end((err, res) => {
                                if (err) {
                                    console.log(err)
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(401)
                                    expect(res.body).toHaveProperty('type', 'Unauthorized')
                                    expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
                                    expect(res.body).toHaveProperty('errors', errors)
                                    return done()
                                }
                            })


                    })

                })
            })
            describe('succes update product with specific id', () => {
                test('should return object with status 200', done => {
                    Product.findOne({
                        where: {
                            name: firstProduct.name
                        }
                    }).then(data => {
                        let id = data.id
                        return User.findOne({
                            where: {
                                'email': 'user@mail.com'
                            }
                        }).then(result => {
                            let payload = {
                                id: result.id,
                                email: result.email
                            }
                            let updatedProduct = {
                                name: firstProduct.name,
                                image_url: 'imageUpdate.jpg',
                                price: 9999,
                                stock: 12
                            }
                            access_token = getToken(payload)
                            request(app)
                                .put('/products/' + id)
                                .set({ 'access_token': access_token, Accept: 'application/json' })
                                .send(updatedProduct)
                                .end((err, res) => {
                                    if (err) {
                                        return done(err)
                                    } else {
                                        expect(res.status).toBe(201)
                                        expect(res.body).toHaveProperty('msg', expect.any(String))
                                        return done()
                                    }
                                })
                        })
                    })
                })
            })
            describe('error update not found id', () => {
                test('should return object with result Not Found', done => {
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }

                        access_token = getToken(payload)
                        request(app)
                            .put('/products/' + null)
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    return done()
                                }
                            })
                    })

                })
            })
            describe('error delete not found id', () => {
                test('should return error object with result Not Found', done => {
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }

                        access_token = getToken(payload)
                        request(app)
                            .del('/products')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(404)
                                    return done()
                                }
                            })
                    })

                })
            })
        })
        describe('DELETE /products/id', () => {
            describe('error delete invalid token', () => {
                test('should return object with status 401', done => {
                    const errors = 'invalid token'
                    Product.findOne({
                        where: {
                            name: firstProduct.name
                        }
                    }).then(data => {
                        let id = data.id
                        request(app)
                            .del('/products/' + id)
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(401)
                                    expect(res.body).toHaveProperty('type', 'Unauthorized')
                                    expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
                                    expect(res.body).toHaveProperty('errors', errors)
                                    // console.log('BODY', res.body)
                                    return done()
                                }
                            })


                    })

                })
            })
            describe('succes delete product with specific id', () => {
                test('should return object with status 200', done => {
                    Product.findOne({
                        where: {
                            name: 'laptop'
                        }
                    }).then(data => {
                        let id = data.id
                        return User.findOne({
                            where: {
                                'email': 'user@mail.com'
                            }
                        }).then(result => {
                            let payload = {
                                id: result.id,
                                email: result.email
                            }
                            access_token = getToken(payload)
                            console.log('>>>>>>>>>>>>>>ID', id)
                            request(app)
                                .del('/products/' + id)
                                .set({ 'access_token': access_token, Accept: 'application/json' })
                                .end((err, res) => {
                                    if (err) {
                                        return done(err)
                                    } else {
                                        console.log(res.body)
                                        expect(res.status).toBe(200)
                                        expect(res.body).toHaveProperty('msg', expect.any(String))
                                        return done()
                                    }
                                })
                        })
                    })
                })
            })
            describe('error delete not found id', () => {
                test('should return object with result Not Found', done => {
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }

                        access_token = getToken(payload)
                        request(app)
                            .del('/products/' + null)
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(404)
                                    expect(res.body).toHaveProperty('type', 'Not Found')
                                    return done()
                                }
                            })
                    })

                })
            })
            describe('error delete not found id', () => {
                test('should return error object with result Not Found', done => {
                    User.findOne({
                        where: {
                            'email': 'user@mail.com'
                        }
                    }).then(result => {
                        let payload = {
                            id: result.id,
                            email: result.email
                        }

                        access_token = getToken(payload)
                        request(app)
                            .del('/products/100')
                            .set({ 'access_token': access_token, Accept: 'application/json' })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                } else {
                                    expect(res.status).toBe(404)
                                    expect(res.body).toHaveProperty('type', 'Not Found')
                                    return done()
                                }
                            })
                    })

                })
            })
        })


    })
})
