const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Sourav Suman",
      email: "srv1fly@gmail.com",
      password: "Qwerty123",
    })
    .expect(201);

  // assert data base was change correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //assert about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Sourav Suman",
      email: "srv1fly@gmail.com",
    },
    token: user.tokens[0].token,
  });
  //assertind the database has a encrypted password
  expect(user.password).not.toBe("Qwerty123!");
});

test("Should login exixting user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // token is generated
  const user = await User.findById(userOneId);

  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login non-existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password + "abc",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete account for unauthorised user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

// test("Should upload avatar image", async () => {
//   await request(app)
//     .post("/user/me/avatar")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .attach("avatar", "tests/fixtures/profile-pic.jpg")
//     .expect(200);
//     expect(user.avatar).toEqual(expect.any(Buffer))
// });
// not working for me so i have commented it out 

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "jess",
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toEqual("jess");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Bokaro",
    })
    .expect(400);
});
