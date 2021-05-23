import request from "supertest"
import { Connection } from "typeorm"


import createConnection from "../../../../database"
import { app } from "../../../../app"
import auth from "@config/auth"
import { sign } from "jsonwebtoken"
import { hash } from "bcryptjs"
import { UsersRepository } from "@modules/users/repositories/UsersRepository"
import { AppError } from "@shared/errors/AppError"



let connection: Connection

describe("Create User Controller", () => {

    beforeAll(async ()=> {
        connection = await createConnection()
        await connection.runMigrations()


    })

    afterAll(async ()=>{
        await connection.dropDatabase()
        await connection.close()
    })

    it("Should be able possible to do a deposit", async () => {
      const usersRepository = new UsersRepository();

      const user = await usersRepository.create({
       name: "test",
       email: "test@test.com",
       password: await hash("12345", 8)
      })
      const { secret, expiresIn } = auth.jwt;

      const token = sign({ user }, secret, {
       subject: user.id,
       expiresIn
      })
      const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description:"test_description"
      })
      .set({
          Authorization: `Bearer ${token}`
      }).send()

      expect(response.status).toBe(201)

      })



    it("Should not be able possible to do a withdraw without enough money in the account", async () => {

      const usersRepository = new UsersRepository();

      const user = await usersRepository.create({
       name: "test1",
       email: "test1@test.com",
       password: await hash("12345", 8)
      })
      const { secret, expiresIn } = auth.jwt;

      const token = sign({ user }, secret, {
       subject: user.id,
       expiresIn
      })
      const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description:"test_description"
      })
      .set({
          Authorization: `Bearer ${token}`
      }).send()

      expect(async ()=> {
        const responseWithdraw = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 150,
        description:"test_description"
      })
      .set({
          Authorization: `Bearer ${token}`
      }).send()
      }).rejects.toBeInstanceOf(AppError)


    })

    it("should be possible to make a withdrawal when you have enough balance available ", async () => {

      const usersRepository = new UsersRepository();

      const user = await usersRepository.create({
       name: "test2",
       email: "test2@test.com",
       password: await hash("12345", 8)
      })
      const { secret, expiresIn } = auth.jwt;

      const token = sign({ user }, secret, {
       subject: user.id,
       expiresIn
      })
      const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description:"test_description"
      })
      .set({
          Authorization: `Bearer ${token}`
      }).send()


        const responseWithdraw = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description:"test_description"
      })
      .set({
          Authorization: `Bearer ${token}`
      }).send()

      expect(responseWithdraw.status).toBe(201)
      })

      it("Should not be able possible to do a deposit with a not existing user", async () => {

        expect(async () =>{
          const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description:"test_description"
      })
      .set({
          Authorization: "Invalid Token"
      }).send()
        }).rejects.toBeInstanceOf(AppError)

       })

})
