import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory } from './entities/inventory.entity';
import { InventoryInRecord } from './entities/inventory-in-record.entity';
import { InventoryOutRecord } from './entities/inventory-out-record.entity';
import { StockTake } from './entities/stock-take.entity';
import { StockTakeItem } from './entities/stock-take-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryInRecord,
      InventoryOutRecord,
      StockTake,
      StockTakeItem,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
