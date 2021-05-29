import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferStatementUseCase } from './TransferValueUseCase';

export class TransferValueController {
  async execute(request: Request, response: Response) {
    const { user_id: receiver_id } = request.params;
    const {id: sender_id} = request.user
    const {amount, description} = request.body



    const getStatementOperation = container.resolve(CreateTransferStatementUseCase);

    const statementOperation = await getStatementOperation.execute({
      amount,
      description,
      receiver_id,
      sender_id
    });

    return response.json(statementOperation);
  }
}
