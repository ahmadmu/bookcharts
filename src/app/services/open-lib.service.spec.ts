import { TestBed } from '@angular/core/testing';

import { OpenLibService } from './open-lib.service';

describe('OpenLibService', () => {
  let service: OpenLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
