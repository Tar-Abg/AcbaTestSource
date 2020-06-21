import { TestBed } from '@angular/core/testing';

import { CommonServiceService } from './common-service.service';

describe('CommonServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonServiceService = TestBed.get(CommonServiceService);
    expect(service).toBeTruthy();
  });
});
