import { inject, injectable } from "tsyringe";

import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";


import {OperationType, Statement} from "../../../../modules/statements/entities/Statement"

interface IRequest {
  amount: number;
  description: string;
  sender_id: string;
  receiver_id: string;

}

@injectable()
export class CreateTransferStatementUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ amount, description, sender_id, receiver_id }: IRequest): Promise<Statement[]> {
    const senderUser = await this.usersRepository.findById(sender_id);
    const receiverUser = await this.usersRepository.findById(receiver_id);

    if (!senderUser) {
      throw new CreateStatementError.UserNotFound();
    }

    if (!receiverUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const senderBalance = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (senderBalance.balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const senderStatementOperation = await this.statementsRepository.create({
      user_id: sender_id,
      receiver_id: receiver_id,
      description,
      amount,
      type: OperationType.TRANSFER
    });

    const receiverStatementOperation = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id: sender_id,
      description,
      amount,
      type: OperationType.TRANSFER
    });

    return [
      senderStatementOperation,
      receiverStatementOperation
    ];
  }
}
