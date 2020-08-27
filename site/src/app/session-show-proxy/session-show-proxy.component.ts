import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-show-proxy',
  templateUrl: './session-show-proxy.component.html',
  styleUrls: ['./session-show-proxy.component.css']
})
export class SessionShowProxyComponent implements OnInit {

  constructor(private Rout: Router, private acRoute: ActivatedRoute) {
    this.Rout.navigate([''], { queryParams: { session: this.acRoute.snapshot.params.session } });
  }
  ngOnInit(): void {
  }

}
