import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section-show-proxy',
  templateUrl: './section-show-proxy.component.html',
  styleUrls: ['./section-show-proxy.component.css']
})
export class SectionShowProxyComponent implements OnInit {

  constructor(private Rout: Router, private acRoute: ActivatedRoute) {
    this.Rout.navigate([''], {
      queryParams: {
        section: this.acRoute.snapshot.params.section
      }
    });
  }

  ngOnInit(): void {
  }

}
