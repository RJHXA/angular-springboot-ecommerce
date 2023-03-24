import { TestBed } from '@angular/core/testing';

import { RjhxaFormService } from './rjhxa-form.service';

describe('RjhxaFormService', () => {
  let service: RjhxaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RjhxaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
