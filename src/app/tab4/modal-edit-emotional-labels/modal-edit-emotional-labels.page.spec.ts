import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEditEmotionalLabelsPage } from './modal-edit-emotional-labels.page';

describe('ModalEditEmotionalLabelsPage', () => {
  let component: ModalEditEmotionalLabelsPage;
  let fixture: ComponentFixture<ModalEditEmotionalLabelsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditEmotionalLabelsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditEmotionalLabelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
