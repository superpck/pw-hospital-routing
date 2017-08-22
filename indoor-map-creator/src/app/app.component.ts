import { Component, AfterViewInit, NgZone } from '@angular/core';
import { MapComponent } from './map/map.component';
import { SidePaneComponent } from './side-pane/side-pane.component';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { MapApiService } from './services/map-api.service';
import { MdDialog } from '@angular/material';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserService } from './services/user.service';
declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GoogleMapsAPIWrapper, MapApiService]
})
export class AppComponent implements AfterViewInit {
  mapApi: GoogleMapsAPIWrapper;
  constructor(private _mapApi: GoogleMapsAPIWrapper, private _internalMapApiService: MapApiService, public dialog: MdDialog, private zone: NgZone, private userService: UserService) {
    this.mapApi = _mapApi;
    _internalMapApiService.setApi(_mapApi);
  }

  onMyAccountClick() {
    this.dialog.open(UserAccountComponent, { disableClose: false, width: '60vw', height: '57vh' });
  }

  onLogoutClick() {
    gapi.load('auth2', function () {
      gapi.auth2.init();
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.disconnect();
      auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.removeItem('isLogined');
      });
    });

  }
  ngAfterViewInit() {
    setTimeout(() => {
      gapi.signin2.render('my-signin', {
        'onsuccess': param => this.onSignIn(param),
        'scope': 'profile email',
        'theme': 'light'
      });
    }, 1000);
  }

  onSignIn(googleUser) {
    console.log('Signing in . . .');
    this.userService.signIn(googleUser, function(err, isSuccess){
      if (isSuccess) {
        console.log('Login success');
      } else {
        console.error('Login failed');
      }
    })
  }
}
