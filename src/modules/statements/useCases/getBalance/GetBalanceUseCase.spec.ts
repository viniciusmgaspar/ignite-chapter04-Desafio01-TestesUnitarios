import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {

 beforeEach(() => {

  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
 })

 it("Should be able to get balance", async () => {

  const user = await createUserUseCase.execute({
   name: "New User",
   email: "test@test.com",
   password: "12345"
  });

  const response = await getBalanceUseCase.execute({ user_id: user.id })

  expect(response).toHaveProperty("statement")
  expect(response).toHaveProperty("balance")
 })

 it("Should not be able to get balance", async () => {

    expect(async ()=> {
      const user_id = "UserTest"
    await getBalanceUseCase.execute({ user_id })
    }).rejects.toBeInstanceOf(AppError)
 })
})
