import { Test, TestingModule } from '@nestjs/testing';
import { SubnotesController } from './subnotes.controller';

describe('SubnotesController', () => {
  let controller: SubnotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubnotesController],
    }).compile();

    controller = module.get<SubnotesController>(SubnotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
