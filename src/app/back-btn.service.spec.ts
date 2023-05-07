import { TestBed } from '@angular/core/testing';

import { BackBtnService } from './back-btn.service';

describe('BackBtnService', () => {
  let service: BackBtnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackBtnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
