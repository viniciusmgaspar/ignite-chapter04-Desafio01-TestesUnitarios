import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase"
import { AppError } from "@shared/errors/AppError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"


let createStatementUseCase: CreateStatementUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository
let createUserUseCase : CreateUserUseCase

describe("List Cars", () => {

    beforeEach(() => {
      usersRepositoryInMemory = new InMemoryUsersRepository()
      statementsRepositoryInMemory = new InMemoryStatementsRepository()
      createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
      createStatementUseCase= new CreateStatementUseCase(usersRepositoryInMemory,statementsRepositoryInMemory)
    })

    it("Should be able possible to do a deposit", async () => {

      const user = await createUserUseCase.execute({
       name: "User test",
       email: "usertest@algumacoisa.com",
       password: "12345"
      });

      const statement = {
       user_id: user.id,
       type: "deposit",
       amount: 100,
       description: "description"
      } as ICreateStatementDTO

      const response = await createStatementUseCase.execute(statement)

      expect(response).toHaveProperty("id")

     })

     it("Should not be able possible to do a withdraw without enough money in the account", async () => {

      expect(async ()=>{
        const user = await createUserUseCase.execute({
          name: "User test",
          email: "usertest@algumacoisa.com",
          password: "12345"
         });

         const statementDeposit = {
          user_id: user.id,
          type: "deposit",
          amount: 100,
          description: "description"
         } as ICreateStatementDTO

         await createStatementUseCase.execute(statementDeposit)

         const statementWithDraw = {
           user_id: user.id,
           type: "withdraw",
           amount: 150,
           description: "description"
          } as ICreateStatementDTO

          await createStatementUseCase.execute(statementWithDraw)
      }).rejects.toBeInstanceOf(AppError)




     })

     it("should be possible to make a withdrawal when you have enough balance available ", async () => {

      const user = await createUserUseCase.execute({
       name: "User test",
       email: "usertest@algumacoisa.com",
       password: "12345"
      });

      const statementDeposit = {
        user_id: user.id,
        type: "deposit",
        amount: 100,
        description: "description"
       } as ICreateStatementDTO

       await createStatementUseCase.execute(statementDeposit)

       const statementWithDraw = {
         user_id: user.id,
         type: "withdraw",
         amount: 50,
         description: "description"
        } as ICreateStatementDTO

        const response = await createStatementUseCase.execute(statementWithDraw)

        expect(response).toHaveProperty("id")
        expect(response).toHaveProperty("amount")

     })

     it("Should not be able possible to do a deposit with a not existing user", async () => {

      expect(async ()=>{
        const statement = {
          user_id: "user.id",
          type: "deposit",
          amount: 100,
          description: "description"
         } as ICreateStatementDTO

         const response = await createStatementUseCase.execute(statement)
      }).rejects.toBeInstanceOf(AppError)
     })


})
