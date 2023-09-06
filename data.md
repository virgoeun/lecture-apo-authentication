console.log('The form data: ', req.body);

The form data:  [Object: null prototype] {
  username: 'alice',
  email: 'alice@alice.com',
  password: 'dfjkdjfkdjfkdjf'
}


console.log('Newly created user is: ', userFromDb)

Newly created user is:  {
  username: 'hello',
  email: 'hello@gmail.com',
  passwordHash: '$2a$10$.q9LrdiimFF2ZxEqja352Oj1sroiRQCZxsSD1wtg1Bt/bnjdoIe5e',
  _id: new ObjectId("64f859b5de642cde36c093d3"),
  createdAt: 2023-09-06T10:51:33.473Z,
  updatedAt: 2023-09-06T10:51:33.473Z,
  __v: 0
}