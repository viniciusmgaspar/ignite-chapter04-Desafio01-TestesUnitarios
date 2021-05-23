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

    it("Should be able to get balance", async () => {
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


      const response = await request(app).get(`api/v1/statements/${responseDeposit.body.id}`).set({
        Authorization: `Bearer ${token}`
      }).send()

      expect(response.status).toBe(200)
    })



})
