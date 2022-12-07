import { TestBed } from '@angular/core/testing';

import { AnnualRecordService } from './annual-record.service';

describe('AnnualRecord.ServiceService', () => {
  let service: AnnualRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnualRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
