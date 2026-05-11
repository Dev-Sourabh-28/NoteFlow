import { Test, TestingModule } from '@nestjs/testing';
import { SubnotesService } from './subnotes.service';

describe('SubnotesService', () => {
  let service: SubnotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubnotesService],
    }).compile();

    service = module.get<SubnotesService>(SubnotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
