import { Component, Input, OnInit } from '@angular/core';
import { BranchEntity } from '../../entities/branch.entity';
import { ServiceEntity } from '../../entities/service.entity';
import { TicketEntity } from '../../entities/ticket.entity';


declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../shared/css/common-styles.css']
})
export class TicketComponent implements OnInit {
  public branchEntity: BranchEntity;
  public serviceEntity: ServiceEntity;
  public ticketEntity: TicketEntity;
  public serviceName: string;
  public isTicketNumberHidden: boolean = false;
  @Input() isTicketEndedOrDeleted: boolean;
  @Input() isAfterCalled: boolean;
  private flashInterval;
  private flashCount: number = 0;

  constructor() {
  }

  ngOnInit() {
    this.ticketEntity = new TicketEntity();
    this.getSelectedBranch();
    this.getTicketInfo();
  }

  //MOVE ALL MobileTicketAPI calls to service class otherwise using things this way
  //makes unit test writing impossible

  public getSelectedBranch() {
    if (MobileTicketAPI.getSelectedBranch() !== null) {
      this.branchEntity = MobileTicketAPI.getSelectedBranch();
    }
  }

  public onServiceNameUpdate(serviceName: string) {
    this.serviceName = this.trimServiceString(serviceName);

  }

  public trimServiceString(str: string) {
    return str.length > 30 ? str.slice(0, 27) + "..." : str;
  }

  public getTicketInfo() {
    if (MobileTicketAPI.getCurrentVisit() !== null) {
      this.ticketEntity = MobileTicketAPI.getCurrentVisit();
    }
  }

  public onTicketIdChange() {
    if (MobileTicketAPI.getCurrentVisitStatus().ticketId != null) {
      this.ticketEntity.ticketNumber = MobileTicketAPI.getCurrentVisitStatus().ticketId;
    } else {
      this.ticketEntity.ticketNumber = '';
    }
  }

  startFlashing() {
    // Clear if any previous interval this runing
    clearInterval(this.flashInterval);
    this.flashCount = 0;
    var context = this;

    // Start new interval
    this.flashInterval = setInterval(function () {
      context.flashCount++;
      context.isTicketNumberHidden = !!!context.isTicketNumberHidden;
      console.log("flash count - " + context.flashCount);

      if (context.flashCount === 6) {
        // Stop interval after 3 seconds
        clearInterval(context.flashInterval);
      }
    }, 500);
  }

  getTicketNumberLength() {
    return this.ticketEntity.ticketNumber.length;
  }

}
