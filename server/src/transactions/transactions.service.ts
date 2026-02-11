import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
    });

    return await this.transactionRepository.save(newTransaction);
  }

  async findAllTransactions(userId: string) {
    return await this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    // Find the transaction
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Check if the transaction belongs to the user
    if (transaction.userId !== userId) {
      throw new ForbiddenException('You can only update your own transactions');
    }

    // Update the transaction
    Object.assign(transaction, updateTransactionDto);

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string, userId: string) {
    // Find the transaction
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    // Check if transaction exists
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Check if the transaction belongs to the user
    if (transaction.userId !== userId) {
      throw new ForbiddenException('You can only delete your own transactions');
    }

    await this.transactionRepository.softDelete(id);

    return {
      message: 'Transaction deleted successfully',
      id,
    };
  }
}
