import { TestBed } from '@angular/core/testing';

import { SqlConnectorService } from './sql-connector.service';

describe('SqlConnectorService', () => {
  let service: SqlConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
