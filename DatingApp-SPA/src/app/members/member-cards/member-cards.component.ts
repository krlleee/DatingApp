import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-cards',
  templateUrl: './member-cards.component.html',
  styleUrls: ['./member-cards.component.css']
})
export class MemberCardsComponent implements OnInit {

  @Input() user:User;
  
  constructor(private authService:AuthService, private userService:UserService,
    private alertify:AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id:number){
    this.userService.sendLike(this.authService.decodedToken.nameid,id).subscribe(data=>{
      this.alertify.success("You have liked: "+this.user.knownAs);
    },error=>{
      this.alertify.error(error);
    });
    
  }

}
