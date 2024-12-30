import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('Disconnected from PostgreSQL');
  }

  public async query(queryText: string, params?: any[]) {
    return this.client.query(queryText, params);
  }
}
