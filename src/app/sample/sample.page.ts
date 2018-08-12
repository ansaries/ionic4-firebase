import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.page.html',
  styleUrls: ['./sample.page.scss'],
})
export class SamplePage implements OnInit {
  items: any;
  fg: FormGroup;
  selectedItem: any;
  constructor(
    private db: AngularFirestore,
    private router: Router,
    public toastController: ToastController,
  ) {
    this.fg = new FormGroup({
      title: new FormControl(),
      note: new FormControl(),
      icon: new FormControl(),
      id: new FormControl(),
    });
    this.items = db.collection('/items').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  ngOnInit() {
  }
  addItem() {
    const data = this.fg.value;
    if (!data.id) {
      this.db.collection('/items')
      .add(data).then(__ => {
        this.toastController.create({duration: 2000, message: 'New Record Saved'}).then(toast => {
        toast.present();
        });
      });
    } else {
      const id = data.id;
      delete data.id;
      this.db.collection('/items')
      .ref.doc(id).update(data).then(__ => {
        this.toastController.create({duration: 2000, message: 'Record updated'}).then(toast => {
          toast.present();
          });
      });
    }
    this.fg.reset();
  }
  removeItem() {
    const id = this.fg.value.id;
    this.db.collection('/items')
    .ref.doc(id).delete().then(__ => {
      this.toastController.create({duration: 2000, message: 'Record updated'}).then(toast => {
        toast.present();
        });
    });
  }
  navigate(item) {
    this.fg.setValue(item);
    // this.selectedItem = item;
    // this.router.navigate(['/list', item]);
  }

}
